// app/(onboarding-customers)/kyc_cus_birthday.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { supabase } from "@/constants/supabase";

export default function KycCusBirthday() {
  const router = useRouter();
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  const formatted = date
    ? date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const handleConfirm = async () => {
    if (!date) return;
    setLoading(true);

    // get current user
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      console.error("Auth error:", userErr);
      setLoading(false);
      return;
    }

    // update user_profiles.dob
    const { error: updateErr } = await supabase
      .from("user_profiles")
      .update({ dob: date.toISOString() })
      .eq("user_id", user.id);

    setLoading(false);
    if (updateErr) {
      console.error("Update dob error:", updateErr);
      return;
    }

    // navigate onward
    router.replace("/dietary_restrictions");
  };

  const handleSkip = () => {
    router.replace("/dietary_restrictions");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.inner}
      >
        <View style={styles.content}>
          <Text style={styles.header}>When’s your birthday?</Text>

          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{ width: "100%" }}
          >
            <TextInput
              style={styles.input}
              placeholder="DD MMM YYYY"
              placeholderTextColor="#555"
              value={formatted}
              editable={false}
            />
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={onChange}
            />
          )}

          <TouchableOpacity
            style={[
              styles.button,
              (!date || loading) && styles.buttonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!date || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Saving..." : "CONFIRM"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} style={styles.skip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>

          <Text style={styles.note}>Get a free dish on us!</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  inner: { flex: 1, justifyContent: "center" }, // center vertically
  content: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#888",
    color: "#fff",
    fontSize: 18,
    paddingVertical: 12,
    marginBottom: 30,
  },
  button: {
    width: "100%",
    backgroundColor: "#C67C4E",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  skip: {
    marginBottom: 30,
  },
  skipText: {
    color: "#FF9900",
    fontSize: 16,
  },
  note: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
  },
});
