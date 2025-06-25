import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Log In</Text>
      <Text style={styles.subheader}>Please log in to your existing account</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          placeholderTextColor="#333"
        />

        <Text style={styles.label}>PASSWORD</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.input}
            placeholder="123456789"
            placeholderTextColor="#333"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox} />
            <Text style={styles.rememberText}>Remember me</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.signupText}>
        Don’t have an account?{' '}
        <Text style={styles.signupLink}>SIGN UP WITH YOUR EMAIL</Text>
      </Text>

      <Text style={styles.orText}>Or</Text>

      <View style={styles.socialRow}>
        <AntDesign name="phone" size={28} color="white" />
        <AntDesign name="google" size={28} color="white" />
        <AntDesign name="close" size={28} color="white" />
        <AntDesign name="facebook-square" size={28} color="white" />
        <AntDesign name="apple1" size={28} color="white" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0D0D0D',
    padding: 20,
    paddingTop: 60,
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
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: '#3F3F3F',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 10,
  },
  rememberText: {
    color: '#fff',
    fontSize: 14,
  },
  forgotText: {
    color: '#D77F44',
    fontWeight: '500',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#C67C4E',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signupText: {
    marginTop: 30,
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
  },
  signupLink: {
    color: '#FF7C2E',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#fff',
    marginVertical: 18,
    fontSize: 16,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
  },
});
