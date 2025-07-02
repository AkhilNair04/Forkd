// app/signup-email.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { supabase } from '@/constants/supabase';

export default function SignUpEmailScreen() {
  // form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isChef, setIsChef] = useState(false);

  // UI toggles + loading
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // show email-confirm prompt
  const [isConfirmingEmail, setIsConfirmingEmail] = useState(false);

  // when email-confirm prompt shows, fire a single 5s timer then redirect
  useEffect(() => {
    if (!isConfirmingEmail) return;
    const timer = setTimeout(async () => {
      const role = await AsyncStorage.getItem('userRole');
      if (role === 'chef') {
        router.replace('/(onboarding-chefs)/kyc_chefs_profile');
      } else {
        router.replace('/(onboarding-customers)/kyc_cus_name');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isConfirmingEmail]);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password) {
      return Alert.alert('Missing Fields', 'Please fill out all fields.');
    }
    if (password !== confirm) {
      return Alert.alert('Password Mismatch', 'Passwords do not match.');
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name.trim(),
          role: isChef ? 'chef' : 'customer',
        },
      },
    });
    setLoading(false);

    if (error) {
      return Alert.alert('Sign-up Error', error.message);
    }

    // persist flow flags & role
    await AsyncStorage.setItem('isNewUser', 'true');
    await AsyncStorage.setItem('emailForSignup', email.trim());
    await AsyncStorage.setItem('userRole', isChef ? 'chef' : 'customer');

    // show the "check your email" message & trigger redirect
    setIsConfirmingEmail(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <Text style={styles.subheader}>Please sign up to get started</Text>

      <View style={styles.formWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
        >
          {/* NAME */}
          <Text style={styles.label}>NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#a3a3a3"
            value={name}
            onChangeText={setName}
          />

          {/* EMAIL */}
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#a3a3a3"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* PASSWORD */}
          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#a3a3a3"
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

          {/* RETYPE PASSWORD */}
          <Text style={styles.label}>RE-TYPE PASSWORD</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#a3a3a3"
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

          {/* SIGN UP AS CHEF */}
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setIsChef(v => !v)}
          >
            <View
              style={[styles.checkbox, isChef && styles.checkboxChecked]}
            />
            <Text style={styles.checkboxText}>
              Sign up as a <Text style={styles.chefText}>chef</Text>
            </Text>
          </Pressable>

          {/* SUBMIT */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpButtonText}>SIGN UP</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* EMAIL CONFIRMATION PROMPT */}
      {isConfirmingEmail && (
        <View style={styles.confirmationMessage}>
          <Text style={styles.confirmationText}>
            Check your email for confirmation!
          </Text>
        </View>
      )}
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
    marginBottom: 8,
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
    paddingBottom: 60,
  },
  label: {
    color: '#fff',
    fontSize: 13,
    marginTop: 12,
    marginBottom: 6,
    letterSpacing: 1,
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
    right: 12,
    top: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#C67C4E',
    borderColor: '#C67C4E',
  },
  checkboxText: {
    color: '#fff',
    fontSize: 14,
  },
  chefText: {
    color: '#FF9900',
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#C67C4E',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 30,
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  confirmationMessage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -20 }],
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmationText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
