import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OrderDetails {
  amount: number;
  address: string;
  phone: string;
  instructions: string;
  orderTime: string;
  orderId: string;
  status: string;
  paymentId?: string;
  paymentMethod?: string;
}

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  const total = (params.total as string) || "0";
  const address = (params.address as string) || "";
  const phone = (params.phone as string) || "";
  const instructions = (params.instructions as string) || "";
  const paymentMethod = (params.paymentMethod as string) || "cod";
  const amount = parseInt(total) / 100;

  // Add immediate logging to verify the screen loads
  console.log("🎯 [TERMINAL LOG] ===== PAYMENT SCREEN LOADED =====");
  console.log("🎯 [TERMINAL LOG] Payment screen loaded with:", { total, address, phone, instructions, paymentMethod });
  console.log("🎯 [TERMINAL LOG] ===== PAYMENT SCREEN LOADED =====");

  useEffect(() => {
    const details: OrderDetails = {
      amount,
      address,
      phone,
      instructions,
      orderTime: new Date().toLocaleString(),
      orderId: "ORD" + Date.now(),
      status: "pending"
    };
    setOrderDetails(details);
  }, [amount, address, phone, instructions]);

  const handleRazorpayPayment = async () => {
    console.log("🎯 [TERMINAL LOG] Razorpay payment initiated");
    setIsProcessing(true);
    
    // TODO: Implement actual Razorpay integration here
    // For now, simulate payment processing
    setTimeout(async () => {
      if (!orderDetails) return;
      
      const completeOrderDetails: OrderDetails = {
        ...orderDetails,
        status: "confirmed",
        paymentMethod: "razorpay",
        paymentId: "rzp_" + Date.now()
      };
      
      await AsyncStorage.setItem("orderDetails", JSON.stringify(completeOrderDetails));
      
      setIsProcessing(false);
      Alert.alert(
        "Payment Successful!",
        "Your payment has been processed successfully.",
        [
          {
            text: "Track Order",
            onPress: () => {
              console.log("🎯 [TERMINAL LOG] Razorpay - Starting navigation to order_placed");
              router.push("/checkout/order_placed");
            }
          }
        ]
      );
    }, 2000);
  };

  const handleCashOnDelivery = async () => {
    console.log("🎯 [TERMINAL LOG] Cash on Delivery selected");
    setIsProcessing(true);
    
    setTimeout(async () => {
      if (!orderDetails) return;
      
      const completeOrderDetails: OrderDetails = {
        ...orderDetails,
        status: "confirmed",
        paymentMethod: "cod"
      };
      
      await AsyncStorage.setItem("orderDetails", JSON.stringify(completeOrderDetails));
      
      setIsProcessing(false);
      Alert.alert(
        "Order Placed!",
        "Your order has been placed successfully. Pay when delivered.",
        [
          {
            text: "Track Order",
            onPress: () => {
              console.log("🎯 [TERMINAL LOG] COD - Starting navigation to order_placed");
              router.push("/checkout/order_placed");
            }
          }
        ]
      );
    }, 1500);
  };

  // Automatically handle payment based on selected method
  useEffect(() => {
    if (orderDetails && paymentMethod) {
      console.log("🎯 [TERMINAL LOG] Auto-handling payment method:", paymentMethod);
      
      if (paymentMethod === "razorpay") {
        // Start Razorpay payment automatically
        setTimeout(() => {
          handleRazorpayPayment();
        }, 1000); // Small delay to show the screen briefly
      } else if (paymentMethod === "cod") {
        // Start COD process automatically
        setTimeout(() => {
          handleCashOnDelivery();
        }, 1000); // Small delay to show the screen briefly
      }
    }
  }, [orderDetails, paymentMethod]);

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
        <View style={styles.emptySpace} />
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
          {instructions ? (
            <Text style={styles.orderDetails}>
              Instructions: {instructions}
            </Text>
          ) : null}
        </View>

        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>Processing Payment</Text>
          
          {paymentMethod === "razorpay" ? (
            <View style={styles.selectedPaymentMethod}>
              <Ionicons name="card-outline" size={32} color="#FF9100" />
              <Text style={styles.selectedMethodTitle}>Online Payment</Text>
              <Text style={styles.selectedMethodSubtitle}>Processing Razorpay payment...</Text>
            </View>
          ) : (
            <View style={styles.selectedPaymentMethod}>
              <Ionicons name="cash-outline" size={32} color="#FF9100" />
              <Text style={styles.selectedMethodTitle}>Cash on Delivery</Text>
              <Text style={styles.selectedMethodSubtitle}>Confirming your order...</Text>
            </View>
          )}
        </View>

        <View style={styles.securityInfo}>
          <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
          <Text style={styles.securityText}>Your payment is secure and encrypted</Text>
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
  emptySpace: {
    width: 24,
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
  paymentTextContainer: {
    marginLeft: 12,
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
  selectedPaymentMethod: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF9100",
  },
  selectedMethodTitle: {
    color: "#FF9100",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
  selectedMethodSubtitle: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
});