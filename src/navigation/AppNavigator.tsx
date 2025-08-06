// src/navigation/AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import LoginScreen from "../screens/LoginScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import { useThemeContext } from "../theme/ThemeProvider";

// Replace this hook with your real auth logic (context, redux, etc)
const useAuth = () => {
  const isLoggedIn = true; // TODO: Replace with real auth state
  return { isLoggedIn };
};

export type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { colors } = useThemeContext();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      text: colors.text,
      primary: colors.primary,
      card: colors.card,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
