import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function OrderTrackingScreen() {
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = await AsyncStorage.getItem('orderDetails');
        if (orderData) {
          setOrderDetails(JSON.parse(orderData));
        }
        // Assuming location data is available from context
        setCurrentLocation({
          latitude: 37.78825,
          longitude: -122.4324, // Just an example location
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  const renderOrderDetails = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#FF9100" />;
    }

    if (!orderDetails) {
      return <Text>No order details available.</Text>;
    }

    return (
      <>
        <View style={styles.orderInfo}>
          <Text style={styles.orderTitle}>Order Detail 1</Text>
          <Text style={styles.orderTime}>
            Ordered At {orderDetails.orderTime}
          </Text>
          <Text style={styles.foodImageWrapper}>
            <Image source={{ uri: orderDetails.foodImage }} style={styles.foodImage} />
          </Text>
          <Text style={styles.chefName}>Chef Anna P</Text>
          <Text style={styles.orderTime}>Order received at 10:00pm</Text>
        </View>

        {/* Map View */}
        <MapView
          style={styles.map}
          region={{
            latitude: currentLocation?.latitude || 37.78825,
            longitude: currentLocation?.longitude || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={currentLocation} />
        </MapView>

        {/* Order Tracking Steps */}
        <ScrollView style={styles.orderStepsWrapper}>
          <View style={styles.orderStep}>
            <Ionicons name="checkmark-circle" size={22} color="#FF9100" />
            <Text style={styles.orderStepText}>Your order has been received</Text>
          </View>
          <View style={styles.orderStep}>
            <Ionicons name="reload" size={22} color="#FF9100" />
            <Text style={styles.orderStepText}>The restaurant is preparing your food</Text>
          </View>
          <View style={styles.orderStep}>
            <Ionicons name="car" size={22} color="#FF9100" />
            <Text style={styles.orderStepText}>Your order has been picked up for delivery</Text>
          </View>
          <View style={styles.orderStep}>
            <Ionicons name="home" size={22} color="#FF9100" />
            <Text style={styles.orderStepText}>Order arriving soon!</Text>
          </View>
        </ScrollView>

        {/* Contact Courier */}
        <View style={styles.contactCourier}>
          <Text style={styles.courierName}>Robert F.</Text>
          <Text style={styles.courierRole}>Courier</Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="call" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <Feather name="message-circle" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderOrderDetails()}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push('/home')}
        >
          <Ionicons name="home" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  orderInfo: {
    padding: 16,
    backgroundColor: '#2c2c2c',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  orderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderTime: {
    color: '#FF9100',
    marginTop: 8,
  },
  foodImageWrapper: {
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  chefName: {
    color: '#fff',
    marginTop: 8,
  },
  orderStepsWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  orderStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderStepText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  map: {
    flex: 1,
  },
  contactCourier: {
    padding: 16,
    backgroundColor: '#2c2c2c',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
  },
  courierName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  courierRole: {
    fontSize: 14,
    color: '#C67C4E',
    marginTop: 4,
  },
  contactButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  contactButton: {
    backgroundColor: '#FF9100',
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    height: 65,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
  },
  homeButton: {
    backgroundColor: '#C67C4E',
    padding: 10,
    borderRadius: 50,
  },
  profileButton: {
    backgroundColor: '#C67C4E',
    padding: 10,
    borderRadius: 50,
  },
});
