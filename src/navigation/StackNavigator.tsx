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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type InnerStackParamList = {
  Login: undefined;
  MainApp: undefined;
  AllProducts: undefined;
  AddOrUpdateProduct: { product?: Product } | undefined;
  UpdateCheck: undefined;
  PriceList: { updatedProduct?: PriceListProduct } | undefined;
  PriceListProductOrUpdate: { product?: PriceListProduct } | undefined;
};

const Stack = createNativeStackNavigator<InnerStackParamList>();

type Props = { isLoggedIn: boolean };
type NavigationType = NativeStackNavigationProp<InnerStackParamList>;

const StackNavigator: React.FC<Props> = ({ isLoggedIn }) => {
  const { colors } = useThemeContext();

  // Reusable header function
  const renderHeader = (title: string, navigation: NavigationType) => (
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

  // Screens that require custom header
  const renderAddOrUpdateOptions = (
    route: any,
    navigation: NavigationType
  ) => ({
    headerShown: true,
    header: () =>
      renderHeader(
        route.params?.product ? "Update Product" : "Add Product",
        navigation
      ),
  });

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
            component={ProductAddOrUpdateScreen}
            options={({ route, navigation }) =>
              renderAddOrUpdateOptions(route, navigation)
            }
          />

          <Stack.Screen
            name="PriceListProductOrUpdate"
            component={PriceListProductAddOrUpdateScreen}
            options={({ route, navigation }) =>
              renderAddOrUpdateOptions(route, navigation)
            }
          />

          <Stack.Screen
            name="PriceList"
            component={PriceListScreen}
            options={({ navigation }) => ({
              headerShown: true,
              header: () =>
                renderHeader("Price List", navigation as NavigationType),
            })}
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
