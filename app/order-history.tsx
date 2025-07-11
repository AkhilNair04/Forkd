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
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OrderItem {
  id: string;
  chefName: string;
  chefAvatar: string;
  dishName: string;
  dishImage: string;
  orderDate: string;
  totalAmount: number;
  status: 'completed' | 'cancelled' | 'pending';
  rating?: number;
  quantity: number;
}

export default function OrderHistoryScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled' | 'pending'>('all');

  useEffect(() => {
    loadOrderHistory();
  }, []);

  const loadOrderHistory = async () => {
    try {
      // Load from AsyncStorage or API
      const savedOrders = await AsyncStorage.getItem('orderHistory');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Mock data for demo
        const mockOrders: OrderItem[] = [
          {
            id: '1',
            chefName: 'Chef Maria',
            chefAvatar: 'https://ui-avatars.com/api/?name=Maria&background=C67C4E&color=fff&size=128',
            dishName: 'Spicy Pasta Arrabiata',
            dishImage: 'https://picsum.photos/200/200?random=1',
            orderDate: '2024-01-15',
            totalAmount: 24.99,
            status: 'completed',
            rating: 5,
            quantity: 2,
          },
          {
            id: '2',
            chefName: 'Chef John',
            chefAvatar: 'https://ui-avatars.com/api/?name=John&background=C67C4E&color=fff&size=128',
            dishName: 'Grilled Salmon',
            dishImage: 'https://picsum.photos/200/200?random=2',
            orderDate: '2024-01-12',
            totalAmount: 32.50,
            status: 'completed',
            rating: 4,
            quantity: 1,
          },
          {
            id: '3',
            chefName: 'Chef Sarah',
            chefAvatar: 'https://ui-avatars.com/api/?name=Sarah&background=C67C4E&color=fff&size=128',
            dishName: 'Vegetarian Buddha Bowl',
            dishImage: 'https://picsum.photos/200/200?random=3',
            orderDate: '2024-01-10',
            totalAmount: 18.75,
            status: 'cancelled',
            quantity: 1,
          },
        ];
        setOrders(mockOrders);
        await AsyncStorage.setItem('orderHistory', JSON.stringify(mockOrders));
      }
    } catch (error) {
      console.error('Error loading order history:', error);
    }
  };

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#ff4444';
      case 'pending': return '#FFA500';
      default: return '#999';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <TouchableOpacity style={styles.orderCard} activeOpacity={0.8}>
      <View style={styles.orderHeader}>
        <View style={styles.chefInfo}>
          <Image source={{ uri: item.chefAvatar }} style={styles.chefAvatar} />
          <View>
            <Text style={styles.chefName}>{item.chefName}</Text>
            <Text style={styles.orderDate}>{formatDate(item.orderDate)}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.dishInfo}>
        <Image source={{ uri: item.dishImage }} style={styles.dishImage} />
        <View style={styles.dishDetails}>
          <Text style={styles.dishName}>{item.dishName}</Text>
          <Text style={styles.quantity}>Qty: {item.quantity}</Text>
          <Text style={styles.amount}>${item.totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {item.rating && item.status === 'completed' && (
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Your Rating:</Text>
          <View style={styles.stars}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < item.rating! ? 'star' : 'star-outline'}
                size={16}
                color="#FFD700"
              />
            ))}
          </View>
        </View>
      )}

      <View style={styles.orderActions}>
        {item.status === 'completed' && (
          <>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Reorder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Rate & Review</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status === 'pending' && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#ff4444' }]}>
            <Text style={styles.actionButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const FilterButton = ({ filterType, label }: { filterType: typeof filter, label: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && styles.activeFilterButton
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={[
        styles.filterButtonText,
        filter === filterType && styles.activeFilterButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <FilterButton filterType="all" label="All Orders" />
        <FilterButton filterType="completed" label="Completed" />
        <FilterButton filterType="pending" label="Pending" />
        <FilterButton filterType="cancelled" label="Cancelled" />
      </ScrollView>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#555" />
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all' 
                ? "You haven't placed any orders yet" 
                : `No ${filter} orders found`}
            </Text>
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
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterContent: {
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeFilterButton: {
    backgroundColor: '#C67C4E',
    borderColor: '#C67C4E',
  },
  filterButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chefInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chefAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chefName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  dishInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dishImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  dishDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dishName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C67C4E',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  stars: {
    flexDirection: 'row',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#C67C4E',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#C67C4E',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#C67C4E',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#C67C4E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
