// app/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/constants/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    // validate 10-digit Indian number
    if (!/^[6-9]\d{9}$/.test(phone)) {
      Alert.alert('Invalid Number', 'Enter a valid 10-digit Indian phone number.');
      return;
    }

    setLoading(true);
    const fullPhone = `+91${phone}`;

    // Supabase OTP
    const { error } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
    });
    setLoading(false);

    if (error) {
      Alert.alert('OTP Error', error.message);
      return;
    }

    // persist for OTP screen
    await AsyncStorage.setItem('phoneForOTP', fullPhone);
    await AsyncStorage.setItem('isNewUser', 'false');

    // navigate
    router.replace('/otp_verification');
  };

  const handleAltLogin = () => {
    router.replace('/email-login'); // adjust if needed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log-in Using Your Phone Number:</Text>

      <View style={styles.phoneInputContainer}>
        <Text style={styles.countryCode}>IN ▾ +91</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={10}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSendOTP}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Send OTP</Text>
        }
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>

      <TouchableOpacity style={styles.button} onPress={handleAltLogin}>
        <Text style={styles.buttonText}>LOG IN ANOTHER WAY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#fff',
    marginBottom: 30,
    paddingBottom: 6,
  },
  countryCode: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#C67C4E',
    paddingVertical: 16,
    borderRadius: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  orText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
  },
});
