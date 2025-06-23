import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  const handleContinue = () => {
    router.replace('/select-user');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your display language:</Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          style={styles.picker}
          dropdownIconColor="#C67C4E"
          mode="dropdown"
        >
          <Picker.Item label="English (default)" value="English" />
          <Picker.Item label="Hindi" value="Hindi" />
          <Picker.Item label="Malayalam" value="Malayalam" />
          <Picker.Item label="Tamil" value="Tamil" />
          <Picker.Item label="Kannada" value="Kannada" />
          <Picker.Item label="Telugu" value="Telugu" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
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
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  pickerWrapper: {
  borderWidth: 1,
  borderColor: '#C67C4E',
  borderRadius: 12,
  marginBottom: 30,
  backgroundColor: '#1a1a1a',
  width: 300, // Increased width to prevent text clipping
  ...Platform.select({
    android: {
      overflow: 'hidden',
    },
  }),
},
picker: {
  height: 55, // Slightly taller
  color: '#fff',
  width: '100%',
},
  button: {
    backgroundColor: '#C67C4E',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
