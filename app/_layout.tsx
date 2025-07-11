// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { CartProvider } from "../context/CartContext";
import { LocationProvider } from "../context/LocationContext";

// ✅ React Query imports
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%', height: '100%' }}>
      {/* ✅ React Query wraps everything */}
      <QueryClientProvider client={queryClient}>
        <LocationProvider>
          <CartProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="welcome-screen" options={{ headerShown: false }} />
                <Stack.Screen name="select-lang" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="favorites" options={{ headerShown: false }} />
                <Stack.Screen name="settings-demo" options={{ headerShown: false }} />
                <Stack.Screen name="notification-demo" options={{ headerShown: false }} />
                <Stack.Screen name="chat" options={{ headerShown: false }} />
                <Stack.Screen name="map-picker" options={{ headerShown: false }} />
                <Stack.Screen name="order-history" options={{ headerShown: false }} />
                <Stack.Screen name="privacy-security" options={{ headerShown: false }} />
                <Stack.Screen name="customer-settings" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </CartProvider>
        </LocationProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
