import { useRef } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

type Day = {
  id: string;
  dayName: string;
  date: number;
  month: number;
  fullDate: Date;
  isToday: boolean;
};

interface ScheduleDatePickerProps {
  upcomingDays: Day[];
  selectedDay: number;
  setSelectedDay: (index: number) => void;
}

export default function ScheduleDatePicker({
  upcomingDays,
  selectedDay,
  setSelectedDay,
}: ScheduleDatePickerProps) {
  const flatListRef = useRef<FlatList>(null);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const handleDaySelect = (index: number) => {
    setSelectedDay(index);
    scrollToIndex(index);
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Schedule For:</Text>
      <View style={styles.datePickerContainer}>
        <FlatList
          ref={flatListRef}
          data={upcomingDays}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateListContent}
          initialScrollIndex={0}
          getItemLayout={(_, index) => ({
            length: 60,
            offset: 60 * index,
            index,
          })}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const isSelected = selectedDay === index;
            const isToday = item.isToday;

            return (
              <TouchableOpacity
                style={[
                  styles.dateItem,
                  isSelected && styles.dateItemSelected,
                  !isSelected && isToday && styles.todayItem,
                ]}
                onPress={() => handleDaySelect(index)}
              >
                <Text
                  style={[
                    styles.dayNameText,
                    isSelected ? styles.selectedText : isToday && styles.todayText,
                  ]}
                >
                  {item.dayName}
                </Text>
                <Text
                  style={[
                    styles.dateNumberText,
                    isSelected ? styles.selectedText : isToday && styles.todayText,
                  ]}
                >
                  {item.date}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 20,
  },
  datePickerContainer: {
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  dateListContent: {
    paddingHorizontal: 10,
  },
  dateItem: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  dateItemSelected: {
    backgroundColor: "#C67C4E",
  },
  todayItem: {
    borderColor: "#C67C4E",
    borderWidth: 1,
  },
  dayNameText: {
    color: "#ccc",
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 18,
  },
  dateNumberText: {
    color: "#ccc",
    fontSize: 22,
    fontWeight: "bold",
  },
  selectedText: {
    color: "#fff",
  },
  todayText: {
    color: "#C67C4E",
  },
});
