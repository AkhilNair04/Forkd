// components/SearchBarWithFilter.tsx
import { Ionicons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";

export default function SearchBarWithFilter({
  searchQuery,
  setSearchQuery,
  onOpenFilter,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenFilter: () => void;
}) {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search cuisines, dishes..."
          placeholderTextColor="#999"
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="mic" size={20} color="#999" />
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onOpenFilter}>
        <Ionicons name="options" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    width: "100%",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
  },
  input: { flex: 1, marginHorizontal: 8, color: "#fff" },
  filterButton: { backgroundColor: "#C67C4E", padding: 10, borderRadius: 12 },
});