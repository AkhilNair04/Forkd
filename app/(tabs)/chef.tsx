// app/(tabs)/chef.tsx
import FilterModal from "@/components/FilterModal";
import HeaderSection from "@/components/HeaderSection";
import ItemCard from "@/components/ItemCard";
import SearchBarWithFilter from "@/components/SearchBarWithFilter";
import SkeletonCard from "@/components/SkeletonCard";
import { fetchChefs } from "@/constants/fetchChefs";
import { fetchFavoriteChefs } from "@/constants/fetchFavoriteChefs";
import { toggleFavoriteChef } from "@/constants/updateFavorites";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocation } from "@/context/LocationContext";

export default function ChefScreen() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const userId = "1";
  const { location } = useLocation();
  const selectedAddress = location?.address || 'Pick your location';

  const queryClient = useQueryClient();

  const { data: chefs = [], isLoading } = useQuery({
    queryKey: ["chefs"],
    queryFn: fetchChefs,
  });

  const { data: favoriteChefs = [] } = useQuery({
    queryKey: ["favoriteChefs", userId],
    queryFn: () => fetchFavoriteChefs(userId),
  });

  const filteredChefs = chefs.filter((chef) => {
    const name = chef.name?.toLowerCase() ?? "";
    const cuisine = chef.cuisine?.toLowerCase() ?? "";
    const specialties = (chef.specialties || []).map((s: string) =>
      s.toLowerCase()
    );
    const experience = chef.experience_level ?? ""; // add if not already present
    const services = (chef.service_type || []).map((s: string) =>
      s.toLowerCase()
    ); // this is now an array

    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      cuisine.includes(searchQuery.toLowerCase());

    const matchesExperience =
      selectedExperience.length === 0 ||
      selectedExperience.includes(experience);

    const matchesSpecialties =
      selectedSpecialties.length === 0 ||
      selectedSpecialties.some((specialty) =>
        specialties.includes(specialty.toLowerCase())
      );

    const matchesServices =
      selectedServices.length === 0 ||
      selectedServices.some((s) => services.includes(s.toLowerCase()));

    return (
      matchesSearch &&
      matchesExperience &&
      matchesSpecialties &&
      matchesServices
    );
  });

  const handleToggleFavorite = async (id: string, isCurrentlyFav: boolean) => {
    await toggleFavoriteChef(userId, id, isCurrentlyFav);
    await queryClient.invalidateQueries({
      queryKey: ["favoriteChefs", userId],
    });
  };

  const filterSections = [
    {
      label: "Experience Level",
      options: ["Beginner", "Intermediate", "Expert"],
      selected: selectedExperience,
      setSelected: setSelectedExperience,
    },
    {
      label: "Cuisine Specialties",
      options: ["Italian", "Indian", "French", "Japanese"],
      selected: selectedSpecialties,
      setSelected: setSelectedSpecialties,
    },
    {
      label: "Service Type",
      options: ["Home Cook", "Event Catering"],
      selected: selectedServices,
      setSelected: setSelectedServices,
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

          <Text style={styles.sectionTitle}>All Chefs</Text>

          {isLoading ? (
            <FlatList
              data={[...Array(6).keys()]}
              keyExtractor={(item) => item.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingBottom: 120 }}
              renderItem={() => <SkeletonCard />}
            />
          ) : filteredChefs.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                No Chefs found matching your search.
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredChefs}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingBottom: 120 }}
              renderItem={({ item }) => {
                const isFav = favoriteChefs.some((c) => c.id === item.id);
                return (
                  <ItemCard
                    item={item}
                    isFavorite={isFav}
                    type="chef"
                    onArrowPress={() =>
                      router.push({
                        pathname: "/chef-details/[chefId]",
                        params: { chefId: item.id },
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
