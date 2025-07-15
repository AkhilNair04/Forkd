// components/ItemCard.tsx
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";
export default function ItemCard({
  item,
  isFavorite,
  type, // "dish" or "chef"
  onArrowPress,
  onToggleDone,
}: {
  item: any;
  isFavorite: boolean;
  type: "dish" | "chef";
  onArrowPress: () => void;
  onToggleDone?: () => void;
}) {
  const [favorite, setFavorite] = useState(isFavorite);
  const { addToCart } = useCart();

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleToggle = async () => {
    const newFav = !favorite;
    setFavorite(newFav);
    onToggleDone?.();
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <TouchableOpacity style={styles.heartIcon} onPress={handleToggle}>
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={20}
            color={favorite ? "#d67C4E" : "#fff"}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.cuisine}>
        {Array.isArray(item.specialties)
          ? item.specialties.map((tag: string) => `#${tag}`).join(" ")
          : `#${item.cuisine || "N/A"}`}
      </Text>

      <View style={styles.ratingRow}>
        <View style={styles.ratingLeft}>
          <Ionicons name="star" size={16} color="#FDC913" />
          <Text style={styles.rating}>{item.rating || "0.0"}</Text>
          <Text style={styles.rating}> ({item.reviews || 0})</Text>
        </View>
        <TouchableOpacity style={styles.arrowButton} onPress={onArrowPress}>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      </View>
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
