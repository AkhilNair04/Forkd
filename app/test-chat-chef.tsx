import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { supabase } from '../constants/supabase';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const PRIMARY = '#C67C4E';
const BG = '#111';
const CARD = '#444';

export default function TestChatChefScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  // Test connection and load messages
  useEffect(() => {
    loadMessages();
    
    // Set up polling for new messages every 3 seconds
    const pollInterval = setInterval(() => {
      loadMessages();
    }, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(pollInterval);
  }, []);

  const loadMessages = async () => {
    try {
      console.log('Loading messages...');
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', '550e8400-e29b-41d4-a716-446655440003') // Same chat UUID
        .order('timestamp', { ascending: true });

      console.log('Messages loaded:', data, error);

      if (error) {
        Alert.alert('Error', `Failed to load messages: ${error.message}`);
      } else {
        setMessages(data || []);
      }
    } catch (err) {
      console.error('Load error:', err);
      Alert.alert('Error', 'Failed to connect to database');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText('');

    try {
      console.log('Sending message:', messageText);

      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: '550e8400-e29b-41d4-a716-446655440003', // Same chat UUID
          sender_id: '550e8400-e29b-41d4-a716-446655440001', // Chef ID (different from customer)
          sender_type: 'chef',
          message: messageText,
        })
        .select();

      console.log('Message sent:', data, error);

      if (error) {
        Alert.alert('Error', `Failed to send message: ${error.message}`);
        setInputText(messageText); // Restore text on error
      } else {
        // Reload messages to see the new one
        loadMessages();
      }
    } catch (err) {
      console.error('Send error:', err);
      Alert.alert('Error', 'Failed to send message');
      setInputText(messageText);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isOwnMessage = item.sender_id === '550e8400-e29b-41d4-a716-446655440001'; // Chef ID
    
    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        <Text style={[
          styles.messageText,
          isOwnMessage ? styles.ownMessageText : styles.otherMessageText
        ]}>
          {item.message}
        </Text>
        <Text style={[
          styles.timestamp,
          isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp
        ]}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading chat...</Text>
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
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Test Customer Chat</Text>
          <Text style={styles.headerSubtitle}>Chef View • Live Test</Text>
        </View>
        <TouchableOpacity onPress={loadMessages} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
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
  headerInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
    color: '#fff',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginVertical: 4,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  ownMessage: {
    backgroundColor: PRIMARY,
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: CARD,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.8,
  },
  ownTimestamp: {
    color: 'white',
  },
  otherTimestamp: {
    color: '#bbb',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: CARD,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: BG,
    color: '#fff',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
