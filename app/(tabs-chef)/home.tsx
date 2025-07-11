import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <View style={styles.pageContainer}>
      {/* Top Bar: Location & Chat */}
      <View style={styles.topRow}>
        <View>
          <Text
            style={[
              styles.locationLabel,
              { fontSize: 32, textAlign: "center", width: "100%" },
            ]}
          >
            Home.
          </Text>
        </View>
        <View style={styles.chatIconWrapper}>
          <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
          <View style={styles.chatBadge}>
            <Text style={styles.chatBadgeText}>2</Text>
          </View>
        </View>
      </View>

      {/* Open/Closed Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, isOpen ? styles.open : styles.closed]}
          onPress={() => setIsOpen((prev) => !prev)}
        >
          <Text
            style={[
              styles.toggleButtonText,
              isOpen ? styles.openText : styles.closedText,
            ]}
          >
            {isOpen ? "Open" : "Closed"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stat Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>02</Text>
          <Text style={styles.statLabel}>RUNNING ORDERS</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>05</Text>
          <Text style={styles.statLabel}>BOOKINGS</Text>
        </View>
      </View>

      {/* Revenue Card */}
      <View style={styles.revenueCard}>
        <View style={styles.revenueHeader}>
          <View>
            <Text style={styles.revenueLabel}>Total Revenue</Text>
            <Text style={styles.revenueValue}>Rs. 2470</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.revenueDetails}>See Details</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.revenueChartRow}>
          <View style={styles.revenueChartPlaceholder}>
            {/* Placeholder for chart */}
            <Text style={styles.chartText}>[Chart]</Text>
          </View>
          <TouchableOpacity style={styles.revenueDropdown}>
            <Text style={styles.revenueDropdownText}>Daily</Text>
            <Ionicons name="chevron-down" size={16} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Reviews Card */}
      <View style={styles.reviewsCard}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.reviewsLabel}>Reviews</Text>
          <TouchableOpacity>
            <Text style={styles.reviewsDetails}>See All Reviews</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reviewsRow}>
          <Ionicons
            name="star"
            size={20}
            color="#C67C4E"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.reviewsRating}>4.9</Text>
          <Text style={styles.reviewsTotal}> Total 20 Reviews</Text>
        </View>
      </View>

      {/* Popular Items Card */}
      <View style={styles.popularCard}>
        <View style={styles.popularHeader}>
          <Text style={styles.popularLabel}>Popular Items This Weeks</Text>
          <TouchableOpacity>
            <Text style={styles.popularDetails}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.popularItemsRow}>
          <View style={styles.popularItemPlaceholder} />
          <View style={styles.popularItemPlaceholder} />
        </View>
      </View>
    </View>
  );
}

const CARD_RADIUS = 20;
const CARD_BG = "#181818";
const CARD_PADDING = 18;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    paddingTop: 40,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  locationLabel: {
    color: "#C67C4E",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 1,
    marginBottom: 2,
  },
  locationValue: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  chatIconWrapper: {
    position: "relative",
    backgroundColor: "#181818",
    borderRadius: 20,
    padding: 6,
  },
  chatBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#C67C4E",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: "center",
  },
  chatBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  toggleRow: {
    alignItems: "center",
    marginBottom: 18,
  },
  toggleButton: {
    minWidth: 140,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    backgroundColor: "#181818",
  },
  open: {
    backgroundColor: "#C67C4E",
    borderColor: "#C67C4E",
  },
  closed: {
    backgroundColor: "#181818",
    borderColor: "#fff",
  },
  toggleButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  openText: {
    color: "#fff",
  },
  closedText: {
    color: "#fff",
    opacity: 0.7,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  statCard: {
    backgroundColor: CARD_BG,
    borderRadius: CARD_RADIUS,
    width: (width - 60) / 2,
    padding: CARD_PADDING,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 13,
    color: "#A0A0A0",
    fontWeight: "600",
    marginTop: 2,
    letterSpacing: 1,
  },
  revenueCard: {
    backgroundColor: CARD_BG,
    borderRadius: CARD_RADIUS,
    padding: CARD_PADDING,
    marginBottom: 18,
  },
  revenueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  revenueLabel: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
  revenueValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  revenueDetails: {
    color: "#C67C4E",
    fontWeight: "500",
    fontSize: 14,
  },
  revenueChartRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  revenueChartPlaceholder: {
    flex: 1,
    height: 60,
    backgroundColor: "#232323",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  chartText: {
    color: "#888",
    fontSize: 14,
  },
  revenueDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  revenueDropdownText: {
    color: "#888",
    fontWeight: "500",
    marginRight: 4,
  },
  reviewsCard: {
    backgroundColor: CARD_BG,
    borderRadius: CARD_RADIUS,
    padding: CARD_PADDING,
    marginBottom: 18,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewsLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewsDetails: {
    color: "#C67C4E",
    fontWeight: "500",
    fontSize: 14,
  },
  reviewsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewsRating: {
    color: "#C67C4E",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 6,
  },
  reviewsTotal: {
    color: "#fff",
    fontSize: 14,
  },
  popularCard: {
    backgroundColor: CARD_BG,
    borderRadius: CARD_RADIUS,
    padding: CARD_PADDING,
    marginBottom: 18,
  },
  popularHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  popularLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  popularDetails: {
    color: "#C67C4E",
    fontWeight: "500",
    fontSize: 14,
  },
  popularItemsRow: {
    flexDirection: "row",
    gap: 12,
  },
  popularItemPlaceholder: {
    flex: 1,
    height: 60,
    backgroundColor: "#232323",
    borderRadius: 12,
    marginRight: 8,
  },
});
