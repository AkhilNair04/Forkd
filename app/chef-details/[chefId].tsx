import HireSection from "@/components/HireSection";
import ScheduleDatePicker from "@/components/ScheduleDatePicker";
import TimeSelector from "@/components/TimeSelector";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const chefs = [
  {
    id: "1",
    name: "Chef Anna P",
    specialties: ["Italian", "French"],
    rating: 4.7,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    pricePerHour: 450,
    verified: true,
    availableTimes: [
      { label: "Breakfast", available: false },
      { label: "Lunch", available: true },
      { label: "Dinner", available: true },
    ],
  },
  {
    id: "2",
    name: "Chef Ravi K",
    specialties: ["Indian", "Thai"],
    rating: 4.5,
    image: "https://randomuser.me/api/portraits/men/66.jpg",
    pricePerHour: 400,
    verified: false,
    availableTimes: [
      { label: "Breakfast", available: false },
      { label: "Lunch", available: true },
      { label: "Dinner", available: false },
    ],
  },
];

export default function ChefDetails() {
  const { chefId } = useLocalSearchParams();
  const chef = chefs.find((c) => c.id === chefId);
  const [showTooltip, setShowTooltip] = useState(false);

  // Schedule section
  const [selectedDay, setSelectedDay] = useState(0);

  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      days.push({
        id: i.toString(),
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
        month: date.getMonth() + 1,
        fullDate: date,
        isToday: i === 0,
      });
    }

    return days;
  };

  const upcomingDays = getUpcomingDays();

  // Time selector
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(1);

  const [note, setNote] = useState("");

  const handleHireChef = () => {
  console.log("Hired with note:", note);
  // Navigate or show confirmation
};


  if (!chef) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>Chef not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        <FlatList
          data={[]}
          renderItem={null}
          ListHeaderComponent={() => (
            <>
              <View style={styles.headerRow}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>{chef.name}</Text>
              </View>
              <View style={styles.headerContainer}>
                <Image
                  source={{ uri: chef?.image }}
                  style={styles.chefImage}
                  resizeMode="cover"
                />
                <View style={styles.chefDetails}>
                  <View style={styles.nameRow}>
                    <Text
                      style={styles.chefName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {chef?.name}
                    </Text>
                    {chef?.verified && (
                      <TouchableOpacity
                        onPress={() => setShowTooltip(!showTooltip)}
                        style={{ position: "relative" }}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#C67C4E"
                          style={styles.verifiedIcon}
                        />
                        {showTooltip && (
                          <View style={styles.tooltip}>
                            <Text style={styles.tooltipText}>
                              Fork&apos;d Verified Chef
                            </Text>
                            <View style={styles.tooltipArrow} />
                          </View>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.specialty}>Specialty</Text>
                  <Text style={styles.cuisine}>
                    {chef?.specialties?.join(", ")}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#FDC913" />
                    <Text style={styles.rating}>{chef?.rating}</Text>
                  </View>
                  <Text style={styles.price}>Rs. {chef?.pricePerHour}/Hr</Text>
                </View>
              </View>
              <ScheduleDatePicker
                upcomingDays={upcomingDays}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
              />
              <TimeSelector
                times={chef.availableTimes}
                selectedTimes={selectedTimes}
                setSelectedTimes={setSelectedTimes}
                startTime={startTime}
                setStartTime={setStartTime}
                hours={hours}
                setHours={setHours}
              />
              <HireSection note={note} setNote={setNote} onHire={handleHireChef} />
            </>
            
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
          keyExtractor={(_, index) => index.toString()}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
    marginTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    color: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  chefImage: {
    width: 150,
    height: 152,
    borderRadius: 20,
    marginRight: 16,
  },
  chefDetails: {
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  chefName: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    maxWidth: "85%",
  },
  verifiedIcon: {
    marginLeft: 6,
  },
  specialty: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 6,
  },
  cuisine: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  rating: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 20,
  },
  price: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 4,
  },
  tooltip: {
    position: "absolute",
    bottom: 24,
    right: -40,
    backgroundColor: "#2C2C36",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 10,
    minWidth: 120,
    maxWidth: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  tooltipText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  tooltipArrow: {
    position: "absolute",
    top: "100%",
    left: "50%",
    marginLeft: 14,
    marginTop: 12,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#2C2C36",
  },
});
