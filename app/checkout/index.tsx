// app/checkout/index.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router"; // Import useLocalSearchParams
import { useEffect, useState } from "react"; // Import useEffect
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useCart } from "../../context/CartContext";

// Define CartItem type (adjust fields as per your actual CartContext)
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function Checkout() {
  const router = useRouter();
  const { cart } = useCart() as { cart: CartItem[] };
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [instructions, setInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  // State to hold the total after applying a coupon
  const [appliedDiscountTotal, setAppliedDiscountTotal] = useState<number | null>(null);

  // Use local search params to receive data from coupons.tsx
  const params = useLocalSearchParams();
  const { discountedTotal: paramDiscountedTotal } = params; // Expecting 'discountedTotal'

  // Calculate base totals (before any coupon)
  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  const deliveryFee = 40;
  const platformFee = 5;
  const gst = Math.round((subtotal + deliveryFee) * 0.05);
  const regularTotal = subtotal + deliveryFee + platformFee + gst;

  // The 'total' variable will now depend on whether a coupon was applied
  const currentDisplayedTotal = appliedDiscountTotal !== null ? appliedDiscountTotal : regularTotal;

  // Effect to update the total when a discountedTotal is received from coupons.tsx
  useEffect(() => {
    if (paramDiscountedTotal) {
      // Ensure it's a number and update the state
      setAppliedDiscountTotal(parseFloat(paramDiscountedTotal as string));
    }
  }, [paramDiscountedTotal]); // Re-run when paramDiscountedTotal changes

  const validateForm = () => {
    if (!address.trim()) {
      Alert.alert("Missing Address", "Please enter your delivery address");
      return false;
    }
    if (!phone.trim()) {
      Alert.alert("Missing Phone", "Please enter your phone number");
      return false;
    }
    if (phone.length < 6) {
      Alert.alert("Invalid Phone", "Please enter a valid phone number (at least 6 digits)");
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      return;
    }

    const amountInPaise = (currentDisplayedTotal * 100).toString(); // Use currentDisplayedTotal

    try {
      await AsyncStorage.setItem("cartItems", JSON.stringify(cart));
      router.push({
        pathname: "/payment", // <-- CORRECTED: Now routes to /app/payment.tsx
        params: {
          total: amountInPaise,
          address: address.replace(/\n/g, " "),
          phone,
          instructions: instructions.replace(/\n/g, " "),
          paymentMethod,
          cart: JSON.stringify(cart),  // pass cart as JSON string
          gst,
          deliveryFee,
          platformFee,
          subtotal,
        },
      });

    } catch (error) {
      Alert.alert("Navigation Error", "Unable to proceed to payment. Please try again.");
    }
  };

  // Function to handle navigation to coupons screen
  const handleApplyCoupon = () => {
    router.push({
      pathname: '/checkout/coupons', // Route to your coupons.tsx file
      params: { currentSubtotal: subtotal.toFixed(2) }, // Pass the current subtotal to coupon screen
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderSummary}>
            {cart.map((item: CartItem) => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>× {item.quantity}</Text>
                <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Delivery Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Delivery Address *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your complete address"
              placeholderTextColor="#666"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your phone number"
              placeholderTextColor="#666"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Special Instructions (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Any special instructions for delivery"
              placeholderTextColor="#666"
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === "razorpay" && styles.selectedPayment]}
            onPress={() => setPaymentMethod("razorpay")}
          >
            <View style={styles.paymentInfo}>
              <Ionicons name="card-outline" size={24} color="#C67C4E" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.paymentTitle}>Online Payment</Text>
                <Text style={styles.paymentSubtitle}>Pay securely with Razorpay</Text>
              </View>
            </View>
            <View style={[styles.radioButton, paymentMethod === "razorpay" && styles.radioSelected]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === "cod" && styles.selectedPayment]}
            onPress={() => setPaymentMethod("cod")}
          >
            <View style={styles.paymentInfo}>
              <Ionicons name="cash-outline" size={24} color="#C67C4E" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                <Text style={styles.paymentSubtitle}>Pay when you receive</Text>
              </View>
            </View>
            <View style={[styles.radioButton, paymentMethod === "cod" && styles.radioSelected]} />
          </TouchableOpacity>
        </View>

        {/* Bill Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          <View style={styles.billContainer}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>₹{subtotal}</Text>
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

            {/* Apply Coupon Button - Added Here */}
            <TouchableOpacity style={styles.applyCouponButton} onPress={handleApplyCoupon}>
              <Text style={styles.applyCouponText}>Apply Coupon</Text>
              <Ionicons name="chevron-forward" size={20} color="#C67C4E" />
            </TouchableOpacity>

            {/* Display Discount Row if coupon was applied */}
            {appliedDiscountTotal !== null && (
              <>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Discount</Text>
                  <Text style={[styles.billValue, { color: 'lightgreen' }]}>
                    - ₹{(regularTotal - appliedDiscountTotal).toFixed(2)}
                  </Text>
                </View>
              </>
            )}

            <View style={styles.billDivider} />
            <View style={styles.billRow}>
              <Text style={styles.billTotal}>Total Amount</Text>
              <Text style={styles.billTotal}>₹{currentDisplayedTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.placeOrderButton}
        onPress={handleCheckout}
      >
        <Text style={styles.placeOrderText}>
          {paymentMethod === "razorpay" ? "Pay Now" : "Place Order"} • ₹{currentDisplayedTotal.toFixed(2)}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  orderSummary: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  itemName: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
  },
  itemQuantity: {
    color: "#999",
    fontSize: 14,
    marginHorizontal: 12,
  },
  itemPrice: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  selectedPayment: {
    borderColor: "#C67C4E",
    backgroundColor: "#1a1a1a",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  paymentSubtitle: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666",
  },
  radioSelected: {
    borderColor: "#C67C4E",
    backgroundColor: "#C67C4E",
  },
  billContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
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
  placeOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#C67C4E",
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 16,
    borderRadius: 12,
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // New styles for the Apply Coupon Button
  applyCouponButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a2a", // Slightly different background
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12, // Space from previous bill row
    marginBottom: 12, // Space before the divider
    borderWidth: 1,
    borderColor: "#444",
  },
  applyCouponText: {
    color: "#C67C4E", // Highlight color
    fontSize: 15,
    fontWeight: "bold",
  },
});