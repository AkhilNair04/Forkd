// app/checkout/coupons.tsx
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CouponsScreen = () => {
  const params = useLocalSearchParams();
  const { currentSubtotal: initialSubtotalParam } = params;
  const currentSubtotal = parseFloat(initialSubtotalParam as string || '0');

  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState('');
  const [appliedSuccessfully, setAppliedSuccessfully] = useState(false);

  const applyCoupon = () => {
    let newTotal = currentSubtotal;
    let success = false;

    if (couponCode === 'SAVE10') {
      newTotal = currentSubtotal - 10.00; // ₹10 off
      setMessage('Coupon SAVE10 applied! ₹10 off.');
      success = true;
    } else if (couponCode === 'PERCENT20') {
      newTotal = currentSubtotal * 0.80; // 20% off
      setMessage('Coupon PERCENT20 applied! 20% off.');
      success = true;
    } else {
      setMessage('Invalid coupon code. Please try again.');
      setAppliedSuccessfully(false);
      return;
    }

    if (newTotal < 0) newTotal = 0;

    router.setParams({ discountedTotal: newTotal.toFixed(2) });
    setAppliedSuccessfully(true);
  };

  return (
    <View style={styles.container}>
      {/* Header consistent with Checkout screen */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply Coupon</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtotalText}>Current Subtotal: ₹{currentSubtotal.toFixed(2)}</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter coupon code"
          placeholderTextColor="#666"
          value={couponCode}
          onChangeText={setCouponCode}
          autoCapitalize="characters"
        />

        <TouchableOpacity style={styles.applyCouponButton} onPress={applyCoupon}>
          <Text style={styles.applyCouponText}>Apply Coupon</Text>
        </TouchableOpacity>

        {message ? (
          <Text style={[styles.messageText, { color: appliedSuccessfully ? '#00BFFF' : '#FF6347' }]}>
            {message}
          </Text>
        ) : null}

        {(message && !appliedSuccessfully) || appliedSuccessfully ? (
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Go Back to Checkout</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtotalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },
  applyCouponButton: {
    backgroundColor: '#C67C4E',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  applyCouponText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    marginTop: 10,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CouponsScreen;