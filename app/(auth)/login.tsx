import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const handleSendOTP = () => {
    // TODO: Trigger OTP send logic here
    router.replace('/otp_verification');
  };

  const handleAltLogin = () => {
    router.replace('/email-login'); // adjust as needed
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
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>Send OTP</Text>
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
