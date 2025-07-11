import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // 'public', 'friends', 'private'
    showRealName: true,
    showContactInfo: false,
    allowChefContact: true,
    shareLocation: true,
    shareActivityStatus: false,
    allowDataCollection: true,
    shareReviews: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    biometricLogin: false,
    loginNotifications: true,
    autoLogout: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedPrivacy = await AsyncStorage.getItem('privacySettings');
      const savedSecurity = await AsyncStorage.getItem('securitySettings');
      
      if (savedPrivacy) {
        setPrivacySettings(JSON.parse(savedPrivacy));
      }
      if (savedSecurity) {
        setSecuritySettings(JSON.parse(savedSecurity));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      await AsyncStorage.setItem('privacySettings', JSON.stringify(privacySettings));
      await AsyncStorage.setItem('securitySettings', JSON.stringify(securitySettings));
      Alert.alert('Success', 'Your privacy and security settings have been saved!');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyToggle = (key: keyof typeof privacySettings) => {
    if (key === 'profileVisibility') return; // Handle separately
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key as Exclude<keyof typeof privacySettings, 'profileVisibility'>] }));
  };

  const handleSecurityToggle = (key: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileVisibilityChange = () => {
    const options = ['Public', 'Friends Only', 'Private'];
    const currentIndex = options.findIndex(option => 
      option.toLowerCase().replace(' only', '').replace(' ', '') === privacySettings.profileVisibility
    );
    
    Alert.alert(
      'Profile Visibility',
      'Who can see your profile?',
      options.map((option, index) => ({
        text: option + (index === currentIndex ? ' ✓' : ''),
        onPress: () => {
          const value = option.toLowerCase().replace(' only', '').replace(' ', '') as 'public' | 'friends' | 'private';
          setPrivacySettings(prev => ({ ...prev, profileVisibility: value }));
        }
      }))
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Account', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Account Deletion', 'Please contact support to delete your account.');
          }
        }
      ]
    );
  };

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'We will prepare your data export and send it to your registered email within 24-48 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Request Export', onPress: () => console.log('Data export requested') }
      ]
    );
  };

  const SettingToggleItem = ({ 
    title, 
    subtitle, 
    value, 
    onToggle, 
    icon 
  }: { 
    title: string; 
    subtitle: string; 
    value: boolean; 
    onToggle: () => void; 
    icon: string;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Feather name={icon as any} size={20} color="#C67C4E" style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        thumbColor={value ? '#C67C4E' : '#ccc'}
        trackColor={{ false: '#555', true: '#C67C4E50' }}
      />
    </View>
  );

  const SettingNavItem = ({ 
    title, 
    subtitle, 
    icon, 
    onPress, 
    value 
  }: { 
    title: string; 
    subtitle: string; 
    icon: string; 
    onPress: () => void; 
    value?: string;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingContent}>
        <Feather name={icon as any} size={20} color="#C67C4E" style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        {value && <Text style={styles.valueText}>{value}</Text>}
        <Feather name="chevron-right" size={20} color="#bbb" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveSettings}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Privacy Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          
          <SettingNavItem
            title="Profile Visibility"
            subtitle="Control who can see your profile"
            icon="eye"
            onPress={handleProfileVisibilityChange}
            value={privacySettings.profileVisibility.charAt(0).toUpperCase() + privacySettings.profileVisibility.slice(1)}
          />

          <SettingToggleItem
            title="Show Real Name"
            subtitle="Display your real name on your profile"
            value={privacySettings.showRealName}
            onToggle={() => handlePrivacyToggle('showRealName')}
            icon="user"
          />

          <SettingToggleItem
            title="Show Contact Information"
            subtitle="Allow others to see your contact details"
            value={privacySettings.showContactInfo}
            onToggle={() => handlePrivacyToggle('showContactInfo')}
            icon="phone"
          />

          <SettingToggleItem
            title="Allow Chef Contact"
            subtitle="Let chefs message you directly"
            value={privacySettings.allowChefContact}
            onToggle={() => handlePrivacyToggle('allowChefContact')}
            icon="message-circle"
          />
        </View>

        {/* Data & Activity */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Data & Activity</Text>
          
          <SettingToggleItem
            title="Share Location"
            subtitle="Help us find nearby chefs and delivery options"
            value={privacySettings.shareLocation}
            onToggle={() => handlePrivacyToggle('shareLocation')}
            icon="map-pin"
          />

          <SettingToggleItem
            title="Share Activity Status"
            subtitle="Show when you're active on the app"
            value={privacySettings.shareActivityStatus}
            onToggle={() => handlePrivacyToggle('shareActivityStatus')}
            icon="activity"
          />

          <SettingToggleItem
            title="Allow Data Collection"
            subtitle="Help improve our services with usage data"
            value={privacySettings.allowDataCollection}
            onToggle={() => handlePrivacyToggle('allowDataCollection')}
            icon="bar-chart-2"
          />

          <SettingToggleItem
            title="Share Reviews Publicly"
            subtitle="Make your reviews visible to other users"
            value={privacySettings.shareReviews}
            onToggle={() => handlePrivacyToggle('shareReviews')}
            icon="star"
          />
        </View>

        {/* Security Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          
          <SettingToggleItem
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security to your account"
            value={securitySettings.twoFactorAuth}
            onToggle={() => handleSecurityToggle('twoFactorAuth')}
            icon="shield"
          />

          <SettingToggleItem
            title="Biometric Login"
            subtitle="Use fingerprint or face recognition to log in"
            value={securitySettings.biometricLogin}
            onToggle={() => handleSecurityToggle('biometricLogin')}
            icon="lock"
          />

          <SettingToggleItem
            title="Login Notifications"
            subtitle="Get notified when someone logs into your account"
            value={securitySettings.loginNotifications}
            onToggle={() => handleSecurityToggle('loginNotifications')}
            icon="bell"
          />

          <SettingToggleItem
            title="Auto Logout"
            subtitle="Automatically log out after periods of inactivity"
            value={securitySettings.autoLogout}
            onToggle={() => handleSecurityToggle('autoLogout')}
            icon="log-out"
          />
        </View>

        {/* Data Management */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.dataAction} onPress={handleDataExport}>
            <View style={styles.dataActionContent}>
              <Feather name="download" size={20} color="#C67C4E" />
              <View style={styles.dataActionText}>
                <Text style={styles.dataActionTitle}>Export My Data</Text>
                <Text style={styles.dataActionSubtitle}>Download a copy of your data</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#bbb" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.dataAction} onPress={handleDeleteAccount}>
            <View style={styles.dataActionContent}>
              <Feather name="trash-2" size={20} color="#ff4444" />
              <View style={styles.dataActionText}>
                <Text style={[styles.dataActionTitle, { color: '#ff4444' }]}>Delete Account</Text>
                <Text style={styles.dataActionSubtitle}>Permanently delete your account</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#bbb" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginRight: 50,
  },
  saveButton: {
    backgroundColor: '#C67C4E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginBottom: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    color: '#C67C4E',
    marginRight: 8,
  },
  dataAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  dataActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dataActionText: {
    marginLeft: 12,
    flex: 1,
  },
  dataActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  dataActionSubtitle: {
    fontSize: 14,
    color: '#999',
  },
});
