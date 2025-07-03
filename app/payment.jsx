// app/payment.tsx (or .jsx if you're using JS)
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function PaymentScreen() {
  const { total } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
        Pay ₹{parseInt(total ?? "0") / 100}
      </Text>
    </View>
  );
}
