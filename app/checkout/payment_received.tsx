import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { supabase } from '@/constants/supabase';

export default function PaymentReceivedScreen() {
  const [loading, setLoading] = useState(true);
  const orderId = uuidv4();

  useEffect(() => {
    const insertOrder = async () => {
      try {
        console.log("🚀 Inserting order…");

        const { data: userData, error: userError } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        console.log("👤 User ID:", userId);

        if (!userId || userError) {
          console.error("⚠️ No user found or error:", userError);
          Alert.alert('Error', 'User not logged in.');
          return;
        }

        const rawCart = await AsyncStorage.getItem('cart');
        const rawDetails = await AsyncStorage.getItem('orderDetails');

        if (!rawCart || !rawDetails) {
          Alert.alert('Error', 'Missing cart or order details.');
          return;
        }

        const parsedCart = JSON.parse(rawCart);
        const orderDetails = JSON.parse(rawDetails);

        const dishesOnly = parsedCart.filter((item: any) =>
          item.id?.startsWith('D')
        );

        console.log("🛒 Dishes only:", dishesOnly);

        let lat = null;
        let lng = null;
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({});
            lat = loc.coords.latitude;
            lng = loc.coords.longitude;
            console.log("📍 Location:", lat, lng);
          }
        } catch (locErr) {
          console.warn('📍 Location fetch failed:', locErr);
        }

        const { error, data } = await supabase
          .from('Orders')
          .insert({
            order_id: orderId,
            user_id: userId,
            items: dishesOnly,
            order_time: new Date().toISOString(),
            delivery_lat: lat,
            delivery_lng: lng,
            delivery_address: orderDetails.address,
            status: 'open',
            total_amount: parseFloat(orderDetails.amount || 0),
            payment_status: 'paid',
            payment_method: orderDetails.paymentMethod,
            payment_time: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select();

        if (error) {
          console.error('❌ Supabase insert error:', error);
          Alert.alert('Order Failed', error.message);
        } else {
          console.log('✅ Order inserted:', data);
        }
      } catch (e) {
        console.error('❌ Unexpected error inserting order:', e);
        Alert.alert('Error', 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    insertOrder();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={rstyles.container}>
        <ActivityIndicator size="large" color="#C48359" />
        <Text style={{ color: '#fff', marginTop: 20 }}>
          Finalizing your order…
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={rstyles.container}>
      <View style={rstyles.circle}>
        <Feather name="check" size={110} color="#C48359" />
      </View>
      <Text style={rstyles.title}>Received!</Text>
      <Text style={rstyles.subtitle}>
        Your payment has been received, and the chef has been notified!
      </Text>
      <TouchableOpacity
        style={rstyles.btn}
        onPress={() => router.push('/orders/track')}
      >
        <Text style={rstyles.btnText}>TRACK ORDER</Text>
      </TouchableOpacity>
      <TouchableOpacity style={rstyles.pager} onPress={() => router.back()}>
        <Feather name="chevron-left" size={16} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const rstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  circle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 4,
    borderColor: '#C48359',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginTop: 48 },
  subtitle: {
    color: '#bbb',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  btn: {
    backgroundColor: '#C48359',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 40,
  },
  btnText: { color: '#fff', fontWeight: '600' },
  pager: {
    flexDirection: 'row',
    marginTop: 32,
    backgroundColor: '#2A2A2A',
    borderRadius: 24,
    padding: 8,
  },
});
