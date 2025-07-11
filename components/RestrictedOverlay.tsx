import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

interface RestrictedOverlayProps {
  reason?: string;
}

const { width, height } = Dimensions.get("window");

export const RestrictedOverlay: React.FC<RestrictedOverlayProps> = ({
  reason,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons
          name="lock-closed"
          size={80}
          color="#FF0000"
          style={styles.icon}
        />
        <Text style={styles.restrictedText}>RESTRICTED</Text>
        <Text style={styles.subtitle}>Account Access Limited</Text>
        {reason && <Text style={styles.reasonText}>{reason}</Text>}
        <Text style={styles.instructionText}>
          Please complete your KYC verification in the Profile section to
          restore access.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
    maxWidth: width * 0.8,
  },
  icon: {
    marginBottom: 20,
  },
  restrictedText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FF0000",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: "#FF6666",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  reasonText: {
    fontSize: 14,
    color: "#FFAAAA",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  instructionText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.8,
  },
});
