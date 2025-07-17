import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface HireSectionProps {
  note: string;
  setNote: (text: string) => void;
  onHire: () => void;
}

export default function HireSection({ note, setNote, onHire }: HireSectionProps) {
  const [localNote, setLocalNote] = useState(note);

  // Sync the localNote with the parent's note if it changes externally
  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const handleHirePress = () => {
    setNote(localNote); // Update parent state only when hiring
    onHire();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>NOTES :</Text>
      <TextInput
        value={localNote}
        onChangeText={setLocalNote}
        placeholder="Add any special instructions for the chef..."
        placeholderTextColor="#999"
        style={styles.noteInput}
        multiline
      />

      <TouchableOpacity style={styles.hireButton} onPress={handleHirePress}>
        <Text style={styles.hireButtonText}>Hire Chef</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles remain the same...

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noteInput: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 16,
    fontSize: 14,
    height: 100,
  },
  hireButton: {
    backgroundColor: "#C67C4E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  hireButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
