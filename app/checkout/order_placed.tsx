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

const DELIVERY_STAGES = [
  "Looking for a delivery partner",
  "Rider on their way to pick up order",
  "Rider has reached pickup location",
  "Rider has picked up your order",
  "Rider is on the way to deliver your order",
  "Rider has successfully delivered your order",
];

type OrderDetails = {
  orderId: string;
  amount: number;
  paymentMethod: string;
  address: string;
  phone: string;
  instructions?: string;
  delivery_notes?: string;
  isChefHire?: boolean;
  note?: string;
  chefDetails?: {
    chefId: string;
    chefName?: string;
    scheduledDate?: string;
    startTime?: string;
    endTime?: string;
    status?: string;
    note?: string;
    chefPhone?: string;
  };
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
        const rawHireData = await AsyncStorage.getItem("hireChefId");
        let details: OrderDetails | null = null;

        // If this is a chef hire, fetch from hire_chef
        if (hireChefId || rawHireData) {
          const chefHireId = (hireChefId as string) || rawHireData;
          // Fetch from Supabase
          const { data, error } = await supabase
            .from("hire_chef")
            .select(
              "id, amount, payment_method, address, phone, note, status, chef_id, scheduled_date, start_time, end_time,user_rating"
            )
            .eq("id", chefHireId)
            .single();

          if (error || !data) {
            console.error(
              "❌ Supabase fetch error (hire_chef):",
              error?.message
            );
            throw new Error("Chef hire details not found");
          }

          // Fetch chef name if you want (optional)
          let chefName = undefined;
          let chefPhone = undefined;
          try {
            const { data: chefData } = await supabase
              .from("Chef")
              .select("name, phone")
              .eq("id", data.chef_id)
              .single();
            chefName = chefData?.name;
            chefPhone = chefData?.phone;
          } catch (e) {}

          details = {
            orderId: data.id,
            amount: parseFloat(data.amount),
            paymentMethod: data.payment_method,
            address: data.address,
            phone: data.phone ?? "N/A",
            note: data.note,
            delivery_notes: data.status,
            isChefHire: true,
            chefDetails: {
              chefId: data.chef_id,
              chefName,
              chefPhone,
              scheduledDate: data.scheduled_date,
              startTime: data.start_time,
              endTime: data.end_time,
              status: data.status,
              note: data.note,
            },
          };
        } else if (rawOrderData) {
          // Normal dish order
          const { orderId } = JSON.parse(rawOrderData);
          const { data, error } = await supabase
            .from("Orders")
            .select(
              "order_id, total_amount, payment_method, delivery_address, delivery_notes, tax_amount, phone, items"
            )
            .eq("order_id", orderId)
            .single();

          if (error || !data) {
            console.error("❌ Supabase fetch error (Orders):", error?.message);
            throw new Error("Order details not found");
          }

          details = {
            orderId: data.order_id,
            amount: parseFloat(data.total_amount),
            paymentMethod: data.payment_method,
            address: data.delivery_address,
            delivery_notes: data.delivery_notes,
            phone: data.phone ?? "N/A",
            isChefHire: false,
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

  const getCurrentStage = () => {
    const index = DELIVERY_STAGES.indexOf(orderDetails?.delivery_notes ?? "");
    return index >= 0 ? index : 0;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9100" />
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
              ? "Chef Hire Request Placed!"
              : "Order Placed Successfully!"}
          </Text>
          <Text style={styles.successSubtitle}>
            {orderDetails.isChefHire
              ? "Your chef will reach out for confirmation soon"
              : "Your delicious food will be delivered shortly"}
          </Text>
          <Text style={styles.orderId}>
            {orderDetails.isChefHire ? "Hire ID" : "Order ID"}:{" "}
            {orderDetails.orderId}
          </Text>
        </View>

        {/* Status Section */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>
            {orderDetails.isChefHire ? "Hire Status" : "Order Status"}
          </Text>
          <View style={styles.statusContainer}>
            {orderDetails.isChefHire ? (
              <View style={styles.statusStep}>
                <View
                  style={[
                    styles.statusIconContainer,
                    { backgroundColor: "#4CAF50" },
                  ]}
                >
                  <Ionicons name="person-outline" size={24} color="#4CAF50" />
                </View>
                <View style={styles.statusContent}>
                  <Text style={[styles.statusTitle, { color: "#4CAF50" }]}>
                    {orderDetails.chefDetails?.status || "Requested"}
                  </Text>
                </View>
              </View>
            ) : (
              DELIVERY_STAGES.map((stage, index) => {
                const current = getCurrentStage();
                const isComplete = index <= current;
                const color = isComplete ? "#4CAF50" : "#666";
                const iconBg = isComplete ? "#4CAF50" : "#333";

                const iconMap: { [key: number]: any } = {
                  0: "search",
                  1: "walk",
                  2: "navigate",
                  3: "checkmark-done",
                  4: "bicycle",
                  5: "home",
                };

                return (
                  <View style={styles.statusStep} key={index}>
                    <View
                      style={[
                        styles.statusIconContainer,
                        { backgroundColor: iconBg },
                      ]}
                    >
                      <Ionicons
                        name={iconMap[index] || "checkmark-circle"}
                        size={24}
                        color={color}
                      />
                    </View>
                    <View style={styles.statusContent}>
                      <Text style={[styles.statusTitle, { color }]}>
                        {stage}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>

        {/* Order/Chef Hire Details Section */}
        <View style={styles.orderDetailsSection}>
          <Text style={styles.sectionTitle}>
            {orderDetails.isChefHire ? "Hire Details" : "Order Details"}
          </Text>
          <View style={styles.detailsContainer}>
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
              <Text
                style={[styles.detailValue, { flex: 1, textAlign: "right" }]}
              >
                {orderDetails.address}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{orderDetails.phone}</Text>
            </View>
            {orderDetails.isChefHire && orderDetails.chefDetails && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Chef</Text>
                  <Text style={styles.detailValue}>
                    {orderDetails.chefDetails.chefName ||
                      orderDetails.chefDetails.chefId}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Scheduled Date</Text>
                  <Text style={styles.detailValue}>
                    {orderDetails.chefDetails.scheduledDate}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Start Time</Text>
                  <Text style={styles.detailValue}>
                    {orderDetails.chefDetails.startTime}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>End Time</Text>
                  <Text style={styles.detailValue}>
                    {orderDetails.chefDetails.endTime}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Instructions</Text>
                  <Text style={styles.detailValue}>
                    {orderDetails.chefDetails.note}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsSection}>
          <Text style={styles.sectionTitle}>What&apos;s Next?</Text>
          <View style={styles.nextStepsContainer}>
            {orderDetails.isChefHire ? (
              <>
                <View style={styles.nextStep}>
                  <Ionicons name="person-outline" size={24} color="#FF9100" />
                  <Text style={styles.nextStepText}>
                    Your chef will contact you for confirmation
                  </Text>
                </View>
                <View style={styles.nextStep}>
                  <Ionicons name="call-outline" size={24} color="#FF9100" />
                  <Text style={styles.nextStepText}>
                    Coordinate timing and any special requests
                  </Text>
                </View>
                <View style={styles.nextStep}>
                  <Ionicons name="star-outline" size={24} color="#FF9100" />
                  <Text style={styles.nextStepText}>
                    Leave a review after service!
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.nextStep}>
                  <Ionicons name="time-outline" size={24} color="#FF9100" />
                  <Text style={styles.nextStepText}>
                    Your food will be ready in 15-20 minutes
                  </Text>
                </View>
                <View style={styles.nextStep}>
                  <Ionicons name="call-outline" size={24} color="#FF9100" />
                  <Text style={styles.nextStepText}>
                    We&apos;ll call you once the delivery partner is assigned
                  </Text>
                </View>
                <View style={styles.nextStep}>
                  <Ionicons name="star-outline" size={24} color="#FF9100" />
                  <Text style={styles.nextStepText}>
                    Rate your experience after delivery
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push("/(tabs)/dish")}
          >
            <Ionicons name="restaurant-outline" size={20} color="#FF9100" />
            <Text style={styles.exploreButtonText}>Explore More Dishes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chefsButton}
            onPress={() => router.push("/")}
          >
            <Ionicons name="people-outline" size={20} color="#fff" />
            <Text style={styles.chefsButtonText}>Discover Chefs</Text>
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
  orderId: { color: "#FF9100", fontSize: 14, fontWeight: "600" },
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
  nextStepsSection: { marginBottom: 32 },
  nextStepsContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
  },
  nextStep: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  nextStepText: { color: "#fff", fontSize: 14, marginLeft: 12, flex: 1 },
  actionButtons: { marginBottom: 40 },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#FF9100",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exploreButtonText: {
    color: "#FF9100",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  chefsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9100",
    borderRadius: 12,
    padding: 16,
  },
  chefsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  homeButton: {
    backgroundColor: "#FF9100",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  homeButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
