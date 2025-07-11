// app/(tabs-chef)/_layout.tsx
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useColorScheme } from "react-native";

export default function ChefTabsLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 10,
          backgroundColor: "#2c2c2c",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: 65,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          marginTop: 10,
        },
        tabBarActiveTintColor: "#C67C4E",
        tabBarInactiveTintColor: "#fff",
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("./home");
          },
        }}
      />

      {/* Dishes / Chef */}
      <Tabs.Screen
        name="dishes"
        options={{
          title: "Dishes",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chef-hat" size={28} color={color} />
          ),
        }}
      />

      {/* Schedule / Calendar */}
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={28} color={color} />
          ),
        }}
      />

      {/* Reels */}
      <Tabs.Screen
        name="reels"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("../chef-settings/chef-reels");
          },
        }}
        options={{
          title: "Reels",
          tabBarIcon: ({ color }) => (
            <Feather name="video" size={28} color={color} />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
