// components/ItemCard.tsx
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext"; // ✅ import cart hook

export default function ItemCard({
  item,
  isFavorite,
  toggleFavorite,
  onArrowPress,
}: {
  item: any;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
  onArrowPress: () => void;
}) {
  const { addToCart } = useCart(); // ✅ use the cart context

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <TouchableOpacity style={styles.heartIcon} onPress={() => toggleFavorite(item.id)}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? "#d67C4E" : "#fff"}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.cuisine}>#{item.cuisine}</Text>
      <View style={styles.ratingRow}>
        <View style={styles.ratingLeft}>
          <Ionicons name="star" size={16} color="#FDC913" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <TouchableOpacity style={styles.arrowButton} onPress={onArrowPress}>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* ✅ Add to Cart Button */}
      <TouchableOpacity
        onPress={() =>
          addToCart({
            id: item.id,
            name: item.name,
            price: item.price || 400,
            image: item.image,
            meal_type: item.cuisine,
            quantity: 1,
          })
        }
        style={styles.cartButton}
      >
        <Text style={styles.cartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 6,
    width: "48%",
    marginBottom: 16,
  },
  imageWrapper: { position: "relative" },
  heartIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 6,
  },
  image: { width: "100%", height: 140, borderRadius: 12, marginBottom: 8 },
  name: { color: "#000000", fontSize: 16, fontWeight: "600" },
  cuisine: { color: "#32343E", fontSize: 12, marginVertical: 4 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  ratingLeft: { flexDirection: "row", alignItems: "center" },
  rating: { color: "#000", fontSize: 14, marginLeft: 4 },
  arrowButton: { backgroundColor: "#C67C4E", padding: 6, borderRadius: 20 },

  // ✅ styles for Add to Cart button
  cartButton: {
    backgroundColor: "#f59e0b",
    marginTop: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  cartButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
});
