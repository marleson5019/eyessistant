import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useCores } from '../components/TemaContext';

type TabRoute = "/inicio" | "/analise" | "/dados" | "/perfil" | "/config";
type NavbarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const navbarStyles = StyleSheet.create({
  navbarWrapper: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Platform.OS === "ios" ? 36 : 28,
    backgroundColor: "transparent",
  },
  navbar: {
    width: "92%",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#00A86B33",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerButton: {
    position: "absolute",
    bottom: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#00C47D",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00A86B55",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
});

const tabs: Array<{ key: string; icon: string; route: TabRoute }> = [
  { key: "home", icon: "home-outline", route: "/inicio" },
  { key: "scan", icon: "camera-outline", route: "/analise" },
  { key: "dados", icon: "bar-chart-outline", route: "/dados" },
  { key: "profile", icon: "person-outline", route: "/perfil" },
  { key: "settings", icon: "settings-outline", route: "/config" },
];

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const router = useRouter();
  const cores = useCores();
  const activeIndex = tabs.findIndex(tab => tab.key === activeTab);
  const tabsWithoutActive = tabs.filter(tab => tab.key !== activeTab);
  const iconCount = tabsWithoutActive.length;
  const gap = 24;
  const iconWidth = 40;
  const totalWidth = iconCount * iconWidth + (iconCount - 1) * gap + 70;
  return (
    <View style={navbarStyles.navbarWrapper}>
      <View style={[navbarStyles.navbar, { justifyContent: 'space-between', width: totalWidth, backgroundColor: cores.surface, shadowColor: cores.shadow }]}> 
        {tabsWithoutActive.slice(0, 2).map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={navbarStyles.navItem}
            onPress={() => {
              setActiveTab(tab.key);
              router.push(tab.route);
            }}
          >
            <Ionicons name={tab.icon as any} size={26} color={cores.textSecundario} />
          </TouchableOpacity>
        ))}
        <View style={{ width: 70 }} />
        {tabsWithoutActive.slice(2).map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={navbarStyles.navItem}
            onPress={() => {
              setActiveTab(tab.key);
              router.push(tab.route);
            }}
          >
            <Ionicons name={tab.icon as any} size={26} color={cores.textSecundario} />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[navbarStyles.centerButton, { backgroundColor: cores.primary, shadowColor: cores.shadow }]}
        onPress={() => {
          setActiveTab(tabs[activeIndex].key);
          router.push(tabs[activeIndex].route);
        }}
      >
        <Ionicons name={tabs[activeIndex].icon as any} size={28} color={cores.surface} />
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
