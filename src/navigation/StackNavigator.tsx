import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllProductsScreen from "../screens/AllProductsScreen";
import LoginScreen from "../screens/LoginScreen";
import BottomTabNavigator from "./BottomTabNavigator";

export type InnerStackParamList = {
  Login: undefined;
  MainApp: undefined;
  AllProducts: undefined;
};

const Stack = createNativeStackNavigator<InnerStackParamList>();

type Props = { isLoggedIn: boolean };

const StackNavigator: React.FC<Props> = ({ isLoggedIn }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
          <Stack.Screen
            name="AllProducts"
            component={AllProductsScreen}
            options={{ headerShown: true, title: "All Products" }}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
