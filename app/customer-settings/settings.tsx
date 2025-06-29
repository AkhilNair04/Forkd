import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Settings: React.FC = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8}>
          <Feather name="arrow-left" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      {/* Settings List */}
      <View style={styles.settingsBox}>
        <SettingsItem
          title="Profile Settings"
          onPress={() => router.push("/customer-settings/customer-profile")}
        />
        <SettingsItem
          title="Eating Preferences"
          onPress={() => router.push("/customer-settings/eating-preferences")}
        />
        <SettingsItem title="Language and Region" />
        <SettingsItem title="Privacy & Security" />
        <SettingsItem
          title="Support & Feedback"
          onPress={() => router.push("/customer-settings/support")}
          isLast
        />
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TabIcon icon={<Feather name="home" size={28} color="#fff" />} />
        <TabIcon icon={<FontAwesome5 name="users" size={24} color="#fff" />} />
        <TabIcon
          icon={
            <MaterialCommunityIcons name="noodles" size={26} color="#fff" />
          }
        />
        <TabIcon icon={<MaterialIcons name="event" size={26} color="#fff" />} />
        <TabIcon
          icon={<Feather name="menu" size={26} color="#b87a51" />}
          activeCircle
        />
      </View>
    </View>
  );
};

interface SettingsItemProps {
  title: string;
  isLast?: boolean;
  onPress?: () => void;
}
const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  isLast,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.item, isLast && { borderBottomWidth: 0 }]}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <Text style={styles.itemText}>{title}</Text>
    <Feather name="chevron-right" size={22} color="#bbb" />
  </TouchableOpacity>
);

interface TabIconProps {
  icon: React.ReactNode;
  activeCircle?: boolean;
}
const TabIcon: React.FC<TabIconProps> = ({ icon, activeCircle }) => (
  <View style={activeCircle ? styles.activeTabCircle : styles.tabIcon}>
    {icon}
  </View>
);

const PRIMARY = "#b87a51";
const BG = "#111";
const CARD = "#444";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 38,
    marginLeft: 14,
    marginBottom: 25,
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
  headerText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },
  settingsBox: {
    backgroundColor: CARD,
    borderRadius: 24,
    marginHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 8,
    marginBottom: 24,
    marginTop: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 22,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    justifyContent: "space-between",
  },
  itemText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "400",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: CARD,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 22,
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabIcon: {
    alignItems: "center",
    flex: 1,
  },
  activeTabCircle: {
    alignItems: "center",
    flex: 1,
    // Add active tab highlight if needed
  },
});

export default Settings;
