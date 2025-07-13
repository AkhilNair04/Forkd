import ItemCard from "@/components/ItemCard";
import { fetchFavoriteChefs } from "@/constants/fetchFavoriteChefs";
import { fetchFavoriteDishes } from "@/constants/fetchFavoriteDishes";
import { useUserId } from "@/constants/getUserId";
import {
  toggleFavoriteChef,
  toggleFavoriteDish,
} from "@/constants/updateFavorites";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
  const [selectedTab, setSelectedTab] = useState<"Dish" | "Chef">("Dish");

  const userId = useUserId();

  const { data: favoriteChefs = [], refetch: refetchFavoriteChefs } = useQuery({
    queryKey: ["favoriteChefs", userId],
    queryFn: async () => fetchFavoriteChefs(userId!),
    enabled: !!userId,
  });

  const { data: favoriteDishes = [], refetch: refetchFavoriteDishes } =
    useQuery({
      queryKey: ["favoriteDishes", userId],
      queryFn: async () => fetchFavoriteDishes(userId!),
      enabled: !!userId,
    });

  // Transform data into uniform structure for ItemCard
  const transformedChefs = favoriteChefs.map((chef: any) => ({
    ...chef,
    name: chef.name,
    cuisine: chef.specialties?.[0] || chef.cuisine || "Chef",
    price: chef.pricePerHour ?? 500,
    image: chef.imageUrl,
  }));

  const transformedDishes = favoriteDishes.map((dish: any) => ({
    ...dish,
    name: dish.title,
    cuisine: dish.cuisine ?? "N/A",
    price: dish.price ?? 400,
    image: dish.imageUrl,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favourites</Text>
      </View>

      {/* Tab Switch */}
      <View style={styles.tabContainer}>
        {["Dish", "Chef"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab as "Dish" | "Chef")}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
            {selectedTab === tab && <View style={styles.activeLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* FlatList View */}
      <FlatList
        key={selectedTab}
        data={selectedTab === "Dish" ? transformedDishes : transformedChefs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isFav =
            selectedTab === "Dish"
              ? favoriteDishes.some((d) => d.id === item.id)
              : favoriteChefs.some((c) => c.id === item.id);

          return (
            <ItemCard
              item={item}
              isFavorite={isFav}
              type={selectedTab.toLowerCase() as "dish" | "chef"}
              onArrowPress={() => {
                if (selectedTab === "Dish") {
                  router.push({
                    pathname: "/dish-details/[dishId]",
                    params: { dishId: item.id },
                  });
                } else {
                  router.push({
                    pathname: "/chef-details/[chefId]",
                    params: { chefId: item.id },
                  });
                }
              }}
              onToggleDone={async () => {
                if (selectedTab === "Dish") {
                  await toggleFavoriteDish(userId!, item.id, isFav);
                  await refetchFavoriteDishes();
                } else {
                  await toggleFavoriteChef(userId!, item.id, isFav);
                  await refetchFavoriteChefs();
                }
              }}
            />
          );
        }}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    width: "100%",
    height: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    marginBottom: 10,
  },
  tabButton: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 12,
  },
  tabText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#C67C4E",
    fontWeight: "700",
  },
  activeLine: {
    height: 3,
    backgroundColor: "#C67C4E",
    width: "60%",
    marginTop: 4,
    borderRadius: 10,
  },
});
