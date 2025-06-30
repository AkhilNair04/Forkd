import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/constants/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      Alert.alert('Invalid Number','Enter a valid 10-digit Indian number');
      return;
    }
    setLoading(true);
    const fullPhone = `+91${phone}`;
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log-in Using Your Phone Number:</Text>
      <View style={styles.row}>
        <Text style={styles.code}>IN +91</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={10}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Send OTP</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 24, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  row: { flexDirection:'row', alignItems:'center', borderBottomWidth:1, borderColor:'#fff', marginBottom:30 },
  code: { color:'#fff', fontWeight:'bold', marginRight:10, fontSize:16 },
  input:{ flex:1, color:'#fff', fontSize:16, paddingVertical:8 },
  button:{ backgroundColor:'#C67C4E', padding:16, borderRadius:20, alignItems:'center' },
  btnText:{ color:'#fff', fontWeight:'600', fontSize:16 },
});
