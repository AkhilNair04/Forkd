import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { supabase } from '@/constants/supabase';

export default function LoginEmailScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message);
      return;
    }

    // Mark as returning user
    await AsyncStorage.setItem('isNewUser', 'false');

    // Redirect to main tabs
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Log In</Text>
      <Text style={styles.subheader}>Please log in to your existing account</Text>

      <View style={styles.formWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={[styles.label, { marginTop: 20 }]}>PASSWORD</Text>
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
              onPress={() => setShowPassword((v) => !v)}
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>LOG IN</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Don’t have an account?{' '}
            <Text
              style={styles.signupLink}
              onPress={() => router.replace('/signup-email')}
            >
              SIGN UP WITH YOUR EMAIL
            </Text>
          </Text>

          <Text style={styles.orText}>Or</Text>

          <View style={styles.socialRow}>
            {/* If you want to implement social logins later */}
            <AntDesign name="google" size={28} color="white" />
            <AntDesign name="facebook-square" size={28} color="white" />
            <AntDesign name="apple1" size={28} color="white" />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  formWrapper: {
    flex: 1,
    backgroundColor: '#3F3F3F',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  scrollInner: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#000',
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  loginButton: {
    backgroundColor: '#C67C4E',
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signupText: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 24,
    fontSize: 15,
  },
  signupLink: {
    color: '#FF7C2E',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#fff',
    marginVertical: 24,
    fontSize: 16,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 40,
  },
});
