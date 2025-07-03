// components/HeaderSection.tsx
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HeaderSection({ address }: { address: string }) {
  const router = useRouter();
  return (
    <View style={styles.topBar}>
      <View>
        <View style={styles.row}>
          <Text style={styles.deliverText}>DELIVER TO</Text>
          <IconSymbol
            name="caretdown"
            size={12}
            color="#C67C4E"
            style={{ marginLeft: 4 }}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.address}>{address}</Text>
        </View>
      </View>

      <View style={styles.icons}>
        {/* Chat button */}
        <TouchableOpacity 
          style={styles.badgeWrapper}
          onPress={() => router.push('/chat')}
        >
          <Ionicons 
            name="chatbubble-ellipses-outline" 
            size={24} 
            color="white" 
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>

        {/* Cart button */}
        <TouchableOpacity
          style={{ marginLeft: 16 }}
          onPress={() => router.push('/checkout/cart')}
        >
          <Ionicons 
            name="cart-outline" 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  deliverText: {
    color: "#C67C4E",
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  address: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -7,
    right: -8,
    backgroundColor: "#C67C4E",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
  },
});
