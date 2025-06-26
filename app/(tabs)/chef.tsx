// chef.tsx (same structure, with changes to data and filters)
import HeaderSection from "@/components/HeaderSection";
import SearchBarWithFilter from "@/components/SearchBarWithFilter";
import ItemCard from "@/components/ItemCard";
import FilterModal from "@/components/FilterModal";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StatusBar, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const addresses = ["1234 Culinary Street, Flavor Town, Near Food Plaza, Opp. Tasty Tower, Apt 56, Delight City, Gourmet State"];
const chefs = [
  { id: "1", name: "Chef Anand R", cuisine: "American Cuisine", rating: 4.8, image: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: "2", name: "Chef Albin S", cuisine: "Italian Cuisine", rating: 4.5, image: "https://randomuser.me/api/portraits/men/58.jpg" },
  { id: "3", name: "Chef Priya K", cuisine: "Indian Cuisine", rating: 4.3, image: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: "4", name: "Chef Ravi M", cuisine: "Korean Cuisine", rating: 4.2, image: "https://randomuser.me/api/portraits/men/68.jpg" },
];

export default function ChefScreen() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChefs, setFilteredChefs] = useState(chefs);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const selectedAddress = addresses[0].split(" ").slice(0, 4).join(" ") + "...";

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const results = chefs.filter(
      (chef) =>
        chef.name.toLowerCase().includes(lowerQuery) ||
        chef.cuisine.toLowerCase().includes(lowerQuery)
    );
    setFilteredChefs(results);
  }, [searchQuery]);

  const filterSections = [
    { label: "Experience Level", options: ["Beginner", "Intermediate", "Expert"], selected: selectedExperience, setSelected: setSelectedExperience },
    { label: "Cuisine Specialties", options: ["Italian", "Indian", "French", "Japanese"], selected: selectedSpecialties, setSelected: setSelectedSpecialties },
    { label: "Service Type", options: ["Home Cook", "Event Catering", "Meal Plan"], selected: selectedServices, setSelected: setSelectedServices },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.container}>
          <HeaderSection address={selectedAddress} />
          <SearchBarWithFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} onOpenFilter={() => setShowFilterModal(true)} />
          <Text style={styles.sectionTitle}>All Chefs</Text>
          <FlatList
            data={filteredChefs}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
              <ItemCard
                item={item}
                isFavorite={favorites.includes(item.id)}
                toggleFavorite={toggleFavorite}
                onArrowPress={() => router.push({ pathname: "/chef-details/[chefId]", params: { chefId: item.id } })}
              />
            )}
          />
        </View>
        <FilterModal visible={showFilterModal} onClose={() => setShowFilterModal(false)} onApply={() => setShowFilterModal(false)} sections={filterSections} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 16, paddingTop: 40 },
  sectionTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 12 },
});
