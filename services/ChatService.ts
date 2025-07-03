import { supabase } from '@/constants/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationService } from './NotificationService';

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  sender_type: 'customer' | 'chef';
  message: string;
  timestamp: string;
  read: boolean;
  message_type: 'text' | 'order_update' | 'system';
  edited_at?: string;
  reply_to?: string;
}

export interface Chat {
  id: string;
  customer_id: string;
  chef_id: string;
  order_id?: string | null;
  status: 'active' | 'archived' | 'blocked';
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar: string;
  type: 'customer' | 'chef';
  online: boolean;
  last_seen?: string;
}

export interface TypingStatus {
  userId: string;
  isTyping: boolean;
  timestamp: string;
}

export class ChatService {
  private static activeSubscriptions: { [key: string]: any } = {};
  private static typingTimeouts: { [key: string]: ReturnType<typeof setTimeout> } = {};

  /**
   * Initialize chat service and setup database tables
   */
  static async initialize(): Promise<void> {
    try {
      // In a real app, you would have these tables created via Supabase migrations
      // This is just for reference of the expected schema
      
      // Chats table schema:
      // - id (uuid, primary key)
      // - customer_id (uuid, foreign key to users)
      // - chef_id (uuid, foreign key to users)
      // - order_id (uuid, foreign key to orders, nullable)
      // - status (text: active, archived, blocked)
      // - created_at (timestamp)
      // - updated_at (timestamp)
      // - last_message_at (timestamp)

      // Messages table schema:
      // - id (uuid, primary key)
      // - chat_id (uuid, foreign key to chats)
      // - sender_id (uuid, foreign key to users)
      // - sender_type (text: customer, chef)
      // - message (text)
      // - message_type (text: text, order_update, system)
      // - timestamp (timestamp)
      // - read (boolean)
      // - edited_at (timestamp, nullable)
      // - reply_to (uuid, nullable, foreign key to messages)

      console.log('Chat service initialized');
    } catch (error) {
      console.error('Error initializing chat service:', error);
    }
  }

