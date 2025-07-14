import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function OrderPlaced() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>Order Placed!</Text>
      <Text style={{ color: "#fff", marginTop: 16 }}>Thank you for your payment.</Text>
      <TouchableOpacity
        onPress={() => router.replace("/")}
        style={{ marginTop: 32, backgroundColor: "#f59e0b", padding: 14, borderRadius: 10 }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
