import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/constants/supabase';
import { useRouter } from 'expo-router';

interface ChefProfile {
  name: string;
  bio: string;
  rating_avg: number;
  cuisine: string;
  specialties: string[];
  price_per_hour: number;
  experience_level: string;
  avatar: string;
}

export default function ChefProfileScreen() {
  const router = useRouter();
  const [chef, setChef] = useState<ChefProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchChefProfile();
  }, []);

  const fetchChefProfile = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) throw new Error('User not found');

      const { data, error } = await supabase
        .from('Chef')
        .select('*')
        .eq('uid', userData.user.id)
        .single();

      if (error) throw error;

      setChef({
        name: data.name || 'Unnamed Chef',
        bio: data.bio || '',
        rating_avg: data.rating_avg || 0,
        cuisine: data.cuisine || 'Various',
        specialties: data.specialties || [],
        price_per_hour: data.price_per_hour || 0,
        experience_level: data.experience_level || 'Unknown',
        avatar: `https://ui-avatars.com/api/?name=${data.name || 'Chef'}&background=482E1D&color=fff`,
      });
    } catch (err: any) {
      console.error('Error fetching chef profile:', err.message);
      Alert.alert('Error', 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/(auth)/welcome-screen');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#C67C4E" />
      </View>
    );
  }

  if (!chef) return null;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Profile</Text>
            <TouchableOpacity>
              <Feather name="settings" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <Image source={{ uri: chef.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{chef.name}</Text>
            <Text style={styles.bio}>{chef.bio}</Text>
            <Text style={styles.cuisine}>Cuisine: {chef.cuisine}</Text>
            <Text style={styles.rating}>⭐ {chef.rating_avg.toFixed(1)} Rating</Text>
            <Text style={styles.detail}>Experience: {chef.experience_level}</Text>
            <Text style={styles.detail}>Specialties: {chef.specialties.join(', ') || 'None'}</Text>
            <Text style={styles.detail}>Hourly Rate: ₹{chef.price_per_hour}</Text>
          </View>

          {/* Placeholder cards */}
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>My Orders (Coming Soon)</Text>
          </View>
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>Reviews & Ratings (Coming Soon)</Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setShowLogoutModal(true)}
          >
            <Feather name="log-out" size={20} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* Logout Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Feather name="log-out" size={24} color="#ff4444" />
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
              >
                <Text style={styles.confirmText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  profileCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  bio: { color: '#aaa', fontSize: 14, marginVertical: 6, textAlign: 'center' },
  rating: { color: '#C67C4E', fontSize: 16, marginVertical: 4 },
  cuisine: { color: '#fff', fontSize: 14, marginVertical: 2 },
  detail: { color: '#ccc', fontSize: 13, marginTop: 2 },
  placeholderCard: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  placeholderText: { color: '#888', fontSize: 15, textAlign: 'center' },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  modalMessage: { color: '#aaa', fontSize: 14, textAlign: 'center' },
  modalActions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16,
  },
  cancelBtn: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelText: { color: '#fff', fontWeight: '600' },
  confirmBtn: {
    backgroundColor: '#ff4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  confirmText: { color: '#fff', fontWeight: '600' },
});
