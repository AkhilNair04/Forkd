import { supabase } from "@/constants/supabase";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayButton, setShowPayButton] = useState(false);

  // Get the payment method from checkout page params
  const paymentMethod = (params.paymentMethod as string) || "cod";
  const total = (params.total as string) || "0";
  const address = (params.address as string) || "";
  const phone = (params.phone as string) || "";
  const instructions = (params.instructions as string) || "";
  const amount = parseInt(total) / 100;

  // Auto-select the payment method that was chosen in checkout
  const [selectedMethod, setSelectedMethod] = useState<string>(paymentMethod);

  // Insert dish order to Supabase Orders table
  const insertOrderToSupabase = async ({
    userId,
    items,
    address,
    lat,
    lng,
    subtotal,
    gst,
    deliveryFee,
    paymentMethod,
    phone,
  }: any) => {
    const { data, error } = await supabase
      .from("Orders")
      .insert({
        user_id: userId,
        rider_id: "3b2d5a1e-8f14-4a5b-ae99-000000000012",
        items,
        order_time: new Date().toISOString(),
        delivery_lat: lat,
        delivery_lng: lng,
        delivery_address: address,
        status: "open",
        total_amount: subtotal,
        tax_amount: gst,
        delivery_fee: deliveryFee,
        payment_status: "paid",
        payment_method: paymentMethod,
        payment_time: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        phone,
      })
      .select("order_id");

    if (error) {
      console.error("❌ Supabase insert to orders error:", error.message);
      return null;
    }

    return data?.[0]?.order_id;
  };

  function calculateEndTime(startTime: string, hours: number): string {
    const [hourStr, minStr] = startTime.split(":");
    const start = new Date();
    start.setHours(parseInt(hourStr, 10), parseInt(minStr, 10), 0, 0);
    start.setHours(start.getHours() + hours);
    // Return as "HH:mm"
    return start.toTimeString().slice(0, 5);
  }

  // Insert chef hire to Supabase hire_chef table
  const insertHireChefToSupabase = async ({
    userId,
    chefId,
    scheduledDate,
    startTime,
    endTime,
    hours,
    note,
    address,
    lat,
    lng,
    amount,
    tax,
    paymentStatus,
    paymentMethod,
    paymentTime,
    phone,
  }: any) => {
    const end = calculateEndTime(startTime, hours);
    const { data, error } = await supabase
      .from("hire_chef")
      .insert({
        user_id: userId,
        chef_id: chefId,
        scheduled_date: scheduledDate,
        start_time: startTime,
        end_time: end,
        hours,
        note,
        address,
        lat,
        lng,
        amount,
        tax_amount: tax,
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        payment_time: paymentTime,
        updated_at: new Date().toISOString(),
        phone,
        status: "requested",
      })
      .select("id"); // fetch inserted hire UUID

    if (error) {
      console.error("❌ Supabase insert error (hire_chef):", error.message);
      return null;
    }

    return data?.[0]?.id;
  };

  // Only run all logic when pay button is pressed
  // const handlePay = async () => {
  //   setIsProcessing(true);

  //   setTimeout(
  //     async () => {
  //       const {
  //         data: { user },
  //       } = await supabase.auth.getUser();
  //       const userId = user?.id;

  //       // Dish order logic
  //       const cart = await AsyncStorage.getItem("cartItems");
  //       const items = cart ? JSON.parse(cart) : [];

  //       const dishesOnly = items.filter((item: any) =>
  //         item.id?.startsWith("D")
  //       );

  //       // Get location (for both orders and chef hire, if needed)
  //       let lat = "28.807668",
  //         lng = "77.787397";

  //       // Place dish order if cart has dishes
  //       if (dishesOnly.length > 0) {
  //         const subtotal = amount;
  //         const gst = Math.round(subtotal * 0.05);
  //         const deliveryFee = 30;

  //         const orderId = await insertOrderToSupabase({
  //           userId,
  //           items: dishesOnly,
  //           address,
  //           lat,
  //           lng,
  //           subtotal,
  //           gst,
  //           deliveryFee,
  //           paymentMethod: selectedMethod,
  //           phone,
  //         });

  //         if (!orderId) {
  //           Alert.alert("Error", "Order failed. Please try again.");
  //           setIsProcessing(false);
  //           return;
  //         }

  //         await AsyncStorage.setItem("orderId", orderId); // store UUID
  //         await AsyncStorage.setItem(
  //           "orderDetails",
  //           JSON.stringify({
  //             amount: subtotal,
  //             address,
  //             phone,
  //             instructions,
  //             paymentMethod: selectedMethod,
  //             orderId,
  //           })
  //         );
  //       }

  //       // Chef hire logic
  //       const pendingHire = await AsyncStorage.getItem("pendingHire");
  //       if (pendingHire) {
  //         const hire = JSON.parse(pendingHire);

  //         // Compose payload for hire_chef
  //         const hirePayload = {
  //           userId,
  //           chefId: hire.chefId,
  //           scheduledDate: hire.scheduledDate.split("T")[0], // ISO to yyyy-mm-dd
  //           startTime: hire.startTime,
  //           endTime: null,
  //           hours: hire.hours,
  //           note: hire.note,
  //           address,
  //           lat,
  //           lng,
  //           amount,
  //           tax: Math.round(amount * 0.05),
  //           paymentStatus: "paid",
  //           paymentMethod: selectedMethod,
  //           paymentTime: new Date().toISOString(),
  //           phone,
  //         };

  //         const hireChefId = await insertHireChefToSupabase(hirePayload);

  //         if (!hireChefId) {
  //           Alert.alert("Error", "Chef hiring failed. Please try again.");
  //           setIsProcessing(false);
  //           return;
  //         }

  //         await AsyncStorage.setItem("hireChefId", hireChefId);
  //         await AsyncStorage.removeItem("pendingHire"); // clear after success
  //       }

  //       setIsProcessing(false);
  //       Alert.alert(
  //         selectedMethod === "razorpay"
  //           ? "Payment Successful!"
  //           : "Order Placed!",
  //         selectedMethod === "razorpay"
  //           ? "Your payment has been processed successfully."
  //           : "Your order has been placed successfully. Pay when delivered.",
  //         [
  //           {
  //             text: "Track Order",
  //             onPress: () => router.push("/checkout/order_placed"),
  //           },
  //         ]
  //       );
  //     },
  //     selectedMethod === "razorpay" ? 2000 : 1500
  //   );
  // };


  const handlePay = async () => {
  setIsProcessing(true);

  setTimeout(
    async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;

      let orderDetails = null;
      let hireDetails = null;

      // Dish order logic
      const cart = await AsyncStorage.getItem("cartItems");
      const items = cart ? JSON.parse(cart) : [];
      const dishesOnly = items.filter((item: any) => item.id?.startsWith("D"));

      if (dishesOnly.length > 0) {
        const subtotal = amount;
        const gst = Math.round(subtotal * 0.05);
        const deliveryFee = 30;

        const orderId = await insertOrderToSupabase({
          userId,
          items: dishesOnly,
          address,
          lat: "28.807668",
          lng: "77.787397",
          subtotal,
          gst,
          deliveryFee,
          paymentMethod: selectedMethod,
          phone,
        });

        if (!orderId) {
          Alert.alert("Error", "Order failed. Please try again.");
          setIsProcessing(false);
          return;
        }

        orderDetails = {
          type: "dish",
          orderId,
          amount: subtotal,
          address,
          phone,
          instructions,
          paymentMethod: selectedMethod,
          items: dishesOnly,
        };

        await AsyncStorage.setItem("orderDetails", JSON.stringify(orderDetails));
      }

      // Chef hire logic
      const pendingHire = await AsyncStorage.getItem("pendingHire");
      if (pendingHire) {
        const hire = JSON.parse(pendingHire);

        const hirePayload = {
          userId,
          chefId: hire.chefId,
          scheduledDate: hire.scheduledDate.split("T")[0],
          startTime: hire.startTime,
          hours: hire.hours,
          note: hire.note,
          address,
          lat: "28.807668",
          lng: "77.787397",
          amount,
          tax: Math.round(amount * 0.05),
          paymentStatus: "paid",
          paymentMethod: selectedMethod,
          paymentTime: new Date().toISOString(),
          phone,
        };

        const hireChefId = await insertHireChefToSupabase(hirePayload);

        if (!hireChefId) {
          Alert.alert("Error", "Chef hiring failed. Please try again.");
          setIsProcessing(false);
          return;
        }

        hireDetails = {
          type: "chef",
          hireId: hireChefId,
          chefId: hire.chefId,
          scheduledDate: hire.scheduledDate,
          startTime: hire.startTime,
          hours: hire.hours,
          note: hire.note,
          amount,
          address,
          phone,
          paymentMethod: selectedMethod,
        };

        await AsyncStorage.setItem("hireDetails", JSON.stringify(hireDetails));
        await AsyncStorage.removeItem("pendingHire");
      }

      setIsProcessing(false);
      
      // Navigate to order_placed with the appropriate details
      router.push({
        pathname: "/checkout/order_placed",
        params: {
          orderType: dishesOnly.length > 0 ? "dish" : "chef",
          ...(dishesOnly.length > 0 ? { orderDetails: JSON.stringify(orderDetails) } : {}),
          ...(pendingHire ? { hireDetails: JSON.stringify(hireDetails) } : {}),
        },
      });
    },
    selectedMethod === "razorpay" ? 2000 : 1500
  );
};

  // Show pay button immediately since method is already selected
  useEffect(() => {
    setShowPayButton(true);
  }, []);

  if (isProcessing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9100" />
        <Text style={styles.loadingText}>Processing your order...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.emptySpace} />
      </View>

      <View style={styles.content}>
        <View style={styles.orderSummary}>
          <Ionicons name="receipt-outline" size={48} color="#FF9100" />
          <Text style={styles.orderTitle}>Order Summary</Text>
          <Text style={styles.amountText}>₹{amount}</Text>
          <Text style={styles.orderDetails}>Delivery to: {address}</Text>
          <Text style={styles.orderDetails}>Phone: {phone}</Text>
          {instructions ? (
            <Text style={styles.orderDetails}>
              Instructions: {instructions}
            </Text>
          ) : null}
        </View>

        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {/* Only show the selected payment method */}
          {paymentMethod === "razorpay" ? (
            <View style={[styles.paymentOption, styles.paymentOptionSelected]}>
              <Ionicons name="card-outline" size={32} color="#FF9100" />
              <Text style={styles.selectedMethodTitle}>Online Payment</Text>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#4CAF50"
                style={{ marginLeft: 10 }}
              />
            </View>
          ) : (
            <View style={[styles.paymentOption, styles.paymentOptionSelected]}>
              <Ionicons name="cash-outline" size={32} color="#FF9100" />
              <Text style={styles.selectedMethodTitle}>Cash on Delivery</Text>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#4CAF50"
                style={{ marginLeft: 10 }}
              />
            </View>
          )}

          <Text style={styles.paymentConfirmationText}>
            {paymentMethod === "razorpay"
              ? "You've selected online payment. Proceed to pay securely."
              : "You'll pay when your order is delivered."}
          </Text>
        </View>

        {showPayButton && (
          <TouchableOpacity style={styles.payButton} onPress={handlePay}>
            <Ionicons name="wallet" size={20} color="#fff" />
            <Text style={styles.payButtonText}>
              {paymentMethod === "razorpay" ? "Pay Now" : "Confirm Order"}
            </Text>
          </TouchableOpacity>
        )}

        {paymentMethod === "razorpay" && (
          <View style={styles.securityInfo}>
            <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
            <Text style={styles.securityText}>
              Your payment is secure and encrypted
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
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
  emptySpace: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  orderSummary: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  orderTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  amountText: {
    color: "#FF9100",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 8,
  },
  orderDetails: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  paymentMethods: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#333",
  },
  paymentOptionSelected: {
    borderColor: "#FF9100",
  },
  selectedMethodTitle: {
    color: "#FF9100",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  paymentConfirmationText: {
    color: "#999",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9100",
    borderRadius: 12,
    padding: 18,
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 6,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
  },
  securityText: {
    color: "#4CAF50",
    fontSize: 14,
    marginLeft: 8,
  },
});
