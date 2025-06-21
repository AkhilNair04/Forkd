import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const ROUTES = {
  WELCOME: '/welcome-screen',
  HOME: '/(tabs)',
  LANG_SELECT: '/select-lang',
  SELECT_USER: '/select-user',
};

export default function Index() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkAppLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

        if (!hasLaunched) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          setInitialRoute(ROUTES.WELCOME); // first time user
        } else {
          setInitialRoute(isLoggedIn === 'true' ? ROUTES.HOME : ROUTES.WELCOME);
        }
      } catch (error) {
        console.error('Error checking app launch state:', error);
        setInitialRoute(ROUTES.WELCOME);
      }
    };

    checkAppLaunch();
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#C67C4E" />
      </View>
    );
  }

  return <Redirect href={initialRoute as Parameters<typeof Redirect>[0]['href']} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
