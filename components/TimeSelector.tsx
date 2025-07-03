import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export type Time = {
  label: string;
  available: boolean;
};

interface TimeSelectorProps {
  times: Time[];
  selectedTimes: string[];
  setSelectedTimes: (times: string[]) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  hours: number;
  setHours: (value: number) => void;
}

export default function TimeSelector({
  times,
  selectedTimes,
  setSelectedTimes,
  startTime,
  setStartTime,
  hours,
  setHours,
}: TimeSelectorProps) {
  const [openDropdown, setOpenDropdown] = React.useState(false);

  const toggleTime = (label: string) => {
    if (selectedTimes.includes(label)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== label));
    } else {
      setSelectedTimes([...selectedTimes, label]);
    }
  };

  const getStartTimeOptions = () => {
    if (selectedTimes.includes("Breakfast")) {
      return [
        { label: "7:00 AM", value: "7:00 AM" },
        { label: "8:00 AM", value: "8:00 AM" },
        { label: "9:00 AM", value: "9:00 AM" },
        { label: "10:00 AM", value: "10:00 AM" },
      ];
    } else if (selectedTimes.includes("Lunch")) {
      return [
        { label: "12:00 PM", value: "12:00 PM" },
        { label: "1:00 PM", value: "1:00 PM" },
        { label: "2:00 PM", value: "2:00 PM" },
        { label: "3:00 PM", value: "3:00 PM" },
      ];
    } else if (selectedTimes.includes("Dinner")) {
      return [
        { label: "6:00 PM", value: "6:00 PM" },
        { label: "7:00 PM", value: "7:00 PM" },
        { label: "8:00 PM", value: "8:00 PM" },
        { label: "9:00 PM", value: "9:00 PM" },
      ];
    }
    return [];
  };

  const startTimeOptions = getStartTimeOptions();

  return (
    <>
      <Text style={styles.sectionTitle}>Select Time Slots:</Text>
      <View style={styles.timeRow}>
        {times.map((time) => {
          const isSelected = selectedTimes.includes(time.label);
          return (
            <TouchableOpacity
              key={time.label}
              disabled={!time.available}
              style={[
                styles.timeButton,
                isSelected && time.available && styles.timeSelected,
                !time.available && { opacity: 0.4 },
              ]}
              onPress={() => time.available && toggleTime(time.label)}
            >
              <Text
                style={{
                  color: time.available
                    ? isSelected
                      ? "black"
                      : "white"
                    : "#999",
                  fontWeight: "bold",
                  textDecorationLine: time.available ? "none" : "line-through",
                }}
              >
                {time.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Start Time Dropdown */}

      <View style={styles.startTimeRow}>
        <Text style={styles.startTimeLabel}>Start Time :</Text>
        <DropDownPicker
          open={openDropdown}
          value={startTime}
          items={startTimeOptions}
          setOpen={setOpenDropdown}
          setValue={(callback) => {
            const val = callback(startTime); // get value from callback
            setStartTime(val);
          }}
          setItems={() => {}}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdownStyle}
          dropDownContainerStyle={{ backgroundColor: "#fff" }}
          textStyle={{ color: "#000" }}
          placeholder="Select Time"
        />
      </View>

      {/* Hours Selector */}

      <View style={styles.hoursRow}>
        <Text style={styles.startTimeLabel}>Hours :</Text>
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
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#333",
    borderWidth: 2,
    borderColor: "#fff",
  },
  timeSelected: {
    backgroundColor: "white",
  },
  startTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // or use marginRight on label
    marginBottom: 16,
    zIndex: 1000,
    marginTop: 20,
  },
  startTimeLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  dropdownContainer: {
    width: "70%",
  },
  dropdownStyle: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
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
