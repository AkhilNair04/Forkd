import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("../customer-settings/settings");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/chef-cooking-pic.png")}
        style={styles.image}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.7)", "transparent"]}
          style={styles.fadeBox}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        >
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Fork'd welcomes you!</Text>
            <Text style={styles.descriptionText}>
              Browse and hire home chefs and home-made meals for a hearty meal!
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  fadeBox: {
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 10,
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#D4A373",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
