// src/_layout/Main.tsx
import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { useThemeContext } from "../theme/ThemeProvider";
import AppNavigator from "../navigation/AppNavigator";

const Main = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      <AppNavigator />
    </SafeAreaView>
  );
};
export default Main;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
