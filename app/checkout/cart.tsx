// app/checkout/cart.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [activeTab, setActiveTab] = useState<"dishes" | "chefs">("dishes");

  // Split carts by type
  const dishCart = cart.filter((item) => item.type === "dish");
  const chefCart = cart.filter((item) => item.type === "chef");

  // Calculate totals for each type
  const dishTotal = dishCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const chefTotal = chefCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Delivery fee only applies to dishes
  const deliveryFee = dishCart.length > 0 ? 40 : 0;
  const platformFee = 5;
  const addFee = 100; // Additional fee for chefs

  // GST applies to subtotal + delivery fee
  const dishGst = Math.round((dishTotal + deliveryFee) * 0.05);
  const chefGst = Math.round(chefTotal * 0.05);

  const dishFinalTotal = dishTotal + deliveryFee + platformFee + dishGst;
  const chefFinalTotal = chefTotal + platformFee + chefGst + addFee;

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

  const renderDishItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemMealType}>{item.meal_type}</Text>
        {item.chef && <Text style={styles.chefName}>by {item.chef.name}</Text>}
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

  const renderChefItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemMealType}>Scheduled for {item.date}</Text>
        <Text style={styles.chefName}>@ ₹{item.price}/hr</Text>
        <View style={styles.itemBottom}>
          <Text style={styles.itemPrice}>Hours: {item.quantity}</Text>
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
          <Text style={styles.emptyCartSubtext}>
            Add some delicious dishes or hire a chef to get started
          </Text>
          <View style={styles.emptyCartButtons}>
            <TouchableOpacity
              style={[styles.browseButton, { marginRight: 10 }]}
              onPress={() => router.push("/(tabs)/dish")}
            >
              <Text style={styles.browseButtonText}>Browse Dishes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push("/(tabs)/chef")}
            >
              <Text style={styles.browseButtonText}>Hire Chefs</Text>
            </TouchableOpacity>
          </View>
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
        <TouchableOpacity
          onPress={() => cart.forEach((item) => removeFromCart(item.id))}
        >
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "dishes" && styles.activeTab]}
          onPress={() => setActiveTab("dishes")}
        >
          <Text style={styles.tabText}>Dishes ({dishCart.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "chefs" && styles.activeTab]}
          onPress={() => setActiveTab("chefs")}
        >
          <Text style={styles.tabText}>Chefs ({chefCart.length})</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Dishes Tab Content */}
        {activeTab === "dishes" && (
          <>
            {dishCart.length === 0 ? (
              <View style={styles.emptyTabContent}>
                <Ionicons name="fast-food-outline" size={60} color="#666" />
                <Text style={styles.emptyTabText}>No dishes in cart</Text>
              </View>
            ) : (
              <FlatList
                data={dishCart}
                keyExtractor={(i) => i.id}
                renderItem={renderDishItem}
                scrollEnabled={false}
              />
            )}

            {/* Dishes Bill Section */}
            {dishCart.length > 0 && (
              <View style={styles.billContainer}>
                <Text style={styles.billTitle}>Dishes Bill Details</Text>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Dishes Subtotal</Text>
                  <Text style={styles.billValue}>₹{dishTotal}</Text>
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
                  <Text style={styles.billValue}>₹{dishGst}</Text>
                </View>
                <View style={styles.billDivider} />
                <View style={styles.billRow}>
                  <Text style={styles.billTotal}>Dishes Total</Text>
                  <Text style={styles.billTotal}>₹{dishFinalTotal}</Text>
                </View>
              </View>
            )}
          </>
        )}

        {/* Chefs Tab Content */}
        {activeTab === "chefs" && (
          <>
            {chefCart.length === 0 ? (
              <View style={styles.emptyTabContent}>
                <Ionicons name="people-outline" size={60} color="#666" />
                <Text style={styles.emptyTabText}>No chefs in cart</Text>
              </View>
            ) : (
              <FlatList
                data={chefCart}
                keyExtractor={(i) => i.id}
                renderItem={renderChefItem}
                scrollEnabled={false}
              />
            )}

            {/* Chefs Bill Section */}
            {chefCart.length > 0 && (
              <View style={styles.billContainer}>
                <Text style={styles.billTitle}>Chefs Bill Details</Text>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Chefs Subtotal</Text>
                  <Text style={styles.billValue}>₹{chefTotal}</Text>
                </View>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Platform Fee</Text>
                  <Text style={styles.billValue}>₹{platformFee}</Text>
                </View>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Additional Fee</Text>
                  <Text style={styles.billValue}>₹{addFee}</Text>
                </View>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>GST (5%)</Text>
                  <Text style={styles.billValue}>₹{chefGst}</Text>
                </View>
                <View style={styles.billDivider} />
                <View style={styles.billRow}>
                  <Text style={styles.billTotal}>Chefs Total</Text>
                  <Text style={styles.billTotal}>₹{chefFinalTotal}</Text>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Separate checkout buttons for each tab */}
      {activeTab === "dishes" && dishCart.length > 0 && (
        <TouchableOpacity
          onPress={() => router.replace("/checkout")}
          style={[styles.checkoutButton, { backgroundColor: "#C67C4E" }]}
        >
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout Dishes • ₹{dishFinalTotal}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {activeTab === "chefs" && chefCart.length > 0 && (
        <TouchableOpacity
          onPress={() => router.replace("/checkout")}
          style={[styles.checkoutButton, { backgroundColor: "#C67C4E" }]}
        >
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout Chefs • ₹{chefFinalTotal}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  clearAllText: { color: "#C67C4E", fontSize: 14, fontWeight: "600" },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#C67C4E",
  },
  tabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    alignItems: "center",
  },
  itemImage: { width: 70, height: 70, borderRadius: 12 },
  itemDetails: { flex: 1, marginLeft: 12 },
  itemName: { color: "#fff", fontSize: 16, fontWeight: "600", marginBottom: 4 },
  itemMealType: { color: "#999", fontSize: 12, marginBottom: 2 },
  chefName: { color: "#C67C4E", fontSize: 12, marginBottom: 8 },
  itemBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemPrice: { color: "#fff", fontSize: 14, fontWeight: "600" },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 4,
  },
  stepperButton: {
    backgroundColor: "#C67C4E",
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
  itemTotal: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  removeButton: { padding: 8 },
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
  billLabel: { color: "#999", fontSize: 14 },
  billValue: { color: "#fff", fontSize: 14, fontWeight: "600" },
  billDivider: { height: 1, backgroundColor: "#333", marginVertical: 12 },
  billTotal: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  checkoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
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
  emptyCartButtons: {
    flexDirection: "row",
    marginTop: 30,
  },
  browseButton: {
    backgroundColor: "#C67C4E",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyTabContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTabText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 10,
  },
});
