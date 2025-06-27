import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { JSX, useState } from "react";
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { chefs as favoriteChefs } from "@/constants/chefData";
import { dishes } from "@/constants/dishData";


const favoriteDishes = dishes.filter(d => d.isFavorite);

type Dish = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
};

type Chef = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  avatar: string;
};

export default function FavoritesScreen() {
  const [selectedTab, setSelectedTab] = useState<"Dish" | "Chef">("Dish");

  const renderDish = ({ item }: { item: Dish }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.meta}>
        #{item.cuisine} • {item.rating} ⭐
      </Text>
    </View>
  );

  const renderChef = ({ item }: { item: Chef }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.meta}>
        {item.rating} ⭐ ({item.reviews})
      </Text>
    </View>
  );

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
        key={selectedTab} // forces re-render when switching types
        data={selectedTab === "Dish" ? favoriteDishes : favoriteChefs}
        keyExtractor={(item) => item.id}
        renderItem={
          selectedTab === "Dish"
            ? (renderDish as ({ item }: { item: any }) => JSX.Element)
            : (renderChef as ({ item }: { item: any }) => JSX.Element)
        }
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

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 6,
    width: "48%",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  meta: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
});
