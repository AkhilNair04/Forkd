import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY = "#b87a51";
const BG = "#111";
const CARD = "#444";

export default function SupportScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Support</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HelpDesk Section */}
        <View style={styles.cardBox}>
          <Text style={styles.sectionTitle}>HelpDesk:</Text>
          <SupportRow label="Chat Support" />
          <SupportRow label="Email Support" />
          <SupportRow label="Phone Support" />
        </View>
        {/* Ticket Support Section */}
        <View style={styles.cardBox}>
          <Text style={styles.sectionTitle}>Ticket Support:</Text>
          <SupportRow label="Dish Related Support" />
          <SupportRow label="Chef/Cook Support" />
          <SupportRow label="Rider/Delivery Support" />
          <SupportRow label="Payment/Refund Support" />
          <SupportRow label="App-related Support" />
        </View>
        {/* FAQs Section */}
        <View style={styles.cardBox}>
          <TouchableOpacity style={styles.faqRow}>
            <Text style={styles.faqTitle}>FAQs</Text>
            <Feather name="chevron-right" size={22} color="#bbb" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function SupportRow({ label }: { label: string }) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7}>
      <Text style={styles.rowText}>{label}</Text>
      <Feather name="chevron-right" size={22} color="#bbb" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 38,
    marginLeft: 14,
    marginBottom: 18,
  },
  backButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 7,
    marginRight: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "bold",
  },
  cardBox: {
    backgroundColor: CARD,
    borderRadius: 22,
    marginHorizontal: 18,
    marginBottom: 22,
    padding: 18,
  },
  sectionTitle: {
    color: PRIMARY,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#666",
  },
  rowText: {
    color: "#fff",
    fontSize: 17,
  },
  faqRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  faqTitle: {
    color: PRIMARY,
    fontSize: 18,
    fontWeight: "bold",
  },
});
