# Supabase Realtime Chat Setup Guide

## Overview
This guide explains how to set up and use Supabase Realtime for chat functionality in your React Native app.

## 1. Database Setup

### Required Tables
Make sure you have these tables in your Supabase database:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('customer', 'chef')),
  name text NOT NULL,
  avatar text,
  phone text,
  location text,
  preferences jsonb DEFAULT '{}',
  last_active_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Chats table
CREATE TABLE public.chats (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  chef_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  order_id uuid, -- references orders table if exists
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_message_at timestamp with time zone DEFAULT now(),
  UNIQUE(customer_id, chef_id, order_id)
);

-- Messages table
CREATE TABLE public.messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  chat_id uuid REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('customer', 'chef', 'system')),
  message text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'order_update', 'system')),
  timestamp timestamp with time zone DEFAULT now(),
  read boolean DEFAULT false,
  edited_at timestamp with time zone,
  reply_to uuid REFERENCES public.messages(id)
);

-- Create indexes for better performance
CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_messages_timestamp ON public.messages(timestamp);
CREATE INDEX idx_chats_last_message ON public.chats(last_message_at);
```

### 2. Realtime Alternative (Polling)
Since Realtime replication is in early access, we'll use a polling-based approach:
- Messages will be checked every 2-3 seconds when chat is active
- Typing indicators will use Supabase channels (available in all plans)
- This provides near real-time experience without replication

### 3. Row Level Security (RLS)
Set up RLS policies to ensure users can only access their own chats:

```sql
-- Enable RLS
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Chats policies
CREATE POLICY "Users can view their own chats" ON public.chats
  FOR SELECT USING (
    auth.uid() = customer_id OR auth.uid() = chef_id
  );

CREATE POLICY "Users can create chats" ON public.chats
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id OR auth.uid() = chef_id
  );

-- Messages policies
CREATE POLICY "Users can view messages in their chats" ON public.messages
  FOR SELECT USING (
    chat_id IN (
      SELECT id FROM public.chats 
      WHERE customer_id = auth.uid() OR chef_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their chats" ON public.messages
  FOR INSERT WITH CHECK (
    chat_id IN (
      SELECT id FROM public.chats 
      WHERE customer_id = auth.uid() OR chef_id = auth.uid()
    ) AND sender_id = auth.uid()
  );
```

## 4. Usage in React Native

### Basic Implementation
```tsx
import { useChat } from '@/hooks/useChat';

const ChatScreen = ({ chatId, currentUserId }) => {
  const {
    messages,
    isTyping,
    loading,
    error,
    sendMessage,
    sendTypingIndicator,
  } = useChat({
    chatId,
    currentUserId,
    enabled: true
  });

  const handleSend = async (text: string) => {
    const sentMessage = await sendMessage(text);
    if (!sentMessage) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleTyping = (text: string) => {
    if (text.length > 0) {
      sendTypingIndicator(true);
    } else {
      sendTypingIndicator(false);
    }
  };

  // ... render your chat UI
};
```

### Advanced Features

#### 1. Message Types
```tsx
// Send different message types
await sendMessage('Hello!', 'text');
await sendMessage('Order confirmed!', 'order_update');
await sendMessage('User joined chat', 'system');
```

#### 2. Typing Indicators
```tsx
// Handle typing with debounce
const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();

const handleTyping = (text: string) => {
  // Clear existing timeout
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }

  // Send typing indicator
  if (text.length > 0) {
    sendTypingIndicator(true);
    
    // Auto-stop after 3 seconds
    const timeout = setTimeout(() => {
      sendTypingIndicator(false);
    }, 3000);
    setTypingTimeout(timeout);
  } else {
    sendTypingIndicator(false);
  }
};
```

#### 3. Message Status
```tsx
// Messages automatically show read/unread status
const MessageItem = ({ message, isOwnMessage }) => (
  <View style={styles.message}>
    <Text>{message.message}</Text>
    {isOwnMessage && (
      <Icon 
        name={message.read ? "checkmark-done" : "checkmark"} 
        color={message.read ? "green" : "gray"}
      />
    )}
  </View>
);
```

## 5. Testing

### Local Testing
1. Use multiple devices/simulators
2. Send messages from one device
3. Verify they appear in real-time on the other

### Production Testing
1. Test with real network conditions
2. Test offline/online scenarios
3. Verify message delivery and read receipts

## 6. Performance Optimization

### Message Pagination
```tsx
const loadMoreMessages = async () => {
  const olderMessages = await ChatService.getChatMessages(
    chatId, 
    20, 
    messages.length // offset
  );
  setMessages(prev => [...olderMessages, ...prev]);
};
```

### Connection Management
```tsx
// Automatically reconnect on app focus
useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      // Reconnect realtime if needed
      loadMessages();
    }
  });

  return () => subscription?.remove();
}, []);
```

## 7. Troubleshooting

### Common Issues

1. **Messages not appearing in real-time**
   - Check if Realtime is enabled for the messages table
   - Verify RLS policies allow the user to see messages
   - Check network connectivity

2. **Typing indicators not working**
   - Ensure broadcast permissions are set correctly
   - Check if channels are being created properly

3. **Performance issues**
   - Implement message pagination
   - Use proper indexing on database
   - Limit the number of concurrent subscriptions

### Debug Mode
```tsx
// Enable debug logging in ChatService
const { data, error } = await supabase
  .from('messages')
  .insert(messageData)
  .select();

console.log('Message sent:', data, error);
```

## 8. Security Considerations

1. **Always use RLS**: Never rely on client-side filtering alone
2. **Validate inputs**: Sanitize all message content
3. **Rate limiting**: Implement rate limiting for message sending
4. **Content moderation**: Consider adding content filtering

This setup provides a robust, real-time chat system with proper error handling, typing indicators, and message status tracking.
