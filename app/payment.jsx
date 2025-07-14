// app/payment.tsx
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentScreen() {
  const { total, address, phone, instructions } = useLocalSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const amount = parseInt(total ?? "0") / 100;

  useEffect(() => {
    // Prepare order details for storage
    const details = {
      amount,
      address,
      phone,
      instructions,
      orderTime: new Date().toLocaleString(),
      orderId: 'ORD' + Date.now(),
      status: 'pending'
    };
    setOrderDetails(details);
  }, [total, address, phone, instructions]);

  const handleRazorpayPayment = () => {
    // Check if Razorpay keys are configured
    const razorpayKey = 'rzp_test_1DP5mmOlF5G5ag'; // Replace this with your actual key
    
    if (!razorpayKey || razorpayKey === 'rzp_test_1DP5mmOlF5G5ag') {
      Alert.alert(
        "Razorpay Not Configured",
        "Please configure your Razorpay API keys first. Check the setup guide in the console.",
        [
          { text: "Use Cash on Delivery", onPress: handleCashOnDelivery },
          { text: "Cancel", style: "cancel" }
        ]
      );
      console.log(`
🔧 RAZORPAY SETUP REQUIRED:

1. Go to https://razorpay.com/
2. Create an account (or login)
3. Go to Dashboard → Settings → API Keys
4. Generate/Copy your Key ID
5. Replace 'rzp_test_1DP5mmOlF5G5ag' with your actual key in app/payment.jsx
6. For testing, use:
   - Card: 4111 1111 1111 1111
   - Expiry: Any future date
   - CVV: Any 3 digits

Your key should look like: rzp_test_xxxxxxxxxxxxxxxx
      `);
      return;
    }

    setIsProcessing(true);
    
    const options = {
      description: 'Food Order Payment',
      image: 'https://your-app-logo-url.com/logo.png', // Replace with your app logo
      currency: 'INR',
      key: razorpayKey, // Your actual Razorpay key
      amount: total, // amount in paise
      name: 'Forkd',
      prefill: {
        email: 'customer@example.com',
        contact: phone,
        name: 'Customer'
      },
      theme: { color: '#FF9100' }
    };

    RazorpayCheckout.open(options)
      .then(async (data) => {
        // Payment successful
        console.log('Payment successful:', data);
        
        // Save order details to AsyncStorage
        const completeOrderDetails = {
          ...orderDetails,
          paymentId: data.razorpay_payment_id,
          status: 'paid',
          paymentMethod: 'razorpay'
        };
        
        await AsyncStorage.setItem('orderDetails', JSON.stringify(completeOrderDetails));
        
        setIsProcessing(false);
        Alert.alert(
          "Payment Successful!",
          "Your order has been placed successfully.",
          [
            {
              text: "Track Order",
              onPress: () => router.replace("/checkout/order_placed")
            }
          ]
        );
      })
      .catch(async (error) => {
        // Payment failed
        console.log('Payment failed:', error);
        setIsProcessing(false);
        
        if (error.code === 'payment_cancelled') {
          Alert.alert("Payment Cancelled", "You cancelled the payment.");
        } else {
          Alert.alert("Payment Failed", error.description || "Something went wrong. Please try again.");
        }
      });
  };

  const handleCashOnDelivery = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(async () => {
      const completeOrderDetails = {
        ...orderDetails,
        status: 'confirmed',
        paymentMethod: 'cod'
      };
      
      await AsyncStorage.setItem('orderDetails', JSON.stringify(completeOrderDetails));
      
      setIsProcessing(false);
      Alert.alert(
        "Order Placed!",
        "Your order has been placed successfully. Pay when delivered.",
        [
          {
            text: "Track Order",
            onPress: () => router.replace("/checkout/order_placed")
          }
        ]
      );
    }, 1500);
  };

  const paymentMethod = orderDetails?.paymentMethod || 'razorpay';

  if (isProcessing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9100" />
        <Text style={styles.loadingText}>Processing your order...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.orderSummary}>
          <Ionicons name="receipt-outline" size={48} color="#FF9100" />
          <Text style={styles.orderTitle}>Order Summary</Text>
          <Text style={styles.amountText}>₹{amount}</Text>
          <Text style={styles.orderDetails}>
            Delivery to: {address}
          </Text>
          <Text style={styles.orderDetails}>
            Phone: {phone}
          </Text>
          {instructions && (
            <Text style={styles.orderDetails}>
              Instructions: {instructions}
            </Text>
          )}
        </View>

        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>Choose Payment Method</Text>
          
          <TouchableOpacity 
            style={styles.paymentButton}
            onPress={handleRazorpayPayment}
          >
            <View style={styles.paymentInfo}>
              <Ionicons name="card-outline" size={24} color="#fff" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.paymentTitle}>Pay Now with Razorpay</Text>
                <Text style={styles.paymentSubtitle}>UPI • Card • Net Banking • Wallet</Text>
              </View>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.codButton}
            onPress={handleCashOnDelivery}
          >
            <View style={styles.paymentInfo}>
              <Ionicons name="cash-outline" size={24} color="#FF9100" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.codTitle}>Cash on Delivery</Text>
                <Text style={styles.codSubtitle}>Pay ₹{amount} when delivered</Text>
              </View>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#FF9100" />
          </TouchableOpacity>
        </View>

        <View style={styles.securityInfo}>
          <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
          <Text style={styles.securityText}>
            Your payment is secure and encrypted
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  orderSummary: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  orderTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  amountText: {
    color: "#FF9100",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 8,
  },
  orderDetails: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  paymentMethods: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  paymentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FF9100",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  codButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FF9100",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  paymentSubtitle: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  codTitle: {
    color: "#FF9100",
    fontSize: 16,
    fontWeight: "600",
  },
  codSubtitle: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
  },
  securityText: {
    color: "#4CAF50",
    fontSize: 14,
    marginLeft: 8,
  },
});
