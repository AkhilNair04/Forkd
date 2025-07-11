import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

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

// Declare global for TypeScript
declare global {
  interface Window {
    google: any;
  }
}

export default function LocationPicker({ 
  onLocationSelect, 
  initialLocation,
  title = "Select Delivery Location" 
}: LocationPickerProps) {
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || {
      latitude: 37.7749,
      longitude: -122.4194,
    }
  );

  useEffect(() => {
    loadGoogleMaps();
  }, []);

  const loadGoogleMaps = () => {
    if (typeof window !== 'undefined') {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCm-Pxxfw-X0ZhanCnj2rkw63Bq8rSTBzQ&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        script.onerror = () => {
          console.error('Failed to load Google Maps');
          setLoading(false);
          Alert.alert('Error', 'Failed to load Google Maps. Please check your internet connection.');
        };
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    }
  };

  const initializeMap = () => {
    try {
      const mapContainer = document.getElementById('google-map');
      if (!mapContainer) {
        console.error('Map container not found');
        setLoading(false);
        return;
      }

      const map = new window.google.maps.Map(mapContainer, {
        zoom: 15,
        center: { lat: selectedLocation.latitude, lng: selectedLocation.longitude },
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            "featureType": "all",
            "stylers": [{ "color": "#1a1a1a" }]
          },
          {
            "featureType": "road",
            "stylers": [{ "color": "#2a2a2a" }]
          },
          {
            "featureType": "water",
            "stylers": [{ "color": "#0f0f0f" }]
          }
        ]
      });

      const marker = new window.google.maps.Marker({
        position: { lat: selectedLocation.latitude, lng: selectedLocation.longitude },
        map: map,
        draggable: true,
        title: 'Delivery Location'
      });

      // Handle map clicks
      map.addListener('click', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        marker.setPosition({ lat, lng });
        updateLocation(lat, lng);
      });

      // Handle marker drag
      marker.addListener('dragend', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        updateLocation(lat, lng);
      });

      // Get initial address
      updateLocation(selectedLocation.latitude, selectedLocation.longitude);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to initialize map');
    }
  };

  const updateLocation = (lat: number, lng: number) => {
    setSelectedLocation({ latitude: lat, longitude: lng });
    
    // Reverse geocode to get address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
      let formattedAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      
      if (status === 'OK' && results[0]) {
        formattedAddress = results[0].formatted_address;
      }
      
      setAddress(formattedAddress);
    });
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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Update map center and marker
          const map = document.getElementById('google-map');
          if (map && window.google) {
            const mapInstance = new window.google.maps.Map(map, {
              zoom: 15,
              center: { lat, lng }
            });
            
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstance,
              draggable: true
            });
          }
          
          updateLocation(lat, lng);
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
          Alert.alert('Error', 'Unable to get your current location');
        }
      );
    } else {
      Alert.alert('Error', 'Geolocation is not supported by this browser');
    }
  };

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

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#C67C4E" />
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        )}
        <div 
          id="google-map" 
          style={{ 
            width: '100%', 
            height: '100%',
            borderRadius: 12,
            overflow: 'hidden'
          }} 
        />
      </View>

      {/* Address Display */}
      {address ? (
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>Selected Address:</Text>
          <Text style={styles.addressText}>{address}</Text>
        </View>
      ) : null}

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
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  addressContainer: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    margin: 16,
    marginTop: 0,
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
