import React from "react";
import { View, ActivityIndicator, Text, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Payment() {
  const { total } = useLocalSearchParams();
  const router = useRouter();

  // Change this to your backend payment URL
  const paymentUrl = `https://your-backend.com/razorpay?amount=${total}`;

  const onNavChange = (navState: any) => {
    if (navState.url.includes("payment-success")) {
      Alert.alert("Payment Successful", "Your order has been placed!");
      router.replace("/checkout/orderplaced");
    } else if (navState.url.includes("payment-failed")) {
      Alert.alert("Payment Failed", "Please try again.");
      router.back();
    }
  };

  if (!total) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff" }}>Invalid payment amount.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={onNavChange}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
            <ActivityIndicator color="#f59e0b" size="large" />
            <Text style={{ color: "#fff", marginTop: 12 }}>Loading payment gateway…</Text>
          </View>
        )}
      />
    </View>
  );
}
