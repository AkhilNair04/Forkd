# fork'd: Home Chef & Meal Booking App

fork'd is a modern mobile app built with [Expo](https://expo.dev) and React Native, designed to connect customers with home chefs for personalized meal experiences. The app features onboarding, profile management, dietary preferences, support, and more, all with a beautiful dark-themed UI.

## ✨ Features

- **User Onboarding:** Email/phone login, role selection (Customer/Chef), and language selection.
- **Profile Management:** Edit personal info, profile photo, and bio.
- **Dietary Preferences:** Select dietary restrictions, allergies, and add custom notes.
- **Support Center:** Access helpdesk, ticket support, and FAQs.
- **Bottom Tab Navigation:** Quick access to home, chefs, dishes, calendar, and settings.
- **Dark Theme:** Consistent, modern dark UI throughout the app.
- **File-based Routing:** Powered by Expo Router for scalable navigation.

## 📁 Project Structure

```
fork'd/
  app/                  # Main app screens and navigation
    (auth)/             # Authentication and onboarding screens
    (tabs)/             # Main tab screens (home, profile, etc)
    customer-settings/  # Profile, preferences, support, settings
    App.js              # App entry point
    _layout.tsx         # Expo Router layout
  components/           # Reusable UI components
  constants/            # Static data (colors, chef/dish data)
  assets/               # Images and fonts
  hooks/                # Custom React hooks
  scripts/              # Utility scripts
  package.json          # Project dependencies
  README.md             # Project documentation
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the app:**
   ```bash
   npx expo start
   ```
   - Open in Expo Go, iOS Simulator, or Android Emulator.

## 🛠️ Development

- Edit screens in the `app/` directory. Routing is file-based via Expo Router.
- UI components are in `components/` and use consistent dark theme styles.
- Update static data in `constants/` as needed.

## 🧩 Tech Stack

- **React Native** (with Expo)
- **Expo Router** (file-based navigation)
- **TypeScript**
- **Dark Theme** (custom styles)
- **Vector Icons** (Feather, FontAwesome, etc)

## 📄 Main Screens

- **Onboarding & Auth:** `/app/(auth)/`
- **Tabs (Home, Chefs, Dishes, Profile, etc):** `/app/(tabs)/`
- **Profile Edit:** `/app/customer-settings/customer-profile.tsx`
- **Preferences:** `/app/customer-settings/eating-preferences.tsx`
- **Support:** `/app/customer-settings/support.tsx`
- **Settings:** `/app/customer-settings/settings.tsx`

Built by the fork'd team at UpSmart Solutions.

[Nitheesh, Nandana, Akhil, Shaun, Abhijith and Diya.]
