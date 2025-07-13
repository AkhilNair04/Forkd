import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '../../lib/supabase'; // Adjust the path if needed

// 1. Define your navigation stack param list
type RootStackParamList = {
  pastorderstimeline: undefined;
  ordertracking: { orderId: string };
  orderdelivered: { orderId: string };
  chefrating: { orderId: string };
};

// 2. Type for this screen's props
type OrderDeliveredProps = NativeStackScreenProps<RootStackParamList, 'orderdelivered'>;

const OrderDelivered = ({ route, navigation }: OrderDeliveredProps) => {
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { orderId } = route.params;

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Please select a rating before submitting.');
      return;
    }
    setSubmitting(true);
    // Save the rating to Supabase
    const { error } = await supabase
      .from('orders')
      .update({ order_rating: rating })
      .eq('id', orderId);

    setSubmitting(false);

    if (error) {
      Alert.alert('Error', 'Could not save rating. Please try again.');
      return;
    }

    navigation.replace('chefrating', { orderId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.checkmark}>✓</Text>
      <Text style={styles.header}>Order Delivered!</Text>
      <Text style={styles.subtext}>How was your experience?</Text>
      <StarRating rating={rating} onChange={setRating} />
      <TouchableOpacity
        style={[styles.button, submitting && { opacity: 0.5 }]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>{submitting ? 'Submitting...' : 'SUBMIT'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center' },
  checkmark: { color: '#D89B6A', fontSize: 48, marginBottom: 20 },
  header: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  subtext: { color: '#fff', fontSize: 16, marginVertical: 12, textAlign: 'center' },
  button: { backgroundColor: '#D89B6A', padding: 16, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default OrderDelivered;