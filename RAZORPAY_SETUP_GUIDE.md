# 🔧 Razorpay Integration Setup Guide

## Step 1: Create Razorpay Account

1. **Visit Razorpay Website**
   - Go to [https://razorpay.com/](https://razorpay.com/)
   - Click "Sign Up" if you don't have an account

2. **Complete Registration**
   - Enter your business details
   - Verify your email address
   - Complete phone verification

3. **Business Verification (for Live Mode)**
   - Upload business documents
   - Complete KYC verification
   - For testing, you can skip this initially

## Step 2: Get Your API Keys

1. **Login to Dashboard**
   - Go to [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/)
   - Login with your credentials

2. **Navigate to API Keys**
   - In the sidebar, go to **Settings** → **API Keys**
   - Or directly visit: Dashboard → Account & Settings → API Keys

3. **Generate/View Keys**
   - Click "Generate Test Key" (for testing)
   - Copy your **Key ID** (starts with `rzp_test_`)
   - Copy your **Key Secret** (starts with letter, longer string)

## Step 3: Configure Your App

### 3.1 Update Environment Variables (.env file)
```env
# Replace with your actual keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3.2 Update Payment File
In `app/payment.jsx`, replace the placeholder key:

```javascript
// Find this line:
key: 'rzp_test_1DP5mmOlF5G5ag',

// Replace with:
key: 'rzp_test_YOUR_ACTUAL_KEY_ID',
```

## Step 4: Test Your Integration

### Test Card Details (for Test Mode)
Use these test card details when testing payments:

| Card Network | Card Number | CVV | Expiry |
|-------------|-------------|-----|--------|
| Visa | 4111 1111 1111 1111 | Any 3 digits | Any future date |
| Mastercard | 5555 5555 5555 4444 | Any 3 digits | Any future date |
| American Express | 3782 8224 6310 005 | Any 4 digits | Any future date |

### Test UPI IDs
- `success@razorpay` - Always succeeds
- `failure@razorpay` - Always fails

### Test Scenarios
1. **Successful Payment**: Use the test cards above
2. **Failed Payment**: Use card number `4000 0000 0000 0002`
3. **UPI Success**: Use `success@razorpay`

## Step 5: Go Live (Production Setup)

### 5.1 Complete Business Verification
- Submit required business documents
- Complete KYC verification
- Wait for approval (usually 24-48 hours)

### 5.2 Get Live Keys
- Once approved, generate **Live API Keys**
- Replace test keys with live keys in production

### 5.3 Update Configuration
```javascript
// For production
key: 'rzp_live_xxxxxxxxxxxxxxxx',
```

## Common Issues & Solutions

### Issue 1: "Razorpay Not Configured" Alert
**Solution**: Replace the placeholder key in `app/payment.jsx`

### Issue 2: Payment Window Not Opening
**Solution**: 
- Check if `react-native-razorpay` is properly installed
- Verify your API key format
- Ensure you're using test keys for development

### Issue 3: Payment Success but Order Not Saving
**Solution**: Check the AsyncStorage logic in the payment success callback

### Issue 4: Invalid Key Error
**Solution**: 
- Verify your key ID format (`rzp_test_` or `rzp_live_`)
- Check for extra spaces or characters
- Ensure you're using Key ID, not Key Secret

## Key Security Best Practices

1. **Never expose Key Secret in client-side code**
2. **Use environment variables for keys**
3. **Verify payments on your server-side**
4. **Enable webhook verification**
5. **Use HTTPS for all communications**

## Quick Testing Checklist

- [ ] Razorpay account created
- [ ] Test API keys generated
- [ ] Keys added to app configuration
- [ ] Payment flow tested with test cards
- [ ] Success/failure scenarios verified
- [ ] Order storage working correctly

## Support Resources

- **Razorpay Documentation**: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **API Reference**: [https://razorpay.com/docs/api/](https://razorpay.com/docs/api/)
- **React Native Integration**: [https://razorpay.com/docs/payment-gateway/react-native/](https://razorpay.com/docs/payment-gateway/react-native/)
- **Support**: support@razorpay.com

---

## Ready to Test? 🚀

1. Get your keys from Razorpay Dashboard
2. Update `app/payment.jsx` with your actual key
3. Try a test payment with card `4111 1111 1111 1111`
4. Check if order is saved and success screen appears

Your payment integration is ready to go!
