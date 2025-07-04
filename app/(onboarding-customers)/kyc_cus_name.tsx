// app/(onboarding-customers)/kyc_cus_name.tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/constants/supabase';

export default function KycCusName() {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [priming, setPriming] = useState<boolean>(true);

  // On mount → rehydrate Supabase session
  useEffect(() => {
    (async () => {
      try {
        const access_token = await AsyncStorage.getItem('sb_access_token');
        const refresh_token = await AsyncStorage.getItem('sb_refresh_token');

        if (access_token && refresh_token) {
          // v2 SDK: restore session
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (error) console.warn('Session restore error', error);
        }
      } catch (err) {
        console.error('Session restore exception', err);
      } finally {
        setPriming(false);
      }
    })();
  }, []);

  const handleConfirm = async () => {
    if (!name.trim() || priming) return;

    setLoading(true);
    // now supabase.auth.getUser() should work without missing session
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      console.error('Auth error:', authErr);
      setLoading(false);
      return;
    }

    // update full_name in user_profiles
    const { error: updateErr } = await supabase
      .from('user_profiles')
      .update({ full_name: name.trim() })
      .eq('user_id', user.id);

    setLoading(false);

    if (updateErr) {
      console.error('Profile update error:', updateErr);
      return;
    }

    // go to next KYC step
    router.replace('/kyc_cus_birthday');
  };

  if (priming) {
    // session is being rehydrated
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color="#C67C4E" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
      >
        <View style={styles.content}>
          <Text style={styles.header}>What should we call you?</Text>
          <TextInput
            style={styles.input}
            placeholder="Your full name"
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
          />

          <TouchableOpacity
            style={[
              styles.button,
              (!name.trim() || loading) && styles.buttonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!name.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>CONFIRM</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  wrapper: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#888',
    color: '#fff',
    fontSize: 18,
    paddingVertical: 8,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#C67C4E',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
