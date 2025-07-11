# Chat Testing Guide

## Understanding User Identification

### How Users Are Distinguished

In our test chat system, users are identified by their `sender_id` in the messages. Here's how it works:

1. **Customer Chat Screen** (`/test-chat`):
   - Sends messages as Customer ID: `550e8400-e29b-41d4-a716-446655440002`
   - Shows messages from this ID on the RIGHT (blue bubbles with white text)
   - Shows messages from other users on the LEFT (white bubbles with dark text)

2. **Chef Chat Screen** (`/test-chat-chef`):
   - Sends messages as Chef ID: `550e8400-e29b-41d4-a716-446655440001`
   - Shows messages from this ID on the RIGHT (blue bubbles with white text)
   - Shows messages from other users on the LEFT (white bubbles with dark text)

### Visual Message Indicators

- **Your messages**: Blue background, white text, aligned RIGHT
- **Other user's messages**: White background, dark gray text, aligned LEFT
- **Timestamps**: Light gray, below each message

## Testing Scenarios

### Scenario 1: Single Device Testing
1. Navigate to `/test-chat` (customer view)
2. Send a few messages - they appear as blue bubbles on the right
3. Navigate to `/test-chat-chef` (chef view)
4. You'll see the customer's messages as white bubbles on the left
5. Send messages from chef view - they appear as blue bubbles on the right
6. Go back to `/test-chat` - chef messages now appear as white bubbles on the left

### Scenario 2: Multi-Device Testing (RECOMMENDED)
1. **Device 1** (or Browser Tab 1): Open `/test-chat`
2. **Device 2** (or Browser Tab 2): Open `/test-chat-chef`
3. Send messages from both devices and watch them appear in real-time
4. Messages update every 3 seconds via polling

### Scenario 3: Understanding Message Flow
```
Customer sends: "Hello chef!" 
├─ In customer view: Blue bubble on right
└─ In chef view: White bubble on left

Chef replies: "Hello! How can I help?"
├─ In chef view: Blue bubble on right  
└─ In customer view: White bubble on left
```

## Troubleshooting

### Issue: White text on white background
**Status**: ✅ FIXED - If you still see this, try:
1. Restart your Expo development server
2. Clear the app cache (shake device > Reload)
3. Check that you're using the latest code

### Issue: Messages not appearing
**Check these:**
1. **Database Connection**: Verify your `.env` file has correct Supabase credentials
2. **RLS Disabled**: Ensure Row Level Security is disabled for testing:
   ```sql
   ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
   ALTER TABLE chats DISABLE ROW LEVEL SECURITY;
   ```
3. **Test Data**: Ensure test chat and users exist in your database

### Issue: 403 Forbidden errors
**Solution**: Disable RLS (Row Level Security) for testing:
```sql
-- Connect to your Supabase SQL Editor and run:
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE chats DISABLE ROW LEVEL SECURITY;
```

### Issue: No real-time updates
**This is expected** - We're using polling (every 3 seconds) instead of real-time subscriptions for this test version.

## Database Structure

### Users Table
```sql
users (
  id: UUID (Primary Key)
  email: TEXT
  full_name: TEXT
  user_type: TEXT ('customer' or 'chef')
  created_at: TIMESTAMP
)
```

### Chats Table
```sql
chats (
  id: UUID (Primary Key)
  customer_id: UUID (Foreign Key)
  chef_id: UUID (Foreign Key)
  created_at: TIMESTAMP
)
```

### Messages Table
```sql
messages (
  id: UUID (Primary Key)
  chat_id: UUID (Foreign Key)
  sender_id: UUID (Foreign Key)
  message: TEXT
  timestamp: TIMESTAMP
)
```

## Test Data in Database

### Test Users:
- **Chef**: ID `550e8400-e29b-41d4-a716-446655440001`, email: `chef@test.com`
- **Customer**: ID `550e8400-e29b-41d4-a716-446655440002`, email: `customer@test.com`

### Test Chat:
- **Chat ID**: `550e8400-e29b-41d4-a716-446655440003`
- **Between**: Chef and Customer above

## Next Steps for Production

1. **Add Authentication**: Replace hardcoded user IDs with actual authenticated user sessions
2. **Enable RLS**: Re-enable Row Level Security with proper policies
3. **Real-time**: Consider using Supabase Realtime subscriptions instead of polling
4. **UI Improvements**: Add user avatars, names, message status indicators
5. **Chat Management**: Add ability to create new chats, list existing chats

## Quick Commands

### Start the app:
```bash
npm start
```

### Check database (in Supabase Dashboard):
1. Go to Table Editor
2. Check `messages` table for new entries
3. Verify `users` and `chats` tables have test data

### Reset test data (run in Supabase SQL Editor):
```sql
DELETE FROM messages WHERE chat_id = '550e8400-e29b-41d4-a716-446655440003';
```
