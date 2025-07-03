import { ChatParticipant, ChatService, Message, TypingStatus } from '@/services/ChatService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#C67C4E';
const BG = '#111';
const CARD = '#444';

export default function ChatScreen() {
  const router = useRouter();
  const { chatId, participantId, participantName, participantType } = useLocalSearchParams();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserType, setCurrentUserType] = useState<'customer' | 'chef'>('customer');
  const [isTyping, setIsTyping] = useState(false);
  const [participant, setParticipant] = useState<ChatParticipant | null>(null);
  const [subscription, setSubscription] = useState<(() => void) | null>(null);
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initializeChat();
    loadMessages();
    
    return () => {
      // Cleanup subscriptions
      if (subscription) {
        subscription();
      }
    };
  }, []);

  const initializeChat = async () => {
    try {
      // Get current user info from AsyncStorage
      const userId = await AsyncStorage.getItem('userId') || 'user-1';
      const userType = await AsyncStorage.getItem('userRole') || 'customer';
      
      setCurrentUserId(userId);
      setCurrentUserType(userType.toLowerCase() as 'customer' | 'chef');
      
      // Set participant info
      setParticipant({
        id: participantId as string,
        name: participantName as string,
        avatar: `https://ui-avatars.com/api/?name=${participantName}&background=C67C4E&color=fff`,
        type: participantType as 'customer' | 'chef',
        online: Math.random() > 0.3, // Mock online status
      });
      
      // Setup real-time subscription
      setupRealtimeSubscription();
      
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      
      // Load real messages using ChatService
      const realMessages = await ChatService.getChatMessages(chatId as string, 50, 0);
      
      if (realMessages.length > 0) {
        setMessages(realMessages);
      } else {
        // If no real messages, show mock messages for demo
        const mockMessages: Message[] = [
          {
            id: '1',
            chat_id: chatId as string,
            sender_id: participantId as string,
            sender_type: participantType as 'customer' | 'chef',
            message: `Hi! I'm interested in your ${participantType === 'chef' ? 'cooking services' : 'order'}. Can we discuss the details?`,
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            read: true,
            message_type: 'text',
          },
          {
            id: '2',
            chat_id: chatId as string,
            sender_id: 'current-user',
            sender_type: currentUserType,
            message: 'Sure! I\'d be happy to help. What specific requirements do you have?',
            timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
            read: true,
            message_type: 'text',
          },
          {
            id: '3',
            chat_id: chatId as string,
            sender_id: participantId as string,
            sender_type: participantType as 'customer' | 'chef',
            message: 'I need catering for about 20 people this weekend. Can you handle that?',
            timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
            read: true,
            message_type: 'text',
          },
        ];
        setMessages(mockMessages);
      }
      
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    // Subscribe to real-time message updates using ChatService
    const unsubscribe = ChatService.subscribeToChat(
      chatId as string,
      (newMessage: Message) => {
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
      },
      (updatedMessage: Message) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === updatedMessage.id ? updatedMessage : msg
          )
        );
      },
      (typingStatus: TypingStatus) => {
        if (typingStatus.userId !== currentUserId) {
          setIsTyping(typingStatus.isTyping);
        }
      }
    );

    setSubscription(() => unsubscribe);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    
    try {
      // Send message using ChatService
      const sentMessage = await ChatService.sendMessage(
        chatId as string,
        currentUserId,
        currentUserType,
        messageText
      );

      if (sentMessage) {
        // Message will be added via real-time subscription
        scrollToBottom();
      } else {
        Alert.alert('Error', 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleTyping = async (text: string) => {
    setNewMessage(text);
    
    // Send typing indicator
    if (text.length > 0) {
      await ChatService.sendTypingIndicator(chatId as string, currentUserId, true);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender_id === currentUserId || item.sender_id === 'current-user';
    const isSystemMessage = item.message_type === 'system' || item.message_type === 'order_update';

    if (isSystemMessage) {
      return (
        <View style={styles.systemMessageContainer}>
          <View style={styles.systemMessage}>
            <Ionicons name="information-circle" size={16} color={PRIMARY} />
            <Text style={styles.systemMessageText}>{item.message}</Text>
          </View>
          <Text style={styles.systemMessageTime}>{formatTime(item.timestamp)}</Text>
        </View>
      );
    }

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownMessage : styles.otherMessage
        ]}>
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
          ]}>
            {item.message}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[
              styles.messageTime,
              isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime
            ]}>
              {formatTime(item.timestamp)}
            </Text>
            {isOwnMessage && (
              <Ionicons 
                name={item.read ? "checkmark-done" : "checkmark"} 
                size={12} 
                color={item.read ? "#4CAF50" : "#999"}
                style={styles.readIndicator}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <Text style={styles.typingText}>{participant?.name} is typing</Text>
          <View style={styles.typingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.participantInfo}>
          <Text style={styles.participantName}>{participant?.name}</Text>
          <Text style={styles.participantStatus}>
            {participant?.online ? 'Online' : 'Offline'} • {participant?.type}
          </Text>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollToBottom()}
          onLayout={() => scrollToBottom()}
        />
        
        {renderTypingIndicator()}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={handleTyping}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity 
            style={[styles.sendButton, newMessage.trim() ? styles.sendButtonActive : {}]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={newMessage.trim() ? "#fff" : "#999"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  participantStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginVertical: 4,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ownMessage: {
    backgroundColor: PRIMARY,
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 2,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherMessageTime: {
    color: '#999',
  },
  readIndicator: {
    marginLeft: 4,
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemMessage: {
    backgroundColor: 'rgba(198, 124, 78, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  systemMessageText: {
    fontSize: 14,
    color: PRIMARY,
    marginLeft: 6,
    textAlign: 'center',
  },
  systemMessageTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingBubble: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  typingDots: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999',
    marginHorizontal: 1,
  },
  dot1: {
    // Animation would be handled by Animated API in production
  },
  dot2: {
    // Animation would be handled by Animated API in production
  },
  dot3: {
    // Animation would be handled by Animated API in production
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: PRIMARY,
  },
});
