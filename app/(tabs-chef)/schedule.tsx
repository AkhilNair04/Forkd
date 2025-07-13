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
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  breakfast: "#FFB347",
  lunch: "#C67C4E",
  dinner: "#845EC2",
};

const BOOKINGS: Record<
  string,
  { time: string; title: string; tags: string[]; type: keyof typeof COLORS }[]
> = {
  "2025-09-02": [
    {
      type: "breakfast",
      time: "10:00 a.m. - 12:00 noon",
      title: "Breakfast Booking",
      tags: ["#non-veg", "#shellfish-allergy"],
    },
    {
      type: "lunch",
      time: "2:00 p.m. - 3:00 p.m.",
      title: "Lunch Booking",
      tags: ["#vegan", "#peanut-allergy"],
    },
    {
      type: "dinner",
      time: "7:00 p.m. - 8:00 p.m.",
      title: "Dinner Booking",
      tags: [],
    },
  ],
  "2025-09-03": [
    {
      type: "breakfast",
      time: "9:00 a.m. - 10:00 a.m.",
      title: "Breakfast",
      tags: [],
    },
  ],
};

export default function ScheduleScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");

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

  const prevMonth = () => setCurrentMonth(m => addDays(startOfMonth(m), -1));
  const nextMonth = () => setCurrentMonth(m => addDays(endOfMonth(m), 1));

  const renderDay = ({ item: date }: { item: Date }) => {
    const key = format(date, "yyyy-MM-dd");
    const dots = BOOKINGS[key]?.map(b => COLORS[b.type]) ?? [];
    const inMonth = isSameMonth(date, currentMonth);

    return (
      <TouchableOpacity
        onPress={() => setSelectedDate(key)}
        style={[styles.dayCell, !inMonth && styles.outsideMonth]}
      >
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
      </TouchableOpacity>
    );
  };

  const bookings = BOOKINGS[selectedDate] || [];

  return (
    <RestrictedTabWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          {/* Header */}
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

          {/* Weekdays */}
          <View style={styles.weekdays}>
            {["S", "M", "T", "W", "T", "F", "S"].map((w, i) => (
              <Text key={i} style={styles.weekdayText}>
                {w}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <FlatList
            data={calendarDays}
            keyExtractor={d => d.toISOString()}
            numColumns={7}
            renderItem={renderDay}
            scrollEnabled={false}
            contentContainerStyle={styles.grid}
          />

          {/* Booking Preview */}
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>
              {selectedDate ? format(new Date(selectedDate), "do MMMM yyyy") : "No Date Selected"}
            </Text>
            <ScrollView style={styles.sheetScroll}>
              {bookings.length === 0 ? (
                <Text style={{ color: "#aaa", padding: 16 }}>
                  No bookings for this day.
                </Text>
              ) : (
                bookings.map((b, i) => (
                  <View key={i} style={[styles.card, { borderLeftColor: COLORS[b.type] }]}>
                    <Text style={styles.cardTitle}>{b.title}</Text>
                    <Text style={styles.cardTime}>{b.time}</Text>
                    <View style={styles.tagsRow}>
                      {b.tags.map((tag, idx) => (
                        <Text key={idx} style={styles.tag}>
                          {tag}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </RestrictedTabWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 0, // was 4
    height: 50, // reduced from 60
  },
  inner: {
  flex: 1,
  justifyContent: "space-between",
},
sheetScroll: {
  flexGrow: 1,
},
  arrow: { width: 40, alignItems: "center" },
  title: { flex: 1, alignItems: "center" },
  monthText: { color: "#fff", fontSize: 22, fontWeight: "600" }, // slightly smaller
  yearText: { color: "#888", fontSize: 13, marginTop: 1 },

  weekdays: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 0, // reduced spacing
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
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    borderRadius: 6,
  },
  outsideMonth: { opacity: 0.3 },
  dayText: { color: "#fff", fontSize: 16 },
  todayText: { textDecorationLine: "underline" },
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

  sheet: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 450,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cardTime: {
    color: "#ccc",
    marginTop: 4,
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  tag: {
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    color: "#ccc",
    marginRight: 6,
  },
});
