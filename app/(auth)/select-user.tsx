// app/select-user.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SelectUserScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'chef' | null>(null);

  const handleRoleSelect = async (role: 'customer' | 'chef') => {
    setSelectedRole(role);
    await AsyncStorage.setItem('userRole', role);
  };

  const handleContinue = () => {
    if (!selectedRole) return;
    router.replace('/newreturning');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are a…</Text>

      <TouchableOpacity
        style={[styles.button, selectedRole === 'customer' && styles.buttonSelected]}
        onPress={() => handleRoleSelect('customer')}
      >
        <Text style={styles.buttonText}>Customer</Text>
        {selectedRole === 'customer' && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color="#fff"
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selectedRole === 'chef' && styles.buttonSelected]}
        onPress={() => handleRoleSelect('chef')}
      >
        <Text style={styles.buttonText}>Chef</Text>
        {selectedRole === 'chef' && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color="#fff"
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.arrowButton, !selectedRole && styles.arrowButtonDisabled]}
        onPress={handleContinue}
        disabled={!selectedRole}
      >
        <Ionicons name="arrow-forward" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#C67C4E',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 20,
    marginVertical: 12,
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSelected: {
    opacity: 0.9,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 12,
  },
  arrowButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 16,
  },
  arrowButtonDisabled: {
    opacity: 0.4,
  },
});
