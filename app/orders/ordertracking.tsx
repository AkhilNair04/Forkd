import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../lib/supabase';

// Types for navigation and route
type RootStackParamList = {
  pastorderstimeline: undefined;
  ordertracking: { orderId: string };
  orderdelivered: { orderId: string };
  chefrating: { orderId: string };
};

type OrderTrackingRouteProp = RouteProp<RootStackParamList, 'ordertracking'>;
type OrderTrackingNavProp = NativeStackNavigationProp<RootStackParamList, 'ordertracking'>;

export default function OrderTracking() {
  const route = useRoute<OrderTrackingRouteProp>();
  const navigation = useNavigation<OrderTrackingNavProp>();
  const { orderId } = route.params;

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      if (!error) setOrder(data);
    };
    fetchOrder();
  }, [orderId]);

  if (!order) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#181818' }}>
        <Text style={{ color: '#fff' }}>Loading order...</Text>
      </View>
    );
  }

  const courierLat = order.courier_location_lat || 12.9716;
  const courierLng = order.courier_location_lng || 77.5946;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: courierLat,
          longitude: courierLng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude: courierLat, longitude: courierLng }} title="Courier" />
      </MapView>
      <View style={styles.overlay}>
        <Text style={styles.status}>{order.status}</Text>
        <Text style={styles.eta}>Estimated Delivery: {order.estimated_delivery || '20 min'}</Text>
        <View style={styles.courierRow}>
          <Text style={styles.courierName}>{order.courier_name || 'Courier'}</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#D89B6A', padding :10, borderRadius:8 ,marginLeft :8}}

            onPress={() =>{
                if (order.courier_phone){
                    Linking.openURL('tel:${order.courier_phone}');
                }
            }}
          >
            <Text style={{ color: '#fff' }}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { /* Optional messaging logic */ }}
          >
            <Text style={{ color: '#fff' }}>Message</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => navigation.replace('orderdelivered', { orderId })}
        >
          <Text style={{ color: '#fff' }}>Mark as Delivered (Test)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#222a', padding: 20,
  },
  status: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  eta: { color: '#fff', fontSize: 16, marginVertical: 4 },
  courierRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  courierName: { color: '#fff', fontWeight: 'bold', flex: 1 },
  button: { backgroundColor: '#D89B6A', padding: 10, borderRadius: 8, marginLeft: 8 },
  trackButton: { backgroundColor: '#D89B6A', padding: 14, borderRadius: 8, marginTop: 10, alignItems: 'center' },
});