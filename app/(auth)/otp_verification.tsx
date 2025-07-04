// app/otp-verification.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/constants/supabase";

export default function OtpVerification() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(60);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const handleChange = (txt: string, idx: number) => {
    if (!/^\d?$/.test(txt)) return;
    const arr = [...code];
    arr[idx] = txt;
    setCode(arr);
    if (txt && idx < code.length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const token = code.join("");
    const phone = (await AsyncStorage.getItem("phoneForOTP")) || "";
    if (!phone) {
      return Alert.alert("Error", "No phone found. Retry sign-up.");
    }

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    if (error) {
      return Alert.alert("OTP Error", error.message);
    }

    // success!
    const isNew = (await AsyncStorage.getItem("isNewUser")) === "true";
    if (isNew) {
      const role = (await AsyncStorage.getItem("userRole")) || "customer";
      if (role === "chef") {
        router.replace("/(onboarding-chefs)/chef_kyc");
      } else {
        router.replace("/(onboarding-customers)/kyc_landing_accept");
      }
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleResend = async () => {
    setSecondsLeft(60);
    setCode(Array(6).fill(""));
    inputRefs.current[0]?.focus();

    const phone = (await AsyncStorage.getItem("phoneForOTP")) || "";
    if (!phone) {
      return Alert.alert("Error", "No phone to resend OTP to.");
    }
    await supabase.auth.signInWithOtp({ phone });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Verification</Text>
      <Text style={styles.subheader}>
        Enter the 6-digit code we sent you{"\n"}
        <Text style={styles.validityText}>(Valid for 60 seconds)</Text>
      </Text>

      <View style={styles.formWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.codeRow}>
            {code.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                style={styles.codeBox}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(t) => handleChange(t, idx)}
                returnKeyType={idx < code.length - 1 ? "next" : "done"}
                onSubmitEditing={() => {
                  if (idx === code.length - 1) handleVerify();
                }}
              />
            ))}
          </View>

          <View style={styles.resendRow}>
            {secondsLeft <= 0 ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendTextActive}>Resend</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={styles.resendTextInactive}>Resend</Text>
                <Text style={styles.resendCountdown}> in {secondsLeft}s</Text>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
            <Text style={styles.verifyText}>VERIFY</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  subheader: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 22,
  },
  validityText: {
    color: "#f59e0b",
    fontWeight: "600",
  },
  formWrapper: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    overflow: "hidden",
  },
  scrollInner: {
    padding: 24,
    paddingBottom: 60,
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  codeBox: {
    width: 50,
    height: 50,
    backgroundColor: "#ECEFF4",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  resendTextActive: {
    color: "#fff",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  resendTextInactive: {
    color: "#ccc",
  },
  resendCountdown: {
    color: "#ccc",
  },
  verifyBtn: {
    backgroundColor: "#C67C4E",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },
  verifyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
