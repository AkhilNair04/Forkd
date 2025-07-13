import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StarRating from "react-native-star-rating-widget";
import { supabase } from "../../lib/supabase";

interface Props {
  orderId: string; // Pass order_id as prop or fetch from context/params
}

export default function OrderRatingScreen({ orderId }: Props) {
  const [dishRating, setDishRating] = useState(4);
  const [riderRating, setRiderRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from("Orders")
        .update({
          dish_rating: dishRating,
          rider_rating: riderRating,
        })
        .eq("order_id", orderId);

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Thanks for your feedback!");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong.");
      console.error(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ionicons name="checkmark-circle-outline" size={120} color="#C67C4E" />

      <Text style={styles.title}>Order Delivered!</Text>
      <Text style={styles.subtitle}>Please let us know your thoughts!!</Text>

      <Text style={styles.label}>DISH RATING:</Text>
      <StarRating
        rating={dishRating}
        onChange={setDishRating}
        starSize={36}
        color="#C67C4E"
      />

      <Text style={styles.label}>RIDER RATING:</Text>
      <StarRating
        rating={riderRating}
        onChange={setRiderRating}
        starSize={36}
        color="#C67C4E"
      />

      <Text style={styles.label}>DETAILED REVIEW:</Text>
      <TextInput
        multiline
        placeholder="I loved the dish, it was very well prepared!"
        value={review}
        onChangeText={setReview}
        style={styles.input}
        placeholderTextColor="#777"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#000",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
    alignSelf: "flex-start",
  },
  input: {
    backgroundColor: "#f0f4fa",
    padding: 16,
    width: "100%",
    borderRadius: 12,
    marginTop: 10,
    color: "#333",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#C67C4E",
    borderRadius: 14,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
