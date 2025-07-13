// app/(tabs)/dish.tsx
import FilterModal from "@/components/FilterModal";
import HeaderSection from "@/components/HeaderSection";
import ItemCard from "@/components/ItemCard";
import SearchBarWithFilter from "@/components/SearchBarWithFilter";
import SkeletonCard from "@/components/SkeletonCard";
import { Dish, fetchDishes } from "@/constants/fetchDishes";
import { fetchFavoriteDishes } from "@/constants/fetchFavoriteDishes";
import { toggleFavoriteDish } from "@/constants/updateFavorites";
import { useLocation } from "@/context/LocationContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserId } from "@/constants/getUserId";

export default function DishScreen() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  


  const userId = useUserId();

  const queryClient = useQueryClient();
  const { location } = useLocation();
  const selectedAddress = location?.address || "Pick your location";

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ["dishes"],
    queryFn: fetchDishes,
  });

  const { data: favoriteDishes = [] } = useQuery({
    queryKey: ["favoriteDishes", userId],
    queryFn: async () => fetchFavoriteDishes(userId!),
    enabled: !!userId,
  });

  const handleToggleFavorite = async (id: string, isCurrentlyFav: boolean) => {
    if (!userId) return;
    await toggleFavoriteDish(userId, id, isCurrentlyFav);
    await queryClient.invalidateQueries({
      queryKey: ["favoriteDishes", userId],
    });
  };

  const filteredDishes: Dish[] = dishes.filter((dish) => {
    const title = dish.title?.toLowerCase() ?? "";
    const cuisine = (dish as any).cuisine?.toLowerCase() ?? "";
    const dishTags = (dish.tags || []).map((t: string) => t.toLowerCase());
    const dishAllergies = (dish.allergies || []).map((a: string) =>
      a.toLowerCase()
    );

    const matchesSearch =
      title.includes(searchQuery.toLowerCase()) ||
      cuisine.includes(searchQuery.toLowerCase());

    const matchesCuisine =
      selectedCuisines.length === 0 ||
      selectedCuisines.includes((dish as any).cuisine);

    const matchesDietary =
      selectedDietary.length === 0 ||
      selectedDietary.some((pref) => dishTags.includes(pref.toLowerCase()));

    const excludesAllergies =
      selectedAllergies.length === 0 ||
      !selectedAllergies.some((allergy) =>
        dishAllergies.includes(allergy.toLowerCase())
      );

    return (
      matchesSearch && matchesCuisine && matchesDietary && excludesAllergies
    );
  });

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
                      reviews: item.reviews,
                      imageUrl: item.imageUrl,
                      specialties: item.tags,
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
