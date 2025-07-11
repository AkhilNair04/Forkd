// app/(tabs-chef)/profile.tsx
import { RestrictedTabWrapper } from "@/components/RestrictedTabWrapper";
import { useChefRestriction } from "@/context/ChefRestrictionContext";
import { supabase } from "@/lib/supabase"; // Replace with your Supabase import path
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    phone: "",
    bio: "",
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

  return (
    <RestrictedTabWrapper allowOnProfile={true}>
      <ScrollView style={styles.container}>
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

        <View style={styles.profileDetails}>
          <Text style={styles.sectionTitle}>Phone:</Text>
          <Text style={styles.detail}>{userProfile.phone}</Text>

          <Text style={styles.sectionTitle}>Bio:</Text>
          <Text style={styles.detail}>{userProfile.bio}</Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="create" size={24} color="#fff" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#666",
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
  profileDetails: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: "#444",
    marginBottom: 15,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C67C4E",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  editButtonText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  },
  refreshButtonText: {
    marginLeft: 8,
    color: "#C67C4E",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
