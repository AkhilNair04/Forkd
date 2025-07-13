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
type ChefRatingProps = NativeStackScreenProps<RootStackParamList, 'chefrating'>;

const ChefRating = ({ route, navigation }: ChefRatingProps) => {
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { orderId } = route.params;

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Please select a rating before submitting.');
      return;
    }
    setSubmitting(true);
    // Save the chef rating to Supabase
    const { error } = await supabase
      .from('orders')
      .update({ chef_rating: rating })
      .eq('id', orderId);

    setSubmitting(false);

    if (error) {
      Alert.alert('Error', 'Could not save chef rating. Please try again.');
      return;
    }

    navigation.replace('pastorderstimeline');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chef Service Done!</Text>
      <Text style={styles.subtext}>Rate the chef's service</Text>
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
  header: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  subtext: { color: '#fff', fontSize: 16, marginBottom: 16 },
  button: { backgroundColor: '#D89B6A', padding: 16, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default ChefRating;