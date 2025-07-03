// app/(onboarding-chefs)/chef_kyc.tsx
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import TermsAndConditions from "./tnc";

export default function ChefKYC() {
  const [form, setForm] = useState({
    fullName: "",
    dob: null as Date | null,
    age: "",
    phone: "",
    email: "",
    profilePic: "",
    fssaiNum: "",
    fssaiDoc: "",
    pccDoc: "",
  });
  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const calculateAge = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age.toString();
  };

  const pickImage = async (field: keyof typeof form) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setForm((prev) => ({
        ...prev,
        [field]: result.assets[0].uri,
      }));
    }
  };

  const handleChange = (key: keyof typeof form, value: string | Date) => {
    if (key === "dob" && value instanceof Date) {
      setForm((prev) => ({
        ...prev,
        dob: value,
        age: calculateAge(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleSubmit = () => {
    Alert.alert("Submitted!", "Check console for form data.");
    console.log(form);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingVertical: 24 }}
    >
      <Text style={styles.title}>Chef KYC Verification</Text>

      {/* Full Name */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={22} color="#FF9100" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#bbb"
          value={form.fullName}
          onChangeText={(t) => handleChange("fullName", t)}
        />
      </View>

      {/* Date of Birth */}
      <TouchableOpacity onPress={() => setShowDOBPicker(true)} style={styles.inputContainer}>
        <Ionicons name="calendar-outline" size={22} color="#FF9100" style={styles.icon} />
        <Text style={{ color: form.dob ? "#fff" : "#bbb", fontSize: 17, flex: 1 }}>
          {form.dob ? form.dob.toDateString() : "Date of Birth"}
        </Text>
      </TouchableOpacity>
      {showDOBPicker && (
        <DateTimePicker
          value={form.dob || new Date(2000, 0, 1)}
          mode="date"
          display="spinner"
          maximumDate={new Date()}
          onChange={(_, date) => {
            setShowDOBPicker(false);
            if (date) handleChange("dob", date);
          }}
        />
      )}

      {/* Age */}
      <View style={[styles.inputContainer, { backgroundColor: "#191919AA" }]}>
        <Ionicons name="hourglass-outline" size={22} color="#FF9100" style={styles.icon} />
        <Text style={{ color: "#fff", fontSize: 17, flex: 1 }}>
          {form.age ? form.age + " years" : "Age"}
        </Text>
      </View>

      {/* Phone */}
      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={22} color="#FF9100" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#bbb"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(t) => handleChange("phone", t)}
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={22} color="#FF9100" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email (optional)"
          placeholderTextColor="#bbb"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(t) => handleChange("email", t)}
        />
      </View>

      {/* Profile Picture */}
      <Text style={styles.label}>Profile Picture</Text>
      <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage("profilePic")}>
        {form.profilePic ? (
          <Image source={{ uri: form.profilePic }} style={styles.uploadedImg} />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={24} color="#FF9100" />
            <Text style={styles.uploadText}>Select Image</Text>
          </>
        )}
      </TouchableOpacity>

      {/* FSSAI Number */}
      <View style={styles.inputContainer}>
        <Ionicons name="clipboard-outline" size={22} color="#FF9100" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="FSSAI License Number"
          placeholderTextColor="#bbb"
          value={form.fssaiNum}
          onChangeText={(t) => handleChange("fssaiNum", t)}
        />
      </View>

      {/* FSSAI Doc */}
      <Text style={styles.label}>Upload FSSAI Document</Text>
      <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage("fssaiDoc")}>
        {form.fssaiDoc ? (
          <Image source={{ uri: form.fssaiDoc }} style={styles.uploadedImg} />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={24} color="#FF9100" />
            <Text style={styles.uploadText}>Select Document</Text>
          </>
        )}
      </TouchableOpacity>

      {/* PCC Doc */}
      <Text style={styles.label}>Upload PCC Certificate</Text>
      <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage("pccDoc")}>
        {form.pccDoc ? (
          <Image source={{ uri: form.pccDoc }} style={styles.uploadedImg} />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={24} color="#FF9100" />
            <Text style={styles.uploadText}>Select Certificate</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Terms & Conditions */}
      <View style={styles.termsRow}>
        <TouchableOpacity onPress={() => setAcceptedTerms((v) => !v)}>
          <Ionicons
            name={acceptedTerms ? "checkbox-outline" : "square-outline"}
            size={24}
            color={acceptedTerms ? "#FF9100" : "#bbb"}
          />
        </TouchableOpacity>
        <Text style={styles.termsText}>
          I accept the{" "}
          <Text style={styles.termsLink} onPress={() => setShowTerms(true)}>
            Terms & Conditions
          </Text>
        </Text>
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, { opacity: acceptedTerms ? 1 : 0.5 }]}
        disabled={!acceptedTerms}
        onPress={handleSubmit}
      >
        <Text style={styles.submitText}>Submit Request</Text>
      </TouchableOpacity>

      {/* Terms Modal */}
      <Modal visible={showTerms} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.termsContainer}>
            {/* Scrollable T&C */}
            <ScrollView style={styles.termsScroll} contentContainerStyle={{ padding: 16 }}>
              <TermsAndConditions />
            </ScrollView>
            <TouchableOpacity onPress={() => setShowTerms(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#111", flex: 1, paddingHorizontal: 22 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#191919",
    borderRadius: 16,
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  icon: { marginRight: 8 },
  input: { color: "#fff", fontSize: 17, flex: 1 },
  label: {
    color: "#FF9100",
    fontSize: 15,
    marginBottom: 6,
    marginTop: 12,
    fontWeight: "600",
    marginLeft: 2,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1200",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FF9100",
    justifyContent: "center",
    minHeight: 56,
  },
  uploadText: { color: "#FF9100", fontSize: 16, marginLeft: 10, fontWeight: "500" },
  uploadedImg: { width: 52, height: 52, borderRadius: 10, resizeMode: "cover" },
  termsRow: { flexDirection: "row", alignItems: "center", marginTop: 18, marginBottom: 8 },
  termsText: { color: "#fff", fontSize: 15, marginLeft: 8, flex: 1 },
  termsLink: { color: "#FF9100", textDecorationLine: "underline" },

  // ScrollView style for T&C
  termsContainer: {
    backgroundColor: "#191919",
    borderRadius: 18,
    width: "90%",
    maxHeight: "80%",
    paddingTop: 12,
  },
  termsScroll: {
    // give ScrollView a max height so inner content can overflow
    maxHeight: 360,
  },

  submitBtn: { backgroundColor: "#FF9100", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 18, marginBottom: 24 },
  submitText: { color: "#111", fontWeight: "bold", fontSize: 17, letterSpacing: 0.5 },

  modalBg: { flex: 1, backgroundColor: "#000A", justifyContent: "center", alignItems: "center" },
  closeBtn: { marginTop: 12, alignSelf: "flex-end", paddingHorizontal: 12 },
  closeText: { color: "#FF9100", fontWeight: "bold", fontSize: 16 },
});
