import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

const PRIMARY = '#b87a51';
const BG = '#111';
const CARD = '#444';

export default function UserSettingsScreen() {
  const router = useRouter();
  
  // Personal Data Settings
  const [dataSettings, setDataSettings] = useState({
    shareLocation: true,
    shareActivityStatus: false,
    allowDataCollection: true,
    shareReviews: true,
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
    orderUpdates: true,
    chefMessages: true,
    promotions: false,
    weeklyDigest: true,
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public', // 'public', 'friends', 'private'
    showRealName: true,
    showContactInfo: false,
    allowChefContact: true,
  });

  const handleDataToggle = (key: keyof typeof dataSettings) => {
    setDataSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyToggle = (key: keyof typeof privacy) => {
    if (key === 'profileVisibility') return; // Handle separately
    setPrivacy(prev => ({ ...prev, [key]: !prev[key as Exclude<keyof typeof privacy, 'profileVisibility'>] }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Your data export will be sent to your email within 24 hours.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerText}>User Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Personal Data Management */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal Data Management</Text>
          
          <SettingToggleItem
            title="Share Location"
            subtitle="Allow location sharing for better chef recommendations"
            value={dataSettings.shareLocation}
            onToggle={() => handleDataToggle('shareLocation')}
            icon="map-pin"
          />
          
          <SettingToggleItem
            title="Activity Status"
            subtitle="Show when you're active on the platform"
            value={dataSettings.shareActivityStatus}
            onToggle={() => handleDataToggle('shareActivityStatus')}
            icon="activity"
          />
          
          <SettingToggleItem
            title="Data Collection"
            subtitle="Allow data collection for improved experience"
            value={dataSettings.allowDataCollection}
            onToggle={() => handleDataToggle('allowDataCollection')}
            icon="database"
          />
          
          <SettingToggleItem
            title="Share Reviews"
            subtitle="Make your reviews visible to other users"
            value={dataSettings.shareReviews}
            onToggle={() => handleDataToggle('shareReviews')}
            icon="star"
            isLast
          />
        </View>

        {/* Dietary Tags Management */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Dietary Tags & Preferences</Text>
          
          <SettingNavItem
            title="Manage Dietary Restrictions"
            subtitle="Update your dietary preferences and allergies"
            icon="heart"
            onPress={() => router.push('/customer-settings/eating-preferences')}
          />
          
          <SettingNavItem
            title="Allergen Alerts"
            subtitle="Get notified about potential allergens"
            icon="alert-triangle"
            onPress={() => console.log('Allergen alerts')}
            isLast
          />
        </View>

        {/* Notification Preferences */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          
          <SettingToggleItem
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            value={notifications.pushNotifications}
            onToggle={() => handleNotificationToggle('pushNotifications')}
            icon="bell"
          />
          
          <SettingToggleItem
            title="Email Notifications"
            subtitle="Receive updates via email"
            value={notifications.emailNotifications}
            onToggle={() => handleNotificationToggle('emailNotifications')}
            icon="mail"
          />
          
          <SettingToggleItem
            title="Order Updates"
            subtitle="Get notified about order status changes"
            value={notifications.orderUpdates}
            onToggle={() => handleNotificationToggle('orderUpdates')}
            icon="package"
          />
          
          <SettingToggleItem
            title="Chef Messages"
            subtitle="Receive messages from chefs"
            value={notifications.chefMessages}
            onToggle={() => handleNotificationToggle('chefMessages')}
            icon="message-circle"
          />
          
          <SettingToggleItem
            title="Promotions"
            subtitle="Receive promotional offers and deals"
            value={notifications.promotions}
            onToggle={() => handleNotificationToggle('promotions')}
            icon="tag"
            isLast
          />
        </View>

        {/* Privacy & Security */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          
          <SettingToggleItem
            title="Show Real Name"
            subtitle="Display your real name in profile"
            value={privacy.showRealName}
            onToggle={() => handlePrivacyToggle('showRealName')}
            icon="user"
          />
          
          <SettingToggleItem
            title="Allow Chef Contact"
            subtitle="Let chefs contact you directly"
            value={privacy.allowChefContact}
            onToggle={() => handlePrivacyToggle('allowChefContact')}
            icon="phone"
          />
          
          <SettingNavItem
            title="Change Password"
            subtitle="Update your account password"
            icon="lock"
            onPress={() => console.log('Change password')}
          />
          
          <SettingNavItem
            title="Two-Factor Authentication"
            subtitle="Add extra security to your account"
            icon="shield"
            onPress={() => console.log('2FA setup')}
            isLast
          />
        </View>

        {/* Data Management */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <SettingNavItem
            title="Export My Data"
            subtitle="Download a copy of your data"
            icon="download"
            onPress={handleExportData}
          />
          
          <SettingNavItem
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            icon="trash-2"
            onPress={handleDeleteAccount}
            isLast
            isDanger
          />
        </View>

        {/* App Preferences */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <SettingNavItem
            title="Language & Region"
            subtitle="Change app language and region settings"
            icon="globe"
            onPress={() => console.log('Language settings')}
          />
          
          <SettingNavItem
            title="Currency"
            subtitle="Set your preferred currency"
            icon="dollar-sign"
            onPress={() => console.log('Currency settings')}
          />
          
          <SettingNavItem
            title="Accessibility"
            subtitle="Adjust app accessibility features"
            icon="eye"
            onPress={() => console.log('Accessibility settings')}
            isLast
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable Components
interface SettingToggleItemProps {
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
  icon: string;
  isLast?: boolean;
}

const SettingToggleItem: React.FC<SettingToggleItemProps> = ({
  title,
  subtitle,
  value,
  onToggle,
  icon,
  isLast = false,
}) => (
  <View style={[styles.settingItem, isLast && styles.lastItem]}>
    <View style={styles.settingContent}>
      <Feather name={icon as any} size={20} color="#fff" style={styles.settingIcon} />
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      thumbColor={value ? PRIMARY : '#ccc'}
      trackColor={{ false: '#555', true: PRIMARY + '50' }}
    />
  </View>
);

interface SettingNavItemProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
  isLast?: boolean;
  isDanger?: boolean;
}

const SettingNavItem: React.FC<SettingNavItemProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  isLast = false,
  isDanger = false,
}) => (
  <TouchableOpacity
    style={[styles.settingItem, isLast && styles.lastItem]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.settingContent}>
      <Feather 
        name={icon as any} 
        size={20} 
        color={isDanger ? '#ff4444' : '#fff'} 
        style={styles.settingIcon} 
      />
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, isDanger && styles.dangerText]}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <Feather name="chevron-right" size={20} color="#bbb" />
  </TouchableOpacity>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    marginBottom: 20,
    padding: 4,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  lastItem: {
    borderBottomWidth: 0,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    color: '#bbb',
    fontSize: 14,
  },
  dangerText: {
    color: '#ff4444',
  },
});
