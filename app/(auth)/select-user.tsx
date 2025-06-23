import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SelectUserScreen() {
  const router = useRouter();

  const handleRoleSelect = (role: 'Customer' | 'Chef') => {
    // Save role to context or AsyncStorage if needed
    if (role === 'Customer') {
      router.replace('/customer-onboarding'); // Make sure this file exists
    } else {
      router.replace('/chef-onboarding'); // Make sure this file exists
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are a...</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect('Customer')}>
        <Text style={styles.buttonText}>Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect('Chef')}>
        <Text style={styles.buttonText}>Chef</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#C67C4E',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 20,
    marginVertical: 10,
    width: '85%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
