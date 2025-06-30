import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

export default function OtpVerification() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Countdown timer
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

    if (text && idx < 3) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleVerify = () => {
    // TODO: actual OTP verify logic
    router.replace("/(tabs)");
  };

  const handleResend = () => {
    // TODO: trigger resend OTP API
    setSecondsLeft(60);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Verification</Text>
      <Text style={styles.subheader}>We have sent a code to your email</Text>
      <Text style={styles.email}>example@gmail.com</Text>

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
                ref={(el) => {
                  /* assign and return void */
                  inputRefs.current[idx] = el;
                }}
                style={styles.codeBox}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(txt) => handleChange(txt, idx)}
                returnKeyType={idx < 3 ? "next" : "done"}
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
  },
  email: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 8,
  },
  formWrapper: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    marginTop: 20,
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
    width: 70,
    height: 70,
    backgroundColor: "#ECEFF4",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 28,
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
