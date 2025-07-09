import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
];

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  const handleContinue = () => {
    router.replace('/select-user');
  };

  const renderLanguageCard = ({ item }: { item: Language }) => (
    <TouchableOpacity
      style={[
        styles.languageCard,
        selectedLanguage === item.code && styles.selectedCard
      ]}
      onPress={() => setSelectedLanguage(item.code)}
    >
      <View style={styles.cardContent}>
        <View style={styles.flagContainer}>
          <Text style={styles.flag}>{item.flag}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[
            styles.languageName,
            selectedLanguage === item.code && styles.selectedText
          ]}>
            {item.name}
          </Text>
          <Text style={[
            styles.nativeName,
            selectedLanguage === item.code && styles.selectedNativeText
          ]}>
            {item.nativeName}
          </Text>
        </View>
        <View style={styles.checkContainer}>
          {selectedLanguage === item.code && (
            <Ionicons name="checkmark-circle" size={24} color="#C67C4E" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Language</Text>
        <Text style={styles.subtitle}>Select your preferred display language</Text>
      </View>

      <FlatList
        data={languages}
        renderItem={renderLanguageCard}
        keyExtractor={(item) => item.code}
        style={styles.languageList}
        showsVerticalScrollIndicator={false}
      />

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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    width: '100%',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  languageList: {
    flex: 1,
    marginBottom: 20,
  },
  languageCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#C67C4E',
    backgroundColor: '#2a1a0f',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  flagContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  flag: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  languageName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedText: {
    color: '#C67C4E',
  },
  nativeName: {
    color: '#999',
    fontSize: 14,
  },
  selectedNativeText: {
    color: '#D4A373',
  },
  checkContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#C67C4E',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
