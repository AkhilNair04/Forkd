import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function SignUpEmailScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [isChef, setIsChef] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <Text style={styles.subheader}>Please sign up to get started</Text>

      <View style={styles.formWrapper}>
        <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
          {/* Name */}
          <Text style={styles.label}>NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#a3a3a3"
          />

          {/* Email */}
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#a3a3a3"
          />

          {/* Password */}
          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#a3a3a3"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Retype Password */}
          <Text style={styles.label}>RE-TYPE PASSWORD</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#a3a3a3"
              secureTextEntry={!showRetypePassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowRetypePassword(!showRetypePassword)}
            >
              <Feather name={showRetypePassword ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Checkbox */}
          <Pressable style={styles.checkboxRow} onPress={() => setIsChef(!isChef)}>
            <View style={[styles.checkbox, isChef && styles.checkboxChecked]} />
            <Text style={styles.checkboxText}>
              Sign up as a <Text style={styles.chefText}>chef</Text>
            </Text>
          </Pressable>

          {/* Submit Button */}
          <TouchableOpacity style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>SIGN UP</Text>
          </TouchableOpacity>
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
    paddingRight: 45,
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
});
