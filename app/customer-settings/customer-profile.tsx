import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PROFILE_PLACEHOLDER =
  "https://ui-avatars.com/api/?name=User&background=bbb&color=fff&size=256";

export default function CustomerProfile() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Info</Text>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>SAVE</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Photo */}
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: PROFILE_PLACEHOLDER }}
          style={styles.profilePhoto}
        />
        <TouchableOpacity style={styles.editIcon}>
          <Feather name="edit-2" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.formSection}>
        <Text style={styles.label}>FULL NAME</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="User's name"
          placeholderTextColor="#ccc"
        />
        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="username@gmail.com"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>PHONE NUMBER</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="408-841-0926"
          placeholderTextColor="#ccc"
          keyboardType="phone-pad"
        />
        <Text style={styles.label}>BIO</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="I love fast food!"
          placeholderTextColor="#ccc"
          multiline
        />
      </View>
    </View>
  );
}

const PRIMARY = "#b87a51";
const BG = "#111";
const CARD = "#444";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 38,
    marginLeft: 14,
    marginBottom: 18,
    justifyContent: "flex-start",
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
  headerTitle: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "bold",
    flex: 1,
  },
  saveBtn: {
    marginRight: 24,
  },
  saveBtnText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 18,
    marginTop: 10,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#bbb",
  },
  editIcon: {
    position: "absolute",
    bottom: 8,
    right: 110 / 2 - 8,
    backgroundColor: PRIMARY,
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: BG,
    elevation: 2,
  },
  formSection: {
    marginHorizontal: 18,
    marginTop: 10,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 18,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: CARD,
    color: "#fff",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 2,
  },
  bioInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
});
