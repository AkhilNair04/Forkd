import { RestrictedTabWrapper } from "@/components/RestrictedTabWrapper";
import { supabase } from "@/constants/supabase";
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
import { useEffect, useMemo, useState } from "react";
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

type BookingType = {
  title: string;
  time: string;
  tags: string[];
  type: keyof typeof COLORS;
};

function categorizeMealType(orderTime: string): keyof typeof COLORS | null {
  const hour = new Date(orderTime).getHours();
  if (hour >= 5 && hour < 11) return "breakfast";
  if (hour >= 11 && hour < 16) return "lunch";
  if (hour >= 16 && hour < 23) return "dinner";
  return null;
}

export default function ScheduleScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [bookingsMap, setBookingsMap] = useState<Record<string, BookingType[]>>({});

  useEffect(() => {
    const fetchBookings = async () => {
      const session = await supabase.auth.getSession();
      const user = session.data.session?.user;
      if (!user) return;

      const { data: chefData } = await supabase
        .from("Chef")
        .select("uuid")
        .eq("uuid", user.id)
        .single();

      if (!chefData) return;

      const { data: orders, error } = await supabase
        .from("Orders")
        .select("order_id, order_time, delivery_notes")
        .eq("chef_id", chefData.uuid);

      if (error || !orders) return;

      const map: Record<string, BookingType[]> = {};
      for (const order of orders) {
        const dateKey = format(new Date(order.order_time), "yyyy-MM-dd");
        const mealType = categorizeMealType(order.order_time);
        if (!mealType) continue;
        const timeStr = format(new Date(order.order_time), "h:mm a");

        const booking: BookingType = {
          title: `Chef Booking`,
          time: timeStr,
          tags: [order.delivery_notes || ""],
          type: mealType,
        };
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push(booking);
      }
      setBookingsMap(map);
    };

    fetchBookings();
  }, []);

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
    const dots = bookingsMap[key]?.map((b: BookingType) => COLORS[b.type]) ?? [];
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
          {dots.map((color: string, i: number) => (
            <View key={i} style={[styles.dot, { backgroundColor: color }]} />
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  const bookings = bookingsMap[selectedDate] || [];

  return (
    <RestrictedTabWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
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

          <View style={styles.weekdays}>
            {["S", "M", "T", "W", "T", "F", "S"].map((w, i) => (
              <Text key={i} style={styles.weekdayText}>{w}</Text>
            ))}
          </View>

          <FlatList
            data={calendarDays}
            keyExtractor={d => d.toISOString()}
            numColumns={7}
            renderItem={renderDay}
            scrollEnabled={false}
            contentContainerStyle={styles.grid}
          />

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
                bookings.map((b: BookingType, i: number) => (
                  <View key={i} style={[styles.card, { borderLeftColor: COLORS[b.type] }]}>\n                    <Text style={styles.cardTitle}>{b.title}</Text>
                    <Text style={styles.cardTime}>{b.time}</Text>
                    <View style={styles.tagsRow}>
                      {b.tags.map((tag: string, idx: number) => (
                        <Text key={idx} style={styles.tag}>{tag}</Text>
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
  inner: { flex: 1, justifyContent: "space-between" },
  sheetScroll: { flexGrow: 1 },
  header: { flexDirection: "row", alignItems: "center", marginHorizontal: 16, height: 50 },
  arrow: { width: 40, alignItems: "center" },
  title: { flex: 1, alignItems: "center" },
  monthText: { color: "#fff", fontSize: 22, fontWeight: "600" },
  yearText: { color: "#888", fontSize: 13, marginTop: 1 },
  weekdays: { flexDirection: "row", marginHorizontal: 16 },
  weekdayText: { flex: 1, color: "#888", textAlign: "center", fontWeight: "600" },
  grid: { paddingHorizontal: 16 },
  dayCell: { flex: 1, aspectRatio: 1, alignItems: "center", justifyContent: "center", margin: 2, borderRadius: 6 },
  outsideMonth: { opacity: 0.3 },
  dayText: { color: "#fff", fontSize: 16 },
  todayText: { textDecorationLine: "underline" },
  dotsRow: { flexDirection: "row", marginTop: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 1 },
  sheet: { backgroundColor: "#1a1a1a", padding: 16, paddingBottom: 32, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 450 },
  sheetTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  card: { backgroundColor: "#222", borderRadius: 10, padding: 12, marginBottom: 10, borderLeftWidth: 4 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cardTime: { color: "#ccc", marginTop: 4, marginBottom: 6 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  tag: { backgroundColor: "#333", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, fontSize: 12, color: "#ccc", marginRight: 6 },
});