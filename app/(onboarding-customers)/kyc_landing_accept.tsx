import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { router } from "expo-router";

export default function KycLandingAccept() {
  const handleProceed = () => {
    // Navigate to your next KYC detail page
    router.replace('/kyc_cus_name');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.header}>Great!</Text>
        <Text style={styles.subheader}>Now, let us get to know you.</Text>

        <TouchableOpacity style={styles.button} onPress={handleProceed}>
          <Text style={styles.buttonText}>PROCEED</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  inner: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  header: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  subheader: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 40,
  },
  button: {
    width: "100%",
    backgroundColor: "#C67C4E",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
