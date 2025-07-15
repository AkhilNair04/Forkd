import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FilterModal from "../../components/FilterModal";
import HeaderSection from "../../components/HeaderSection";
import {
  DishWithPrice,
  fetchDishesWithPrices,
} from "../../constants/fetchDishes";
import { useCart } from "../../context/CartContext";
import { useLocation } from "../../context/LocationContext";
import { getCurrentUserProfile } from "../../lib/supabase";

const { width } = Dimensions.get("window");

// Using the DishWithPrice interface from fetchDishes

interface UserProfile {
  id: string;
  profile: {
    full_name: string;
    bio: string;
    location: string;
    user_type: string;
    avatar_url: string | null;
    phone: string;
  };
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const { addToCart } = useCart();
  const { location } = useLocation();

  // Use dynamic address from location hook
  const selectedAddress = location?.address || "Pick your location";

  // Fetch dishes with prices from Supabase
  const { data: dishesWithPrices = [], isLoading } = useQuery({
    queryKey: ["dishesWithPrices"],
    queryFn: fetchDishesWithPrices,
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const profile = await getCurrentUserProfile();
    setUserProfile(profile);
  };

  // Get featured dishes (highest rated)
  const featuredDishes = dishesWithPrices
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 5);

  // Get popular dishes (first 6 dishes)
  const popularDishes = dishesWithPrices.slice(0, 6);

  const toggleFavorite = (dishId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(dishId)) {
      newFavorites.delete(dishId);
    } else {
      newFavorites.add(dishId);
    }
    setFavorites(newFavorites);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: "/(tabs)/dish",
        params: { search: searchQuery },
      });
    }
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const navigateToFavorites = () => {
    router.push("/favorites");
  };

  const navigateToCart = () => {
    router.push("/checkout/cart");
  };

  // Filter sections for the filter modal
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

  const navigateToDishDetails = (dishId: string) => {
    router.push(`/dish-details/${dishId}`);
  };

  const navigateToChef = (chefId: string) => {
    router.push(`/chef-details/${chefId}`);
  };

  const renderFeaturedDish = ({ item }: { item: DishWithPrice }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => navigateToDishDetails(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.featuredImage} />
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <Text style={styles.featuredCuisine}>{item.cuisine}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.heartIcon}
        onPress={() => toggleFavorite(item.id)}
      >
        <Ionicons
          name={favorites.has(item.id) ? "heart" : "heart-outline"}
          size={20}
          color={favorites.has(item.id) ? "#FF6B6B" : "#fff"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPopularDish = ({ item }: { item: DishWithPrice }) => (
    <TouchableOpacity
      style={styles.popularCard}
      onPress={() => navigateToDishDetails(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.popularImage} />
      <View style={styles.popularContent}>
        <Text style={styles.popularTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.popularCuisine}>{item.cuisine}</Text>
        <View style={styles.popularFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.popularRating}>{item.rating}</Text>
          </View>
          {item.chefs && item.chefs[0] && (
            <Text style={styles.priceText}>₹{item.chefs[0].price}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* Header with chat and cart */}
          <HeaderSection address={selectedAddress} />

          {/* Personalized Greeting with Profile */}
          <View style={styles.greetingSection}>
            <View style={styles.greetingContent}>
              <View>
                <Text style={styles.greeting}>
                  Good{" "}
                  {new Date().getHours() < 12
                    ? "Morning"
                    : new Date().getHours() < 18
                    ? "Afternoon"
                    : "Evening"}
                </Text>
                <Text style={styles.userName}>
                  {userProfile?.profile?.full_name || "Food Lover"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push("/(tabs)/profile")}
              >
                {userProfile?.profile?.avatar_url ? (
                  <Image
                    source={{ uri: userProfile.profile.avatar_url }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <Ionicons name="person" size={20} color="#999" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search"
                size={20}
                color="#999"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for dishes, cuisines..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={handleFilter}
            >
              <Ionicons name="options" size={20} color="#C67C4E" />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)/dish")}
            >
              <Ionicons name="restaurant" size={24} color="#C67C4E" />
              <Text style={styles.actionText}>Browse</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)/chef")}
            >
              <Ionicons name="people" size={24} color="#C67C4E" />
              <Text style={styles.actionText}>Chefs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToFavorites}
            >
              <Ionicons name="heart" size={24} color="#C67C4E" />
              <Text style={styles.actionText}>Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToCart}
            >
              <Ionicons name="bag" size={24} color="#C67C4E" />
              <Text style={styles.actionText}>Cart</Text>
            </TouchableOpacity>
          </View>

          {/* Featured Dishes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Dishes</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/dish")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredDishes}
              renderItem={renderFeaturedDish}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </View>

          {/* Popular Dishes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Near You</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/dish")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={popularDishes}
              renderItem={renderPopularDish}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.popularRow}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>

        {/* Filter Modal */}
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
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
    width: "100%",
    minHeight: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 100,
    minHeight: "100%",
    width: "100%",
    flexGrow: 1,
  },
  greetingSection: {
    marginBottom: 20,
    width: "100%",
  },
  greetingContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  greeting: {
    fontSize: 16,
    color: "#999",
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profilePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 25,
    gap: 12,
    width: "100%",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    width: "100%",
  },
  actionButton: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "#1a1a1a",
    borderRadius: 15,
    minWidth: 70,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  section: {
    marginBottom: 30,
    width: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  seeAll: {
    fontSize: 14,
    color: "#C67C4E",
    fontWeight: "500",
  },
  featuredList: {
    paddingLeft: 0,
  },
  featuredCard: {
    width: 280,
    height: 180,
    marginRight: 15,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  featuredCuisine: {
    fontSize: 14,
    color: "#ddd",
    marginBottom: 8,
  },
  heartIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 35,
    height: 35,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  popularRow: {
    justifyContent: "space-between",
    width: "100%",
  },
  popularCard: {
    width: (width - 50) / 2,
    backgroundColor: "#1a1a1a",
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  popularImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  popularContent: {
    padding: 12,
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  popularCuisine: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  popularFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  popularRating: {
    marginLeft: 4,
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#C67C4E",
  },
});
