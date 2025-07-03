import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const ROUTES = {
  WELCOME: "(auth)/welcome-screen",
  HOME: "/(tabs)",
  LANG_SELECT: "(auth)/select-lang",
  NEW_OR_RETURNING: "(auth)/newreturning",
  LOGIN: "(auth)/login",
};

export default function Index() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkAppLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      console.log(process.env.SUPABASE_URL);
      if (!hasLaunched) {
        await AsyncStorage.setItem("hasLaunched", "true");
        setInitialRoute(ROUTES.WELCOME);
      } else {
        setInitialRoute(isLoggedIn === "true" ? ROUTES.HOME : ROUTES.WELCOME);
      }
    };

    checkAppLaunch();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ✅ Use type assertion to silence the TS error
  return (
    <Redirect href={initialRoute as Parameters<typeof Redirect>[0]["href"]} />
  );
}
