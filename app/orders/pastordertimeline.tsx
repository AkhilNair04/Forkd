import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

// 1. Define your navigation stack param list
type RootStackParamList = {
  pastorderstimeline: undefined;
  ordertracking: { orderId: string };
  orderdelivered: { orderId: string };
  chefrating: { orderId: string };
};

type Order = {
  id: string;
  status: string;
  created_at: string;
};

// 2. Type for navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'pastorderstimeline'>;

const PastOrdersTimeline = () => {
  // 3. Use the typed navigation hook
  const navigation = useNavigation<NavigationProp>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error.message);
        setOrders([]);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#181818' }}>
        <ActivityIndicator color="#D89B6A" size="large" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#181818' }}>
        <Text style={{ color: '#fff' }}>No past orders found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#181818', padding: 20 }}>
      <Text style={{ color: '#fff', fontSize: 22, marginBottom: 20 }}>Past Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ordertracking', { orderId: item.id })}
            style={{ marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 8 }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.status}</Text>
            <Text style={{ color: '#aaa' }}>{new Date(item.created_at).toLocaleString()}</Text>
            <Text style={{ color: '#D89B6A', marginTop: 4 }}>Track Order</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default PastOrdersTimeline;