// app/(tabs)/cart.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView } from "react-native";
import { useCart } from "../../context/CartContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 40;
  const platformFee = 5;
  const gst = Math.round((total + deliveryFee) * 0.05);
  const finalTotal = total + deliveryFee + platformFee + gst;

  const Stepper = ({ id, qty }: { id: string; qty: number }) => (
    <View style={styles.stepperContainer}>
      <TouchableOpacity 
        style={styles.stepperButton}
        onPress={() => updateQuantity(id, Math.max(1, qty - 1))}
      >
        <Ionicons name="remove" size={16} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.quantityText}>{qty}</Text>
      <TouchableOpacity 
        style={styles.stepperButton}
        onPress={() => updateQuantity(id, qty + 1)}
      >
        <Ionicons name="add" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemMealType}>{item.meal_type}</Text>
        {item.chef && (
          <Text style={styles.chefName}>by {item.chef.name}</Text>
        )}
        <View style={styles.itemBottom}>
          <Text style={styles.itemPrice}>₹{item.price}</Text>
          <Stepper id={item.id} qty={item.quantity} />
        </View>
      </View>
      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>₹{item.price * item.quantity}</Text>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyCart}>
          <Ionicons name="basket-outline" size={80} color="#666" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>Add some delicious dishes to get started</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push("/(tabs)/dish")}
          >
            <Text style={styles.browseButtonText}>Browse Dishes</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart ({cart.length} items)</Text>
        <TouchableOpacity onPress={() => cart.forEach(item => removeFromCart(item.id))}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        style={styles.cartList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.billContainer}>
        <Text style={styles.billTitle}>Bill Details</Text>
        
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Subtotal</Text>
          <Text style={styles.billValue}>₹{total}</Text>
        </View>
        
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Delivery Fee</Text>
          <Text style={styles.billValue}>₹{deliveryFee}</Text>
        </View>
        
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Platform Fee</Text>
          <Text style={styles.billValue}>₹{platformFee}</Text>
        </View>
        
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>GST (5%)</Text>
          <Text style={styles.billValue}>₹{gst}</Text>
        </View>
        
        <View style={styles.billDivider} />
        
        <View style={styles.billRow}>
          <Text style={styles.billTotal}>Total</Text>
          <Text style={styles.billTotal}>₹{finalTotal}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.replace("/checkout")}
        style={[styles.checkoutButton, { backgroundColor: cart.length ? "#FF9100" : "#555" }]}
        disabled={cart.length === 0}
      >
        <Text style={styles.checkoutButtonText}>
          Proceed to Checkout • ₹{finalTotal}
        </Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  clearAllText: {
    color: "#FF9100",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyCartText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  emptyCartSubtext: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  browseButton: {
    backgroundColor: "#FF9100",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 30,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cartList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemMealType: {
    color: "#999",
    fontSize: 12,
    marginBottom: 2,
  },
  chefName: {
    color: "#FF9100",
    fontSize: 12,
    marginBottom: 8,
  },
  itemBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemPrice: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 4,
  },
  stepperButton: {
    backgroundColor: "#FF9100",
    borderRadius: 6,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    color: "#fff",
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  itemActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 70,
  },
  itemTotal: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    padding: 8,
  },
  billContainer: {
    backgroundColor: "#1a1a1a",
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  billTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  billLabel: {
    color: "#999",
    fontSize: 14,
  },
  billValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  billDivider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 12,
  },
  billTotal: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 16,
    borderRadius: 12,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
