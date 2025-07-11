import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationContextType {
  location: LocationData | null;
  loading: boolean;
  updateLocation: (newLocation: LocationData) => Promise<void>;
  getCurrentLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedLocation();
  }, []);

  const loadSavedLocation = async () => {
    try {
      const savedLocation = await AsyncStorage.getItem('selectedLocation');
      if (savedLocation) {
        const parsedLocation = JSON.parse(savedLocation);
        setLocation(parsedLocation);
        console.log('Loaded saved location:', parsedLocation);
      } else {
        // If no saved location, try to get current location
        await getCurrentLocation();
      }
    } catch (error) {
      console.error('Error loading saved location:', error);
      await getCurrentLocation();
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // Set a default location if permission denied
        const defaultLocation = {
          latitude: 37.78825,
          longitude: -122.4324,
          address: '1234 Culinary Street, Flavor...',
        };
        setLocation(defaultLocation);
        return;
      }

      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      };

      // Get address from coordinates
      const addresses = await Location.reverseGeocodeAsync(coords);
      let formattedAddress = '1234 Culinary Street, Flavor...';
      
      if (addresses.length > 0) {
        const addr = addresses[0];
        formattedAddress = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}, ${addr.region || ''}`.trim();
        
        // Truncate if too long
        if (formattedAddress.length > 30) {
          formattedAddress = formattedAddress.substring(0, 27) + '...';
        }
      }

      const newLocation = {
        ...coords,
        address: formattedAddress,
      };

      setLocation(newLocation);
      // Save to AsyncStorage
      await AsyncStorage.setItem('selectedLocation', JSON.stringify(newLocation));
      console.log('Got current location:', newLocation);
    } catch (error) {
      console.error('Error getting current location:', error);
      // Set default location on error
      const defaultLocation = {
        latitude: 37.78825,
        longitude: -122.4324,
        address: '1234 Culinary Street, Flavor...',
      };
      setLocation(defaultLocation);
    }
  };

  const updateLocation = async (newLocation: LocationData) => {
    console.log('Updating location to:', newLocation);
    setLocation(newLocation);
    try {
      await AsyncStorage.setItem('selectedLocation', JSON.stringify(newLocation));
      console.log('Location updated and saved successfully');
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const value: LocationContextType = {
    location,
    loading,
    updateLocation,
    getCurrentLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
