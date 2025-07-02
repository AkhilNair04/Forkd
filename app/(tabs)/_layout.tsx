import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/useColorScheme';

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
          width: '100%',
          left: 20,
          right: 20,
          elevation: 10,
          backgroundColor: '#2c2c2c', // dark background
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: 65,
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
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chef"
        options={{
          title: 'Chef',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chef-hat" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dish"
        options={{
          title: 'Dish',
          tabBarIcon: ({ color }) => <Ionicons name="restaurant" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reel"
        options={{
          title: 'Reel',
          tabBarIcon: ({ color }) => <Feather name="video" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
