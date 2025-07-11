import { RestrictedTabWrapper } from "@/components/RestrictedTabWrapper";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../constants/supabase";

const CHEF_PROFILE = {
  avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  name: "Chef Chris T",
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

      const { uri, fileName, mimeType } = asset;
      const response = await fetch(uri);
      const blob = await response.blob();

      if (blob.size === 0) {
        Alert.alert("Upload Failed", "Selected video file is empty.");
        return null;
      }

      const name = fileName || `chef-reel-${Date.now()}`;
      const type = mimeType || "video/mp4";

      const { data, error } = await supabase.storage
        .from("chef-reels")
        .upload(name, blob, {
          contentType: type,
          cacheControl: "3600",
        });

      if (error) {
        Alert.alert("Upload Failed", error.message);
        return null;
      }

      const { publicUrl } = supabase.storage
        .from("chef-reels")
        .getPublicUrl(name).data;

      return publicUrl;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
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

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      // Check if it's a video
      if (asset.type === "video") {
        // Upload video to Supabase
        const uploadedUrl = await uploadVideoToSupabase(asset);
        if (uploadedUrl) {
          setUserImages((prev) => [...prev, uploadedUrl]);
        }
      } else {
        // Handle images (if any)
        setUserImages((prev) => [...prev, asset.uri]);
      }
    }

    setShowMediaModal(false);
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

  return (
    <RestrictedTabWrapper>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.root}>
          {/* Profile Section */}
          <View style={styles.profileTop}>
            <Image
              source={{ uri: CHEF_PROFILE.avatar }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editText}>EDIT</Text>
            </TouchableOpacity>
            <Text style={styles.name}>
              {CHEF_PROFILE.name}{" "}
              <Ionicons name="checkmark-circle" size={19} color="#FF934F" />
            </Text>
            <Text style={styles.specialty}>
              <Text style={{ fontWeight: "bold" }}>Specialty:</Text>{" "}
              {CHEF_PROFILE.specialty}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={20} color="#FF934F" />
              <Text style={styles.ratingText}>{CHEF_PROFILE.rating}</Text>
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
            onRequestClose={() => setShowMediaModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add New Reel</Text>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => pickVideo("camera")}
                  disabled={uploading}
                >
                  <Ionicons name="camera" size={24} color="#FF934F" />
                  <Text style={styles.modalOptionText}>
                    {uploading ? "Uploading..." : "Record Video"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => pickVideo("library")}
                  disabled={uploading}
                >
                  <Ionicons name="videocam" size={24} color="#FF934F" />
                  <Text style={styles.modalOptionText}>
                    {uploading ? "Uploading..." : "Choose Video from Gallery"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowMediaModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
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
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
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
});
