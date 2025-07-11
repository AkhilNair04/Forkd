# Complete Step-by-Step Chat Setup (No Realtime Replication Needed)

## 🚀 Phase 1: Supabase Database Setup

### Step 1: Access Your Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in and select your project
3. Go to **Database → SQL Editor**

### Step 2: Create the Database Tables
Copy and paste this entire SQL script and click "Run":

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
  order_id uuid,
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

### Step 3: Set Up Security (RLS Policies)
Run this second SQL script to secure your data:

```sql
-- Enable Row Level Security
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

### Step 4: Add Some Test Data (Optional)
Add test users and a chat to test with:

```sql
-- Insert test users
INSERT INTO public.users (id, email, user_type, name, avatar) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'chef1@test.com', 'chef', 'Chef Mario', 'https://randomuser.me/api/portraits/men/75.jpg'),
('550e8400-e29b-41d4-a716-446655440002', 'customer1@test.com', 'customer', 'John Doe', 'https://randomuser.me/api/portraits/men/32.jpg');

-- Insert a test chat
INSERT INTO public.chats (id, customer_id, chef_id) VALUES 
('chat-test-123', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001');

-- Insert test messages
INSERT INTO public.messages (chat_id, sender_id, sender_type, message) VALUES 
('chat-test-123', '550e8400-e29b-41d4-a716-446655440002', 'customer', 'Hi! I would like to order some pasta.'),
('chat-test-123', '550e8400-e29b-41d4-a716-446655440001', 'chef', 'Sure! What type of pasta would you prefer?');
```

## 📱 Phase 2: React Native App Setup

### Step 5: Install Dependencies
Run these commands in your project terminal:

```bash
npm install @supabase/supabase-js
npm install @react-native-async-storage/async-storage
```

### Step 6: Verify Your Supabase Configuration
Check that your `app.config.js` has your Supabase credentials:

```javascript
export default {
  expo: {
    // ... other config
    extra: {
      SUPABASE_URL: "your-supabase-url",
      SUPABASE_ANON_KEY: "your-supabase-anon-key"
    }
  }
};
```

### Step 7: Test the Chat System

#### Option A: Use the existing chat screens
1. Start your app: `npm start`
2. Navigate to the chat screen
3. The system will use polling (checking for new messages every 2 seconds)

#### Option B: Create a simple test chat
Create a new file `test-chat.tsx`:

```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useChat } from '@/hooks/useChat';

export default function TestChat() {
  const [inputText, setInputText] = useState('');
  
  const {
    messages,
    isTyping,
    loading,
    sendMessage,
    sendTypingIndicator,
  } = useChat({
    chatId: 'chat-test-123', // Use the test chat we created
    currentUserId: '550e8400-e29b-41d4-a716-446655440002', // Customer ID
    enabled: true
  });

  const handleSend = async () => {
    if (inputText.trim()) {
      await sendMessage(inputText);
      setInputText('');
    }
  };

  const handleTyping = (text: string) => {
    setInputText(text);
    sendTypingIndicator(text.length > 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Test Chat</Text>
      
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.message,
            item.sender_id === '550e8400-e29b-41d4-a716-446655440002' 
              ? styles.ownMessage 
              : styles.otherMessage
          ]}>
            <Text>{item.message}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />
      
      {isTyping && (
        <Text style={styles.typing}>Chef Mario is typing...</Text>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleTyping}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  message: { padding: 12, marginVertical: 4, borderRadius: 8, maxWidth: '80%' },
  ownMessage: { backgroundColor: '#007AFF', alignSelf: 'flex-end' },
  otherMessage: { backgroundColor: '#E5E5EA', alignSelf: 'flex-start' },
  timestamp: { fontSize: 10, marginTop: 4, opacity: 0.7 },
  typing: { fontStyle: 'italic', color: '#666', margin: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  sendButton: { backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  sendButtonText: { color: 'white', fontWeight: 'bold' }
});
```

## 🧪 Phase 3: Testing

### Step 8: Test Your Chat
1. **Single device testing**: Send messages and see them appear
2. **Multi-device testing**: 
   - Open the app on two devices/simulators
   - Use different user IDs in the useChat hook
   - Send messages from one device and watch them appear on the other (within 2-3 seconds)

### Step 9: Test Typing Indicators
1. Start typing on one device
2. Watch for "is typing..." indicator on the other device
3. This uses Supabase channels and works immediately

## 🎯 How It Works

### Polling System
- **Every 2 seconds**, the app checks for new messages
- Only fetches messages newer than the last received message
- Very efficient and provides near real-time experience

### Typing Indicators
- Uses Supabase channels (available on all plans)
- Works in true real-time
- Auto-clears after 3-5 seconds

### Benefits of This Approach
✅ Works without Realtime replication
✅ Very responsive (2-second delay max)
✅ Efficient (only fetches new messages)
✅ True real-time typing indicators
✅ Works on all Supabase plans

## 🐛 Troubleshooting

### Common Issues:

1. **"No messages appearing"**
   - Check your Supabase URL and API key
   - Verify the tables were created correctly
   - Check the browser network tab for API errors

2. **"Authentication errors"**
   - RLS policies require authenticated users
   - For testing, you can temporarily disable RLS:
   ```sql
   ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
   ALTER TABLE public.chats DISABLE ROW LEVEL SECURITY;
   ```

3. **"Typing indicators not working"**
   - Check if channels are enabled in your Supabase project
   - Verify the channel names match between sender and receiver

### Debug Mode:
Add this to your chat component to see what's happening:

```tsx
useEffect(() => {
  console.log('Messages updated:', messages.length);
  console.log('Latest message:', messages[messages.length - 1]);
}, [messages]);
```

## 🎉 Congratulations!
You now have a functional chat system that:
- Polls for new messages every 2 seconds
- Shows typing indicators in real-time
- Handles message delivery and read receipts
- Works without Realtime replication

The experience feels real-time to users while being compatible with all Supabase plans!
