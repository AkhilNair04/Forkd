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
import { router } from "expo-router";

export default function KycCusBirthday() {
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (_: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  const formatted = date
    ? date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "";

  const handleConfirm = () => {
    // TODO: save birthday
    router.push('/dietary_restrictions'); // adjust to your next route
  };

  const handleSkip = () => {
    router.push('/dietary_restrictions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.inner}
      >
        <View style={styles.content}>
          <Text style={styles.header}>When’s your birthday?</Text>

          {/* Underline “input” */}
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <View pointerEvents="none">
              <TextInput
                style={styles.input}
                placeholder="DD MMM YYYY"
                placeholderTextColor="#555"
                value={formatted}
                editable={false}
              />
            </View>
          </TouchableOpacity>

          {/* Date Picker */}
          {showPicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={onChange}
            />
          )}

          {/* Confirm */}
          <TouchableOpacity
            style={[styles.button, !date && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={!date}
          >
            <Text style={styles.buttonText}>CONFIRM</Text>
          </TouchableOpacity>

          {/* Skip */}
          <TouchableOpacity onPress={handleSkip} style={styles.skip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>

          {/* Footer note */}
          <Text style={styles.note}>Get a free dish on us!</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  inner: { flex: 1, justifyContent: "flex-end" },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#888",
    color: "#fff",
    fontSize: 18,
    paddingVertical: 12,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#C67C4E",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
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
    marginTop: 16,
    alignItems: "center",
  },
  skipText: {
    color: "#FF9900",
    fontSize: 16,
  },
  note: {
    textAlign: "center",
    color: "#888",
    marginTop: 30,
    fontSize: 14,
  },
});
