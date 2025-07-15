import { supabase } from "@/constants/supabase";
import { addDish } from "@/constants/uploadDish";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  Image,
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

export default function AddDishScreen() {
  const [itemName, setItemName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Dinner");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");
  const [contains, setContains] = useState("");

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 1,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets?.length > 0) {
        console.log("Image selected:", result.assets[0].uri);
        setImage(result.assets[0].uri);
      } else {
        console.log("Image selection cancelled.");
      }
    } catch (err) {
      console.error("Error in pickImage:", err);
    }
  };

  const isFormValid = Boolean(
    itemName.trim() &&
      selectedCategory &&
      price.trim() &&
      quantity > 0 &&
      ingredients.trim() &&
      cuisine.trim() &&
      description.trim() &&
      contains.trim()
  );

  const handleAddDish = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        alert("Not logged in");
        return;
      }

      const userId = user?.id || "e62e3039-4e1a-4def-9647-debeed5f40be";
      const chefId = userId;

      // ✅ Step 2: Prepare dish payload
      const dishPayload = {
        title: itemName,
        description,
        cuisine,
        ingredients,
        contains,
        tags: selectedCategory,
        price: parseFloat(price),
      };

      // ✅ Step 3: Call addDish with chefId
      const result = await addDish(chefId, dishPayload);

      if ("success" in result && result.success) {
        alert("Dish Added Successfully!");
        handleReset();
        router.back();
      } else {
        alert("Error: " + result);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong!");
    }
  };

  const handleReset = () => {
    setItemName("");
    setSelectedCategory("Dinner");
    setPrice("");
    setQuantity(1);
    setImage(null);
    setIngredients("");
    setContains("");
    setCuisine("");
    setDescription("");
    console.log("Form reset to initial state");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={styles.roundBackButton}
                  onPress={() => router.back()}
                >
                  <Ionicons name="chevron-back" size={20} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Add New Items</Text>
              </View>
              <TouchableOpacity onPress={handleReset}>
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
            <Text style={styles.label}>UPLOAD PHOTO</Text>
            <View style={styles.uploadRow}>
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 12,
                    marginRight: 10,
                  }}
                />
              )}
              <TouchableOpacity style={styles.addBox} onPress={pickImage}>
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
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  placeholder="Enter price"
                  placeholderTextColor="#888"
                />
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
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

            <Text style={styles.label}>CUISINE</Text>
            <TextInput
              style={[styles.ingredient_input, { height: 50 }]}
              value={cuisine}
              onChangeText={setCuisine}
              multiline
              placeholder="Enter cuisine"
              placeholderTextColor="#888"
            />

            {/* Ingredients */}
            <Text style={styles.label}>INGREDIENTS</Text>
            <TextInput
              style={styles.ingredient_input}
              value={ingredients}
              onChangeText={setIngredients}
              multiline
              placeholder="Enter ingredients"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>DESCRIPTION</Text>
            <TextInput
              style={styles.ingredient_input}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Enter description"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>CONTAINS</Text>
            <TextInput
              style={[styles.ingredient_input, { marginBottom: 200 }]}
              value={contains}
              onChangeText={setContains}
              multiline
              placeholder="Enter description"
              placeholderTextColor="#888"
            />
          </ScrollView>

          {/* Fixed Footer Add Dish Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.addButton, { opacity: isFormValid ? 1 : 0.5 }]}
              disabled={!isFormValid}
              onPress={handleAddDish}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>Add Dish</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    fontWeight: "bold",
    paddingTop: 10,
  },
  reset: {
    color: "#C67C4E",
    fontWeight: "bold",
    fontSize: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "bold",
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
  ingredient_input: {
    backgroundColor: "#3a3a3aff",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#fff",
    height: 100,
    textAlignVertical: "top",
  },
  uploadRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
    gap: 16,
  },
  addBox: {
    flex: 1,
    height: 100,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#555",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222",
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
    fontWeight: "900",
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
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  addButton: {
    backgroundColor: "#C67C4E",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
