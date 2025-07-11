import * as React from 'react';
import LocationPicker from '@/components/LocationPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocation } from '@/context/LocationContext';

export default function MapPickerScreen() {
  const { updateLocation } = useLocation();

  const handleLocationSelect = async (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    try {
      // Save the selected location to AsyncStorage
      await AsyncStorage.setItem('selectedLocation', JSON.stringify(location));
      
      // Update the location hook state immediately
      updateLocation(location);
      
      console.log('Location saved and updated:', location);
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  return (
    <LocationPicker 
      onLocationSelect={handleLocationSelect}
      title="Select Delivery Location"
    />
  );
}
