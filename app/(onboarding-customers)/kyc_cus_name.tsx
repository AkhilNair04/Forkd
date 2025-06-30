import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';

export default function KycCusName() {
  const [name, setName] = useState('');

  const handleConfirm = () => {
    // TODO: save name (AsyncStorage / context)
    router.push('/'); // adjust to next KYC route
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={styles.content}>
          <Text style={styles.header}>What should we call you?</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
          />

          <TouchableOpacity
            style={[styles.button, !name && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={!name.trim()}
          >
            <Text style={styles.buttonText}>CONFIRM</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#888',
    color: '#fff',
    fontSize: 18,
    paddingVertical: 8,
    marginBottom: 40,
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
