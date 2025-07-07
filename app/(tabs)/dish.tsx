// app/(tabs)/dish.tsx
import FilterModal from "@/components/FilterModal";
import HeaderSection from "@/components/HeaderSection";
import ItemCard from "@/components/ItemCard";
import SearchBarWithFilter from "@/components/SearchBarWithFilter";
import { fetchDishes, Dish } from "@/constants/fetchDishes";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

const addresses = [
  "1234 Culinary Street, Flavor Town, Near Food Plaza, Opp. Tasty Tower, Apt 56, Delight City, Gourmet State",
];

export default function DishScreen() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const selectedAddress =
    addresses[0].split(" ").slice(0, 4).join(" ") + "...";

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ["dishes"],
    queryFn: fetchDishes,
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Filter based on search query
  const filteredDishes: Dish[] = dishes.filter(
    (dish) =>
      dish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dish as any).cuisine?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );

  const filterSections = [
    {
      label: "Cuisine Type",
      options: ["Chinese", "Italian", "Indian", "Korean", "American", "Mexican"],
      selected: selectedCuisines,
      setSelected: setSelectedCuisines,
    },
    {
      label: "Dietary Preferences",
      options: ["Vegan", "Non-veg", "Vegetarian", "Gluten-free", "Halal", "Kosher"],
      selected: selectedDietary,
      setSelected: setSelectedDietary,
    },
    {
      label: "Allergies",
      options: ["Dairy", "Peanut", "Gluten", "Soy", "Egg", "Shellfish"],
      selected: selectedAllergies,
      setSelected: setSelectedAllergies,
    },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.container}>
          <HeaderSection address={selectedAddress} />
          <SearchBarWithFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenFilter={() => setShowFilterModal(true)}
          />

          <Text style={styles.sectionTitle}>All Dishes</Text>
          <FlatList
            data={filteredDishes}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
              <ItemCard
                item={{
                  ...item,
                  name: item.title,
                  cuisine: (item as any).cuisine ?? "Unknown",
                  rating: 4.5,
                  image: (item as any).image ?? "", // if image is not in schema now
                }}
                isFavorite={favorites.includes(item.id)}
                toggleFavorite={toggleFavorite}
                onArrowPress={() =>
                  router.push({
                    pathname: "/dish-details/[dishId]",
                    params: { dishId: item.id },
                  })
                }
              />
            )}
          />
        </View>
        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={() => setShowFilterModal(false)}
          sections={filterSections}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 16, paddingTop: 40 },
  sectionTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 12 },
});
