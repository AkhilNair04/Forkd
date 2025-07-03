# Fork'd Chat & Notification System

This document provides a comprehensive guide to the chat and notification features implemented in the Fork'd app.

## 🚀 Features Implemented

### ✅ 1. In-App Messaging (Real-time Chat)
- **Real-time messaging** between customers and chefs using Supabase Realtime
- **Typing indicators** to show when someone is typing
- **Message status indicators** (sent, delivered, read)
- **Order-related messaging** with special message types
- **Chat persistence** with AsyncStorage fallback for offline support
- **Message threading** support for replies

### ✅ 2. Order Update Push Notifications
- **Order status notifications** (confirmed, preparing, ready, delivered, cancelled)
- **Estimated delivery time** updates
- **Custom notification channels** for different notification types
- **Badge count management** for unread notifications
- **Local and push notification** support

### ✅ 3. Promotional Push Notifications
- **Supabase Edge Functions** for server-side notification sending
- **Targeted campaigns** (all users, customers only, inactive users)
- **Location-based targeting** for local promotions
- **Promo code distribution** through notifications
- **Campaign tracking** and analytics
- **Scheduled notifications** support

## 📱 Core Services

### NotificationService (`/services/NotificationService.ts`)
Handles all notification functionality:

```typescript
// Initialize notification service
await NotificationService.initialize();

// Send order update notification
await NotificationService.sendOrderUpdateNotification(
  orderId, status, dishName, estimatedTime
);

// Send new message notification
await NotificationService.sendNewMessageNotification(
  chatId, senderName, message, senderType
);

// Send promotional notification
await NotificationService.sendPromotionalNotification(
  title, message, promoCode, chefId
);

// Manage badge count
await NotificationService.setBadgeCount(count);
```

### ChatService (`/services/ChatService.ts`)
Manages real-time chat functionality:

```typescript
// Create a new chat
const chat = await ChatService.createChat(customerId, chefId, orderId);

// Send a message
const message = await ChatService.sendMessage(
  chatId, senderId, senderType, messageText
);

// Subscribe to real-time updates
const unsubscribe = ChatService.subscribeToChat(
  chatId, onNewMessage, onMessageUpdate, onTyping
);

// Send typing indicator
await ChatService.sendTypingIndicator(chatId, userId, isTyping);
```

### PromotionalService (`/services/PromotionalService.ts`)
Handles promotional campaigns via Supabase Edge Functions:

```typescript
// Send promotional notification
await PromotionalService.sendPromotionalNotification({
  title: "Weekend Deal!",
  message: "Get 25% off with code WEEKEND25",
  promoCode: "WEEKEND25",
  targetAudience: "customers"
});

// Send chef availability notification
await PromotionalService.sendChefAvailabilityNotification({
  chefId, chefName, location, specialties
});
```

## 🗄️ Database Schema

### Chat Tables
```sql
-- Chats table
CREATE TABLE chats (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES users(id),
  chef_id UUID REFERENCES users(id),
  order_id UUID REFERENCES orders(id),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  chat_id UUID REFERENCES chats(id),
  sender_id UUID REFERENCES users(id),
  sender_type TEXT CHECK (sender_type IN ('customer', 'chef', 'system')),
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  timestamp TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  reply_to UUID REFERENCES messages(id)
);
```

### Notification Tables
```sql
-- User push tokens
CREATE TABLE user_push_tokens (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  push_token TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('ios', 'android', 'web')),
  is_active BOOLEAN DEFAULT TRUE
);

-- Notification campaigns
CREATE TABLE notification_campaigns (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_audience TEXT,
  sent_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install expo-notifications expo-device @supabase/supabase-js
```

### 2. Configure Supabase
1. Run the migration: `/supabase/migrations/20241228000000_chat_and_notifications.sql`
2. Deploy the edge function: `/supabase/functions/promotional-notifications/index.ts`
3. Set environment variables in Supabase dashboard:
   - `EXPO_ACCESS_TOKEN` (from Expo dashboard)

### 3. Initialize Services
Services are automatically initialized in `app/_layout.tsx`:

```typescript
useEffect(() => {
  const initializeServices = async () => {
    await NotificationService.initialize();
    await ChatService.initialize();
    NotificationService.setupNotificationListeners();
  };
  
  initializeServices();
}, []);
```

## 📱 UI Screens

### Chat Screens
- **Chat List** (`/app/chat/index.tsx`) - List of all chats with unread indicators
- **Chat Detail** (`/app/chat/[chatId].tsx`) - Individual chat with real-time messaging

