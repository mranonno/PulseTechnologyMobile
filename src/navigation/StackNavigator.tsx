import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import BottomTabNavigator from "./BottomTabNavigator";
import AllProductsScreen from "../screens/AllProductsScreen";
import LoginScreen from "../screens/LoginScreen";
import ProductAddOrUpdateScreen from "../screens/ProductAddOrUpdateScreen";
import PriceListScreen from "../screens/PriceListScreen";
import UpdateCheckScreen from "../screens/UpdateCheckScreen";
import CustomHeader from "../components/CustomHeader";
import { useThemeContext } from "../theme/ThemeProvider";
import { Product, PriceListProduct } from "../types/types";
import PriceListProductAddOrUpdateScreen from "../screens/PriceListProductAddOrUploadScreen";

export type InnerStackParamList = {
  Login: undefined;
  MainApp: undefined;
  AllProducts: undefined;
  AddOrUpdateProduct: { product?: Product } | undefined;
  UpdateCheck: undefined;
  PriceList: { updatedProduct?: PriceListProduct } | undefined; // ✅ updated for real-time
  PriceListProductOrUpdate: { product?: PriceListProduct } | undefined;
};

const Stack = createNativeStackNavigator<InnerStackParamList>();

type Props = { isLoggedIn: boolean };

const StackNavigator: React.FC<Props> = ({ isLoggedIn }) => {
  const { colors } = useThemeContext();

  const renderHeader = (title: string, navigation: any) => (
    <CustomHeader
      title={title}
      leftComponent={
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      }
      onPressLeft={() => navigation.goBack()}
      shadow
      borderBottom
    />
  );

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
              header: () =>
                renderHeader(
                  route.params?.product ? "Update Product" : "Add Product",
                  navigation
                ),
            })}
          >
            {({ route }) => (
              <ProductAddOrUpdateScreen product={route.params?.product} />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="PriceListProductOrUpdate"
            component={PriceListProductAddOrUpdateScreen}
            options={({ route, navigation }) => ({
              headerShown: true,
              header: () =>
                renderHeader(
                  route.params?.product ? "Update Product" : "Add Product",
                  navigation
                ),
            })}
          />

          <Stack.Screen
            name="PriceList"
            component={PriceListScreen}
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="Price List" shadow borderBottom />
              ),
            }}
          />

          <Stack.Screen name="UpdateCheck" component={UpdateCheckScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
