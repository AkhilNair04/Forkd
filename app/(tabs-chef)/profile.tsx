// app/(tabs-chef)/profile.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase"; // Replace with your Supabase import path
import { useRouter } from "expo-router";

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    phone: "",
    bio: "",
  });

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
        avatar: profileData?.avatar_url || "https://ui-avatars.com/api/?name=User&background=666&color=fff&size=256",
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

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{userProfile.name}</Text>
        <Text style={styles.email}>{userProfile.email}</Text>
      </View>

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
    </View>
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
  },
  editButtonText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
