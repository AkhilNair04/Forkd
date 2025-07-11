// app/signup-email.tsx
import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator, StyleSheet
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';

export default function SignUpEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      return Alert.alert('Missing Fields', 'Please fill out all fields.');
    }
    if (password !== confirm) {
      return Alert.alert('Password Mismatch', 'Passwords do not match.');
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      console.error('Sign-up Error:', error);
      return Alert.alert('Sign-up Error', error.message);
    }

    // Mark as new user & store email for later verification
    await AsyncStorage.setItem('isNewUser', 'true');
    await AsyncStorage.setItem('emailForSignup', email.trim());

    // Get the user ID from supabase auth
    const userId = data?.user?.id;

    if (userId) {
      // Now we associate the new user with a profile
      await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
        });

      // Route immediately to email-confirm
      router.replace('/(onboarding-customers)/kyc_landing_accept');
    } else {
      Alert.alert('Error', 'Unable to create user profile.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <Text style={styles.subheader}>Please sign up to get started</Text>

      <View style={styles.formWrapper}>
        <ScrollView contentContainerStyle={styles.scrollInner}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(v => !v)}
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>RE-TYPE PASSWORD</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#888"
              secureTextEntry={!showRetypePassword}
              autoCapitalize="none"
              value={confirm}
              onChangeText={setConfirm}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowRetypePassword(v => !v)}
            >
              <Feather
                name={showRetypePassword ? 'eye-off' : 'eye'}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.signUpButtonText}>SIGN UP</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', paddingTop: 60, paddingHorizontal: 20 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subheader: { fontSize: 16, color: '#ccc', textAlign: 'center', marginBottom: 20 },
  formWrapper: { flex: 1, backgroundColor: '#3F3F3F', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  scrollInner: { padding: 20, paddingBottom: 60 },
  label: { color: '#fff', fontSize: 13, marginTop: 12, marginBottom: 6, letterSpacing: 1 },
  input: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 14, fontSize: 16, color: '#000' },
  passwordWrapper: { position: 'relative' },
  eyeIcon: { position: 'absolute', right: 12, top: 18 },
  signUpButton: { backgroundColor: '#C67C4E', paddingVertical: 16, borderRadius: 18, alignItems: 'center', marginTop: 30 },
  signUpButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});
