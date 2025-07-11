import 'dotenv/config'

export default {
  expo: {
    name: "Forkd",
    slug: "forkd",
    version: "1.0.0",
    platforms: ["ios", "android", "web"],
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    },
    env: {
      EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    },
    ios: {
      bundleIdentifier: "com.forkd.app",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      package: "com.forkd.app",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    plugins: [
      "expo-location",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow Forkd to use your location to find nearby chefs and deliver food to you.",
          locationAlwaysPermission: "Allow Forkd to use your location to find nearby chefs and deliver food to you.",
          locationWhenInUsePermission: "Allow Forkd to use your location to find nearby chefs and deliver food to you.",
        },
      ],
    ],
  },
}

