// app/(tabs)/cart.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { useCart } from "../../context/CartContext";
import { router } from "expo-router";

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart } = useCart(); // ✅ correct hook usage

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // ✅ uses quantity

  const Stepper = ({ id, qty }: any) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity onPress={() => updateQuantity(id, Math.max(1, qty - 1))}>
        <Text style={{ color: "#fff", fontSize: 18 }}>－</Text>
      </TouchableOpacity>
      <Text style={{ color: "#fff", marginHorizontal: 8 }}>{qty}</Text>
      <TouchableOpacity onPress={() => updateQuantity(id, qty + 1)}>
        <Text style={{ color: "#fff", fontSize: 18 }}>＋</Text>
      </TouchableOpacity>
    </View>
  );

  const render = ({ item }: any) => (
    <View style={{ flexDirection: "row", padding: 12 }}>
      <Image source={{ uri: item.image }} style={{ width: 60, height: 60, borderRadius: 12 }} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={{ color: "#fff" }}>{item.name}</Text>
        <Text style={{ color: "#999", fontSize: 12 }}>{item.meal_type}</Text>
        <Stepper id={item.id} qty={item.quantity} />
      </View>
      <Text style={{ color: "#fff", fontWeight: "bold" }}>₹ {item.price * item.quantity}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold", margin: 16 }}>
        Cart
      </Text>

      <FlatList
        data={cart}
        keyExtractor={(i) => i.id}
        renderItem={render}
      />

      <TouchableOpacity
        onPress={() => router.push("/checkout")}
        style={{
          backgroundColor: "#f59e0b",
          margin: 16,
          padding: 16,
          borderRadius: 14,
          alignItems: "center",
        }}
        disabled={cart.length === 0}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Check-out ₹{total}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
