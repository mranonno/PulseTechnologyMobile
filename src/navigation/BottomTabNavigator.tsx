import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/HomeScreen";
import ServiceScreen from "../screens/ServiceScreen";
import SoldScreen from "../screens/SoldScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useThemeContext } from "../theme/ThemeProvider";

const Tab = createBottomTabNavigator();
const { height: screenHeight } = Dimensions.get("window");
const TAB_BAR_HEIGHT = screenHeight < 700 ? 55 : 65;

const IoniconsMap = {
  Home: "home",
  Service: "construct",
  Sold: "pricetag",
  Settings: "settings",
} as const;

export default function BottomTabNavigator() {
  const { colors } = useThemeContext();
  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const iconName = (IoniconsMap[route.name as keyof typeof IoniconsMap] ??
          "ellipse") as keyof typeof Ionicons.glyphMap;

        return {
          headerShown: true,
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: "600",
          },
          headerStyle: {
            backgroundColor: colors.tabBackground,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: colors.primary,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: TAB_BAR_HEIGHT + bottom,
            paddingBottom: Platform.OS === "android" ? bottom : bottom || 20,
            paddingTop: 8,
            backgroundColor: colors.tabBackground,
            borderTopWidth: 0,
            elevation: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: "Pulse Technology" }}
      />
      <Tab.Screen
        name="Sold"
        component={SoldScreen}
        options={{ headerTitle: "Sold Products" }}
      />
      <Tab.Screen name="Service" component={ServiceScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
