import * as React from 'react';
import { useState, useEffect } from 'react';
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
  const [address, setAddress] = useState('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable location permissions to use this feature.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setSelectedLocation(newLocation);
      await getAddressFromCoordinates(newLocation);
      setLoading(false);
    } catch (error) {
      console.error('Error getting current location:', error);
      setLoading(false);
      Alert.alert('Error', 'Unable to get your current location. Please try again.');
    }
  };

  const getAddressFromCoordinates = async (coords: { latitude: number; longitude: number }) => {
    try {
      const addresses = await Location.reverseGeocodeAsync(coords);
      if (addresses.length > 0) {
        const addr = addresses[0];
        const formattedAddress = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}, ${addr.region || ''} ${addr.postalCode || ''}`.trim();
        setAddress(formattedAddress || 'Unknown Address');
      }
    } catch (error) {
      console.error('Error getting address:', error);
      setAddress('Unable to get address');
    }
  };

  const handleMapPress = async (event: any) => {
    const coordinate = event.nativeEvent.coordinate;
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
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          ...selectedLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
        customMapStyle={mapStyle}
      >
        <Marker
          coordinate={selectedLocation}
          draggable
          onDragEnd={(event) => {
            const coordinate = event.nativeEvent.coordinate;
            setSelectedLocation(coordinate);
            getAddressFromCoordinates(coordinate);
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
          style={styles.currentLocationButton} 
          onPress={getCurrentLocation}
        >
          <Ionicons name="locate" size={20} color="#fff" />
          <Text style={styles.currentLocationText}>Current Location</Text>
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
