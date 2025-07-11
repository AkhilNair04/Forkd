import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  Linking,
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

  const handleChatSupport = () => {
    // Navigate to chat or show coming soon
    Alert.alert('Chat Support', 'Live chat will be available soon!');
  };

  const handleEmailSupport = () => {
    const email = 'support@forkd.app';
    const subject = 'Support Request';
    const body = 'Please describe your issue here...';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const handlePhoneSupport = () => {
    const phoneNumber = '+1-800-FORKD-APP';
    Alert.alert(
      'Phone Support',
      `Call us at ${phoneNumber}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => Linking.openURL(`tel:${phoneNumber}`).catch(() => {
            Alert.alert('Error', 'Unable to make phone call');
          })
        }
      ]
    );
  };

  const handleTicketSupport = (type: string) => {
    Alert.alert(
      'Ticket Support',
      `Create a support ticket for ${type}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create Ticket', onPress: () => console.log(`Creating ticket for ${type}`) }
      ]
    );
  };

  const handleFAQs = () => {
    Alert.alert('FAQs', 'Frequently Asked Questions section coming soon!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={26} color="#fff" />
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
          <SupportRow label="Chat Support" onPress={handleChatSupport} />
          <SupportRow label="Email Support" onPress={handleEmailSupport} />
          <SupportRow label="Phone Support" onPress={handlePhoneSupport} />
        </View>
        {/* Ticket Support Section */}
        <View style={styles.cardBox}>
          <Text style={styles.sectionTitle}>Ticket Support:</Text>
          <SupportRow label="Dish Related Support" onPress={() => handleTicketSupport('Dish Related Issues')} />
          <SupportRow label="Chef/Cook Support" onPress={() => handleTicketSupport('Chef/Cook Issues')} />
          <SupportRow label="Rider/Delivery Support" onPress={() => handleTicketSupport('Delivery Issues')} />
          <SupportRow label="Payment/Refund Support" onPress={() => handleTicketSupport('Payment/Refund Issues')} />
          <SupportRow label="App-related Support" onPress={() => handleTicketSupport('App Issues')} />
        </View>
        {/* FAQs Section */}
        <View style={styles.cardBox}>
          <TouchableOpacity style={styles.faqRow} onPress={handleFAQs}>
            <Text style={styles.faqTitle}>FAQs</Text>
            <Feather name="chevron-right" size={22} color="#bbb" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function SupportRow({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={onPress}>
      <Text style={styles.rowText}>{label}</Text>
      <Feather name="chevron-right" size={22} color="#bbb" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 38,
    marginLeft: 14,
    marginBottom: 18,
  },
  backButton: {
    backgroundColor: "#1a1a1a",
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
    backgroundColor: '#1a1a1a',
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
