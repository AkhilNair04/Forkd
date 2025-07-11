// app/(tabs-chef)/schedule.tsx
import { RestrictedTabWrapper } from "@/components/RestrictedTabWrapper";
import { Ionicons } from "@expo/vector-icons";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

// your dot data:
const MARKED: Record<string, string[]> = {
  "2025-09-02": ["#C67C4E", "#4fc24f", "#845ec2"],
  "2025-09-03": ["#0d99ff", "#0d99ff"],
  "2025-09-06": ["#4fc24f"],
  // …etc
};

export default function ScheduleScreen() {
  const colorScheme = useColorScheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate a flat array of Date objects for the calendar grid:
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    const days: Date[] = [];
    let cursor = start;
    while (cursor <= end) {
      days.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return days;
  }, [currentMonth]);

  const prevMonth = () => setCurrentMonth((m) => addDays(startOfMonth(m), -1));
  const nextMonth = () => setCurrentMonth((m) => addDays(endOfMonth(m), 1));

  const renderDay = ({ item: date }: { item: Date }) => {
    const key = format(date, "yyyy-MM-dd");
    const dots = MARKED[key] || [];
    const inMonth = isSameMonth(date, currentMonth);
    return (
      <View style={[styles.dayCell, !inMonth && styles.outsideMonth]}>
        <Text
          style={[
            styles.dayText,
            isSameDay(date, new Date()) && styles.todayText,
          ]}
        >
          {format(date, "d")}
        </Text>
        <View style={styles.dotsRow}>
          {dots.map((color, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: color }]} />
          ))}
        </View>
      </View>
    );
  };

  return (
    <RestrictedTabWrapper>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={prevMonth} style={styles.arrow}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.title}>
            <Text style={styles.monthText}>{format(currentMonth, "LLLL")}</Text>
            <Text style={styles.yearText}>{format(currentMonth, "yyyy")}</Text>
          </View>

          <TouchableOpacity onPress={nextMonth} style={styles.arrow}>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* weekdays header */}
        <View style={styles.weekdays}>
          {["S", "M", "T", "W", "T", "F", "S"].map((w, i) => (
            <Text key={i} style={styles.weekdayText}>
              {w}
            </Text>
          ))}
        </View>

        {/* days grid */}
        <FlatList
          data={calendarDays}
          keyExtractor={(d) => d.toISOString()}
          numColumns={7}
          renderItem={renderDay}
          scrollEnabled={false}
          contentContainerStyle={styles.grid}
        />
      </View>
    </RestrictedTabWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", paddingTop: 24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
    height: 60,
  },
  arrow: { width: 40, alignItems: "center" },
  title: { flex: 1, alignItems: "center" },
  monthText: { color: "#fff", fontSize: 24, fontWeight: "600" },
  yearText: { color: "#888", fontSize: 14, marginTop: 2 },

  weekdays: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 4,
  },
  weekdayText: {
    flex: 1,
    color: "#888",
    textAlign: "center",
    fontWeight: "600",
  },

  grid: { paddingHorizontal: 16 },
  dayCell: {
    flex: 1,
    aspectRatio: 1, // square cells
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    borderRadius: 6,
  },
  outsideMonth: {
    opacity: 0.3,
  },
  dayText: {
    color: "#fff",
    fontSize: 16,
  },
  todayText: {
    textDecorationLine: "underline",
  },
  dotsRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
});
