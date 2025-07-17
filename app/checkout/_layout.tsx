// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function CheckoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        animation: 'fade',
      }}
    />
  );
}
