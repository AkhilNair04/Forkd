import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, Pressable } from "react-native";

export type Time = {
  label: string;
  available: boolean;
};

interface TimeSelectorProps {
  
  selectedTimes: string[];
  setSelectedTimes: (times: string[]) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  hours: number;
  setHours: (value: number) => void;
}

const timeOptions = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", 
  "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", 
  "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", 
  "9:00 PM", "10:00 PM"
];

export default function TimeSelector({
  startTime,
  setStartTime,
  hours,
  setHours,
}: TimeSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Text style={styles.sectionTitle}>Select Time Slots:</Text>

      <View style={styles.startTimeRow}>
        <Text style={styles.startTimeLabel}>Start Time:</Text>
        <TouchableOpacity 
          style={styles.customDropdown} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.dropdownText}>
            {startTime || "Select Time"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              {timeOptions.map((time) => (
                <Pressable
                  key={time}
                  style={[
                    styles.option,
                    startTime === time && styles.selectedOption
                  ]}
                  onPress={() => {
                    setStartTime(time);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{time}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.hoursRow}>
        <Text style={styles.startTimeLabel}>Hours:</Text>
        <View style={styles.hoursControl}>
          <TouchableOpacity
            style={styles.hourButton}
            onPress={() => setHours(Math.max(1, hours - 1))}
          >
            <Text style={styles.hourButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.hoursText}>{hours}</Text>
          <TouchableOpacity
            style={styles.hourButton}
            onPress={() => setHours(hours + 1)}
          >
            <Text style={styles.hourButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  startTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    marginTop: 20,
  },
  startTimeLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  customDropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 16,
    width: "70%",
  },
  dropdownText: {
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "80%",
    maxHeight: "60%",
  },
  scrollView: {
    width: "100%",
  },
  scrollContent: {
    paddingVertical: 10,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#f0f0f0",
  },
  optionText: {
    color: "#000",
    fontSize: 16,
  },
  hoursRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
    alignSelf: "center",
  },
  hoursControl: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  hourButton: {
    backgroundColor: "#242426",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  hourButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  hoursText: {
    color: "white",
    fontSize: 18,
    marginHorizontal: 20,
  },
});