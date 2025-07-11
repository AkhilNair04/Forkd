import React, { useEffect, useRef } from "react";
import { View } from "react-native";

// Declare global for TypeScript
declare global {
  interface Window {
    google: any;
  }
}

interface MapViewProps {
  style?: any;
  region?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onPress?: (event: any) => void;
  children?: React.ReactNode;
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  customMapStyle?: any[];
  provider?: any;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

interface MarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  draggable?: boolean;
  onDragEnd?: (event: any) => void;
  children?: React.ReactNode;
  title?: string;
}

export const Marker: React.FC<MarkerProps> = ({
  coordinate,
  draggable = false,
  onDragEnd,
  children,
  title,
}) => {
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (window.google && coordinate) {
      const map = window.google.maps.Map.getMap(
        document.getElementById("google-map")
      );
      if (map) {
        markerRef.current = new window.google.maps.Marker({
          position: { lat: coordinate.latitude, lng: coordinate.longitude },
          map: map,
          draggable: draggable,
          title: title,
        });

        if (onDragEnd) {
          markerRef.current.addListener("dragend", (event: any) => {
            onDragEnd({
              nativeEvent: {
                coordinate: {
                  latitude: event.latLng.lat(),
                  longitude: event.latLng.lng(),
                },
              },
            });
          });
        }
      }
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [coordinate, draggable, onDragEnd, title]);

  return null;
};

const MapView: React.FC<MapViewProps> = ({
  style,
  region,
  onPress,
  children,
  customMapStyle = [],
  initialRegion,
}) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (typeof window !== "undefined") {
        if (!window.google) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCm-Pxxfw-X0ZhanCnj2rkw63Bq8rSTBzQ&libraries=places`;
          script.async = true;
          script.defer = true;
          script.onload = initializeMap;
          script.onerror = () => {
            console.error("Failed to load Google Maps");
          };
          document.head.appendChild(script);
        } else {
          initializeMap();
        }
      }
    };

    const initializeMap = () => {
      if (!mapContainerRef.current) return;

      const center = region ||
        initialRegion || { latitude: 37.78825, longitude: -122.4324 };

      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        zoom: 15,
        center: { lat: center.latitude, lng: center.longitude },
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles:
          customMapStyle.length > 0
            ? customMapStyle
            : [
                {
                  featureType: "all",
                  stylers: [{ color: "#1a1a1a" }],
                },
                {
                  featureType: "road",
                  stylers: [{ color: "#2a2a2a" }],
                },
                {
                  featureType: "water",
                  stylers: [{ color: "#0f0f0f" }],
                },
              ],
      });

      if (onPress) {
        mapRef.current.addListener("click", (event: any) => {
          onPress({
            nativeEvent: {
              coordinate: {
                latitude: event.latLng.lat(),
                longitude: event.latLng.lng(),
              },
            },
          });
        });
      }
    };

    loadGoogleMaps();

    return () => {
      if (mapRef.current) {
        // Clean up map instance
        mapRef.current = null;
      }
    };
  }, [region, initialRegion, onPress, customMapStyle]);

  return (
    <View style={style}>
      <div
        ref={mapContainerRef}
        id="google-map"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 12,
          overflow: "hidden",
        }}
      />
      {children}
    </View>
  );
};

export default MapView;

// Export PROVIDER_GOOGLE for compatibility
export const PROVIDER_GOOGLE = "google";
