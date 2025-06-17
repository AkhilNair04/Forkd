import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

const ROUTES = {
  WELCOME: '/welcome-screen',
  HOME: '/(tabs)',
  LANG_SELECT: '/select-lang',
};

export default function Index() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkAppLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

      if (!hasLaunched) {
        await AsyncStorage.setItem('hasLaunched', 'true');
        setInitialRoute(ROUTES.WELCOME);
      } else {
        setInitialRoute(isLoggedIn === 'true' ? ROUTES.HOME : ROUTES.WELCOME);
      }
    };

    checkAppLaunch();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ✅ Use type assertion to silence the TS error
  return <Redirect href={initialRoute as Parameters<typeof Redirect>[0]['href']} />;
}
