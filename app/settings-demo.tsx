import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#C67C4E';
const BG = '#111';
const CARD = '#444';

export default function SettingsDemo() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'Customer' | 'Chef'>('Customer');

  const handleRoleSwitch = async (role: 'Customer' | 'Chef') => {
    setUserRole(role);
    await AsyncStorage.setItem('userRole', role);
    Alert.alert(
      'Role Switched',
      `You are now viewing as a ${role}. Settings will be tailored for ${role.toLowerCase()}s.`,
      [{ text: 'OK' }]
    );
  };

  const navigateToSettings = () => {
    if (userRole === 'Customer') {
      router.push('/customer-settings/user-settings');
    } else {
      router.push('/chef-settings/chef-settings');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings Demo</Text>
      </View>

      <View style={styles.content}>
        {/* Role Selector */}
        <View style={styles.roleSelector}>
          <Text style={styles.roleSelectorTitle}>Select Your Role:</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                userRole === 'Customer' && styles.roleButtonActive
              ]}
              onPress={() => handleRoleSwitch('Customer')}
            >
              <Feather name="user" size={24} color={userRole === 'Customer' ? '#fff' : '#888'} />
              <Text style={[
                styles.roleButtonText,
                userRole === 'Customer' && styles.roleButtonTextActive
              ]}>Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                userRole === 'Chef' && styles.roleButtonActive
              ]}
              onPress={() => handleRoleSwitch('Chef')}
            >
              <MaterialCommunityIcons 
                name="chef-hat" 
                size={24} 
                color={userRole === 'Chef' ? '#fff' : '#888'} 
              />
              <Text style={[
                styles.roleButtonText,
                userRole === 'Chef' && styles.roleButtonTextActive
              ]}>Chef</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Preview */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>
              {userRole === 'Customer' ? '👥 User Settings' : '👨‍🍳 Chef Settings'}
            </Text>
            <Text style={styles.previewSubtitle}>
              {userRole === 'Customer' 
                ? 'Manage personal data, dietary preferences, and notifications'
                : 'Control availability, dish visibility, and business settings'
              }
            </Text>
          </View>

          {/* Feature List */}
          <View style={styles.featureList}>
            {userRole === 'Customer' ? (
              <>
                <FeatureItem icon="shield" title="Personal Data Management" />
                <FeatureItem icon="heart" title="Dietary Tags & Preferences" />
                <FeatureItem icon="bell" title="Notification Preferences" />
                <FeatureItem icon="lock" title="Privacy & Security" />
                <FeatureItem icon="database" title="Data Management" />
                <FeatureItem icon="globe" title="App Preferences" />
              </>
            ) : (
              <>
                <FeatureItem icon="clock" title="Availability Management" />
                <FeatureItem icon="eye" title="Dish Visibility Control" />
                <FeatureItem icon="edit" title="Content Management" />
                <FeatureItem icon="credit-card" title="Business & Payment Settings" />
                <FeatureItem icon="bar-chart-2" title="Analytics & Performance" />
                <FeatureItem icon="settings" title="Account Management" />
              </>
            )}
          </View>

          {/* Open Settings Button */}
          <TouchableOpacity
            style={styles.openSettingsButton}
            onPress={navigateToSettings}
          >
            <Text style={styles.openSettingsText}>
              Open {userRole} Settings
            </Text>
            <Feather name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.infoCard}>
          <Feather name="info" size={20} color={PRIMARY} />
          <Text style={styles.infoText}>
            Switch between Customer and Chef roles to see different settings options.
            Each role has tailored features for their specific needs.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title }) => (
  <View style={styles.featureItem}>
    <Feather name={icon as any} size={16} color="#bbb" />
    <Text style={styles.featureItemText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 14,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 7,
    marginRight: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  headerText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  roleSelector: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  roleSelectorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleButtonActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  roleButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  previewCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  previewHeader: {
    marginBottom: 20,
  },
  previewTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewSubtitle: {
    color: '#bbb',
    fontSize: 14,
    lineHeight: 20,
  },
  featureList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureItemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  openSettingsButton: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openSettingsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  infoCard: {
    backgroundColor: PRIMARY + '20',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PRIMARY + '40',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
});
