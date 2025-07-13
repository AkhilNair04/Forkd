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
import { ReferralService } from '@/services/ReferralService';

interface PasswordStrength {
  score: number;
  percentage: number;
  level: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    symbols: boolean;
    noCommon: boolean;
  };
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noCommon: !isCommonPassword(password)
  };

  const score = Object.values(checks).filter(Boolean).length;
  const percentage = Math.round((score / 6) * 100);

  let level: PasswordStrength['level'];
  let color: string;

  if (score <= 1) {
    level = 'Very Weak';
    color = '#FF4444';
  } else if (score <= 2) {
    level = 'Weak';
    color = '#FF8800';
  } else if (score <= 3) {
    level = 'Fair';
    color = '#FFAA00';
  } else if (score <= 4) {
    level = 'Good';
    color = '#88CC00';
  } else {
    level = 'Strong';
    color = '#00CC44';
  }

  return { score, percentage, level, color, checks };
};

const isCommonPassword = (password: string): boolean => {
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    '12345678', '111111', '123123', 'admin', 'letmein', 'welcome',
    'monkey', '1234567890', 'dragon', 'sunshine', 'princess', 'football'
  ];
  return commonPasswords.includes(password.toLowerCase());
};

const processReferralCode = async (code: string, newUserId: string | undefined) => {
  try {
    if (!newUserId) return;

    // Validate referral code using service
    const isValid = await ReferralService.validateReferralCode(code);
    if (!isValid) {
      Alert.alert('Invalid Code', 'The referral code you entered is not valid.');
      return;
    }

    // Process referral using service
    const success = await ReferralService.processNewUserReferral(code, newUserId);
    
    if (success) {
      // Show success message
      Alert.alert(
        'Referral Applied!',
        'Congratulations! You\'ve received ₹100 off your first order. Check your rewards in the app!',
        [{ text: 'Great!', style: 'default' }]
      );
    } else {
      // Fallback error message
      Alert.alert(
        'Error',
        'Failed to process referral code. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
    
  } catch (error) {
    console.error('Error processing referral code:', error);
    Alert.alert('Error', 'Failed to process referral code. Please try again.');
  }
};

export default function SignUpEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    setEmailError('');
    
    if (newEmail.length > 0 && !validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
    }
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setPasswordError('');
    
    if (newPassword.length > 0) {
      setPasswordStrength(calculatePasswordStrength(newPassword));
    } else {
      setPasswordStrength(null);
    }

    // Check confirm password match if it's already filled
    if (confirm.length > 0) {
      handleConfirmChange(confirm);
    }
  };

  const handleConfirmChange = (newConfirm: string) => {
    setConfirm(newConfirm);
    setConfirmError('');
    
    if (newConfirm.length > 0 && newConfirm !== password) {
      setConfirmError('Passwords do not match');
    }
  };

  const handleSignUp = async () => {
  // Reset all errors
  setEmailError('');
  setPasswordError('');
  setConfirmError('');

  // Validation checks
  let hasErrors = false;

  if (!email.trim()) {
    setEmailError('Email is required');
    hasErrors = true;
  } else if (!validateEmail(email.trim())) {
    setEmailError('Please enter a valid email address');
    hasErrors = true;
  }

  if (!password) {
    setPasswordError('Password is required');
    hasErrors = true;
  } else if (passwordStrength && passwordStrength.score < 3) {
    setPasswordError('Password is too weak. Please choose a stronger password.');
    hasErrors = true;
  }

  if (!confirm) {
    setConfirmError('Please confirm your password');
    hasErrors = true;
  } else if (password !== confirm) {
    setConfirmError('Passwords do not match');
    hasErrors = true;
  }

  if (hasErrors) {
    return;
  }

  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error('Sign-up Error:', error);

      // Handle specific error types
      if (error.message.includes('invalid format') || error.message.includes('email')) {
        setEmailError('Invalid email format. Please check your email address.');
      } else if (error.message.includes('password')) {
        setPasswordError(error.message);
      } else if (error.message.includes('already registered') || error.message.includes('already exists')) {
        setEmailError('This email is already registered. Try logging in instead.');
      } else {
        Alert.alert('Sign-up Error', error.message);
      }
      return;
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

      // Process referral code if provided
      if (referralCode.trim()) {
        await processReferralCode(referralCode.trim(), data.user?.id);
      }

      // Route immediately to email-confirm
      router.replace('/(onboarding-customers)/kyc_landing_accept');
    } else {
      Alert.alert('Error', 'Unable to create user profile.');
    }
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'An unexpected error occurred.');
  } finally {
    setLoading(false);
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
            style={[
              styles.input, 
              emailError && styles.inputError,
              email.length > 0 && !emailError && validateEmail(email) && styles.inputSuccess
            ]}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleEmailChange}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, passwordError && styles.inputError]}
              placeholder="••••••••"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={handlePasswordChange}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(v => !v)}
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Password Strength Indicator */}
          {passwordStrength && (
            <View style={styles.passwordStrengthContainer}>
              <View style={styles.strengthHeader}>
                <Text style={styles.strengthLabel}>Password Strength</Text>
                <Text style={[styles.strengthLevel, { color: passwordStrength.color }]}>
                  {passwordStrength.level} ({passwordStrength.percentage}%)
                </Text>
              </View>
              
              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${passwordStrength.percentage}%`,
                        backgroundColor: passwordStrength.color 
                      }
                    ]} 
                  />
                </View>
              </View>

              {/* Requirements Checklist */}
              <View style={styles.requirementsContainer}>
                <View style={styles.requirementRow}>
                  <Feather 
                    name={passwordStrength.checks.length ? "check-circle" : "circle"} 
                    size={16} 
                    color={passwordStrength.checks.length ? "#00CC44" : "#666"} 
                  />
                  <Text style={[styles.requirementText, passwordStrength.checks.length && styles.requirementMet]}>
                    At least 8 characters
                  </Text>
                </View>
                
                <View style={styles.requirementRow}>
                  <Feather 
                    name={passwordStrength.checks.lowercase ? "check-circle" : "circle"} 
                    size={16} 
                    color={passwordStrength.checks.lowercase ? "#00CC44" : "#666"} 
                  />
                  <Text style={[styles.requirementText, passwordStrength.checks.lowercase && styles.requirementMet]}>
                    Lowercase letter (a-z)
                  </Text>
                </View>

                <View style={styles.requirementRow}>
                  <Feather 
                    name={passwordStrength.checks.uppercase ? "check-circle" : "circle"} 
                    size={16} 
                    color={passwordStrength.checks.uppercase ? "#00CC44" : "#666"} 
                  />
                  <Text style={[styles.requirementText, passwordStrength.checks.uppercase && styles.requirementMet]}>
                    Uppercase letter (A-Z)
                  </Text>
                </View>

                <View style={styles.requirementRow}>
                  <Feather 
                    name={passwordStrength.checks.numbers ? "check-circle" : "circle"} 
                    size={16} 
                    color={passwordStrength.checks.numbers ? "#00CC44" : "#666"} 
                  />
                  <Text style={[styles.requirementText, passwordStrength.checks.numbers && styles.requirementMet]}>
                    Number (0-9)
                  </Text>
                </View>

                <View style={styles.requirementRow}>
                  <Feather 
                    name={passwordStrength.checks.symbols ? "check-circle" : "circle"} 
                    size={16} 
                    color={passwordStrength.checks.symbols ? "#00CC44" : "#666"} 
                  />
                  <Text style={[styles.requirementText, passwordStrength.checks.symbols && styles.requirementMet]}>
                    Special character (!@#$...)
                  </Text>
                </View>

                <View style={styles.requirementRow}>
                  <Feather 
                    name={passwordStrength.checks.noCommon ? "check-circle" : "circle"} 
                    size={16} 
                    color={passwordStrength.checks.noCommon ? "#00CC44" : "#666"} 
                  />
                  <Text style={[styles.requirementText, passwordStrength.checks.noCommon && styles.requirementMet]}>
                    Not a common password
                  </Text>
                </View>
              </View>
            </View>
          )}

          <Text style={styles.label}>RE-TYPE PASSWORD</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[
                styles.input, 
                confirmError && styles.inputError,
                confirm.length > 0 && !confirmError && password === confirm && styles.inputSuccess
              ]}
              placeholder="Confirm password"
              placeholderTextColor="#999"
              secureTextEntry={!showRetypePassword}
              autoCapitalize="none"
              value={confirm}
              onChangeText={handleConfirmChange}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowRetypePassword(v => !v)}
            >
              <Feather
                name={showRetypePassword ? 'eye-off' : 'eye'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          {confirmError ? <Text style={styles.errorText}>{confirmError}</Text> : null}

          {/* Referral Code Section */}
          <TouchableOpacity 
            style={styles.referralToggle}
            onPress={() => setShowReferralInput(!showReferralInput)}
          >
            <Text style={styles.referralToggleText}>
              Have a referral code? 
            </Text>
            <Feather 
              name={showReferralInput ? 'chevron-up' : 'chevron-down'} 
              size={16} 
              color="#C67C4E" 
            />
          </TouchableOpacity>

          {showReferralInput && (
            <View style={styles.referralContainer}>
              <Text style={styles.label}>REFERRAL CODE (OPTIONAL)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter referral code"
                placeholderTextColor="#999"
                autoCapitalize="characters"
                value={referralCode}
                onChangeText={setReferralCode}
              />
              <Text style={styles.referralBenefit}>
                🎉 Get ₹100 off your first order!
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.signUpButton,
              (Boolean(emailError) || Boolean(passwordError) || Boolean(confirmError) || 
               !email.trim() || !password || !confirm ||
               !validateEmail(email.trim()) || password !== confirm ||
               (passwordStrength !== null && passwordStrength.score < 3)) && styles.signUpButtonDisabled
            ]}
            onPress={handleSignUp}
            disabled={loading || Boolean(emailError) || Boolean(passwordError) || Boolean(confirmError) || 
                     !email.trim() || !password || !confirm ||
                     !validateEmail(email.trim()) || password !== confirm ||
                     (passwordStrength !== null && passwordStrength.score < 3)}
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
  input: { backgroundColor: '#2A2A2A', borderRadius: 12, padding: 14, fontSize: 16, color: '#fff', borderWidth: 1, borderColor: '#444' },
  inputError: { 
    borderWidth: 2, 
    borderColor: '#FF4444',
    backgroundColor: '#2A1A1A'
  },
  inputSuccess: {
    borderWidth: 2,
    borderColor: '#C67C4E',
    backgroundColor: '#2A2A2A'
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordWrapper: { position: 'relative' },
  eyeIcon: { position: 'absolute', right: 12, top: 18 },
  signUpButton: { backgroundColor: '#C67C4E', paddingVertical: 16, borderRadius: 18, alignItems: 'center', marginTop: 30 },
  signUpButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  signUpButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  
  // Password Strength Styles
  passwordStrengthContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  strengthLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  strengthLevel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#444',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  requirementsContainer: {
    marginTop: 4,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingLeft: 4,
  },
  requirementText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 8,
  },
  requirementMet: {
    color: '#00CC44',
  },
  
  // Referral Code Styles
  referralToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    padding: 12,
  },
  referralToggleText: {
    color: '#C67C4E',
    fontSize: 16,
    marginRight: 8,
  },
  referralContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  referralBenefit: {
    color: '#00CC44',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});
