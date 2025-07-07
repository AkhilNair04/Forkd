// app/(onboarding-chefs)/chef_kyc.tsx
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { useRouter } from "expo-router";
import { supabase } from "@/constants/supabase";
import TermsAndConditions from "./tnc";
import { v4 as uuidv4 } from "uuid";

export default function ChefKYC() {
  const router = useRouter();

  const [chefFolder, setChefFolder] = useState<string>("");
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
  const [loadingField, setLoadingField] = useState<keyof typeof form | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // On mount: fetch latest Chef.id → nextChefFolder
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("Chef")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .single();
      if (!error && data?.id) {
        const lastNum = parseInt(data.id.slice(1), 10) || 0;
        const nextStr = (lastNum + 1).toString().padStart(4, "0");
        setChefFolder(`C${nextStr}`);
      } else {
        console.error("Could not fetch Chef.id:", error);
      }
    })();
  }, []);

  const calculateAge = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age.toString();
  };

  const handleChange = (key: keyof typeof form, value: string | Date) => {
    if (key === "dob" && value instanceof Date) {
      setForm(f => ({ ...f, dob: value, age: calculateAge(value) }));
    } else {
      setForm(f => ({ ...f, [key]: value }));
    }
  };

  const pickImageAndUpload = async (
    field: keyof typeof form,
    bucket: "chef" | "fssai" | "pcc"
  ) => {
    if (!chefFolder) {
      Alert.alert("Please wait", "Initializing your Chef ID…");
      return;
    }
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (res.canceled) return;
      const asset = res.assets[0];
      const uri = asset.uri;
      const ext = uri.split(".").pop() ?? "jpg";
      const filename = `${chefFolder}/${uuidv4()}.${ext}`;
      setLoadingField(field);

      const b64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const buffer = decode(b64);

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filename, buffer, {
          contentType: asset.type ?? `image/${ext}`,
          upsert: true,
        });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename);
      setForm(f => ({ ...f, [field]: urlData.publicUrl }));
    } catch (err: any) {
      console.error("Upload error:", err);
      Alert.alert("Upload failed", err.message ?? JSON.stringify(err));
    } finally {
      setLoadingField(null);
    }
  };

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      Alert.alert("Terms required", "You must accept the Terms & Conditions before submitting.");
      return;
    }
    if (!form.email) {
      Alert.alert("Email required", "Please enter your email.");
      return;
    }
    if (!form.dob) {
      Alert.alert("Date of Birth required", "Please select your date of birth.");
      return;
    }
    if (!chefFolder) {
      Alert.alert("Error", "Chef ID is not ready yet.");
      return;
    }

    setSubmitting(true);

    // 1) update auth user
    const { error: authError } = await supabase.auth.updateUser({
      email: form.email,
      phone: form.phone,
    });
    if (authError) {
      setSubmitting(false);
      console.error("Auth update error:", authError);
      return Alert.alert("Update failed", authError.message);
    }

    // 2) upsert Chef table
    const payload = {
      id: chefFolder,
      name: form.fullName,
      dob: form.dob.toISOString().split("T")[0], // not-null
      is_restricted: false,                        // not-null boolean
      fssai_number: form.fssaiNum,
      fssai_license_img: form.fssaiDoc,
      pcc_certificate: form.pccDoc,
    };

    const { error } = await supabase.from("Chef").upsert(payload);
    setSubmitting(false);

    if (error) {
      console.error("DB write error:", error);
      return Alert.alert("Submission failed", error.message);
    }

    Alert.alert("Success!", "Your KYC has been recorded.", [
      { text: "OK", onPress: () => router.replace("(tabs-chef)") },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingVertical: 24 }}>
      <Text style={styles.title}>Chef KYC Verification</Text>

      {/* Full Name */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={22} color="#FF9100" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#bbb"
          value={form.fullName}
          onChangeText={t => handleChange("fullName", t)}
        />
      </View>

      {/* Date of Birth */}
      <TouchableOpacity onPress={() => setShowDOBPicker(true)} style={styles.inputContainer}>
        <Ionicons name="calendar-outline" size={22} color="#FF9100" style={styles.icon} />
        <Text style={{ color: form.dob ? "#fff" : "#bbb", flex: 1, fontSize: 17 }}>
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
        <Text style={{ color: "#fff", flex: 1, fontSize: 17 }}>
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
          onChangeText={t => handleChange("phone", t)}
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={22} color="#FF9100" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          keyboardType="email-address"
          value={form.email}
          onChangeText={t => handleChange("email", t)}
        />
      </View>

      {/* Profile Picture */}
      <Text style={styles.label}>Profile Picture</Text>
      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={() => pickImageAndUpload("profilePic", "chef")}
      >
        {loadingField === "profilePic" ? (
          <ActivityIndicator color="#FF9100" />
        ) : form.profilePic ? (
          <Image source={{ uri: form.profilePic }} style={styles.uploadedImg} />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={24} color="#FF9100" />
            <Text style={styles.uploadText}>Select Image</Text>
          </>
        )}
      </TouchableOpacity>

      {/* FSSAI License Number */}
      <View style={styles.inputContainer}>
        <Ionicons name="clipboard-outline" size={22} color="#FF9100" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="FSSAI License Number"
          placeholderTextColor="#bbb"
          value={form.fssaiNum}
          onChangeText={t => handleChange("fssaiNum", t)}
        />
      </View>

      {/* Upload FSSAI Document */}
      <Text style={styles.label}>Upload FSSAI Document</Text>
      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={() => pickImageAndUpload("fssaiDoc", "fssai")}
      >
        {loadingField === "fssaiDoc" ? (
          <ActivityIndicator color="#FF9100" />
        ) : form.fssaiDoc ? (
          <Image source={{ uri: form.fssaiDoc }} style={styles.uploadedImg} />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={24} color="#FF9100" />
            <Text style={styles.uploadText}>Select Document</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Upload PCC Certificate */}
      <Text style={styles.label}>Upload PCC Certificate</Text>
      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={() => pickImageAndUpload("pccDoc", "pcc")}
      >
        {loadingField === "pccDoc" ? (
          <ActivityIndicator color="#FF9100" />
        ) : form.pccDoc ? (
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
        <TouchableOpacity onPress={() => setAcceptedTerms(v => !v)}>
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
        style={[styles.submitBtn, { opacity: acceptedTerms && !submitting ? 1 : 0.5 }]}
        disabled={!acceptedTerms || submitting}
        onPress={handleSubmit}
      >
        {submitting ? (
          <ActivityIndicator color="#111" />
        ) : (
          <Text style={styles.submitText}>Submit Request</Text>
        )}
      </TouchableOpacity>

      {/* T&C Modal */}
      <Modal visible={showTerms} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.termsContainer}>
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
    fontSize: 26, fontWeight: "700", color: "#fff",
    marginBottom: 20, textAlign: "center", letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#191919", borderRadius: 16,
    marginBottom: 18, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: "#222",
  },
  icon: { marginRight: 8 },
  input: { flex: 1, color: "#fff", fontSize: 17 },
  label: {
    color: "#FF9100", fontSize: 15,
    marginBottom: 6, marginTop: 12,
    fontWeight: "600", marginLeft: 2,
  },
  uploadBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#1A1200", borderRadius: 12,
    padding: 12, marginBottom: 12,
    borderWidth: 1, borderColor: "#FF9100",
    justifyContent: "center", minHeight: 56,
  },
  uploadText: { color: "#FF9100", fontSize: 16, marginLeft: 10, fontWeight: "500" },
  uploadedImg: { width: 52, height: 52, borderRadius: 10, resizeMode: "cover" },
  termsRow: { flexDirection: "row", alignItems: "center", marginTop: 18, marginBottom: 8 },
  termsText: { color: "#fff", fontSize: 15, marginLeft: 8, flex: 1 },
  termsLink: { color: "#FF9100", textDecorationLine: "underline" },
  submitBtn: {
    backgroundColor: "#FF9100", borderRadius: 16,
    paddingVertical: 16, alignItems: "center",
    marginTop: 18, marginBottom: 24,
  },
  submitText: { color: "#111", fontWeight: "bold", fontSize: 17, letterSpacing: 0.5 },
  modalBg: { flex: 1, backgroundColor: "#000A", justifyContent: "center", alignItems: "center" },
  termsContainer: { backgroundColor: "#191919", borderRadius: 18, width: "90%", maxHeight: "80%", paddingTop: 12 },
  termsScroll: { maxHeight: 360 },
  closeBtn: { marginTop: 12, alignSelf: "flex-end", paddingHorizontal: 12 },
  closeText: { color: "#FF9100", fontWeight: "bold", fontSize: 16 },
});
