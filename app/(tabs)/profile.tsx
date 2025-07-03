import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  userType: "customer" | "chef";
  avatar: string;
  location: string;
  joinDate: string;
}

interface UserStats {
  totalOrders: number;
  favoriteChefs: number;
  savedDishes: number;
  totalSpent: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    userType: "customer",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    location: "Mumbai, Maharashtra",
    joinDate: "January 2024",
  });

  const [userStats, setUserStats] = useState<UserStats>({
    totalOrders: 42,
    favoriteChefs: 8,
    savedDishes: 25,
    totalSpent: 12500,
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // In a real app, load from AsyncStorage or API
      const savedProfile = await AsyncStorage.getItem("userProfile");
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleLogout = async () => {
    console.log("Logout button pressed"); // Debug log

    try {
      // Clear all user-related data
      await AsyncStorage.multiRemove([
        "isLoggedIn",
        "userProfile",
        "userId",
        "userType",
        "phoneForOTP",
        "expoPushToken",
      ]);

      console.log("User data cleared"); // Debug log

      // Navigate back to welcome screen
      router.replace("/(auth)/welcome-screen");
      console.log("Navigation triggered"); // Debug log
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, still navigate away
      router.replace("/(auth)/welcome-screen");
    }
  };

  const handleLogoutWithConfirmation = () => {
    console.log("Logout with confirmation button pressed"); // Debug log
    setShowLogoutModal(true);
  };

  const StatCard = ({
    icon,
    value,
    label,
  }: {
    icon: string;
    value: string | number;
    label: string;
  }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon as any} size={24} color="#C67C4E" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuOption = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
  }: {
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={() => router.push("/settings-demo")}>
              <Feather name="settings" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userProfile.name}</Text>
              <Text style={styles.userType}>
                {userProfile.userType === "customer"
                  ? "👤 Customer"
                  : "👨‍🍳 Chef"}
              </Text>
              <Text style={styles.userLocation}>📍 {userProfile.location}</Text>
              <Text style={styles.joinDate}>
                Member since {userProfile.joinDate}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push("/customer-settings/customer-profile")}
            >
              <Feather name="edit-2" size={18} color="#C67C4E" />
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            <View style={styles.statsGrid}>
              <StatCard
                icon="restaurant"
                value={userStats.totalOrders}
                label="Orders"
              />
              <StatCard
                icon="heart"
                value={userStats.favoriteChefs}
                label="Fav Chefs"
              />
              <StatCard
                icon="bookmark"
                value={userStats.savedDishes}
                label="Saved Dishes"
              />
              <StatCard
                icon="wallet"
                value={`₹${userStats.totalSpent.toLocaleString()}`}
                label="Total Spent"
              />
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
                onPress={() => router.push("/favorites")}
              />
              <MenuOption
                icon="clock"
                title="Order History"
                subtitle="View your past orders"
                onPress={() =>
                  Alert.alert(
                    "Coming Soon",
                    "Order history feature will be available soon!"
                  )
                }
              />
              <MenuOption
                icon="message-circle"
                title="Messages"
                subtitle="Chat with your chefs"
                onPress={() => router.push("/chat")}
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
                onPress={() => router.push("/customer-settings/settings")}
              />
              <MenuOption
                icon="bell"
                title="Notifications"
                subtitle="Manage notification preferences"
                onPress={() => router.push("/notification-demo")}
              />
              <MenuOption
                icon="shield"
                title="Privacy & Security"
                subtitle="Manage your privacy settings"
                onPress={() =>
                  Alert.alert(
                    "Coming Soon",
                    "Privacy settings will be available soon!"
                  )
                }
              />
              <MenuOption
                icon="help-circle"
                title="Help & Support"
                subtitle="Get help and contact support"
                onPress={() => router.push("/customer-settings/support")}
              />
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              console.log("Logout with confirmation button pressed!");
              handleLogoutWithConfirmation();
            }}
            activeOpacity={0.7}
          >
            <Feather name="log-out" size={20} color="#ff4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

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
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  console.log("Logout cancelled");
                  setShowLogoutModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalLogoutButton}
                onPress={() => {
                  console.log("Logout confirmed via modal");
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileCard: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: "#C67C4E",
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: "#999",
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 12,
    color: "#666",
  },
  editButton: {
    backgroundColor: "#2a2a2a",
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
    fontWeight: "bold",
    color: "#fff",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "47%",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  menuContainer: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconContainer: {
    backgroundColor: "#2a2a2a",
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#999",
  },
  logoutButton: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ff4444",
    minHeight: 50, // Ensure minimum touch area
  },
  logoutText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Legacy styles (keeping for compatibility)
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#C67C4E",
    textAlign: "center",
  },
  subtext: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  settingsButton: {
    backgroundColor: "#C67C4E",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  customerSettingsButton: {
    backgroundColor: "#b87a51",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  notificationButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  settingsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 40,
    width: "80%",
    maxWidth: 300,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: "#999",
    marginBottom: 24,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalLogoutButton: {
    flex: 1,
    backgroundColor: "#ff4444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalLogoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
