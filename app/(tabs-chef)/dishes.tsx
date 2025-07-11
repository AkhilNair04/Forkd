// app/(tabs-chef)/dishes.tsx
import { RestrictedTabWrapper } from "@/components/RestrictedTabWrapper";
import { Text, View } from "react-native";

export default function DishesScreen() {
  return (
    <RestrictedTabWrapper>
      <View>
        <Text>Dishes go here</Text>
      </View>
    </RestrictedTabWrapper>
  );
}
