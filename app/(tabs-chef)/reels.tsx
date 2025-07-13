import { RestrictedTabWrapper } from "@/components/RestrictedTabWrapper";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../constants/supabase";

const CHEF_PROFILE = {
  name: "name", // This will be overridden with dynamic data
  specialty: "French, Japanese",
  rating: 4.7,
  followers: 30,
  posts: 6,
  likes: 400,
};

const POST_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  "https://images.unsplash.com/photo-1519864600265-abb224a01f66",
  "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0",
  "https://images.unsplash.com/photo-1502741126161-b048400d98b5",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  "https://images.unsplash.com/photo-1519864600265-abb224a01f66",
];

export default function ChefReelsPage() {
  const [userImages, setUserImages] = useState<string[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [chefName, setChefName] = useState(CHEF_PROFILE.name);
  const [chefId, setChefId] = useState<string | null>(null);

  // Fetch chef name and ID from Chef table
  const fetchChefData = async () => {
    try {
      // Get current authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ No authenticated user found:", userError?.message);
        return;
      }

      // First try to get chef info from user_profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("full_name, user_type")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        console.error("❌ Error fetching user profile:", profileError.message);
        return;
      }

      if (profileData?.user_type === "chef" && profileData?.full_name) {
        setChefName(profileData.full_name);
        console.log("✅ Chef name loaded from profile:", profileData.full_name);

        // Try to get chef ID from Chef table using user_id
        const { data: chefData, error: chefError } = await supabase
          .from("Chef")
          .select("id")
          .eq("uuid", user.id)
          .limit(1);

        if (!chefError && chefData && chefData.length > 0) {
          setChefId(chefData[0].id);
          console.log("✅ Chef ID loaded:", chefData[0].id);
        }
        return;
      }

      // If not found in user_profiles, try the Chef table
      const { data: chefData, error: chefError } = await supabase
        .from("Chef")
        .select("id, name")
        .eq("uuid", user.id) // Try uuid field first
        .limit(1);

      if (!chefError && chefData && chefData.length > 0) {
        setChefName(chefData[0].name);
        setChefId(chefData[0].id);
        console.log(
          "✅ Chef data loaded from Chef table:",
          chefData[0].name,
          chefData[0].id
        );
        return;
      }

      // If still not found, try with id field (for Chef table with custom IDs like C0001)
      const { data: chefData2, error: chefError2 } = await supabase
        .from("Chef")
        .select("id, name")
        .eq("id", user.id)
        .limit(1);

      if (!chefError2 && chefData2 && chefData2.length > 0) {
        setChefName(chefData2[0].name);
        setChefId(chefData2[0].id);
        console.log(
          "✅ Chef data loaded from Chef table (id):",
          chefData2[0].name,
          chefData2[0].id
        );
        return;
      }

      console.log("⚠️ No chef profile found for user:", user.id);
    } catch (error) {
      console.error("❌ Error in fetchChefData:", error);
    }
  };

  // Fetch chef data on component mount
  useEffect(() => {
    fetchChefData();
  }, []);

  // Load existing reels when chefId is available
  useEffect(() => {
    if (chefId) {
      loadExistingReels();
    }
  }, [chefId]);

  const loadExistingReels = async () => {
    try {
      if (!chefId) {
        console.log("❌ No chef ID available");
        return;
      }

      console.log(`🔍 Loading existing reels for chef: ${chefId}`);

      // List files in the chef's folder
      const { data: files, error } = await supabase.storage
        .from("chef-reels")
        .list(chefId);

      if (error) {
        console.error("❌ Error loading existing reels:", error);
        return;
      }

      if (files && files.length > 0) {
        // Get public URLs for all videos in the chef's folder
        const reelUrls = files
          .filter((file) => file.name && !file.name.endsWith("/")) // Filter out folders
          .map((file) => {
            const { publicUrl } = supabase.storage
              .from("chef-reels")
              .getPublicUrl(`${chefId}/${file.name}`).data;
            return publicUrl;
          });

        setUserImages(reelUrls);
        console.log(`✅ Loaded ${reelUrls.length} existing reels`);
      } else {
        console.log("📁 No existing reels found for this chef");
      }
    } catch (error) {
      console.error("❌ Error in loadExistingReels:", error);
    }
  };

  // Place "add" at first slot
  const gridData = [
    { type: "add" },
    ...userImages.map((uri) => ({ type: "img", uri })),
  ];

  const requestPermissions = async (type: "camera" | "library") => {
    if (type === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    }
  };

  const uploadVideoToSupabase = async (asset: ImagePicker.ImagePickerAsset) => {
    // NOTE: asset is required here for Supabase uploads.
    // Even if VSCode or chatgpt warns, do NOT remove it!

    try {
      setUploading(true);

      // Check if we have chef ID
      if (!chefId) {
        Alert.alert(
          "Upload Failed",
          "Chef profile not found. Please try again."
        );
        return null;
      }

      const { uri, fileName, mimeType } = asset;
      const response = await fetch(uri);
      const blob = await response.blob();

      if (blob.size === 0) {
        Alert.alert("Upload Failed", "Selected video file is empty.");
        return null;
      }

      // Create folder structure: chef-reels/{chefId}/{filename}
      const timestamp = Date.now();
      const fileExtension = fileName?.split(".").pop() || "mp4";
      const fileNameWithoutExt = fileName?.split(".")[0] || `reel-${timestamp}`;
      const finalFileName = `${fileNameWithoutExt}-${timestamp}.${fileExtension}`;
      const folderPath = `${chefId}/${finalFileName}`;

      const type = mimeType || "video/mp4";

      console.log(`📁 Uploading to folder: ${folderPath}`);

      const { data, error } = await supabase.storage
        .from("chef-reels")
        .upload(folderPath, blob, {
          contentType: type,
          cacheControl: "3600",
        });

      if (error) {
        console.error("❌ Upload error:", error);
        Alert.alert("Upload Failed", error.message);
        return null;
      }

      const { publicUrl } = supabase.storage
        .from("chef-reels")
        .getPublicUrl(folderPath).data;

      console.log("✅ Video uploaded successfully to:", folderPath);
      return publicUrl;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Upload error:", errorMessage);
      Alert.alert("Upload Failed", errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const pickVideo = async (source: "camera" | "library") => {
    const hasPermission = await requestPermissions(source);

    if (!hasPermission) {
      Alert.alert(
        "Permission Required",
        `Sorry, we need ${source} permissions to make this work!`
      );
      return;
    }

    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
    };

    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    // Only proceed if user didn't cancel and we have a video
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      // Check if it's a video
      if (asset.type === "video") {
        console.log("🎥 Video selected, starting upload...");

        // Upload video to Supabase
        const uploadedUrl = await uploadVideoToSupabase(asset);

        if (uploadedUrl) {
          console.log("✅ Upload successful, adding to grid");
          setUserImages((prev) => [...prev, uploadedUrl]);
          setShowMediaModal(false); // Close modal only on successful upload
        } else {
          console.log("❌ Upload failed, keeping modal open");
          // Don't close modal if upload failed - let user try again
        }
      } else {
        console.log("📸 Image selected (not supported for reels)");
        Alert.alert("Invalid File", "Please select a video file for reels.");
        // Don't close modal for invalid file type
      }
    } else {
      console.log("🚫 User cancelled video selection");
      // Don't close modal if user cancelled - let them try again
    }
  };

  const renderGridItem = ({ item }: { item: any }) => {
    if (item.type === "add") {
      return (
        <TouchableOpacity
          style={styles.addContainer}
          onPress={() => setShowMediaModal(true)}
        >
          <Ionicons name="add" size={46} color="#bbb" />
        </TouchableOpacity>
      );
    }
    // Display Video for Reels
    return (
      <Video
        source={{ uri: item.uri }}
        style={styles.gridImg}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={false} // Only play when user opens it (for grid)
      />
    );
  };

  if (!chefName) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#181818",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>
          No chef profile found.
        </Text>
      </View>
    );
  }

  return (
    <RestrictedTabWrapper>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.root}>
          {/* Profile Section */}
          <View style={styles.profileTop}>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editText}>EDIT</Text>
            </TouchableOpacity>
            <Text style={styles.name}>
              {chefName}{" "}
              <Ionicons name="checkmark-circle" size={19} color="#FF934F" />
            </Text>
            <Text style={styles.specialty}>
              <Text style={{ fontWeight: "bold" }}>Specialty:</Text>{" "}
              {CHEF_PROFILE.specialty}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={20} color="#FF934F" />
              <Text style={styles.ratingText}>
                {CHEF_PROFILE.rating.toFixed(1)}
              </Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{CHEF_PROFILE.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{CHEF_PROFILE.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{CHEF_PROFILE.likes}</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
            </View>
          </View>

          {/* Grid Section */}
          <FlatList
            data={gridData}
            renderItem={renderGridItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          />

          {/* Media Modal */}
          <Modal
            visible={showMediaModal}
            transparent
            animationType="slide"
            onRequestClose={() => !uploading && setShowMediaModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {uploading ? "Uploading Reel..." : "Add New Reel"}
                </Text>

                {uploading ? (
                  <View style={styles.uploadingContainer}>
                    <ActivityIndicator size="large" color="#FF934F" />
                    <Text style={styles.uploadingText}>
                      Uploading your reel...
                    </Text>
                    <Text style={styles.uploadingSubtext}>
                      Please wait, this may take a moment
                    </Text>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.modalOption}
                      onPress={() => pickVideo("camera")}
                      disabled={uploading}
                    >
                      <Ionicons name="camera" size={24} color="#FF934F" />
                      <Text style={styles.modalOptionText}>Record Video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalOption}
                      onPress={() => pickVideo("library")}
                      disabled={uploading}
                    >
                      <Ionicons name="videocam" size={24} color="#FF934F" />
                      <Text style={styles.modalOptionText}>
                        Choose Video from Gallery
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setShowMediaModal(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </RestrictedTabWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#181818" },
  root: { flex: 1, backgroundColor: "#181818" },
  profileTop: { alignItems: "center", marginTop: 30, marginBottom: 16 },
  editBtn: { position: "absolute", right: 26, top: 6 },
  editText: { color: "#FF934F", fontWeight: "bold", fontSize: 15 },
  name: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 6 },
  specialty: { color: "#bbb", marginTop: 2, marginBottom: 4 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 8,
  },
  ratingText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    marginLeft: 5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  statBox: { alignItems: "center", flex: 1 },
  statNumber: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  statLabel: { color: "#bbb", fontSize: 14 },
  gridContainer: { paddingHorizontal: 6, paddingBottom: 50 },
  gridImg: { width: 115, height: 115, borderRadius: 12, margin: 4 },
  addContainer: {
    width: 115,
    height: 115,
    borderRadius: 12,
    margin: 4,
    backgroundColor: "#bbb3",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    width: "100%",
  },
  modalOptionText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "500",
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    color: "#FF934F",
    fontSize: 16,
    fontWeight: "500",
  },
  uploadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  uploadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  uploadingSubtext: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
  },
});
