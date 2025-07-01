import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';

import { router } from 'expo-router';

const DeliveryAddressScreen = () => {
  const [address, setAddress] = useState('');
  const [street, setStreet] = useState('');
  const [postCode, setPostCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const handleEditLocation = () => {
    console.log('Navigating to map edit location screen...');
    Alert.alert("Feature Coming Soon", "This would open a map to pick your location.");
  };

  const handleSaveAddress = () => {
    if (!address || !street || !postCode || !city || !state) {
      Alert.alert("Missing Information", "Please fill in all address fields to confirm.");
      return;
    }

    console.log('Saving Address:', { address, street, postCode, city, state });

    Alert.alert(
      "Address Confirmed!",
      "Your delivery address has been saved.",
      [
        {
          text: "OK",
          onPress: () => {
            console.log('Address saved and proceeding to next step.');
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.fullScreen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Please Verify your location:</Text>
        </View>

        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <TouchableOpacity style={styles.editLocationButton} onPress={handleEditLocation}>
              <Text style={styles.editLocationButtonText}>Move to edit location</Text>
            </TouchableOpacity>
            <View style={styles.orangeDot}></View>
          </View>
        </View>

        <Text style={styles.inputLabel}>FULL ADDRESS (Street, City, State, Post Code)</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          placeholder="Enter full address here (e.g., 3235 Royal Ln, Mesa)"
          placeholderTextColor="#888"
          value={address}
          onChangeText={setAddress}
          multiline={true}
          numberOfLines={3}
        />

        <Text style={styles.inputLabel}>STREET</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Street Name"
          placeholderTextColor="#888"
          value={street}
          onChangeText={setStreet}
        />

        <Text style={styles.inputLabel}>POST CODE</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Post Code"
          placeholderTextColor="#888"
          value={postCode}
          onChangeText={setPostCode}
          keyboardType="numeric"
        />

        <View style={styles.rowInputsContainer}>
          <View style={styles.halfInputWrapper}>
            <Text style={styles.inputLabel}>CITY</Text>
            <TextInput
              style={styles.halfInput}
              placeholder="Enter City"
              placeholderTextColor="#888"
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={styles.halfInputWrapper}>
            <Text style={styles.inputLabel}>STATE</Text>
            <TextInput
              style={styles.halfInput}
              placeholder="Enter State"
              placeholderTextColor="#888"
              value={state}
              onChangeText={setState}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
          <Text style={styles.saveButtonText}>CONFIRM ADDRESS</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  mapContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholder: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  editLocationButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    position: 'absolute',
    bottom: 20,
  },
  editLocationButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  orangeDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'orange',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -10,
    marginLeft: -10,
  },
  inputLabel: {
    alignSelf: 'flex-start',
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 15,
    fontWeight: '500',
  },
  addressDisplayContainer: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressDisplayText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    width: '100%',
    marginBottom: 10,
  },
  rowInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  halfInputWrapper: {
    flex: 0.48,
  },
  halfInput: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#E67E22',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeliveryAddressScreen;
