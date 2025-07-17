import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "@/constants/supabase";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DISH_DELIVERY_STAGES = [
  "Looking for a delivery partner",
  "Rider on their way to pick up order",
  "Rider has reached pickup location",
  "Rider has picked up your order",
  "Rider is on the way to deliver your order",
  "Rider has successfully delivered your order",
];

const CHEF_HIRE_STAGES = [
  "Requested",
  "Chef Confirmed",
  "Preparing Ingredients",
  "On the Way",
  "Cooking in Progress",
  "Service Completed",
];

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
};

type ChefDetails = {
  chefId: string;
  chefName?: string;
  chefImage?: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  note?: string;
  chefPhone?: string;
};

type OrderDetails = {
  orderId: string;
  amount: number;
  paymentMethod: string;
  address: string;
  phone: string;
  instructions?: string;
  delivery_notes?: string;
  isChefHire?: boolean;
  items?: OrderItem[];
  note?: string;
  chefDetails?: ChefDetails;
};

export default function OrderPlacedScreen() {
  const router = useRouter();
  const { orderId, hireChefId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const rawOrderData = await AsyncStorage.getItem("orderDetails");
        const rawHireData = await AsyncStorage.getItem("hireDetails");
        let details: OrderDetails | null = null;

        // If this is a chef hire
        if (hireChefId || rawHireData) {
          const hireData = rawHireData ? JSON.parse(rawHireData) : null;
          const hireId = (hireChefId as string) || hireData?.hireId;

          const { data, error } = await supabase
            .from("hire_chef")
            .select("*")
            .eq("id", hireId)
            .single();

          if (error || !data) {
            console.error("Error fetching chef hire:", error?.message);
            throw new Error("Chef hire details not found");
          }

          // Fetch chef details
          const { data: chefData } = await supabase
            .from("Chef")
            .select("*")
            .eq("chef_id", data.chef_id)
            .single();

          details = {
            orderId: data.id,
            amount: data.amount,
            paymentMethod: data.payment_method,
            address: data.address,
            phone: data.phone,
            note: data.note,
            delivery_notes: data.status,
            isChefHire: true,
            chefDetails: {
              chefId: data.chef_id,
              chefName: chefData?.name,
              chefImage: chefData?.profile_image,
              scheduledDate: data.scheduled_date,
              startTime: data.start_time,
              endTime: data.end_time,
              status: data.status,
              note: data.note,
              chefPhone: chefData?.phone,
            },
          };
        }
        // If this is a dish order
        else if (orderId || rawOrderData) {
          const orderData = rawOrderData ? JSON.parse(rawOrderData) : null;
          const id = (orderId as string) || orderData?.orderId;

          const { data, error } = await supabase
            .from("Orders")
            .select("*")
            .eq("order_id", id)
            .single();

          if (error || !data) {
            console.error("Error fetching order:", error?.message);
            throw new Error("Order details not found");
          }

          // Ensure items is always an array
          let items: OrderItem[] = [];
          if (data.items && Array.isArray(data.items)) {
            items = data.items;
          } else if (data.items) {
            // Handle case where items might be stored as object
            items = Object.values(data.items);
          }

          details = {
            orderId: data.order_id,
            amount: data.total_amount,
            paymentMethod: data.payment_method,
            address: data.delivery_address,
            phone: data.phone,
            instructions: data.instructions,
            delivery_notes: data.status,
            isChefHire: false,
            items: items,
          };
        }

        setOrderDetails(details);
      } catch (err) {
        console.error("Error loading order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  const getCurrentStageIndex = () => {
    if (!orderDetails) return 0;

    const stages = orderDetails.isChefHire
      ? CHEF_HIRE_STAGES
      : DISH_DELIVERY_STAGES;

    return stages.indexOf(orderDetails.delivery_notes || stages[0]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C67C4E" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#ff4444" />
          <Text style={styles.errorText}>No order details found</Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.homeButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentStageIndex = getCurrentStageIndex();
  const stages = orderDetails.isChefHire
    ? CHEF_HIRE_STAGES
    : DISH_DELIVERY_STAGES;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={styles.successHeader}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          </View>
          <Text style={styles.successTitle}>
            {orderDetails.isChefHire
              ? "Chef Hired Successfully!"
              : "Order Placed Successfully!"}
          </Text>
          <Text style={styles.successSubtitle}>
            {orderDetails.isChefHire
              ? "Your chef will contact you soon"
              : "Your food will be delivered shortly"}
          </Text>
          <Text style={styles.orderId}>
            {orderDetails.isChefHire ? "Booking ID" : "Order ID"}:{" "}
            {orderDetails.orderId}
          </Text>
        </View>

        {/* Status Section */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>
            {orderDetails.isChefHire ? "Booking Status" : "Order Status"}
          </Text>
          <View style={styles.statusContainer}>
            {stages.map((stage, index) => {
              const isComplete = index <= currentStageIndex;
              const color = isComplete ? "#4CAF50" : "#666";
              const iconBg = isComplete ? "#4CAF50" : "#333";

              const iconMap = orderDetails.isChefHire
                ? [
                    "person-outline",
                    "checkmark-done",
                    "restaurant-outline",
                    "walk",
                    "time-outline",
                    "checkmark-done",
                  ]
                : [
                    "search",
                    "walk",
                    "navigate",
                    "checkmark-done",
                    "bicycle",
                    "home",
                  ];

              return (
                <View style={styles.statusStep} key={index}>
                  <View
                    style={[
                      styles.statusIconContainer,
                      { backgroundColor: iconBg },
                    ]}
                  >
                    <Ionicons
                      name={"checkmark-circle"}
                      size={24}
                      color={color}
                    />
                  </View>
                  <View style={styles.statusContent}>
                    <Text style={[styles.statusTitle, { color }]}>{stage}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.orderDetailsSection}>
          <Text style={styles.sectionTitle}>
            {orderDetails.isChefHire ? "Booking Details" : "Order Details"}
          </Text>
          <View style={styles.detailsContainer}>
            {orderDetails.isChefHire && orderDetails.chefDetails && (
              <View style={styles.chefInfoContainer}>
                <View style={styles.chefText}>
                  <Text style={styles.chefName}>
                    {orderDetails.chefDetails.chefName || "Professional Chef"}
                  </Text>
                  <Text style={styles.chefContact}>
                    {orderDetails.chefDetails.chefPhone ||
                      "Contact chef for details"}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount Paid</Text>
              <Text style={styles.detailValue}>₹{orderDetails.amount}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>
                {orderDetails.paymentMethod === "razorpay"
                  ? "Online Payment"
                  : "Cash on Delivery"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {orderDetails.isChefHire
                  ? "Service Address"
                  : "Delivery Address"}
              </Text>
              <Text style={styles.detailValue}>{orderDetails.address}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Contact Phone</Text>
              <Text style={styles.detailValue}>{orderDetails.phone}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push("/(tabs)/chef")}
          >
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#fff", fontSize: 16, marginTop: 16 },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 60 },
  successHeader: { alignItems: "center", paddingVertical: 40 },
  successIcon: { marginBottom: 20 },
  successTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  successSubtitle: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  orderId: { color: "#C67C4E", fontSize: 14, fontWeight: "600" },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statusSection: { marginBottom: 32 },
  statusContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
  },
  statusStep: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statusContent: { flex: 1 },
  statusTitle: { fontSize: 16, fontWeight: "600" },
  orderDetailsSection: { marginBottom: 32 },
  detailsContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
  },
  chefInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  chefImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  chefText: {
    flex: 1,
  },
  chefName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  chefContact: {
    color: "#C67C4E",
    fontSize: 14,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  detailLabel: { color: "#999", fontSize: 14 },
  detailValue: { color: "#fff", fontSize: 14, fontWeight: "600" },
  itemsSection: {
    marginTop: 16,
  },
  itemsTitle: {
    color: "#C67C4E",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemName: {
    color: "#fff",
    fontSize: 14,
  },
  itemPrice: {
    color: "#C67C4E",
    fontSize: 14,
    fontWeight: "600",
  },
  noItemsText: {
    color: "#999",
    fontSize: 14,
    fontStyle: "italic",
  },
  actionButtons: {
    marginBottom: 40,
  },
  trackButton: {
    backgroundColor: "#C67C4E",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  trackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  homeButton: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#C67C4E",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  homeButtonText: {
    color: "#C67C4E",
    fontSize: 16,
    fontWeight: "600",
  },
});
