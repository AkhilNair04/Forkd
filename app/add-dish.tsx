import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = ["Breakfast", "Lunch", "Dinner"];
const ingredients = [
  { name: "Salt", icon: "salt" },
  { name: "Chicken", icon: "drumstick-bite" },
  { name: "Onion", icon: "circle" },
  { name: "Garlic", icon: "close" },
  { name: "Peppers", icon: "fire" },
  { name: "Ginger", icon: "bolt" },
];

export default function AddDishScreen() {
  const [itemName, setItemName] = useState("Palak Paneer");
  const [selectedCategory, setSelectedCategory] = useState("Dinner");
  const [price, setPrice] = useState("240");
  const [quantity, setQuantity] = useState(2);
  const [image, setImage] = useState(
    "https://images.unsplash.com/photo-1601050690597-4a7a423a9f20"
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.roundBackButton}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.title}>Add New Items</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.reset}>RESET</Text>
            </TouchableOpacity>
          </View>

          {/* Item Name */}
          <Text style={styles.label}>ITEM NAME</Text>
          <TextInput
            style={styles.input}
            value={itemName}
            onChangeText={setItemName}
            placeholder="Enter item name"
            placeholderTextColor="#888"
          />

          {/* Upload Photo/Video */}
          <Text style={styles.label}>UPLOAD PHOTO/VIDEO</Text>
          <View style={styles.uploadRow}>
            <TouchableOpacity style={styles.addBox}>
              <Ionicons name="cloud-upload" size={24} color="#C67C4E" />
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Category */}
          <View style={styles.chipRow}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.chip,
                  selectedCategory === cat && styles.chipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCategory === cat && styles.chipTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price and Quantity */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>PRICE</Text>
              <TextInput
                style={styles.input}
                value={`Rs. ${price}`}
                onChangeText={(val) => setPrice(val.replace("Rs. ", ""))}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>QUANTITY</Text>
              <View style={styles.quantityBox}>
                <TouchableOpacity
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <AntDesign name="minuscircleo" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                  <AntDesign name="pluscircleo" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Ingredients */}
          <Text style={styles.label}>INGREDIENTS</Text>
          <View style={styles.ingredientRow}>
            {ingredients.map((ing, index) => (
              <View key={index} style={styles.ingredientCard}>
                <MaterialIcons
                  name="restaurant-menu"
                  size={24}
                  color="#C67C4E"
                />
                <Text style={styles.ingredientText}>{ing.name}</Text>
              </View>
            ))}
          </View>

          {/* Optional: Highlighted Ingredients */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <Text style={styles.label}>Highlighted Ingredients</Text>
            <Text style={[styles.label, { color: "#C67C4E" }]}>See All</Text>
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
    padding: 18,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    color: "#C67C4E",
    fontWeight: "200",
    paddingTop: 10,
  },
  reset: {
    color: "#C67C4E",
    fontWeight: "100",
    fontSize: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "100",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "#3a3a3aff",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fff",
    height: 50,
  },
  uploadRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
    gap: 16,
  },
  addBox: {
    width: "100%",
    height: 100,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#555",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222",
    marginTop: 10,
  },
  addText: {
    color: "#C67C4E",
    marginTop: 4,
  },
  chipRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#333",
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: "#C67C4E",
  },
  chipText: {
    color: "#aaa",
  },
  chipTextSelected: {
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
    justifyContent: "space-between",
  },
  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  quantity: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  ingredientRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  ingredientCard: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  ingredientText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
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
});
