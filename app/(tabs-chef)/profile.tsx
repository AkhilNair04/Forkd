// app/(tabs-chef)/profile.tsx
import { RestrictedTabWrapper } from "@/components/RestrictedTabWrapper";
import { useChefRestriction } from "@/context/ChefRestrictionContext";
import { supabase } from "@/lib/supabase"; // Replace with your Supabase import path
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY = "#C67C4E";
const BG = "#111";
const CARD = "#444";

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    phone: "",
    bio: "",
  });

  // Chef Availability Settings
  const [availability, setAvailability] = useState({
    isAvailable: true,
    autoAcceptOrders: false,
    maxOrdersPerDay: "5",
    advanceBookingDays: "7",
    instantBooking: true,
  });

  // Dish Visibility Settings
  const [dishSettings, setDishSettings] = useState({
    allDishesVisible: true,
    showPricing: true,
    showIngredients: true,
    allowCustomization: true,
    showPreparationTime: true,
  });

  // Content Management Settings
  const [contentSettings, setContentSettings] = useState({
    profileVisible: true,
    acceptReviews: true,
    showExperience: true,
    shareSpecialties: true,
    displayCertifications: true,
    allowDirectMessages: true,
  });

  // Notification Settings for Chefs
  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    customerMessages: true,
    reviewNotifications: true,
    promotionalOpportunities: false,
    weeklyEarningsReport: true,
    paymentNotifications: true,
  });

  const { isRestricted, restrictionReason, refreshRestrictionStatus } =
    useChefRestriction();
  const router = useRouter();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // Fetch the current logged-in user
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        Alert.alert("Error", "Unable to load user profile.");
        return;
      }

      // Fetch user profile data from the Supabase database
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      if (profileError) {
        Alert.alert("Error", "Failed to load profile data.");
        return;
      }

      // Set the profile data to state
      setUserProfile({
        name: profileData?.full_name || "No Name",
        email: data.user.email || "",
        avatar:
          profileData?.avatar_url ||
          "https://ui-avatars.com/api/?name=User&background=666&color=fff&size=256",
        phone: profileData?.phone || "N/A",
        bio: profileData?.bio || "No bio available",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleEditProfile = () => {
    router.push("/edit-profile"); // Navigate to edit profile page
  };

  const handleKYCVerification = () => {
    router.push("/(onboarding-chefs)/chef_kyc");
  };

  const handleAvailabilityToggle = (key: keyof typeof availability) => {
    if (key === "maxOrdersPerDay" || key === "advanceBookingDays") return;
    setAvailability((prev) => ({
      ...prev,
      [key]:
        !prev[
          key as Exclude<
            keyof typeof availability,
            "maxOrdersPerDay" | "advanceBookingDays"
          >
        ],
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
    <RestrictedTabWrapper allowOnProfile={true}>
      <ScrollView style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{userProfile.name}</Text>
          <Text style={styles.email}>{userProfile.email}</Text>
        </View>

        {/* Restriction Status */}
        {isRestricted && (
          <View style={styles.restrictionCard}>
            <View style={styles.restrictionHeader}>
              <Ionicons name="warning" size={24} color="#FF0000" />
              <Text style={styles.restrictionTitle}>Account Restricted</Text>
            </View>
            <Text style={styles.restrictionReason}>{restrictionReason}</Text>
            <TouchableOpacity
              style={styles.kycButton}
              onPress={handleKYCVerification}
            >
              <Ionicons name="document-text" size={20} color="#fff" />
              <Text style={styles.kycButtonText}>
                Complete KYC Verification
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Status Toggle */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <MaterialCommunityIcons name="chef-hat" size={24} color={PRIMARY} />
            <Text style={styles.statusTitle}>Chef Status</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>
              {availability.isAvailable
                ? "Available for Orders"
                : "Currently Unavailable"}
            </Text>
            <Switch
              value={availability.isAvailable}
              onValueChange={() => handleAvailabilityToggle("isAvailable")}
              thumbColor={availability.isAvailable ? PRIMARY : "#ccc"}
              trackColor={{ false: "#555", true: PRIMARY + "50" }}
            />
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.profileDetails}>
          <Text style={styles.sectionTitle}>Phone:</Text>
          <Text style={styles.detail}>{userProfile.phone}</Text>

          <Text style={styles.sectionTitle}>Bio:</Text>
          <Text style={styles.detail}>{userProfile.bio}</Text>
        </View>

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
            title="Edit Profile"
            subtitle="Update your personal information"
            icon="edit"
            onPress={handleEditProfile}
          />

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

        {/* Refresh restriction status */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshRestrictionStatus}
        >
          <Ionicons name="refresh" size={20} color="#C67C4E" />
          <Text style={styles.refreshButtonText}>Refresh Status</Text>
        </TouchableOpacity>
      </ScrollView>
    </RestrictedTabWrapper>
  );
};

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
    padding: 20,
    backgroundColor: BG,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    fontSize: 16,
    color: "#bbb",
  },
  restrictionCard: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFE5E5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  restrictionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  restrictionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF0000",
    marginLeft: 8,
  },
  restrictionReason: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  kycButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0000",
    padding: 12,
    borderRadius: 8,
  },
  kycButtonText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  profileDetails: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: "#bbb",
    marginBottom: 15,
  },
  sectionCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    marginBottom: 20,
    padding: 4,
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
  numberInput: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 8,
    padding: 8,
    minWidth: 60,
    textAlign: "center",
    fontSize: 16,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C67C4E",
    marginTop: 20,
  },
  refreshButtonText: {
    marginLeft: 8,
    color: "#C67C4E",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
