import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { ReferralTestHelper } from '@/utils/ReferralTestHelper';

/**
 * Development component for testing referral system functionality
 * Add this to any page during development to test referral features
 */

interface ReferralTestButtonsProps {
  showTestButtons?: boolean; // Only show in development mode
}

export const ReferralTestButtons: React.FC<ReferralTestButtonsProps> = ({ 
  showTestButtons = __DEV__ // Only show in development build
}) => {
  if (!showTestButtons) return null;

  const handleSetupTestData = async () => {
    Alert.alert(
      'Setup Test Data',
      'This will create sample referral data for testing. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Setup',
          onPress: async () => {
            const success = await ReferralTestHelper.setupTestEnvironment();
            Alert.alert(
              success ? 'Success' : 'Error',
              success 
                ? 'Test data created! Check Settings > Referrals & Rewards' 
                : 'Failed to setup test data'
            );
          }
        }
      ]
    );
  };

  const handleSimulateReferral = async () => {
    Alert.alert(
      'Simulate Referral',
      'This will simulate someone using your referral code. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Simulate',
          onPress: async () => {
            const success = await ReferralTestHelper.simulateReferralProcess();
            Alert.alert(
              success ? 'Success' : 'Error',
              success 
                ? 'Referral simulated! Check your stats and rewards' 
                : 'Failed to simulate referral'
            );
          }
        }
      ]
    );
  };

  const handleClearData = async () => {
    Alert.alert(
      'Clear Test Data',
      'This will remove all referral data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            const success = await ReferralTestHelper.clearAllReferralData();
            Alert.alert(
              success ? 'Success' : 'Error',
              success ? 'All referral data cleared' : 'Failed to clear data'
            );
          }
        }
      ]
    );
  };

  const handleCheckStatus = async () => {
    const status = await ReferralTestHelper.getSystemStatus();
    if (status) {
      Alert.alert(
        'System Status',
        `User Code: ${status.userCode || 'None'}\nRewards: ${status.rewardsCount}\nStats: ${status.statsAvailable ? 'Available' : 'Not Available'}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Referral Test Controls</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSetupTestData}>
          <Text style={styles.buttonText}>Setup Test Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSimulateReferral}>
          <Text style={styles.buttonText}>Simulate Referral</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleClearData}>
          <Text style={styles.buttonText}>Clear Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCheckStatus}>
          <Text style={styles.buttonText}>Check Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 0.48,
  },
  dangerButton: {
    backgroundColor: '#FF4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

// Usage: Add this to any development page
// <ReferralTestButtons />
