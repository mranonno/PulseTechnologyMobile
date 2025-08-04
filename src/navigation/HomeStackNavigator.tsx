// navigation/HomeStackNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import AllProductsScreen from "../screens/AllProductsScreen";
import { useThemeContext } from "../theme/ThemeProvider";

export type HomeStackParamList = {
  HomeMain: undefined;
  AllProducts: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  const { colors } = useThemeContext();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.tabBackground,
          elevation: 0, // remove shadow for Android
          shadowOpacity: 0, // remove shadow for iOS
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.text,
        },
        headerTintColor: colors.primary, // Back button & icons
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerTitle: "Pulse Technology" }}
      />
      <Stack.Screen
        name="AllProducts"
        component={AllProductsScreen}
        options={{ title: "All Products" }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
