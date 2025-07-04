// app/email-confirm.tsx
import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

export default function EmailConfirmScreen() {
  const router = useRouter()
  const [role, setRole] = useState<'customer' | 'chef' | null>(null)
  const [priming, setPriming] = useState(true)

  useEffect(() => {
    ;(async () => {
      const r = await AsyncStorage.getItem('userRole')
      if (r === 'chef' || r === 'customer') setRole(r)
      setPriming(false)
    })()
  }, [])

  const handleContinue = () => {
    if (role === 'chef') {
      router.replace('/(onboarding-chefs)/chef_kyc')
    } else {
      router.replace('/(onboarding-customers)/kyc_cus_name')
    }
  }

  if (priming) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#C67C4E" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Shall we get started?</Text>
        <Text style={styles.subtitle}>
          Let’s get your account personalized and set up!
        </Text>

        <TouchableOpacity
          style={[styles.button, !role && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!role}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#C67C4E',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
