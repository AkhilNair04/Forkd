import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/constants/supabase';

export default function SignupPhone() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [callingCode, setCallingCode] = useState<string>('91');
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendOTP = async () => {
    // Basic validation: numeric, 6–14 digits
    if (!/^\d{6,14}$/.test(phone)) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid phone number (6–14 digits).'
      );
      return;
    }

    setLoading(true);
    const fullPhone = `+${callingCode}${phone}`;

    // Trigger Supabase OTP send
    const { error } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
    });
    setLoading(false);

    if (error) {
      Alert.alert('OTP Error', error.message);
    } else {
      // Persist phone for OTP screen
      await AsyncStorage.setItem('phoneForOTP', fullPhone);

      // (Optional) if you have "new vs returning" flag set earlier:
      // await AsyncStorage.setItem('isNewUser', 'true'); // or 'false'

      // Navigate to OTP screen
      router.replace('/otp-verification');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign-up Using Your Phone Number:</Text>

      <View style={styles.phoneRow}>
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
          placeholder="Phone number"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={14}
        />
      </View>

      <TouchableOpacity
        style={[styles.sendButton, loading && styles.sendButtonDisabled]}
        onPress={handleSendOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.sendButtonText}>Send OTP</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>

      <View style={styles.socialRow}>
        <TouchableOpacity onPress={() => router.replace('/signup-email')}>
          <Text style={styles.altText}>SIGN UP WITH EMAIL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    marginBottom: 30,
    width: '100%',
    paddingBottom: Platform.OS === 'android' ? 4 : 6,
  },
  callingCode: {
    color: '#fff',
    fontSize: 18,
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#C67C4E',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  orText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  altText: {
    color: '#FF7C2E',
    fontSize: 16,
    fontWeight: '600',
  },
});
