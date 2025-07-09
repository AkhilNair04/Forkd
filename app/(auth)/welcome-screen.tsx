import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/select-lang");
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
    width: '100%',
    height: '100%',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  fadeBox: {
    padding: 30,
    paddingBottom: 50,
    justifyContent: "center",
    alignItems: "center",
    minHeight: height * 0.4,
  },
  textContainer: {
    alignItems: "center",
    width: "100%",
    maxWidth: width * 0.9,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 10,
    padding: 20,
  },
  welcomeText: {
    fontSize: Math.min(28, width * 0.07),
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: Math.min(16, width * 0.04),
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#D4A373",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: width * 0.4,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Math.min(18, width * 0.045),
    color: "white",
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
