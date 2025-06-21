import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        //tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          elevation: 10,
          backgroundColor: '#2c2c2c', // dark background
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: 70,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          marginTop: 10,
        },
        tabBarActiveTintColor: '#C67C4E',
        tabBarInactiveTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chef"
        options={{
          title: 'chef',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chef.hat" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dish"
        options={{
          title: 'dish',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="dish.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reel"
        options={{
          title: 'reel',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="reel.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
