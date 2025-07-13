import { ChefForDish, fetchChefsForDish } from "@/constants/fetchChefsForDish";
import { Dish, fetchDishes } from "@/constants/fetchDishes";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DishDetailScreen() {
  const { dishId } = useLocalSearchParams();
  const dishIdString = Array.isArray(dishId) ? dishId[0] : dishId;

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ["dishes"],
    queryFn: fetchDishes,
  });

  const { data: chefs = [], isLoading: isChefsLoading } = useQuery<
    ChefForDish[]
  >({
    queryKey: ["chefs-for-dish", dishIdString],
    queryFn: () => fetchChefsForDish(dishIdString),
  });

  const dish: Dish | undefined = dishes.find((c) => c.id === dishIdString);

  const [quantity, setQuantity] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Sort By:");
  const [selectedChef, setSelectedChef] = useState<string | null>(null);

  const sortOptions = [
    "Ratings (high to low)",
    "Price (low to high)",
    "Price (high to low)",
    "Delivery Time",
  ];

  if (isLoading) {
    return <Text style={styles.error}>Loading dish...</Text>;
  }

  if (!dish) {
    return <Text style={styles.error}>Dish not found</Text>;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.roundBackButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{dish.title} Details</Text>
          </View>

          {/* Dish Image */}
          <Image source={{ uri: dish.imageUrl }} style={styles.image} />

          <View style={styles.content}>
            {/* Tags */}
            <Text style={styles.tags}>
              {dish.tags?.map((tag) => `#${tag}`).join(" ") || ""}
            </Text>

            {/* Title + Quantity */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>{dish.title}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Ionicons name="remove" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity((q) => q + 1)}
                >
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.heading}>Description</Text>
            <Text style={styles.description}>{dish.description}</Text>

            {/* Ingredients */}
            <Text style={styles.heading}>Ingredients</Text>
            <Text style={styles.ingredients}>{dish.ingredients}</Text>

            {/* Sort + Order From */}
            <View style={styles.sortContainer}>
              <Text style={styles.heading}>Order From:</Text>
              <View>
                <TouchableOpacity
                  style={styles.sortDropdownToggle}
                  onPress={() => setShowDropdown(!showDropdown)}
                >
                  <Text style={styles.sortDropdownText}>{selectedSort}</Text>
                  <Ionicons name="caret-down" size={18} color="#C67C4E" />
                </TouchableOpacity>
                {showDropdown && (
                  <View style={styles.dropdownMenu}>
                    {sortOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedSort(option);
                          setShowDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Chefs List */}
            <FlatList
              data={chefs}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const isSelected = selectedChef === item.name;
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedChef(item.name)}
                    style={[
                      styles.chefCard,
                      isSelected && styles.selectedChefCard,
                    ]}
                  >
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.avatar}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.chefName}>{item.name}</Text>
                      <View style={styles.ratingPriceRow}>
                        <View style={styles.chefRatingContainer}>
                          <Ionicons name="star" size={16} color="#FDC913" />
                          <Text style={styles.rating}>{item.rating}</Text>
                          <Text style={styles.reviews}>({item.reviews})</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.priceText}>
                      ₹{item.price * quantity}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            {/* Order Button */}
            <TouchableOpacity style={styles.orderButton}>
              <Text style={styles.orderButtonText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  roundBackButton: {
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
  image: {
    width: "90%",
    height: 152,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 30,
  },
  content: {
    padding: 20,
  },
  tags: {
    color: "#888",
    fontSize: 14,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 110,
    justifyContent: "space-between",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3a3a3a",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: 50,
  },
  heading: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
  ingredients: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 20,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    marginTop: 12,
    position: "relative",
  },
  sortDropdownToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  sortDropdownText: {
    color: "#ccc",
    marginRight: 4,
  },
  dropdownMenu: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#3a3a3a",
    borderRadius: 12,
    width: 220,
    zIndex: 999,
    elevation: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  dropdownText: {
    color: "#fff",
    fontSize: 14,
  },
  chefCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  avatar: {
    width: 48,
    height: 48,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginRight: 12,
  },
  chefName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  chefRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  reviews: {
    color: "#888",
    fontSize: 14,
    marginLeft: 4,
  },
  error: {
    color: "red",
    padding: 20,
    textAlign: "center",
  },
  ratingPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },

  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginLeft: 10,
  },
  orderButton: {
    backgroundColor: "#C67C4E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedChefCard: {
    backgroundColor: "#C67C4E",
  },
});
