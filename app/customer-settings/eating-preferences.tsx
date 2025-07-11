import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DIETARY_OPTIONS = [
  "Vegan",
  "Non-veg",
  "Vegetarian",
  "Pescatarian",
  "Keto",
];
const ALLERGY_OPTIONS = ["Diary", "Peanut", "Gluten", "shellfish", "soy"];

export default function EatingPreferencesScreen() {
  const [selectedDiets, setSelectedDiets] = useState<string[]>(["Vegan"]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(["Dairy"]);
  const [notes, setNotes] = useState(
    "Need about 2 - 3 portions, thinking of having some Aglio Oglio pasta."
  );
  const [isLactoseIntolerant, setIsLactoseIntolerant] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedPreferences = await AsyncStorage.getItem('eatingPreferences');
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        setSelectedDiets(preferences.selectedDiets || ["Vegan"]);
        setSelectedAllergies(preferences.selectedAllergies || ["Dairy"]);
        setNotes(preferences.notes || "");
        setIsLactoseIntolerant(preferences.isLactoseIntolerant || false);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      setLoading(true);
      const preferences = {
        selectedDiets,
        selectedAllergies,
        notes,
        isLactoseIntolerant,
        lastUpdated: new Date().toISOString(),
      };
      await AsyncStorage.setItem('eatingPreferences', JSON.stringify(preferences));
      Alert.alert('Success', 'Your eating preferences have been saved!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDiet = (diet: string) => {
    setSelectedDiets(prev => 
      prev.includes(diet)
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    );
  };

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies(prev => 
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerText}>
          Preferences
        </ThemedText>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={savePreferences}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dietary Preferences */}
        <View style={styles.sectionBox}>
          <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>
            DIETARY PREFERENCES:
          </ThemedText>
          <View style={styles.pillRow}>
            {DIETARY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pill,
                  selectedDiets.includes(option) && styles.pillSelected,
                ]}
                onPress={() => toggleDiet(option)}
              >
                <Text
                  style={[
                    styles.pillText,
                    selectedDiets.includes(option) && styles.pillTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Allergies */}
        <View style={styles.sectionBox}>
          <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>
            ALLERGIES:
          </ThemedText>
          <View style={styles.pillRow}>
            {ALLERGY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pill,
                  selectedAllergies.includes(option) && styles.pillSelected,
                ]}
                onPress={() => toggleAllergy(option)}
              >
                <Text
                  style={[
                    styles.pillText,
                    selectedAllergies.includes(option) && styles.pillTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Lactose Intolerant Checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setIsLactoseIntolerant((prev) => !prev)}
            activeOpacity={0.7}
          >
            <View style={styles.checkboxBox}>
              {isLactoseIntolerant ? (
                <Feather name="check-square" size={22} color={PRIMARY} />
              ) : (
                <Feather name="square" size={22} color="#bbb" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Lactose Intolerant</Text>
          </TouchableOpacity>
        </View>
        {/* Default Notes */}
        <View style={styles.notesSection}>
          <ThemedText type="defaultSemiBold" style={styles.notesLabel}>
            DEFAULT NOTES:
          </ThemedText>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Add any notes for your chef..."
            placeholderTextColor="#bbb"
          />
        </View>
        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>SAVE</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const PRIMARY = "#b87a51";
const BG = "#111";
const CARD = "#444";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 38,
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 18,
  },
  backButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 30,
    padding: 7,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: 50, // Compensate for save button
  },
  saveButton: {
    backgroundColor: "#C67C4E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    marginHorizontal: 18,
    marginBottom: 22,
    padding: 16,
  },
  sectionLabel: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  pill: {
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginBottom: 8,
  },
  pillSelected: {
    backgroundColor: "#fff",
  },
  pillText: {
    color: "#fff",
    fontSize: 16,
  },
  pillTextSelected: {
    color: PRIMARY,
    fontWeight: "600",
  },
  seeAllBtn: {
    paddingHorizontal: 6,
    marginTop: 8,
  },
  seeAllText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    alignSelf: "center",
  },
  notesSection: {
    marginHorizontal: 18,
    marginBottom: 18,
  },
  notesLabel: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  notesInput: {
    backgroundColor: "#f4f4f4",
    color: "#222",
    borderRadius: 12,
    minHeight: 70,
    padding: 14,
    fontSize: 16,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: '#C67C4E',
    marginHorizontal: 18,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 2,
  },
  checkboxBox: {
    marginRight: 10,
  },
  checkboxLabel: {
    color: "#fff",
    fontSize: 16,
  },
});
