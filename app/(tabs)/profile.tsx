import { getCurrentUserProfile, supabase, updateUserProfile } from '@/lib/supabase';
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  userType: 'customer' | 'chef';
  avatar: string;
  location: string;
  joinDate: string;
  bio?: string;
}

interface UserStats {
  totalOrders: number;
  favoriteChefs: number;
  savedDishes: number;
  totalSpent: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Profile completion form data
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    location: '',
    user_type: 'customer',
    bio: ''
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    userType: 'customer',
    avatar: 'https://ui-avatars.com/api/?name=User&background=666&color=fff&size=256',
    location: '',
    joinDate: '',
    bio: ''
  });

  const [userStats, setUserStats] = useState<UserStats>({
    totalOrders: 42,
    favoriteChefs: 8,
    savedDishes: 25,
    totalSpent: 12500
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      const userProfileData = await getCurrentUserProfile();
      if (userProfileData && userProfileData.profile) {
        const profile = userProfileData.profile;
        const user = userProfileData;
        
        // Check if profile needs completion
        if (!profile.full_name || !profile.location || !profile.user_type) {
          setProfileForm({
            full_name: profile.full_name || '',
            location: profile.location || '',
            user_type: profile.user_type || 'customer',
            bio: profile.bio || ''
          });
          setShowProfileModal(true);
        }
        
        setUserProfile({
          name: profile.full_name || 'Complete your profile',
          email: user.email || '',
          phone: profile.phone || user.phone || '',
          userType: profile.user_type || 'customer',
          avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'User')}&background=C67C4E&color=fff&size=256`,
          location: profile.location || '',
          joinDate: new Date(user.created_at).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          }),
          bio: profile.bio || ''
        });

        // Store user data in AsyncStorage for other parts of the app
        await AsyncStorage.setItem('userProfile', JSON.stringify({
          name: profile.full_name,
          email: user.email,
          userType: profile.user_type,
          location: profile.location
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log('Logout button pressed'); // Debug log
    
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear all user-related data
      await AsyncStorage.multiRemove([
        'isLoggedIn',
        'userProfile',
        'userId',
        'userType',
        'phoneForOTP',
        'expoPushToken'
      ]);
      
      console.log('User data cleared'); // Debug log
      
      // Navigate back to welcome screen
      router.replace('/(auth)/welcome-screen');
      console.log('Navigation triggered'); // Debug log
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, still navigate away
      router.replace('/(auth)/welcome-screen');
    }
  };

  const handleSaveProfile = async () => {
    if (!profileForm.full_name.trim()) {
      Alert.alert('Missing Information', 'Please enter your name');
      return;
    }

    if (!profileForm.location) {
      Alert.alert('Missing Information', 'Please select your location');
      return;
    }

    setSaving(true);
    try {
      const { error } = await updateUserProfile(profileForm);

      if (error) {
        Alert.alert('Error', 'Failed to save profile. Please try again.');
        return;
      }

      setShowProfileModal(false);
      loadUserProfile(); // Reload profile data
      Alert.alert('Success', 'Your profile has been updated!');
    } catch (error) {
      console.error('Profile save error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutWithConfirmation = () => {
    console.log('Logout with confirmation button pressed'); // Debug log
    setShowLogoutModal(true);
  };

  const handleProfileUpdate = async () => {
    setSaving(true);
    try {
      // Upsert to user_profiles table, using updateUserProfile helper
      const { error } = await updateUserProfile({
        full_name: profileForm.full_name,
        location: profileForm.location,
        user_type: profileForm.user_type === 'chef' ? 'chef' : 'customer',
        bio: profileForm.bio
      });

      if (error) throw error;

      // Update local user profile state
      setUserProfile(prev => ({
        ...prev,
        name: profileForm.full_name,
        location: profileForm.location,
        userType: profileForm.user_type === 'chef' ? 'chef' : 'customer',
        bio: profileForm.bio,
      }));

      // Save to AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify({
        ...userProfile,
        name: profileForm.full_name,
        location: profileForm.location,
        userType: profileForm.user_type,
        bio: profileForm.bio,
      }));

      // Close the modal and reload profile data
      setShowProfileModal(false);
      loadUserProfile(); // Reload profile data
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'There was an error updating your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const StatCard = ({ icon, value, label }: { icon: string, value: string | number, label: string }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon as any} size={24} color="#C67C4E" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuOption = ({ icon, title, subtitle, onPress, showArrow = true }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIconContainer}>
          <Feather name={icon as any} size={20} color="#C67C4E" />
        </View>
        <View>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && <Feather name="chevron-right" size={20} color="#666" />}
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#C67C4E" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Profile</Text>
              <TouchableOpacity onPress={() => router.push('/settings-demo')}>
                <Feather name="settings" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Profile Card */}
            <View style={styles.profileCard}>
              <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{userProfile.name}</Text>
                <Text style={styles.userType}>
                  {userProfile.userType === 'customer' ? '👤 Customer' : '👨‍🍳 Chef'}
                </Text>
                {userProfile.location && (
                  <Text style={styles.userLocation}>📍 {userProfile.location}</Text>
                )}
                <Text style={styles.joinDate}>Member since {userProfile.joinDate}</Text>
                {userProfile.bio && (
                  <Text style={styles.userBio}>{userProfile.bio}</Text>
                )}
              </View>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setShowProfileModal(true)}
              >
                <Feather name="edit-2" size={18} color="#C67C4E" />
              </TouchableOpacity>
            </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            <View style={styles.statsGrid}>
              <StatCard icon="restaurant" value={userStats.totalOrders} label="Orders" />
              <StatCard icon="heart" value={userStats.favoriteChefs} label="Fav Chefs" />
              <StatCard icon="bookmark" value={userStats.savedDishes} label="Saved Dishes" />
              <StatCard icon="wallet" value={`₹${userStats.totalSpent.toLocaleString()}`} label="Total Spent" />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.menuContainer}>
              <MenuOption
                icon="heart"
                title="Favorites"
                subtitle="Your saved chefs and dishes"
                onPress={() => router.push('/favorites')}
              />
              <MenuOption
                icon="clock"
                title="Order History"
                subtitle="View your past orders"
                onPress={() => Alert.alert('Coming Soon', 'Order history feature will be available soon!')}
              />
              <MenuOption
                icon="message-circle"
                title="Messages"
                subtitle="Chat with your chefs"
                onPress={() => router.push('/chat')}
              />
            </View>
          </View>

          {/* Settings & Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings & Support</Text>
            <View style={styles.menuContainer}>
              <MenuOption
                icon="user"
                title="Account Settings"
                subtitle="Edit profile and preferences"
                onPress={() => router.push('/customer-settings/settings')}
              />
              <MenuOption
                icon="bell"
                title="Notifications"
                subtitle="Manage notification preferences"
                onPress={() => router.push('/notification-demo')}
              />
              <MenuOption
                icon="shield"
                title="Privacy & Security"
                subtitle="Manage your privacy settings"
                onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon!')}
              />
              <MenuOption
                icon="help-circle"
                title="Help & Support"
                subtitle="Get help and contact support"
                onPress={() => router.push('/customer-settings/support')}
              />
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => {
              console.log('Logout with confirmation button pressed!');
              handleLogoutWithConfirmation();
            }}
            activeOpacity={0.7}
          >
            <Feather name="log-out" size={20} color="#ff4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
        )}
      </SafeAreaView>

      {/* Profile Completion Modal */}
      <Modal
        visible={showProfileModal}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModalContainer}>
            <View style={styles.modalHeader}>
              <Feather name="user" size={24} color="#C67C4E" />
              <Text style={styles.modalTitle}>Complete Your Profile</Text>
            </View>
            
            <ScrollView style={styles.profileModalContent}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter your full name"
                  placeholderTextColor="#666"
                  value={profileForm.full_name}
                  onChangeText={(text) => setProfileForm(prev => ({ ...prev, full_name: text }))}
                />
              </View>

              {/* User Type */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>I am a *</Text>
                <View style={styles.userTypeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.userTypeButton,
                      profileForm.user_type === 'customer' && styles.userTypeButtonSelected
                    ]}
                    onPress={() => setProfileForm(prev => ({ ...prev, user_type: 'customer' }))}
                  >
                    <Ionicons 
                      name="person" 
                      size={20} 
                      color={profileForm.user_type === 'customer' ? '#C67C4E' : '#666'} 
                    />
                    <Text style={[
                      styles.userTypeText,
                      profileForm.user_type === 'customer' && styles.userTypeTextSelected
                    ]}>
                      Customer
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.userTypeButton,
                      profileForm.user_type === 'chef' && styles.userTypeButtonSelected
                    ]}
                    onPress={() => setProfileForm(prev => ({ ...prev, user_type: 'chef' }))}
                  >
                    <Ionicons 
                      name="restaurant" 
                      size={20} 
                      color={profileForm.user_type === 'chef' ? '#C67C4E' : '#666'} 
                    />
                    <Text style={[
                      styles.userTypeText,
                      profileForm.user_type === 'chef' && styles.userTypeTextSelected
                    ]}>
                      Chef
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter your city, state"
                  placeholderTextColor="#666"
                  value={profileForm.location}
                  onChangeText={(text) => setProfileForm(prev => ({ ...prev, location: text }))}
                />
              </View>

              {/* Bio */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio (Optional)</Text>
                <TextInput
                  style={[styles.modalInput, styles.bioInput]}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={3}
                  value={profileForm.bio}
                  onChangeText={(text) => setProfileForm(prev => ({ ...prev, bio: text }))}
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>Save Profile</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Feather name="log-out" size={24} color="#ff4444" />
              <Text style={styles.modalTitle}>Logout</Text>
            </View>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  console.log('Logout cancelled');
                  setShowLogoutModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalLogoutButton}
                onPress={() => {
                  console.log('Logout confirmed via modal');
                  setShowLogoutModal(false);
                  handleLogout();
                }}
              >
                <Text style={styles.modalLogoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Profile Completion Modal */}
      <Modal
        visible={showProfileModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Complete Your Profile</Text>
            <Text style={styles.modalMessage}>Please fill in the details below:</Text>

            {/* Profile Form */}
            <View style={styles.profileForm}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#666"
                value={profileForm.full_name}
                onChangeText={text => setProfileForm({ ...profileForm, full_name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor="#666"
                value={profileForm.location}
                onChangeText={text => setProfileForm({ ...profileForm, location: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Bio"
                placeholderTextColor="#666"
                value={profileForm.bio}
                onChangeText={text => setProfileForm({ ...profileForm, bio: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Loading Indicator */}
            {saving ? (
              <ActivityIndicator size="small" color="#C67C4E" style={styles.loadingIndicator} />
            ) : (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleProfileUpdate}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowProfileModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileCard: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: '#C67C4E',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: '#999',
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 12,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 12,
  },
  section: {
    marginBottom: 24,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ff4444',
    minHeight: 50, // Ensure minimum touch area
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Legacy styles (keeping for compatibility)
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C67C4E',
    textAlign: 'center',
  },
  subtext: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  settingsButton: {
    backgroundColor: '#C67C4E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  customerSettingsButton: {
    backgroundColor: '#b87a51',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  notificationButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 40,
    width: '80%',
    maxWidth: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalLogoutButton: {
    flex: 1,
    backgroundColor: '#ff4444',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalLogoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Profile completion modal styles
  profileForm: {
    marginTop: 16,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  loadingIndicator: {
    marginVertical: 16,
  },
  saveButton: {
    backgroundColor: '#C67C4E',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCloseButton: {
    backgroundColor: '#2a2a2a',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
  },
  // User bio style
  userBio: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Profile modal styles
  profileModalContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    margin: 20,
    maxHeight: '80%',
    padding: 0,
    overflow: 'hidden',
  },
  profileModalContent: {
    maxHeight: 400,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  userTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  userTypeButtonSelected: {
    borderColor: '#C67C4E',
    backgroundColor: '#C67C4E20',
  },
  userTypeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  userTypeTextSelected: {
    color: '#C67C4E',
  },
  modalSaveButton: {
    backgroundColor: '#C67C4E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    margin: 20,
    marginTop: 0,
  },
  modalSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
