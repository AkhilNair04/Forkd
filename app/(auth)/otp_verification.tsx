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
  // six-digit code state
  const [code, setCode] = useState(Array(6).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(60);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // countdown timer
  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (text: string, idx: number) => {
    if (!/^\d?$/.test(text)) return;
    const updated = [...code];
    updated[idx] = text;
    setCode(updated);
    // auto-focus next
    if (text && idx < code.length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const token = code.join("");
    // retrieve phone saved during signup
    const phone = (await AsyncStorage.getItem("phoneForOTP")) || "";
    if (!phone) {
      Alert.alert("Error", "No phone number found. Please retry sign-up.");
      return;
    }

    // verify via Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    if (error) {
      Alert.alert("OTP Error", error.message);
      return;
    }

    // signed in successfully
    const isNew = (await AsyncStorage.getItem("isNewUser")) === "true";
    if (isNew) {
      router.replace("../(onboarding-customers)/kyc_cus_name");
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleResend = async () => {
    // reset timer & inputs
    setSecondsLeft(60);
    setCode(Array(6).fill(""));
    inputRefs.current[0]?.focus();

    // re-trigger Supabase OTP send
    const phone = (await AsyncStorage.getItem("phoneForOTP")) || "";
    if (!phone) return Alert.alert("Error", "No phone to resend OTP to.");

    await supabase.auth.signInWithOtp({ phone });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Verification</Text>
      <Text style={styles.subheader}>
        Enter the 6-digit code we sent you
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
                ref={(el) => { inputRefs.current[idx] = el }}
                style={styles.codeBox}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(txt) => handleChange(txt, idx)}
                returnKeyType={idx < code.length - 1 ? "next" : "done"}
                onSubmitEditing={() => {
                  if (idx === code.length - 1) handleVerify();
                }}
              />
            ))}
          </View>

          <View style={styles.resendRow}>
            {secondsLeft === 0 ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendTextActive}>Resend</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={styles.resendTextInactive}>Resend</Text>
                <Text style={styles.resendCountdown}>
                  {" "}
                  in {secondsLeft}s
                </Text>
              </>
            )}
          </View>

          <TouchableOpacity
            style={styles.verifyBtn}
            onPress={handleVerify}
          >
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
