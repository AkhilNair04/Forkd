// app/(tabs)/dish.tsx
import FilterModal from "@/components/FilterModal";
import HeaderSection from "@/components/HeaderSection";
import ItemCard from "@/components/ItemCard";
import SearchBarWithFilter from "@/components/SearchBarWithFilter";
import SkeletonCard from "@/components/SkeletonCard";
import { Dish, fetchDishes } from "@/constants/fetchDishes";
import { fetchFavoriteDishes } from "@/constants/fetchFavoriteDishes";
import { toggleFavoriteDish } from "@/constants/updateFavorites";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const addresses = [
  "1234 Culinary Street, Flavor Town, Near Food Plaza, Opp. Tasty Tower, Apt 56, Delight City, Gourmet State",
];

export default function DishScreen() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const userId = "1"; // 🔐 Replace with auth logic later
  const queryClient = useQueryClient();
  const selectedAddress = addresses[0].split(" ").slice(0, 4).join(" ") + "...";

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ["dishes"],
    queryFn: fetchDishes,
  });

  const { data: favoriteDishes = [], refetch: refetchFavoriteDishes } =
    useQuery({
      queryKey: ["favoriteDishes", userId],
      queryFn: () => fetchFavoriteDishes(userId),
    });

  const handleToggleFavorite = async (id: string, isCurrentlyFav: boolean) => {
    await toggleFavoriteDish(userId, id, isCurrentlyFav);
    await queryClient.invalidateQueries({
      queryKey: ["favoriteDishes", userId],
    });
  };

  const filteredDishes: Dish[] = dishes.filter(
    (dish) =>
      dish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dish as any).cuisine?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );

  const filterSections = [
    {
      label: "Cuisine Type",
      options: [
        "Chinese",
        "Italian",
        "Indian",
        "Korean",
        "American",
        "Mexican",
      ],
      selected: selectedCuisines,
      setSelected: setSelectedCuisines,
    },
    {
      label: "Dietary Preferences",
      options: [
        "Vegan",
        "Non-veg",
        "Vegetarian",
        "Gluten-free",
        "Halal",
        "Kosher",
      ],
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

          {isLoading ? (
            <FlatList
              data={[...Array(6).keys()]}
              keyExtractor={(item) => item.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingBottom: 120 }}
              renderItem={() => <SkeletonCard />}
            />
          ) : filteredDishes.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                No dishes found matching your search.
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredDishes}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingBottom: 120 }}
              renderItem={({ item }) => {
                const isFav = favoriteDishes.some((d) => d.id === item.id);
                return (
                  <ItemCard
                    item={{
                      ...item,
                      name: item.title,
                      cuisine: (item as any).cuisine ?? "Unknown",
                      rating: item.rating,
                      review: item.reviews,
                      image: (item as any).image ?? "",
                    }}
                    isFavorite={isFav}
                    type="dish"
                    onArrowPress={() =>
                      router.push({
                        pathname: "/dish-details/[dishId]",
                        params: { dishId: item.id },
                      })
                    }
                    onToggleDone={() => handleToggleFavorite(item.id, isFav)}
                  />
                );
              }}
            />
          )}
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
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    marginBottom: 150,
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
});
