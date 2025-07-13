import { RestrictedTabWrapper } from "@/components/RestrictedTabWrapper";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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

const foodItems = [
  {
    id: "1",
    name: "Banana Pancakes",
    category: "Breakfast",
    rating: 4.9,
    reviews: 10,
    price: "Rs. 350",
    image:
      "https://images.unsplash.com/photo-1588016905490-30168011fba6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    name: "Seafood Pasta",
    category: "Lunch",
    rating: 4.9,
    reviews: 10,
    price: "Rs. 400",
    image:
      "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    name: "Thai Fried Rice",
    category: "Dinner",
    rating: 4.9,
    reviews: 10,
    price: "Rs. 500",
    image:
      "https://images.unsplash.com/photo-1613145996753-c5c4eb0e15a7?auto=format&fit=crop&w=600&q=80",
  },
];

export default function DishesScreen() {
  const tabs = ["All", "Breakfast", "Lunch", "Dinner"];
  const [selectedTab, setSelectedTab] = useState("All");
  const [showMenuId, setShowMenuId] = useState(null);

  const filteredItems =
    selectedTab === "All"
      ? foodItems
      : foodItems.filter((item) => item.category === selectedTab);

  const toggleMenu = (id: any) => {
    setShowMenuId(showMenuId === id ? null : id);
  };

  return (
    <RestrictedTabWrapper>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>My Food List</Text>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
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

          {/* Item Count */}
          <Text style={styles.itemCount}>
            Total {filteredItems.length.toString().padStart(2, "0")} item(s)
          </Text>

          {/* Food List */}
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
              <View style={styles.foodItem}>
                <Image source={{ uri: item.image }} style={styles.foodImage} />
                <View style={styles.foodContent}>
                  <View style={styles.foodHeader}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <TouchableOpacity onPress={() => toggleMenu(item.id)}>
                      <Entypo
                        name="dots-three-horizontal"
                        size={16}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.item_price}>
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                    <Text style={styles.price}>{item.price}</Text>
                  </View>

                  <View style={styles.bottomRow}>
                    <View style={styles.ratingRow}>
                      <AntDesign name="star" size={16} color="#C67C4E" />
                      <Text style={styles.ratingText}>
                        {item.rating}{" "}
                        <Text style={styles.reviewText}>
                          ({item.reviews} Review)
                        </Text>
                      </Text>
                    </View>
                    <Text style={styles.pickupText}>Pick UP</Text>

                    {showMenuId === item.id && (
                      <View style={styles.floatingMenu}>
                        <TouchableOpacity style={styles.menuItem}>
                          <Text style={styles.menuText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                          <Text style={styles.menuText}>Show/Hide</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.menuItem, styles.lastMenuItem]}
                        >
                          <Text style={[styles.menuText, { color: "#ff4444" }]}>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
          />

          {/* Floating Add Button (unchanged as per your layout) */}
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push("/add-dish")}
          >
            <Ionicons name="add" size={28} color="#C67C4E" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </RestrictedTabWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
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
  itemCount: {
    color: "#888",
    marginBottom: 12,
    fontSize: 14,
  },
  item_price: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  foodItem: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#11111",
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#333",
  },
  foodContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  foodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
    paddingTop: 10,
  },
  foodName: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "400",
    flex: 1,
    paddingRight: 10,
  },
  categoryTag: {
    backgroundColor: "#C67C4E",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  categoryText: {
    color: "#000",
    fontSize: 15,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 6,
  },
  reviewText: {
    color: "#999",
    fontSize: 13,
  },
  price: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  pickupText: {
    color: "#999",
    fontSize: 16,
    alignSelf: "flex-end",
  },
  fab: {
    position: "absolute",
    marginLeft: 30,
    marginBottom: 60,
    bottom: 24,
    right: 24,
    backgroundColor: "#444444",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#C67C4E",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  floatingMenu: {
    position: "absolute",
    top: -40,
    right: 0,
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    minWidth: 120,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
  },
});
