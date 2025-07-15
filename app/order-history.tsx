import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/constants/supabase';

type OrderItem = {
  order_id: string;
  items: string;
  order_time: string;
  total_amount: number;
  delivery_address: string;
  delivery_notes: string;
  status: string;
};

export default function OrderHistoryScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled' | 'pending'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) return;

    const { data, error } = await supabase
      .from('Orders')
      .select('order_id, items, delivery_notes, order_time, total_amount, status, delivery_address')
      .eq('user_id', user.id)
      .order('delivery_notes', { ascending: true }) // Ongoing statuses come first
      .order('order_time', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error.message);
    } else {
      setOrders(data);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#ff4444';
      case 'pending':
        return '#FFA500';
      default:
        return '#999';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
  <TouchableOpacity
    style={styles.orderCard}
    onPress={() => router.push({ pathname: "/checkout/order_placed", params: { orderId: item.order_id } })}
  >
    <View style={styles.orderHeader}>
      <View>
        <Text style={styles.chefName}>Order ID: {item.order_id.slice(0, 8)}</Text>
        <Text style={styles.orderDate}>{formatDate(item.order_time)}</Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status?.toUpperCase()}</Text>
        </View>
      </View>
    </View>

    <View style={styles.dishInfo}>
      <View style={styles.dishDetails}>
        <Text style={styles.dishName}>{item.items}</Text>
        <Text style={styles.amount}>₹{item.total_amount?.toFixed(2)}</Text>
      </View>
    </View>

    <View>
      <Text style={styles.deliveryNoteLabel}>Delivery Status:</Text>
      <Text style={styles.deliveryNoteText}>{item.delivery_notes}</Text>
    </View>
  </TouchableOpacity>
);


  const FilterButton = ({ filterType, label }: { filterType: typeof filter; label: string }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === filterType && styles.activeFilterButton]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={[styles.filterButtonText, filter === filterType && styles.activeFilterButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack?.()) {
              router.back();
            } else {
              router.replace("/(tabs)");
            }
          }}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#555" />
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.browseButtonText}>Browse Dishes</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 100 },
  orderCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chefName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  orderDate: { fontSize: 12, color: '#999' },
  statusContainer: { alignItems: 'flex-end' },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
  dishInfo: { flexDirection: 'row', marginBottom: 12 },
  dishDetails: { flex: 1 },
  dishName: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 4 },
  amount: { fontSize: 18, fontWeight: 'bold', color: '#C67C4E' },
  deliveryNoteLabel: { fontSize: 14, color: '#999' },
  deliveryNoteText: { fontSize: 14, color: '#fff', marginBottom: 8 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 16 },
  browseButton: {
    backgroundColor: '#C67C4E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  browseButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 10,
  },
  activeFilterButton: { backgroundColor: '#C67C4E', borderColor: '#C67C4E' },
  filterButtonText: { color: '#999', fontSize: 14, fontWeight: '600' },
  activeFilterButtonText: { color: '#fff' },
});
