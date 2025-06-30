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
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { supabase } from '@/constants/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [callingCode, setCallingCode] = useState<string>('91');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!/^\d{6,14}$/.test(phone)) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number (6–14 digits).');
      return;
    }

    setLoading(true);
    const fullPhone = `+${callingCode}${phone}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);

    if (error) {
      Alert.alert('OTP Error', error.message);
      return;
    }

    await AsyncStorage.setItem('phoneForOTP', fullPhone);
    await AsyncStorage.setItem('isNewUser', 'false');
    router.replace('/otp_verification');
  };

  const handleAltLogin = () => router.replace('/email-login');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log-in Using Your Phone Number:</Text>

      <View style={styles.phoneInputContainer}>
        {/* Tapping the flag+code opens the picker by default */}
        <CountryPicker
          countryCode={countryCode}
          withFlag
          withCallingCodeButton
          withFilter
          onSelect={(c: Country) => {
            setCountryCode(c.cca2);
            setCallingCode(c.callingCode[0]);
          }}
        />
        <Text style={styles.callingCode}>+{callingCode}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={14}
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
    paddingBottom: Platform.OS === 'android' ? 4 : 6,
  },
  callingCode: {
    color: '#fff',
    fontWeight: 'bold',
    marginHorizontal: 8,
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
