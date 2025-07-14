import { Stack } from "expo-router";

export default function CheckoutLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="cart" options={{ headerShown: false }} />
      <Stack.Screen name="order_placed" options={{ headerShown: false }} />
      <Stack.Screen name="payment_received" options={{ headerShown: false }} />
      <Stack.Screen name="success" options={{ headerShown: false }} />
      <Stack.Screen name="feedback" options={{ headerShown: false }} />
    </Stack>
  );
}
