import { ChatService } from '@/services/ChatService';
import { NotificationService } from '@/services/NotificationService';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#C67C4E';

export default function NotificationDemoScreen() {
  const router = useRouter();
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [badgeCount, setBadgeCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadNotificationStatus();
  }, []);

  const loadNotificationStatus = async () => {
    try {
      const token = await NotificationService.initialize();
      setPushToken(token);
      
      const currentBadgeCount = await NotificationService.getBadgeCount();
      setBadgeCount(currentBadgeCount);
    } catch (error) {
      console.error('Error loading notification status:', error);
    }
  };

  const handleOrderUpdateNotification = async () => {
    try {
      await NotificationService.sendOrderUpdateNotification(
        'order-123',
        'preparing',
        'Chicken Tikka Masala',
        '25 minutes'
      );
      Alert.alert('Success', 'Order update notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const handleNewMessageNotification = async () => {
    try {
      await NotificationService.sendNewMessageNotification(
        'chat-123',
        'Chef Maria',
        'Hi! Your order is ready for pickup. I\'m at the kitchen now.',
        'chef'
      );
      Alert.alert('Success', 'New message notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const handlePromotionalNotification = async () => {
    try {
      await NotificationService.sendPromotionalNotification(
        'Special Weekend Deal! 🔥',
        'Get 25% off on all orders this weekend. Use code WEEKEND25',
        'WEEKEND25',
        'chef-anna'
      );
      Alert.alert('Success', 'Promotional notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const handleChefAvailabilityNotification = async () => {
    try {
      await NotificationService.sendChefAvailabilityNotification(
        'Chef Antonio',
        'Downtown Area'
      );
      Alert.alert('Success', 'Chef availability notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const handleScheduledNotification = async () => {
    try {
      const futureDate = new Date(Date.now() + 10000); // 10 seconds from now
      
      const notificationId = await NotificationService.scheduleNotification(
        {
          type: 'promotional',
          title: 'Scheduled Reminder',
          body: 'This is a scheduled notification that was set 10 seconds ago!',
          data: { test: true },
        },
        futureDate
      );
      
      if (notificationId) {
        Alert.alert('Success', 'Notification scheduled for 10 seconds from now!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  const handleIncreaseBadge = async () => {
    try {
      const newCount = badgeCount + 1;
      await NotificationService.setBadgeCount(newCount);
      setBadgeCount(newCount);
    } catch (error) {
      Alert.alert('Error', 'Failed to update badge count');
    }
  };

  const handleClearBadge = async () => {
    try {
      await NotificationService.setBadgeCount(0);
      setBadgeCount(0);
    } catch (error) {
      Alert.alert('Error', 'Failed to clear badge count');
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await NotificationService.clearAllNotifications();
      Alert.alert('Success', 'All notifications cleared!');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear notifications');
    }
  };

  const handleTestChat = async () => {
    try {
      // Create a test chat
      const chat = await ChatService.createChat('user-1', 'chef-anna', 'order-123');
      
      if (chat) {
        // Send a test message
        await ChatService.sendMessage(
          chat.id,
          'user-1',
          'customer',
          'Hi Chef Anna! Can you help me with my order?'
        );
        
        // Send an order update message
        await ChatService.sendOrderUpdateMessage(
          chat.id,
          'order-123',
          'confirmed',
          'Butter Chicken',
          '30 minutes'
        );
        
        Alert.alert('Success', 'Test chat and messages created!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create test chat');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Demo</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Status</Text>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Push Token:</Text>
            <Text style={styles.statusValue}>
              {pushToken ? `${pushToken.substring(0, 20)}...` : 'Not available'}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Badge Count:</Text>
            <Text style={styles.statusValue}>{badgeCount}</Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Notifications Enabled:</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#ddd', true: PRIMARY }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Test Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Notifications</Text>
          
          <TouchableOpacity style={styles.button} onPress={handleOrderUpdateNotification}>
            <Feather name="clock" size={20} color="#fff" />
            <Text style={styles.buttonText}>Order Update Notification</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleNewMessageNotification}>
            <Feather name="message-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>New Message Notification</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handlePromotionalNotification}>
            <Feather name="gift" size={20} color="#fff" />
            <Text style={styles.buttonText}>Promotional Notification</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleChefAvailabilityNotification}>
            <Feather name="user-check" size={20} color="#fff" />
            <Text style={styles.buttonText}>Chef Availability Notification</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleScheduledNotification}>
            <Feather name="calendar" size={20} color="#fff" />
            <Text style={styles.buttonText}>Schedule Notification (10s)</Text>
          </TouchableOpacity>
        </View>

        {/* Badge Controls Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badge Controls</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.buttonSmall]} 
              onPress={handleIncreaseBadge}
            >
              <Feather name="plus" size={16} color="#fff" />
              <Text style={styles.buttonTextSmall}>Increase Badge</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.buttonSmall, styles.buttonSecondary]} 
              onPress={handleClearBadge}
            >
              <Feather name="x" size={16} color="#fff" />
              <Text style={styles.buttonTextSmall}>Clear Badge</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Testing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chat & Real-time Testing</Text>
          
          <TouchableOpacity style={styles.button} onPress={handleTestChat}>
            <Feather name="message-square" size={20} color="#fff" />
            <Text style={styles.buttonText}>Create Test Chat & Messages</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/chat')}
          >
            <Feather name="users" size={20} color="#fff" />
            <Text style={styles.buttonText}>Go to Chat List</Text>
          </TouchableOpacity>
        </View>

        {/* Utility Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Utilities</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonDanger]} 
            onPress={handleClearAllNotifications}
          >
            <Feather name="trash-2" size={20} color="#fff" />
            <Text style={styles.buttonText}>Clear All Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructionText}>
            • Tap any notification button to test different notification types{'\n'}
            • Check your notification panel to see the notifications{'\n'}
            • Badge count will appear on the app icon (iOS){'\n'}
            • Scheduled notifications will appear after the delay{'\n'}
            • Chat tests will create real chat data for testing real-time features
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statusValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  button: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonSmall: {
    flex: 1,
    paddingVertical: 10,
  },
  buttonTextSmall: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  buttonSecondary: {
    backgroundColor: '#666',
  },
  buttonDanger: {
    backgroundColor: '#e74c3c',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
