import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import AllProductsScreen from "../screens/AllProductsScreen";
import { useThemeContext } from "../theme/ThemeProvider";
import CustomHeader from "../components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";

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
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={() => ({
          headerShown: true,
          header: () => (
            <CustomHeader title="Pulse Technologies" shadow borderBottom />
          ),
        })}
      />
      <Stack.Screen
        name="AllProducts"
        component={AllProductsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <CustomHeader
              title="All Products"
              leftComponent={
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              }
              onPressLeft={() => navigation.goBack()}
              shadow
              borderBottom
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
