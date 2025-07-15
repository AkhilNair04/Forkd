import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/constants/supabase';
import * as Location from 'expo-location';

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = (params.total as string) || "0";
  const address = (params.address as string) || "";
  const phone = (params.phone as string) || "";
  const instructions = (params.instructions as string) || "";
  const paymentMethod = (params.paymentMethod as string) || "cod";
  const amount = parseInt(total) / 100;

  const insertOrderToSupabase = async ({
    userId, items, address, lat, lng, subtotal, gst, deliveryFee, paymentMethod, phone
  }: any) => {
    const { data, error } = await supabase.from("Orders").insert({
      user_id: userId,
      rider_id: null,
      items,
      order_time: new Date().toISOString(),
      delivery_lat: lat,
      delivery_lng: lng,
      delivery_address: address,
      status: "open",
      total_amount: subtotal,
      tax_amount: gst,
      delivery_fee: deliveryFee,
      payment_status: "paid",
      payment_method: paymentMethod,
      payment_time: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      phone,
    }).select("order_id"); // fetch inserted order UUID

    if (error) {
      console.error("❌ Supabase insert error:", error.message);
      return null;
    }

    return data?.[0]?.order_id;
  };

  const handlePayment = async (method: "razorpay" | "cod") => {
    setIsProcessing(true);

    setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      const cart = await AsyncStorage.getItem("cartItems");
      const items = cart ? JSON.parse(cart) : [];

      const dishesOnly = items.filter((item: any) => item.id?.startsWith("D"));

      const { coords } = await Location.getCurrentPositionAsync({});
      const lat = coords.latitude;
      const lng = coords.longitude;

      const subtotal = amount;
      const gst = Math.round(subtotal * 0.05);
      const deliveryFee = 30;

      const orderId = await insertOrderToSupabase({
        userId,
        items: dishesOnly,
        address,
        lat,
        lng,
        subtotal,
        gst,
        deliveryFee,
        paymentMethod: method,
        phone
      });

      if (!orderId) {
        Alert.alert("Error", "Order failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      await AsyncStorage.setItem("orderId", orderId); // store UUID
      await AsyncStorage.setItem("orderDetails", JSON.stringify({
        amount: subtotal,
        address,
        phone,
        instructions,
        paymentMethod: method,
        orderId
      }));

      setIsProcessing(false);
      Alert.alert(
        method === "razorpay" ? "Payment Successful!" : "Order Placed!",
        method === "razorpay"
          ? "Your payment has been processed successfully."
          : "Your order has been placed successfully. Pay when delivered.",
        [{ text: "Track Order", onPress: () => router.push("/checkout/order_placed") }]
      );
    }, method === "razorpay" ? 2000 : 1500);
  };

  useEffect(() => {
    setTimeout(() => {
      if (paymentMethod === "razorpay") handlePayment("razorpay");
      else handlePayment("cod");
    }, 1000);
  }, [paymentMethod]);

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
          <Text style={styles.orderDetails}>Delivery to: {address}</Text>
          <Text style={styles.orderDetails}>Phone: {phone}</Text>
          {instructions ? (
            <Text style={styles.orderDetails}>Instructions: {instructions}</Text>
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