  /**
   * Create a new chat between customer and chef
   */
  static async createChat(
    customerId: string,
    chefId: string,
    orderId?: string
  ): Promise<Chat | null> {
    try {
      // Check if chat already exists
      const existingChat = await this.findExistingChat(customerId, chefId, orderId);
      if (existingChat) {
        return existingChat;
      }

      const chatData = {
        id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customer_id: customerId,
        chef_id: chefId,
        order_id: orderId || null,
        status: 'active' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message_at: new Date().toISOString(),
      };

      // In real app, save to Supabase
      // const { data, error } = await supabase
      //   .from('chats')
      //   .insert(chatData)
      //   .select()
      //   .single();

      // Mock implementation - save to AsyncStorage
      const existingChats = await this.getStoredChats();
      existingChats.push(chatData);
      await AsyncStorage.setItem('chats', JSON.stringify(existingChats));

      return chatData;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  }

  /**
   * Find existing chat between users
   */
  static async findExistingChat(
    customerId: string,
    chefId: string,
    orderId?: string
  ): Promise<Chat | null> {
    try {
      // In real app, query Supabase
      // const { data, error } = await supabase
      //   .from('chats')
      //   .select('*')
      //   .eq('customer_id', customerId)
      //   .eq('chef_id', chefId)
      //   .eq('order_id', orderId || null)
      //   .eq('status', 'active')
      //   .single();

      // Mock implementation
      const chats = await this.getStoredChats();
      const existingChat = chats.find(chat => 
        chat.customer_id === customerId && 
        chat.chef_id === chefId && 
        chat.order_id === orderId &&
        chat.status === 'active'
      );

      return existingChat || null;
    } catch (error) {
      console.error('Error finding existing chat:', error);
      return null;
    }
  }

  /**
   * Get chats for a user
   */
  static async getUserChats(userId: string, userType: 'customer' | 'chef'): Promise<Chat[]> {
    try {
      // In real app, query Supabase
      // const { data, error } = await supabase
      //   .from('chats')
      //   .select('*')
      //   .eq(userType === 'customer' ? 'customer_id' : 'chef_id', userId)
      //   .eq('status', 'active')
      //   .order('last_message_at', { ascending: false });

      // Mock implementation
      const chats = await this.getStoredChats();
      return chats.filter(chat => 
        (userType === 'customer' ? chat.customer_id === userId : chat.chef_id === userId) &&
        chat.status === 'active'
      ).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
    } catch (error) {
      console.error('Error getting user chats:', error);
      return [];
    }
  }

  /**
   * Send a message
   */
  static async sendMessage(
    chatId: string,
    senderId: string,
    senderType: 'customer' | 'chef',
    message: string,
    messageType: 'text' | 'order_update' | 'system' = 'text',
    replyTo?: string
  ): Promise<Message | null> {
    try {
      const messageData: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        chat_id: chatId,
        sender_id: senderId,
        sender_type: senderType,
        message,
        message_type: messageType,
        timestamp: new Date().toISOString(),
        read: false,
        reply_to: replyTo,
      };

      // In real app, save to Supabase
      // const { data, error } = await supabase
      //   .from('messages')
      //   .insert(messageData)
      //   .select()
      //   .single();

      // Mock implementation - save to AsyncStorage
      const existingMessages = await this.getStoredMessages(chatId);
      existingMessages.push(messageData);
      await AsyncStorage.setItem(`messages-${chatId}`, JSON.stringify(existingMessages));

      // Update chat's last_message_at
      await this.updateChatTimestamp(chatId);

      // Send push notification to the other participant
      await this.sendMessageNotification(chatId, senderId, senderType, message);

      return messageData;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  /**
   * Get messages for a chat
   */
  static async getChatMessages(
    chatId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Message[]> {
    try {
      // In real app, query Supabase
      // const { data, error } = await supabase
      //   .from('messages')
      //   .select('*')
      //   .eq('chat_id', chatId)
      //   .order('timestamp', { ascending: true })
      //   .range(offset, offset + limit - 1);

      // Mock implementation
      const messages = await this.getStoredMessages(chatId);
      return messages
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .slice(offset, offset + limit);
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return [];
    }
  }

  /**
   * Mark messages as read
   */
  static async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    try {
      // In real app, update Supabase
      // await supabase
      //   .from('messages')
      //   .update({ read: true })
      //   .eq('chat_id', chatId)
      //   .neq('sender_id', userId);

      // Mock implementation
      const messages = await this.getStoredMessages(chatId);
      const updatedMessages = messages.map(msg => 
        msg.sender_id !== userId ? { ...msg, read: true } : msg
      );
      await AsyncStorage.setItem(`messages-${chatId}`, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  /**
   * Subscribe to real-time chat updates
   */
  static subscribeToChat(
    chatId: string,
    onNewMessage: (message: Message) => void,
    onMessageUpdate: (message: Message) => void,
    onTyping: (typing: TypingStatus) => void
  ): () => void {
    try {
      // Subscribe to new messages
      const messagesChannel = supabase
        .channel(`chat-messages-${chatId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `chat_id=eq.${chatId}`,
          },
          (payload) => {
            const newMessage = payload.new as Message;
            onNewMessage(newMessage);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `chat_id=eq.${chatId}`,
          },
          (payload) => {
            const updatedMessage = payload.new as Message;
            onMessageUpdate(updatedMessage);
          }
        )
        .subscribe();

      // Subscribe to typing indicators
      const typingChannel = supabase
        .channel(`typing-${chatId}`)
        .on('broadcast', { event: 'typing' }, (payload) => {
          onTyping(payload.payload as TypingStatus);
        })
        .subscribe();

      // Store subscriptions for cleanup
      this.activeSubscriptions[chatId] = { messagesChannel, typingChannel };

      // Return cleanup function
      return () => {
        messagesChannel.unsubscribe();
        typingChannel.unsubscribe();
        delete this.activeSubscriptions[chatId];
      };
    } catch (error) {
      console.error('Error subscribing to chat:', error);
      return () => {};
    }
  }

  /**
   * Send typing indicator
   */
  static async sendTypingIndicator(
    chatId: string,
    userId: string,
    isTyping: boolean
  ): Promise<void> {
    try {
      const channel = supabase.channel(`typing-${chatId}`);
      
      await channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          userId,
          isTyping,
          timestamp: new Date().toISOString(),
        } as TypingStatus,
      });

      // Auto-stop typing after 3 seconds
      if (isTyping) {
        if (this.typingTimeouts[`${chatId}-${userId}`]) {
          clearTimeout(this.typingTimeouts[`${chatId}-${userId}`]);
        }
        
        this.typingTimeouts[`${chatId}-${userId}`] = setTimeout(() => {
          this.sendTypingIndicator(chatId, userId, false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }

  /**
   * Send order update message
   */
  static async sendOrderUpdateMessage(
    chatId: string,
    orderId: string,
    status: string,
    dishName: string,
    estimatedTime?: string
  ): Promise<void> {
    const statusMessages = {
      confirmed: `Order confirmed! We'll start preparing your ${dishName}.`,
      preparing: `Your ${dishName} is being prepared with love! ${estimatedTime ? `Estimated time: ${estimatedTime}` : ''}`,
      ready: `Great news! Your ${dishName} is ready ${estimatedTime ? `and will be delivered in ${estimatedTime}` : 'for pickup'}!`,
      delivered: `Your ${dishName} has been delivered. Enjoy your meal!`,
      cancelled: `Unfortunately, your order for ${dishName} has been cancelled. We'll process your refund shortly.`,
    };

    const message = statusMessages[status as keyof typeof statusMessages] || 
                   `Order status updated: ${status}`;

    await this.sendMessage(
      chatId,
      'system',
      'chef',
      message,
      'order_update'
    );
  }

  /**
   * Archive a chat
   */
  static async archiveChat(chatId: string): Promise<void> {
    try {
      // In real app, update Supabase
      // await supabase
      //   .from('chats')
      //   .update({ status: 'archived', updated_at: new Date().toISOString() })
      //   .eq('id', chatId);

      // Mock implementation
      const chats = await this.getStoredChats();
      const updatedChats = chats.map(chat => 
        chat.id === chatId ? { ...chat, status: 'archived' as const, updated_at: new Date().toISOString() } : chat
      );
      await AsyncStorage.setItem('chats', JSON.stringify(updatedChats));
    } catch (error) {
      console.error('Error archiving chat:', error);
    }
  }

  /**
   * Block a chat
   */
  static async blockChat(chatId: string): Promise<void> {
    try {
      // In real app, update Supabase
      // await supabase
      //   .from('chats')
      //   .update({ status: 'blocked', updated_at: new Date().toISOString() })
      //   .eq('id', chatId);

      // Mock implementation
      const chats = await this.getStoredChats();
      const updatedChats = chats.map(chat => 
        chat.id === chatId ? { ...chat, status: 'blocked' as const, updated_at: new Date().toISOString() } : chat
      );
      await AsyncStorage.setItem('chats', JSON.stringify(updatedChats));
    } catch (error) {
      console.error('Error blocking chat:', error);
    }
  }

  /**
   * Helper: Get stored chats from AsyncStorage
   */
  private static async getStoredChats(): Promise<Chat[]> {
    try {
      const chatsJson = await AsyncStorage.getItem('chats');
      return chatsJson ? JSON.parse(chatsJson) : [];
    } catch (error) {
      console.error('Error getting stored chats:', error);
      return [];
    }
  }

  /**
   * Helper: Get stored messages from AsyncStorage
   */
  private static async getStoredMessages(chatId: string): Promise<Message[]> {
    try {
      const messagesJson = await AsyncStorage.getItem(`messages-${chatId}`);
      return messagesJson ? JSON.parse(messagesJson) : [];
    } catch (error) {
      console.error('Error getting stored messages:', error);
      return [];
    }
  }

  /**
   * Helper: Update chat timestamp
   */
  private static async updateChatTimestamp(chatId: string): Promise<void> {
    try {
      const chats = await this.getStoredChats();
      const updatedChats = chats.map(chat => 
        chat.id === chatId 
          ? { ...chat, last_message_at: new Date().toISOString(), updated_at: new Date().toISOString() }
          : chat
      );
      await AsyncStorage.setItem('chats', JSON.stringify(updatedChats));
    } catch (error) {
      console.error('Error updating chat timestamp:', error);
    }
  }

  /**
   * Helper: Send message notification
   */
  private static async sendMessageNotification(
    chatId: string,
    senderId: string,
    senderType: 'customer' | 'chef',
    message: string
  ): Promise<void> {
    try {
      // Get sender info
      const senderName = senderType === 'customer' ? 'Customer' : 'Chef';
      
      // In a real app, you would get the actual sender name from the database
      // and send notification only to the other participant
      
      await NotificationService.sendNewMessageNotification(
        chatId,
        senderName,
        message,
        senderType
      );
    } catch (error) {
      console.error('Error sending message notification:', error);
    }
  }

  /**
   * Cleanup all subscriptions
   */
  static cleanup(): void {
    Object.values(this.activeSubscriptions).forEach(({ messagesChannel, typingChannel }) => {
      messagesChannel?.unsubscribe();
      typingChannel?.unsubscribe();
    });
    this.activeSubscriptions = {};
    
    Object.values(this.typingTimeouts).forEach(timeout => {
      clearTimeout(timeout);
    });
    this.typingTimeouts = {};
  }
}
