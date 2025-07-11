# 🗺️ Maps Integration Guide for Forkd

## Overview
This guide explains how to set up and use the maps functionality in your Forkd app. The integration allows users to select delivery locations by clicking on the "DELIVER TO" section in the header.

## 🔧 Setup Instructions

### 1. Get Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps SDK for Android**
   - **Maps SDK for iOS** 
   - **Maps JavaScript API**
   - **Geocoding API** (for address conversion)
4. Go to "Credentials" and create an API key
5. Restrict your API key to only the APIs you need

### 2. Configure Environment Variables

1. Copy your `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Google Maps API key to the `.env` file:
   ```bash
   GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
   ```

### 3. Install Dependencies (Already Done)
The following packages have been installed:
- `react-native-maps` - For map functionality
- `expo-location` - For location services
- `@react-native-async-storage/async-storage` - For storing selected locations

## 📱 How It Works

### User Flow
1. User taps on "DELIVER TO" in the header
2. Map picker screen opens with current location
3. User can:
   - Drag the marker to select a new location
   - Tap anywhere on the map to set location
   - Use "Current Location" button to get GPS location
4. Address is automatically resolved from coordinates
5. User confirms location
6. Location is saved and reflected in the header

### Key Components

#### `LocationPicker.tsx`
- Main map component with marker
- Handles location permissions
- Converts coordinates to addresses
- Supports both touch and drag interactions

#### `useLocation.ts` Hook
- Manages location state across the app
- Handles saving/loading from AsyncStorage
- Provides current location functionality
- Updates address formatting

#### Updated Components
- **HeaderSection**: Now clickable, opens map picker
- **Main tab screens**: Use location hook for dynamic addresses

## 🌐 Platform Support

### Mobile (iOS & Android)
- Uses native maps (Google Maps on Android, Apple Maps on iOS)
- Full GPS and location services
- Gesture support for map interaction

### Web
- Uses Google Maps JavaScript API
- Full functionality maintained
- Responsive design

## 🔒 Permissions

The app requests location permissions with clear messaging:
- **iOS**: "Allow Forkd to use your location to find nearby chefs and deliver food to you."
- **Android**: Same message for consistency

## 📝 File Structure

```
components/
├── LocationPicker.tsx          # Main map picker component
├── HeaderSection.tsx           # Updated header with clickable location

hooks/
├── useLocation.ts              # Location state management hook

app/
├── map-picker.tsx              # Map picker screen route
├── deliveryaddress.tsx         # Updated to use new map functionality
└── (tabs)/
    ├── index.tsx              # Home - uses location hook
    ├── chef.tsx               # Chef page - uses location hook
    └── dish.tsx               # Dish page - uses location hook
```

## 🎨 Features

### Map Customization
- Dark theme map style to match app design
- Custom marker with app colors
- Smooth animations and interactions

### Address Handling
- Automatic geocoding (coordinates → address)
- Smart address truncation for UI
- Fallback addresses for error cases

### State Management
- Persistent location storage
- Real-time updates across screens
- Efficient re-rendering

## 🚀 Usage Examples

### Basic Usage
```tsx
import { useLocation } from '@/hooks/useLocation';

function MyComponent() {
  const { location, loading } = useLocation();
  
  return (
    <Text>{location?.address || 'Loading...'}</Text>
  );
}
```

### Custom Location Picker
```tsx
import LocationPicker from '@/components/LocationPicker';

function CustomScreen() {
  const handleLocationSelect = (location) => {
    console.log('Selected:', location);
  };
  
  return (
    <LocationPicker 
      onLocationSelect={handleLocationSelect}
      title="Choose Delivery Location"
    />
  );
}
```

## 📋 Testing

### Test the Integration
1. Start your development server:
   ```bash
   npm start
   ```

2. Test on different platforms:
   - **iOS Simulator**: `npm run ios`
   - **Android Emulator**: `npm run android`  
   - **Web Browser**: `npm run web`

3. Test functionality:
   - Tap "DELIVER TO" in header
   - Try selecting different locations
   - Test permission flows
   - Verify address updates

### Troubleshooting

#### Common Issues
1. **"Maps not loading"**: Check API key and enabled APIs
2. **"Permission denied"**: Ensure location permissions are granted
3. **"Address not found"**: Check internet connection and Geocoding API

#### Debug Mode
Add console logs to see location updates:
```tsx
const { location } = useLocation();
console.log('Current location:', location);
```

## 🔄 Future Enhancements

Potential improvements you could add:
- Search functionality on map
- Multiple saved addresses
- Address validation
- Route planning for deliveries
- Integration with chef locations

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify API key permissions
3. Test on different devices/platforms
4. Check network connectivity

The maps integration is now fully functional and ready to use! 🎉
