import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, MaterialIcons, AntDesign, Entypo } from '@expo/vector-icons';

export default function SignupScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const handleSendOTP = () => {
    // Add validation and navigation logic here
    router.replace('/otp_verification'); // Replace with actual OTP page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign-up Using Your Phone Number:</Text>

      {/* Phone input row */}
      <View style={styles.phoneRow}>
        <Text style={styles.countryCode}>IN ▾ +91</Text>
        <TextInput
          placeholder="Phone number"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* Send OTP button */}
      <TouchableOpacity style={styles.sendButton} onPress={handleSendOTP}>
        <Text style={styles.sendButtonText}>Send OTP</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.orText}>Or</Text>

      {/* Social icons row */}
      <View style={styles.iconRow}>
        <FontAwesome name="phone" size={28} color="white" style={styles.icon} />
        <AntDesign name="google" size={28} color="white" style={styles.icon} />
        <AntDesign name="twitter" size={28} color="white" style={styles.icon} />
        <FontAwesome name="facebook" size={28} color="white" style={styles.icon} />
        <AntDesign name="apple1" size={28} color="white" style={styles.icon} />
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
  countryCode: {
    color: '#fff',
    fontSize: 18,
    marginRight: 12,
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
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  orText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  icon: {
    marginHorizontal: 10,
  },
});
