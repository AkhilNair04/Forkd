import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface LocationPickerProps {
  onLocationSelect?: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  title?: string;
}

export default function LocationPicker({ 
  onLocationSelect, 
  initialLocation,
  title = "Select Delivery Location" 
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || {
      latitude: 37.78825,
      longitude: -122.4324,
    }
  );
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('Pick your location');
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: initialLocation?.latitude || 37.78825,
    longitude: initialLocation?.longitude || -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    getCurrentLocation(true);
  }, []);

  // Ensure marker coordinates stay in sync with selected location
  useEffect(() => {
    console.log('Selected location changed to:', selectedLocation);
  }, [selectedLocation]);

  // Debug API key
  useEffect(() => {
    console.log('Google Maps API Key available:', !!process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);
  }, []);

  const getCurrentLocation = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setGettingCurrentLocation(true);
      }
      
      console.log('Getting current location...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable location permissions to use this feature.',
          [{ text: 'OK' }]
        );
        if (isInitialLoad) {
          setLoading(false);
        } else {
          setGettingCurrentLocation(false);
        }
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      console.log('Current location obtained:', newLocation);
      
      // Update location first
      setSelectedLocation(newLocation);
      
      // Update map region
      setMapRegion({
        ...newLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
      // Get address for the new location
      await getAddressFromCoordinates(newLocation);
      
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setGettingCurrentLocation(false);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setGettingCurrentLocation(false);
      }
      Alert.alert('Error', 'Unable to get your current location. Please try again.');
    }
  };

  const getAddressFromCoordinates = async (coords: { latitude: number; longitude: number }) => {
    try {
      console.log('Getting address for coordinates:', coords);
      
      // Add a small delay to avoid rapid calls
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const addresses = await Location.reverseGeocodeAsync(coords);
      console.log('Reverse geocode result:', addresses);
      
      if (addresses.length > 0) {
        const addr = addresses[0];
        const formattedAddress = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}, ${addr.region || ''} ${addr.postalCode || ''}`.trim();
        console.log('Setting address to:', formattedAddress);
        setAddress(formattedAddress || 'Unknown Address');
      } else {
        console.log('No addresses found');
        setAddress('No address found');
      }
    } catch (error) {
      console.error('Error getting address:', error);
      setAddress('Unable to get address');
    }
  };

  const handleMapPress = async (event: any) => {
    console.log('🗺️ MAP PRESS EVENT FIRED!');
    console.log('Map pressed, getting coordinates...');
    const coordinate = event.nativeEvent.coordinate;
    console.log('New coordinates from map press:', coordinate);
    setSelectedLocation(coordinate);
    await getAddressFromCoordinates(coordinate);
  };

  const handleConfirmLocation = () => {
    if (onLocationSelect) {
      onLocationSelect({
        ...selectedLocation,
        address,
      });
    }
    router.back();
  };

  const mapStyle = [
    {
      "featureType": "all",
      "stylers": [
        { "color": "#1a1a1a" }
      ]
    },
    {
      "featureType": "road",
      "stylers": [
        { "color": "#2a2a2a" }
      ]
    },
    {
      "featureType": "water",
      "stylers": [
        { "color": "#0f0f0f" }
      ]
    }
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#C67C4E" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={mapRegion}
        onPress={handleMapPress}
        onRegionChangeComplete={(region) => {
          console.log('Map region changed to:', region);
          setMapRegion(region);
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsBuildings={true}
        showsIndoors={true}
        mapType="standard"
        loadingEnabled={true}
        loadingIndicatorColor="#C67C4E"
        loadingBackgroundColor="#ffffff"
        onMapReady={() => {
          console.log('Map is ready!');
        }}
      >
        <Marker
          coordinate={selectedLocation}
          draggable
          onDragEnd={async (event) => {
            console.log('🎯 MARKER DRAG EVENT FIRED!');
            console.log('Marker dragged, getting new coordinates...');
            const coordinate = event.nativeEvent.coordinate;
            console.log('New coordinates from marker drag:', coordinate);
            setSelectedLocation(coordinate);
            await getAddressFromCoordinates(coordinate);
          }}
        >
          <View style={styles.markerContainer}>
            <Ionicons name="location" size={40} color="#C67C4E" />
          </View>
        </Marker>
      </MapView>

      {/* Address Display */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>Selected Address:</Text>
        <Text style={styles.addressText}>{address}</Text>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.currentLocationButton,
            gettingCurrentLocation && styles.currentLocationButtonDisabled
          ]} 
          onPress={() => getCurrentLocation(false)}
          disabled={gettingCurrentLocation}
        >
          {gettingCurrentLocation ? (
            <ActivityIndicator size={20} color="#fff" />
          ) : (
            <Ionicons name="locate" size={20} color="#fff" />
          )}
          <Text style={styles.currentLocationText}>
            {gettingCurrentLocation ? 'Getting Location...' : 'Current Location'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={handleConfirmLocation}
        >
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#000',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContainer: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  addressTitle: {
    color: '#C67C4E',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#000',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  currentLocationButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.7,
  },
  currentLocationText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#C67C4E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
