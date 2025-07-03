import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  type: 'order_update' | 'new_message' | 'promotional' | 'chef_availability';
  orderId?: string;
  chatId?: string;
  chefId?: string;
  title: string;
  body: string;
  data?: any;
}

export class NotificationService {
  private static expoPushToken: string | null = null;

  /**
   * Initialize notification service and register for push notifications
   */
  static async initialize(): Promise<string | null> {
    try {
      // Check if device can receive push notifications
      if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return null;
      }

      // Get existing permission status
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permission if not already granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      // Get the token for push notifications - handle development gracefully
      let token;
      try {
        token = await Notifications.getExpoPushTokenAsync({
          projectId: 'your-expo-project-id', // Replace with actual project ID
        });
      } catch (error) {
        console.log('Failed to get token with project ID, trying without project ID for development:', error);
        // Fallback for development without project ID
        token = await Notifications.getExpoPushTokenAsync();
      }

      this.expoPushToken = token.data;
      
      // Store token locally
      await AsyncStorage.setItem('expoPushToken', token.data);
      
      // Register token with backend
      await this.registerTokenWithBackend(token.data);

      // Set up notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#C67C4E',
        });

        // Order updates channel
        await Notifications.setNotificationChannelAsync('order_updates', {
          name: 'Order Updates',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4CAF50',
        });

        // Messages channel
        await Notifications.setNotificationChannelAsync('messages', {
          name: 'Messages',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2196F3',
        });

        // Promotional channel
        await Notifications.setNotificationChannelAsync('promotional', {
          name: 'Promotions',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250],
          lightColor: '#FF9800',
        });
      }

      console.log('Push notification token:', token.data);
      return token.data;

    } catch (error) {
      console.error('Error initializing notifications:', error);
      return null;
    }
  }

  /**
   * Register push token with backend
   */
  private static async registerTokenWithBackend(token: string): Promise<void> {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userRole = await AsyncStorage.getItem('userRole');
      
      if (!userId) return;

      // In a real app, save to Supabase
      // await supabase
      //   .from('user_push_tokens')
      //   .upsert({
      //     user_id: userId,
      //     push_token: token,
      //     platform: Platform.OS,
      //     updated_at: new Date().toISOString(),
      //   });

      console.log('Push token registered for user:', userId);
    } catch (error) {
      console.error('Error registering push token:', error);
    }
  }

  /**
   * Send local notification
   */
  static async sendLocalNotification(notificationData: NotificationData): Promise<void> {
    try {
      const content: any = {
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data || {},
        sound: true,
      };

      // Add channel ID for Android
      if (Platform.OS === 'android') {
        content.channelId = this.getChannelId(notificationData.type);
      }
      
      await Notifications.scheduleNotificationAsync({
        content,
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  /**
   * Schedule a notification for later
   */
  static async scheduleNotification(
    notificationData: NotificationData,
    triggerDate: Date
  ): Promise<string | null> {
    try {
      const content: any = {
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data || {},
        sound: true,
      };

      // Add channel ID for Android
      if (Platform.OS === 'android') {
        content.channelId = this.getChannelId(notificationData.type);
      }
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content,
        trigger: {
          date: triggerDate,
        } as any,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  /**
   * Clear all notifications
   */
  static async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  /**
   * Get badge count
   */
  static async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  }

  /**
   * Set badge count
   */
  static async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  /**
   * Send order update notification
   */
  static async sendOrderUpdateNotification(
    orderId: string,
    status: string,
    dishName: string,
    estimatedTime?: string
  ): Promise<void> {
    const statusMessages = {
      confirmed: 'Your order has been confirmed!',
      preparing: 'Your chef is preparing your meal',
      ready: 'Your order is ready for pickup/delivery',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled',
    };

    const body = statusMessages[status as keyof typeof statusMessages] || 
                `Your order status has been updated to: ${status}`;

    const fullBody = estimatedTime ? 
      `${body}${estimatedTime ? ` (${estimatedTime})` : ''}` : 
      body;

    await this.sendLocalNotification({
      type: 'order_update',
      orderId,
      title: `Order Update - ${dishName}`,
      body: fullBody,
      data: { orderId, status, dishName, estimatedTime },
    });
  }

  /**
   * Send new message notification
   */
  static async sendNewMessageNotification(
    chatId: string,
    senderName: string,
    message: string,
    senderType: 'customer' | 'chef'
  ): Promise<void> {
    await this.sendLocalNotification({
      type: 'new_message',
      chatId,
      title: `New message from ${senderName}`,
      body: message.length > 50 ? `${message.substring(0, 50)}...` : message,
      data: { chatId, senderName, senderType },
    });
  }

  /**
   * Send promotional notification
   */
  static async sendPromotionalNotification(
    title: string,
    message: string,
    promoCode?: string,
    chefId?: string
  ): Promise<void> {
    await this.sendLocalNotification({
      type: 'promotional',
      chefId,
      title,
      body: message,
      data: { promoCode, chefId },
    });
  }

  /**
   * Send chef availability notification
   */
  static async sendChefAvailabilityNotification(
    chefName: string,
    location: string
  ): Promise<void> {
    await this.sendLocalNotification({
      type: 'chef_availability',
      title: 'Chef Available Nearby!',
      body: `${chefName} is now available for orders in ${location}`,
      data: { chefName, location },
    });
  }

  /**
   * Get notification channel ID based on type
   */
  private static getChannelId(type: string): string {
    switch (type) {
      case 'order_update':
        return 'order_updates';
      case 'new_message':
        return 'messages';
      case 'promotional':
        return 'promotional';
      default:
        return 'default';
    }
  }

  /**
   * Handle notification received while app is foregrounded
   */
  static setupNotificationListeners() {
    // Listen for notifications received while app is foregrounded
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      // You can show in-app notification here
    });

    // Listen for user tapping on notifications
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });

    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }

  /**
   * Handle notification tap
   */
  private static handleNotificationResponse(response: Notifications.NotificationResponse) {
    const { data } = response.notification.request.content;
    
    // Navigate based on notification type
    switch (data.type) {
      case 'order_update':
        // Navigate to order details
        console.log('Navigate to order:', data.orderId);
        break;
      case 'new_message':
        // Navigate to chat
        console.log('Navigate to chat:', data.chatId);
        break;
      case 'promotional':
        // Navigate to promotions or chef profile
        console.log('Navigate to promotion:', data);
        break;
      default:
        console.log('Unknown notification type:', data.type);
    }
  }
}