### Demo & Testing
- **Notification Demo** (`/app/notification-demo.tsx`) - Test all notification types
- **Profile Screen** (`/app/(tabs)/profile.tsx`) - Quick access to chat and notifications

## 🔔 Notification Types

### Order Updates
- **Confirmed**: "Your order has been confirmed!"
- **Preparing**: "Your chef is preparing your meal"
- **Ready**: "Your order is ready for pickup/delivery"
- **Delivered**: "Your order has been delivered"
- **Cancelled**: "Your order has been cancelled"

### Message Notifications
- Show sender name and message preview
- Navigate to chat when tapped
- Update badge count for unread messages

### Promotional Notifications
- Weekend deals and special offers
- New chef availability alerts
- Promo code distribution
- Location-based promotions

## 🚀 Edge Functions (Supabase)

### Promotional Notifications Function
Located at `/supabase/functions/promotional-notifications/index.ts`

**Endpoints:**
- `POST /promotional` - Send promotional notifications
- `POST /chef_availability` - Send chef availability alerts
- `POST /weekly_deals` - Send weekly deals notifications

**Deploy:**
```bash
supabase functions deploy promotional-notifications
```

**Call from app:**
```typescript
const { data, error } = await supabase.functions.invoke('promotional-notifications', {
  body: {
    type: 'promotional',
    payload: {
      title: "Special Offer!",
      message: "Get 20% off your next order",
      targetAudience: "customers"
    }
  }
});
```

## 🧪 Testing

### Notification Demo Screen
Navigate to `/notification-demo` to test:
- ✅ Order update notifications
- ✅ New message notifications
- ✅ Promotional notifications
- ✅ Chef availability notifications
- ✅ Scheduled notifications
- ✅ Badge count management
- ✅ Chat creation and messaging

### Manual Testing Steps
1. **Test Notifications:**
   - Go to Profile → Notification Demo
   - Tap each notification type button
   - Check notification panel for received notifications

2. **Test Real-time Chat:**
   - Go to Profile → Chat & Messages
   - Create a test chat
   - Send messages and verify real-time updates
   - Test typing indicators

3. **Test Order Updates:**
   - Use notification demo to simulate order status changes
   - Verify notifications appear with correct content

## 🔐 Security & Permissions

### Row Level Security (RLS)
All chat and notification tables have RLS enabled:
- Users can only access their own chats and messages
- Push tokens are user-specific
- Notification preferences are private

### Notification Permissions
- App requests notification permissions on first launch
- Users can disable specific notification types in settings
- Respects system-level notification settings

## 📈 Analytics & Monitoring

### Notification Campaign Tracking
- Track sent vs delivered notifications
- Monitor click-through rates
- Campaign performance metrics stored in `notification_campaigns` table

### Chat Analytics
- Message delivery rates
- Response times between customers and chefs
- Chat engagement metrics

## 🚀 Production Deployment

### Supabase Setup
1. Deploy edge functions: `supabase functions deploy promotional-notifications`
2. Set up cron jobs for scheduled notifications
3. Configure notification templates in database
4. Set up monitoring and alerts

### Expo Setup
1. Configure push notification credentials in Expo dashboard
2. Set up production notification channels
3. Configure notification icons and sounds
4. Test on physical devices

## 🔮 Future Enhancements

### Planned Features
- [ ] **Rich media messages** (images, voice notes)
- [ ] **Push notification scheduling** from admin panel
- [ ] **A/B testing** for notification content
- [ ] **Smart notification timing** based on user behavior
- [ ] **Chat templates** for common scenarios
- [ ] **Notification analytics dashboard**
- [ ] **Multi-language notification support**
- [ ] **Voice/video calling** integration

### Technical Improvements
- [ ] **Message encryption** for enhanced security
- [ ] **Offline message queue** for better reliability
- [ ] **Advanced targeting** (behavioral, demographic)
- [ ] **Real-time presence indicators**
- [ ] **Message search** functionality
- [ ] **Chat backup and export**

## 📞 Support & Troubleshooting

### Common Issues

**Notifications not appearing:**
- Check device notification permissions
- Verify push token registration
- Test with notification demo screen

**Real-time chat not working:**
- Check Supabase connection
- Verify real-time subscriptions
- Test with mock data first

**Edge functions failing:**
- Check environment variables
- Verify function deployment
- Monitor function logs in Supabase dashboard

### Debug Mode
Enable debug logging in development:
```typescript
// Add to app config
export const DEBUG_NOTIFICATIONS = __DEV__;
export const DEBUG_CHAT = __DEV__;
```

---

**Note**: This implementation provides a solid foundation for chat and notifications. For production use, consider additional security measures, performance optimizations, and user experience enhancements based on your specific requirements.
