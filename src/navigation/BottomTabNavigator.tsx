import React, { useCallback } from "react";
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";

import { useThemeContext } from "../theme/ThemeProvider";
import HomeStackNavigator from "./HomeStackNavigator";
import SoldScreen from "../screens/SoldProduct/SoldScreen";
import ServiceScreen from "../screens/ServiceProduct/ServiceScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import CustomHeader from "../components/CustomHeader";

export type BottomTabParamList = {
  Home: undefined;
  Sold: undefined;
  Service: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
const { height: screenHeight } = Dimensions.get("window");
const TAB_BAR_HEIGHT = screenHeight < 700 ? 55 : 65;

const ICONS: Record<keyof BottomTabParamList, keyof typeof Ionicons.glyphMap> =
  {
    Home: "home",
    Sold: "pricetag",
    Service: "construct",
    Settings: "settings",
  };

const TAB_SCREENS: {
  name: keyof BottomTabParamList;
  component: React.ComponentType<any>;
  title?: string;
}[] = [
  { name: "Home", component: HomeStackNavigator },
  { name: "Sold", component: SoldScreen, title: "Sold Products" },
  { name: "Service", component: ServiceScreen },
  { name: "Settings", component: SettingsScreen },
];

export default function BottomTabNavigator() {
  const { colors } = useThemeContext();
  const { bottom } = useSafeAreaInsets();

  const screenOptions = useCallback(
    ({
      route,
    }: {
      route: RouteProp<BottomTabParamList, keyof BottomTabParamList>;
    }): BottomTabNavigationOptions => {
      const iconName = ICONS[route.name];

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
          paddingBottom: Platform.OS === "android" ? bottom : bottom + 8,
          paddingTop: 8,
          backgroundColor: colors.tabBackground,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      };
    },
    [bottom, colors]
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {TAB_SCREENS.map(({ name, component, title }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            headerShown: name !== "Home",
            ...(name !== "Home" && {
              header: () => (
                <CustomHeader title={title ?? name} shadow borderBottom />
              ),
            }),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
