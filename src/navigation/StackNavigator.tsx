// navigation/StackNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllProductsScreen from "../screens/AllProductsScreen";

export type InnerStackParamList = {
  AllProducts: undefined;
};

const Stack = createNativeStackNavigator<InnerStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllProducts"
        component={AllProductsScreen}
        options={{ title: "All Products" }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
