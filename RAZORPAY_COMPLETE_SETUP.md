# 🔑 Complete Razorpay Setup Guide for Your Food App

## **Quick Summary**
This guide will help you get Razorpay API keys and configure them in your app for payment processing.

---

## **Step 1: Create Razorpay Account**

### 🌐 **Go to Razorpay Website**
1. Visit: [https://razorpay.com/](https://razorpay.com/)
2. Click **"Sign Up"** (or "Login" if you have an account)

### 📝 **Complete Registration**
1. **Choose Account Type**: Select "Business" 
2. **Business Details**: Fill in your business information
   - For testing: You can use personal details
   - Business name: Your app name (e.g., "Forkd Food App")
   - Category: "Food & Beverages"
3. **Upload Documents**: 
   - PAN Card
   - Aadhaar Card
   - Bank Account details (for settlements)

---

## **Step 2: Get Your API Keys**

### 🔑 **Access Dashboard**
1. After registration, go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Complete any pending verification steps

### 🧪 **Get Test Keys (For Development)**
1. In the dashboard, go to **Settings** → **API Keys**
2. Click **"Generate Test Key"**
3. You'll see:
   - **Key ID**: `rzp_test_xxxxxxxxxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxxxxxxxxxxxxxx`
4. **Copy both keys** (you'll need them in the next step)

---

## **Step 3: Configure Your App**

### 📄 **Update .env File**
1. Open your `.env` file in the project root
2. Replace the placeholder values:

```env
# Replace these with your actual Razorpay keys
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
RAZORPAY_KEY_SECRET=your_actual_secret_key_here
```

**Example:**
```env
RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
RAZORPAY_KEY_SECRET=abcd1234efgh5678ijkl9012mnop3456
```

### 🔄 **Restart Your App**
1. Stop the Expo server (Ctrl+C in terminal)
2. Start it again: `npx expo start`

---

## **Step 4: Test Payment Integration**

### 💳 **Test Card Details**
For testing Razorpay payments, use these test card details:

**Credit/Debit Card:**
- **Card Number**: `4111 1111 1111 1111`
- **Expiry**: Any future date (e.g., `12/25`)
- **CVV**: Any 3 digits (e.g., `123`)
- **Cardholder Name**: Any name

**UPI:**
- **UPI ID**: `success@razorpay`
- **PIN**: Any 4-6 digits

### ✅ **Test Scenarios**
- **Successful Payment**: Use the test card above
- **Failed Payment**: Use card `4000 0000 0000 0002`
- **Insufficient Funds**: Use card `4000 0000 0000 9995`

---

## **Step 5: Live Mode (Production)**

### 🚀 **When Ready for Production**
1. **Complete KYC**: Submit all required business documents
2. **Get Live Keys**: After approval, generate live keys
3. **Update Environment**: 
   ```env
   RAZORPAY_KEY_ID=rzp_live_your_live_key_id
   RAZORPAY_KEY_SECRET=your_live_secret_key
   ```

---

## **🛠️ Troubleshooting**

### **Common Issues:**

1. **"Razorpay Not Configured" Error**
   - ✅ Check if `.env` file has correct keys
   - ✅ Restart Expo server after updating `.env`
   - ✅ Ensure no extra spaces in key values

2. **Payment Not Opening**
   - ✅ Verify `react-native-razorpay` is installed
   - ✅ Check console for error messages
   - ✅ Test with demo key first

3. **Keys Not Working**
   - ✅ Ensure using Test keys for development
   - ✅ Check if keys are copied correctly (no extra characters)
   - ✅ Verify account is active

### **Debug Steps:**
1. Check console logs in your app
2. Verify environment variables are loaded
3. Test with Cash on Delivery first

---

## **📱 Testing Your Setup**

1. **Add items to cart**
2. **Go to checkout**
3. **Select "Online Payment"**
4. **Click "Pay Now"**
5. **Use test card details above**
6. **Verify payment success**

---

## **🔒 Security Notes**

- **Never commit `.env` file** to git (it's already in `.gitignore`)
- **Keep Secret Key private** - never expose in frontend code
- **Use Test mode** until business verification is complete
- **Regularly rotate keys** in production

---

## **💡 Next Steps**

1. **Webhooks**: Set up webhooks for payment confirmations
2. **Settlements**: Configure bank account for fund transfers
3. **Analytics**: Use Razorpay dashboard for payment analytics
4. **Refunds**: Implement refund functionality if needed

---

## **📞 Support**

- **Razorpay Docs**: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Support**: [https://razorpay.com/support/](https://razorpay.com/support/)
- **Community**: [https://community.razorpay.com/](https://community.razorpay.com/)

---

**🎉 That's it! Your payment integration is ready to use.**
