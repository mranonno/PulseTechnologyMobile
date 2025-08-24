import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllProductsScreen from "../screens/AllProductsScreen";
import LoginScreen from "../screens/LoginScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import ProductAddOrUpdateScreen from "../screens/ProductAddOrUpdateScreen";
import { Product } from "../types/types";
import CustomHeader from "../components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../theme/ThemeProvider";
import UpdateCheckScreen from "../screens/UpdateCheckScreen";

export type InnerStackParamList = {
  Login: undefined;
  MainApp: undefined;
  AllProducts: undefined;
  AddOrUpdateProduct: { product?: Product } | undefined;
  UpdateCheck: undefined;
};

const Stack = createNativeStackNavigator<InnerStackParamList>();

type Props = { isLoggedIn: boolean };

const StackNavigator: React.FC<Props> = ({ isLoggedIn }) => {
  const { colors } = useThemeContext();

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
          <Stack.Screen
            name="AddOrUpdateProduct"
            options={({ route, navigation }) => ({
              headerShown: true,
              header: () => (
                <CustomHeader
                  title={
                    route.params?.product ? "Update Product" : "Add Product"
                  }
                  leftComponent={
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                  }
                  onPressLeft={() => navigation.goBack()}
                  shadow
                  borderBottom
                />
              ),
            })}
          >
            {({ route }) => (
              <ProductAddOrUpdateScreen product={route.params?.product} />
            )}
          </Stack.Screen>
          <Stack.Screen name="UpdateCheck" component={UpdateCheckScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
