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
    padding: 20,
    paddingBottom: 60,
    justifyContent: "flex-end",
    alignItems: "center",
    minHeight: height * 0.5,
  },
  textContainer: {
    alignItems: "center",
    width: "100%",
    maxWidth: width * 0.85,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 15,
    padding: 25,
    marginHorizontal: 20,
  },
  welcomeText: {
    fontSize: Math.min(32, width * 0.08),
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: Math.min(16, width * 0.042),
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
    opacity: 0.9,
  },
  button: {
    backgroundColor: "#D4A373",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: Math.min(18, width * 0.045),
    color: "white",
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
