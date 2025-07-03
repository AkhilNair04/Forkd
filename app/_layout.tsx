import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ChatService } from '@/services/ChatService';
import { NotificationService } from '@/services/NotificationService';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Initialize services when app starts
    const initializeServices = async () => {
      try {
        // Initialize notification service
        await NotificationService.initialize();
        
        // Setup notification listeners
        const cleanup = NotificationService.setupNotificationListeners();
        
        // Initialize chat service
        await ChatService.initialize();
        
        return cleanup;
      } catch (error) {
        console.error('Error initializing services:', error);
      }
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      ChatService.cleanup();
    };
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="(auth)" options={{headerShown:false}}/>
        <Stack.Screen name="welcome-screen" options={{headerShown:false}}/>
        <Stack.Screen name="select-lang" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="favorites" options={{ headerShown: false }} />
        <Stack.Screen name="settings-demo" options={{ headerShown: false }} />
        <Stack.Screen name="notification-demo" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
