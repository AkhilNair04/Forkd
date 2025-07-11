import { useChefRestriction } from "@/context/ChefRestrictionContext";
import React from "react";
import { StyleSheet, View } from "react-native";
import { RestrictedOverlay } from "./RestrictedOverlay";

interface RestrictedTabWrapperProps {
  children: React.ReactNode;
  allowOnProfile?: boolean;
}

export const RestrictedTabWrapper: React.FC<RestrictedTabWrapperProps> = ({
  children,
  allowOnProfile = false,
}) => {
  const { isRestricted, isLoading, restrictionReason } = useChefRestriction();

  // If loading, show children (to avoid flash)
  if (isLoading) {
    return <View style={styles.container}>{children}</View>;
  }

  // If not restricted, show children normally
  if (!isRestricted) {
    return <View style={styles.container}>{children}</View>;
  }

  // If restricted and this is the profile page, show children
  if (allowOnProfile) {
    return <View style={styles.container}>{children}</View>;
  }

  // If restricted and not profile page, show restricted overlay
  return (
    <View style={styles.container}>
      {children}
      <RestrictedOverlay reason={restrictionReason} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
