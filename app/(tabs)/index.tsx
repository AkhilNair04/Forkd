import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

const ROUTES = {
  WELCOME: '/welcome-screen',
  HOME: '/(tabs)',
  LANG_SELECT: '/select-lang',
  SELECT_USER: '/select-user',
};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Fork&apos;d!</Text>
      <Text style={styles.subtext}>homeeee</Text>
    </View>
  );
}

  return <Redirect href={initialRoute as Parameters<typeof Redirect>[0]['href']} />;
}
