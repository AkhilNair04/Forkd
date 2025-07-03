// app/checkout/index.tsx
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { useRouter } from "expo-router"; // ✅ Correct import

export default function Checkout() {
  const router = useRouter(); // ✅ Correct usage
  const { cart } = useCart();
  const [address, setAddress] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

 const handleCheckout = () => {
  const amountInPaise = (total * 100).toString();

  // fallback syntax that always works
  router.push({ pathname: "/payment", params: { total: amountInPaise } });
};


  return (
    <View style={{ flex: 1, backgroundColor: "#000", padding: 16 }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>Checkout</Text>

      <View style={{ backgroundColor: "#111", borderRadius: 12, padding: 12, marginTop: 16 }}>
        {cart.map((item) => (
          <Text key={item.id} style={{ color: "#fff" }}>
            {item.name} × {item.quantity}
          </Text>
        ))}
      </View>

      <Text style={{ color: "#fff", marginTop: 24 }}>Delivery Address</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Home address..."
        placeholderTextColor="#666"
        style={{
          backgroundColor: "#1b1b1b",
          padding: 12,
          borderRadius: 10,
          color: "#fff",
          marginTop: 8,
        }}
      />

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        onPress={handleCheckout}
        style={{
          backgroundColor: "#f59e0b",
          padding: 16,
          borderRadius: 14,
          alignItems: "center",
        }}
        disabled={!address.trim()}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
}
