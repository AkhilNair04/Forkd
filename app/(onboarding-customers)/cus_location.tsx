import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';

export default function KycLocation() {
  // ask permission and navigate
  const handleAccess = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Location permission is required to continue.'
        );
        return;
      }
      // you now have permission
      // TODO: store permission state if needed
      router.push('/(tabs)'); // adjust to your next route
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not request permission.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Image
          source={require('../../assets/images/location.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <TouchableOpacity style={styles.button} onPress={handleAccess}>
          <Text style={styles.buttonText}>ACCESS LOCATION</Text>
          <Image
            source={require('../../assets/images/location.png')}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>

        <Text style={styles.note}>
          FORK’D WILL ACCESS YOUR LOCATION{'\n'}ONLY WHILE USING THE APP
        </Text>
      </View>
    </SafeAreaView>
  );
}

const BUTTON_HEIGHT = 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C67C4E',
    borderRadius: BUTTON_HEIGHT / 2,
    height: BUTTON_HEIGHT,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginLeft: 12,
    tintColor: '#fff',
  },
  note: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
