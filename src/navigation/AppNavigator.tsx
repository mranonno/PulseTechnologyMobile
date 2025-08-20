import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";

import { useThemeContext } from "../theme/ThemeProvider";
import { useAuth } from "../context/AuthContext";
import NavigationService from "./NavigationService";

const AppNavigator: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { colors } = useThemeContext();

  if (isLoggedIn === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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
    <NavigationContainer theme={MyTheme} ref={NavigationService.setNavigator}>
      <StackNavigator isLoggedIn={true} />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default AppNavigator;
