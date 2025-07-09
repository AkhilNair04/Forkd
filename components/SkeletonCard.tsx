import { MotiView } from "moti";
import { View, StyleSheet } from "react-native";

export default function SkeletonCard() {
  return (
    <View style={styles.card}>
      <ShimmerBox style={styles.imagePlaceholder} />
      <ShimmerBox style={styles.textLine} />
      <ShimmerBox style={[styles.textLine, { width: "60%" }]} />
    </View>
  );
}

function ShimmerBox({ style }: { style: any }) {
  return (
    <MotiView
      style={[style, { backgroundColor: "#333", borderRadius: 10 }]}
      from={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "timing",
        duration: 800,
        loop: true,
        repeatReverse: true,
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 6,
    marginBottom: 16,
    width: "48%",
  },
  imagePlaceholder: {
    height: 140,
    width:'100%',
    backgroundColor: "#333",
    borderRadius: 12,
    marginBottom: 10,
  },
  textLine: {
    height: 28,
    backgroundColor: "#444",
    borderRadius: 8,
    marginBottom: 8,
  },
});
