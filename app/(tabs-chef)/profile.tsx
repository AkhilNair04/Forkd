import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#C67C4E";
const BG = "#111";
const CARD = "#444";
const [chefProfile, setChefProfile] = useState<any>(null);
const [loadingProfile, setLoadingProfile] = useState(true);


export default function ChefSettingsScreen() {
  const router = useRouter();

  const [availability, setAvailability] = useState({
    autoAcceptOrders: false,
    maxOrdersPerDay: "5",
    advanceBookingDays: "7",
    instantBooking: true,
  });

  const [dishSettings, setDishSettings] = useState({
    allDishesVisible: true,
    showPricing: true,
    showIngredients: true,
    allowCustomization: true,
    showPreparationTime: true,
  });

  const [contentSettings, setContentSettings] = useState({
    profileVisible: true,
    acceptReviews: true,
    showExperience: true,
    shareSpecialties: true,
    displayCertifications: true,
    allowDirectMessages: true,
  });

  useEffect(() => {
  const fetchChefProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("Chef")
        .select("*")
        .eq("uuid", user.id)
        .single();

      if (error) throw error;

      if (data?.id) {
        const { data: imageUrl } = supabase.storage
          .from("chef")
          .getPublicUrl(`${data.id}/avatar.png`);
        setChefProfile({ ...data, imageUrl: imageUrl?.publicUrl });
      }
    } catch (err) {
      console.error("Error fetching chef profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  fetchChefProfile();
}, []);


  const [businessSettings, setBusinessSettings] = useState({
    taxIncluded: false,
    currency: "INR",
    paymentMethods: ["card", "upi"],
    serviceFeeType: "percentage",
    serviceFeeValue: "10",
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    customerMessages: true,
    reviewNotifications: true,
    promotionalOpportunities: false,
    weeklyEarningsReport: true,
    paymentNotifications: true,
  });

  const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    await AsyncStorage.clear();
    router.replace("/(auth)/welcome-screen");
  } catch (err) {
    Alert.alert("Logout Failed", "Please try again.");
    console.error("Logout error:", err);
  }
};

  const handleAvailabilityToggle = (key: keyof typeof availability) => {
    if (key === "maxOrdersPerDay" || key === "advanceBookingDays") return;
    setAvailability((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDishToggle = (key: keyof typeof dishSettings) => {
    setDishSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleContentToggle = (key: keyof typeof contentSettings) => {
    setContentSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBusinessToggle = (key: keyof typeof businessSettings) => {
    if (
      key === "currency" ||
      key === "paymentMethods" ||
      key === "serviceFeeType" ||
      key === "serviceFeeValue"
    )
      return;
    setBusinessSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSuspendAccount = () => {
    Alert.alert(
      "Suspend Chef Account",
      "This will temporarily disable your chef profile. You can reactivate it anytime.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Suspend",
          style: "destructive",
          onPress: () => console.log("Account suspended"),
        },
      ]
    );
  };

  const handleViewAnalytics = () => {
    console.log("Navigate to analytics");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chef Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Chef Availability Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Availability Management</Text>

          <SettingToggleItem
            title="Auto-Accept Orders"
            subtitle="Automatically accept orders when available"
            value={availability.autoAcceptOrders}
            onToggle={() => handleAvailabilityToggle("autoAcceptOrders")}
            icon="check-circle"
          />

          <SettingToggleItem
            title="Instant Booking"
            subtitle="Allow customers to book immediately"
            value={availability.instantBooking}
            onToggle={() => handleAvailabilityToggle("instantBooking")}
            icon="zap"
          />

          <SettingInputItem
            title="Max Orders Per Day"
            subtitle="Set your daily order limit"
            value={availability.maxOrdersPerDay}
            onChangeText={(text) =>
              setAvailability((prev) => ({ ...prev, maxOrdersPerDay: text }))
            }
            icon="hash"
            keyboardType="numeric"
          />

          <SettingInputItem
            title="Advance Booking (Days)"
            subtitle="How far ahead customers can book"
            value={availability.advanceBookingDays}
            onChangeText={(text) =>
              setAvailability((prev) => ({ ...prev, advanceBookingDays: text }))
            }
            icon="calendar"
            keyboardType="numeric"
            isLast
          />
        </View>

        {/* Dish Visibility Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Dish Visibility & Management</Text>

          <SettingToggleItem
            title="All Dishes Visible"
            subtitle="Make all your dishes visible to customers"
            value={dishSettings.allDishesVisible}
            onToggle={() => handleDishToggle("allDishesVisible")}
            icon="eye"
          />

          <SettingToggleItem
            title="Show Pricing"
            subtitle="Display prices on your dishes"
            value={dishSettings.showPricing}
            onToggle={() => handleDishToggle("showPricing")}
            icon="dollar-sign"
          />

          <SettingToggleItem
            title="Show Ingredients"
            subtitle="Display ingredient lists to customers"
            value={dishSettings.showIngredients}
            onToggle={() => handleDishToggle("showIngredients")}
            icon="list"
          />

          <SettingToggleItem
            title="Allow Customization"
            subtitle="Let customers request dish modifications"
            value={dishSettings.allowCustomization}
            onToggle={() => handleDishToggle("allowCustomization")}
            icon="edit"
          />

          <SettingToggleItem
            title="Show Preparation Time"
            subtitle="Display estimated cooking time"
            value={dishSettings.showPreparationTime}
            onToggle={() => handleDishToggle("showPreparationTime")}
            icon="clock"
            isLast
          />
          <SettingNavItem
            title="Manage Reels"
            subtitle="Add, edit, or remove your food photos & videos"
            icon="film"
            onPress={() => router.push("./chef-reels")}
          />
        </View>

        {/* Content Management */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Profile & Content Management</Text>

          <SettingToggleItem
            title="Profile Visible"
            subtitle="Make your chef profile visible to customers"
            value={contentSettings.profileVisible}
            onToggle={() => handleContentToggle("profileVisible")}
            icon="user"
          />

          <SettingToggleItem
            title="Accept Reviews"
            subtitle="Allow customers to leave reviews"
            value={contentSettings.acceptReviews}
            onToggle={() => handleContentToggle("acceptReviews")}
            icon="star"
          />

          <SettingToggleItem
            title="Show Experience"
            subtitle="Display your cooking experience"
            value={contentSettings.showExperience}
            onToggle={() => handleContentToggle("showExperience")}
            icon="award"
          />

          <SettingToggleItem
            title="Share Specialties"
            subtitle="Display your cuisine specialties"
            value={contentSettings.shareSpecialties}
            onToggle={() => handleContentToggle("shareSpecialties")}
            icon="bookmark"
          />

          <SettingToggleItem
            title="Display Certifications"
            subtitle="Show your cooking certifications"
            value={contentSettings.displayCertifications}
            onToggle={() => handleContentToggle("displayCertifications")}
            icon="shield"
          />

          <SettingToggleItem
            title="Allow Direct Messages"
            subtitle="Let customers message you directly"
            value={contentSettings.allowDirectMessages}
            onToggle={() => handleContentToggle("allowDirectMessages")}
            icon="message-circle"
            isLast
          />
        </View>

        {/* Business Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Business & Payment Settings</Text>

          <SettingToggleItem
            title="Tax Included in Prices"
            subtitle="Include tax in displayed prices"
            value={businessSettings.taxIncluded}
            onToggle={() => handleBusinessToggle("taxIncluded")}
            icon="percent"
          />

          <SettingNavItem
            title="Payment Methods"
            subtitle="Manage accepted payment methods"
            icon="credit-card"
            onPress={() => console.log("Payment methods")}
          />

          <SettingNavItem
            title="Service Fee Settings"
            subtitle="Configure your service fees"
            icon="calculator"
            onPress={() => console.log("Service fees")}
          />

          <SettingNavItem
            title="Tax & Legal Information"
            subtitle="Manage tax details and legal info"
            icon="file-text"
            onPress={() => console.log("Tax settings")}
            isLast
          />
        </View>

        {/* Notifications */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>

          <SettingToggleItem
            title="New Orders"
            subtitle="Get notified when you receive new orders"
            value={notifications.newOrders}
            onToggle={() => handleNotificationToggle("newOrders")}
            icon="bell"
          />

          <SettingToggleItem
            title="Order Updates"
            subtitle="Notifications for order status changes"
            value={notifications.orderUpdates}
            onToggle={() => handleNotificationToggle("orderUpdates")}
            icon="refresh-cw"
          />

          <SettingToggleItem
            title="Customer Messages"
            subtitle="Get notified of new customer messages"
            value={notifications.customerMessages}
            onToggle={() => handleNotificationToggle("customerMessages")}
            icon="message-square"
          />

          <SettingToggleItem
            title="Reviews"
            subtitle="Notifications when customers leave reviews"
            value={notifications.reviewNotifications}
            onToggle={() => handleNotificationToggle("reviewNotifications")}
            icon="star"
          />

          <SettingToggleItem
            title="Weekly Earnings Report"
            subtitle="Receive weekly earning summaries"
            value={notifications.weeklyEarningsReport}
            onToggle={() => handleNotificationToggle("weeklyEarningsReport")}
            icon="trending-up"
            isLast
          />
        </View>

        {/* Analytics & Performance */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Analytics & Performance</Text>

          <SettingNavItem
            title="View Analytics"
            subtitle="See your performance metrics and insights"
            icon="bar-chart-2"
            onPress={handleViewAnalytics}
          />

          <SettingNavItem
            title="Earnings History"
            subtitle="View your payment and earnings history"
            icon="dollar-sign"
            onPress={() => console.log("Earnings history")}
          />

          <SettingNavItem
            title="Customer Feedback"
            subtitle="Review feedback and ratings from customers"
            icon="heart"
            onPress={() => console.log("Customer feedback")}
            isLast
          />
        </View>

        {/* Account Management */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Management</Text>

          <SettingNavItem
            title="Suspend Chef Account"
            subtitle="Temporarily disable your chef profile"
            icon="pause-circle"
            onPress={handleSuspendAccount}
            isDanger
          />

          <SettingNavItem
            title="Help & Support"
            subtitle="Get help with chef-specific issues"
            icon="help-circle"
            onPress={() => console.log("Chef support")}
            isLast
          />
        </View>

        <View style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
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
      <Feather
        name={icon as any}
        size={20}
        color="#fff"
        style={styles.settingIcon}
      />
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      thumbColor={value ? PRIMARY : "#ccc"}
      trackColor={{ false: "#555", true: PRIMARY + "50" }}
    />
  </View>
);

interface SettingInputItemProps {
  title: string;
  subtitle: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: string;
  keyboardType?: "default" | "numeric";
  isLast?: boolean;
}

const SettingInputItem: React.FC<SettingInputItemProps> = ({
  title,
  subtitle,
  value,
  onChangeText,
  icon,
  keyboardType = "default",
  isLast = false,
}) => (
  <View style={[styles.settingItem, isLast && styles.lastItem]}>
    <View style={styles.settingContent}>
      <Feather
        name={icon as any}
        size={20}
        color="#fff"
        style={styles.settingIcon}
      />
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <TextInput
      style={styles.numberInput}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholder="0"
      placeholderTextColor="#888"
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
        color={isDanger ? "#ff4444" : "#fff"}
        style={styles.settingIcon}
      />
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, isDanger && styles.dangerText]}>
          {title}
        </Text>
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 14,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 7,
    marginRight: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  statusCard: {
    backgroundColor: PRIMARY + "20",
    borderRadius: 20,
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: PRIMARY + "40",
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusText: {
    color: "#fff",
    fontSize: 16,
  },
  sectionCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    marginBottom: 20,
    padding: 4,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingSubtitle: {
    color: "#bbb",
    fontSize: 14,
  },
  dangerText: {
    color: "#ff4444",
  },
  logoutWrapper: {
  alignItems: "center",
  marginBottom: 40,
  marginTop: -10,
},
logoutBtn: {
  backgroundColor: "#C44",
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
},
logoutText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 16,
},
  numberInput: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 8,
    padding: 8,
    minWidth: 60,
    textAlign: "center",
    fontSize: 16,
  },
});
