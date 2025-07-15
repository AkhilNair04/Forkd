import React from "react";
import { View, ActivityIndicator, Text, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/constants/supabase";
import * as Location from "expo-location";

export default function Payment() {
  const {
    total,
    address,
    paymentMethod,
    cart,
    gst,
    deliveryFee,
    platformFee,
    subtotal,
  } = useLocalSearchParams();

  const router = useRouter();
  const paymentUrl = `https://your-backend.com/razorpay?amount=${total}`;

  const insertOrder = async () => {
    try {
      // Get session user
      const session = await supabase.auth.getSession();
      console.log("✅ SESSION:", session.data?.session);

      if (!session.data?.session?.user?.id) {
        Alert.alert("User not logged in");
        return;
      }

      const userId = session.data.session.user.id;


      // Get location
      let lat = null;
      let lng = null;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          lat = loc.coords.latitude;
          lng = loc.coords.longitude;
        }
      } catch {
        console.warn("Location fetch failed");
      }

      // Parse cart and filter dishes only
      const parsedCart = JSON.parse(Array.isArray(cart) ? cart[0] : cart || "[]");
      const dishesOnly = parsedCart.filter((item: any) =>
        item.id?.startsWith("D")
      );

      // Insert into Supabase Orders table
      const { error } = await supabase.from("Orders").insert({
        user_id: userId,
        items: dishesOnly,
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
      });

      if (error) {
        console.error("Insert failed:", error);
        Alert.alert("Order Failed", "Something went wrong while placing your order.");
        return;
      }
    } catch (e) {
      console.error("InsertOrder Error", e);
      Alert.alert("Error", "Unexpected error while placing order.");
    }
  };

  const onNavChange = async (navState: any) => {
  console.log("NAV URL:", navState.url); // ✅ Log it

  if (navState.url.includes("payment-success")) {
    console.log("🟢 Insert Order Started");
    await insertOrder();
    Alert.alert("Payment Successful", "Your order has been placed!");
    router.replace("/checkout/order_placed");
  } else if (navState.url.includes("payment-failed")) {
    Alert.alert("Payment Failed", "Please try again.");
    router.back();
  }
};


  if (!total) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000",
            }}
          >
            <ActivityIndicator color="#f59e0b" size="large" />
            <Text style={{ color: "#fff", marginTop: 12 }}>
              Loading payment gateway…
            </Text>
          </View>
        )}
      />
    </View>
  );
}
