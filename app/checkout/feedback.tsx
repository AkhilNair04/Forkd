// app/checkout/feedback.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function FeedbackScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      Alert.alert("Rating Required", "Please select a rating before submitting.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to submit feedback
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Thank You!",
        "Your feedback has been submitted successfully. We appreciate your review!",
        [
          {
            text: "Continue",
            onPress: () => router.push("/")
          }
        ]
      );
    }, 1500);
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Rate your experience";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return "#ff4444";
    if (rating <= 3) return "#ff9800";
    return "#4CAF50";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate Your Experience</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Feedback Header */}
        <View style={styles.feedbackHeader}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
          </View>
          <Text style={styles.feedbackTitle}>Order Delivered!</Text>
          <Text style={styles.feedbackSubtitle}>
            How was your experience with us?
          </Text>
          {orderId && (
            <Text style={styles.orderId}>Order ID: {orderId}</Text>
          )}
        </View>

        {/* Star Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Rate Your Experience</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRatingPress(star)}
                style={styles.starButton}
              >
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={40}
                  color={star <= rating ? "#FFD700" : "#666"}
                />
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={[styles.ratingText, { color: getRatingColor(rating) }]}>
              {getRatingText(rating)}
            </Text>
          )}
        </View>

        {/* Feedback Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>What did you like?</Text>
          <View style={styles.categoriesContainer}>
            <TouchableOpacity style={styles.categoryButton}>
              <Ionicons name="flash" size={20} color="#FF9100" />
              <Text style={styles.categoryText}>Fast Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryButton}>
              <Ionicons name="restaurant" size={20} color="#FF9100" />
              <Text style={styles.categoryText}>Food Quality</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryButton}>
              <Ionicons name="people" size={20} color="#FF9100" />
              <Text style={styles.categoryText}>Chef Service</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryButton}>
              <Ionicons name="heart" size={20} color="#FF9100" />
              <Text style={styles.categoryText}>Overall Experience</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Written Feedback */}
        <View style={styles.feedbackInputSection}>
          <Text style={styles.sectionTitle}>Share Your Feedback</Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Tell us about your experience..."
            placeholderTextColor="#666"
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Suggestions */}
        <View style={styles.suggestionsSection}>
          <Text style={styles.sectionTitle}>Help Us Improve</Text>
          <View style={styles.suggestionItem}>
            <Ionicons name="bulb-outline" size={20} color="#FF9100" />
            <Text style={styles.suggestionText}>
              Your feedback helps us serve better food and improve our service
            </Text>
          </View>
          <View style={styles.suggestionItem}>
            <Ionicons name="star-outline" size={20} color="#FF9100" />
            <Text style={styles.suggestionText}>
              Rate your chef to help other customers discover great food
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[styles.submitButton, { opacity: rating > 0 ? 1 : 0.5 }]}
          onPress={handleSubmitFeedback}
          disabled={rating === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Submitting...</Text>
          ) : (
            <>
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.skipButtonText}>Skip for Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  feedbackHeader: {
    alignItems: "center",
    paddingVertical: 30,
  },
  successIcon: {
    marginBottom: 16,
  },
  feedbackTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  feedbackSubtitle: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  orderId: {
    color: "#FF9100",
    fontSize: 14,
    fontWeight: "600",
  },
  ratingSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  starButton: {
    paddingHorizontal: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
  },
  categoriesSection: {
    marginBottom: 32,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    width: "48%",
    borderWidth: 1,
    borderColor: "#333",
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 6,
  },
  feedbackInputSection: {
    marginBottom: 32,
  },
  feedbackInput: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#333",
  },
  suggestionsSection: {
    marginBottom: 20,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  suggestionText: {
    color: "#999",
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  submitContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9100",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  skipButton: {
    alignItems: "center",
    padding: 12,
  },
  skipButtonText: {
    color: "#666",
    fontSize: 14,
  },
});
