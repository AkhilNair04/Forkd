import { supabase } from '@/constants/supabase';
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#C67C4E';
const BG = '#111';
const CARD = '#444';

interface ChatPreview {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    type: 'customer' | 'chef';
    online: boolean;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    senderId: string;
    read: boolean;
  };
  unreadCount: number;
  orderInfo?: {
    orderId: string;
    status: string;
    dishName: string;
  };
}

export default function ChatListScreen() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    initializeAndLoadChats();
    setupRealtimeSubscription();
    
    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  const initializeAndLoadChats = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId') || 'user-1';
      setCurrentUserId(userId);
      await loadChats(userId);
    } catch (error) {
      console.error('Error initializing chats:', error);
    }
  };

  const loadChats = async (userId: string) => {
    try {
      setLoading(true);
      
      // In real app, load from Supabase
      // const { data, error } = await supabase
      //   .from('chats')
      //   .select(`
      //     *,
      //     messages(message, timestamp, sender_id, read),
      //     participants(user_id, users(name, avatar, type))
      //   `)
      //   .eq('participants.user_id', userId)
      //   .order('updated_at', { ascending: false });

      // Mock chat data for demo
      const mockChats: ChatPreview[] = [
        {
          id: 'chat-1',
          participant: {
            id: 'chef-anna',
            name: 'Chef Anna P',
            avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
            type: 'chef',
            online: true,
          },
          lastMessage: {
            text: 'Your order is ready! I\'ll deliver it in 15 minutes.',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            senderId: 'chef-anna',
            read: false,
          },
          unreadCount: 2,
          orderInfo: {
            orderId: 'ORD-001',
            status: 'ready',
            dishName: 'Pasta Carbonara',
          },
        },
        {
          id: 'chat-2',
          participant: {
            id: 'customer-john',
            name: 'John Smith',
            avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
            type: 'customer',
            online: false,
          },
          lastMessage: {
            text: 'Thank you for the amazing meal! Will definitely order again.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            senderId: 'customer-john',
            read: true,
          },
          unreadCount: 0,
        },
        {
          id: 'chat-3',
          participant: {
            id: 'chef-ravi',
            name: 'Chef Ravi K',
            avatar: 'https://randomuser.me/api/portraits/men/66.jpg',
            type: 'chef',
            online: true,
          },
          lastMessage: {
            text: 'I can prepare that for you. When would you like it delivered?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
            senderId: 'chef-ravi',
            read: true,
          },
          unreadCount: 0,
        },
        {
          id: 'chat-4',
          participant: {
            id: 'customer-sarah',
            name: 'Sarah Johnson',
            avatar: 'https://randomuser.me/api/portraits/women/78.jpg',
            type: 'customer',
            online: false,
          },
          lastMessage: {
            text: 'Hi! I\'m interested in booking you for a dinner party next weekend.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            senderId: 'customer-sarah',
            read: true,
          },
          unreadCount: 0,
        },
      ];

      setChats(mockChats);
      
    } catch (error) {
      console.error('Error loading chats:', error);
      Alert.alert('Error', 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    // Subscribe to real-time chat updates
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          // Update chat previews when new messages arrive
          handleRealtimeMessage(payload);
        }
      )
      .subscribe();
  };

  const handleRealtimeMessage = (payload: any) => {
    // Update the chat list with new message info
    const message = payload.new;
    if (!message) return;

    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === message.chat_id) {
          return {
            ...chat,
            lastMessage: {
              text: message.message,
              timestamp: message.timestamp,
              senderId: message.sender_id,
              read: false,
            },
            unreadCount: message.sender_id !== currentUserId 
              ? chat.unreadCount + 1 
              : chat.unreadCount,
          };
        }
        return chat;
      });
    });
  };

  const openChat = (chat: ChatPreview) => {
    // Mark messages as read
    markChatAsRead(chat.id);
    
    router.push({
      pathname: '/chat/[chatId]',
      params: {
        chatId: chat.id,
        participantId: chat.participant.id,
        participantName: chat.participant.name,
        participantType: chat.participant.type,
      },
    });
  };

  const markChatAsRead = async (chatId: string) => {
    try {
      // Update local state immediately
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId 
            ? { ...chat, unreadCount: 0, lastMessage: { ...chat.lastMessage, read: true } }
            : chat
        )
      );

      // In real app, update Supabase
      // await supabase
      //   .from('messages')
      //   .update({ read: true })
      //   .eq('chat_id', chatId)
      //   .neq('sender_id', currentUserId);
      
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  };

  const deleteChat = (chatId: string) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setChats(prev => prev.filter(chat => chat.id !== chatId));
              
              // In real app, delete from Supabase
              // await supabase.from('chats').delete().eq('id', chatId);
              
            } catch (error) {
              console.error('Error deleting chat:', error);
              Alert.alert('Error', 'Failed to delete chat');
            }
          },
        },
      ]
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderChatItem = ({ item }: { item: ChatPreview }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => openChat(item)}
      onLongPress={() => deleteChat(item.id)}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.participant.avatar }} style={styles.avatar} />
        {item.participant.online && <View style={styles.onlineIndicator} />}
        {item.participant.type === 'chef' && (
          <View style={styles.chefBadge}>
            <Ionicons name="restaurant" size={10} color="#fff" />
          </View>
        )}
      </View>

      {/* Chat Content */}
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.participantName} numberOfLines={1}>
            {item.participant.name}
          </Text>
          <Text style={styles.timestamp}>
            {formatTime(item.lastMessage.timestamp)}
          </Text>
        </View>

        {/* Order Info */}
        {item.orderInfo && (
          <View style={styles.orderInfo}>
            <Ionicons name="receipt" size={12} color={PRIMARY} />
            <Text style={styles.orderText}>
              {item.orderInfo.dishName} • {item.orderInfo.status}
            </Text>
          </View>
        )}

        {/* Last Message */}
        <View style={styles.messageRow}>
          <Text
            style={[
              styles.lastMessage,
              !item.lastMessage.read && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage.text}
          </Text>
          
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading chats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newChatButton}>
          <Feather name="edit" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        style={styles.chatList}
        contentContainerStyle={styles.chatListContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  newChatButton: {
    padding: 8,
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: BG,
  },
  chefBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: BG,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    color: '#bbb',
    fontSize: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderText: {
    color: PRIMARY,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    color: '#bbb',
    fontSize: 14,
    flex: 1,
  },
  unreadMessage: {
    color: '#fff',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: PRIMARY,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
