import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewReturningScreen() {
  const router = useRouter();

  const handlePress = async (type: 'new' | 'returning') => {
    // persist user type for this session
    await AsyncStorage.setItem('isNewUser', type === 'new' ? 'true' : 'false');
    // send them to OTP entry next
    router.replace('/signup');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress('new')}
      >
        <Text style={styles.buttonText}>I’m new here</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress('returning')}
      >
        <Text style={styles.buttonText}>I already have an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  button: {
    backgroundColor: '#C67C4E',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 20,
    marginVertical: 12,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
