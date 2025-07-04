// app/(chefTabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function ChefTabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 10,
          backgroundColor: '#2c2c2c',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: 65,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          marginTop: 10,
        },
        tabBarActiveTintColor: '#C67C4E',
        tabBarInactiveTintColor: '#fff',
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
        }}
      />

      {/* Dishes / Chef */}
      <Tabs.Screen
        name="dishes"
        options={{
          title: 'Dishes',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chef-hat" size={28} color={color} />
          ),
        }}
      />

      {/* Schedule / Calendar */}
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={28} color={color} />,
        }}
      />

      {/* Reels */}
      <Tabs.Screen
        name="reels"
        options={{
          title: 'Reels',
          tabBarIcon: ({ color }) => <Feather name="video" size={28} color={color} />,
        }}
      />

      {/* Profile */}
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
