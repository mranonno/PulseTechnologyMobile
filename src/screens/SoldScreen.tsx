import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useThemeContext } from "../theme/ThemeProvider";
import SoldProductCard from "../components/SoldProductCard";
import { Ionicons } from "@expo/vector-icons";

const SoldScreen = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const handleAddSoldItem = () => {
    // TODO: Add logic or navigation to create a new sold product
    console.log("Add new sold item");
  };

  return (
    <View style={styles.container}>
      {/* Example SoldProductCards */}
      <SoldProductCard title="Product A" price={200} soldDate="2025-08-01" />
      <SoldProductCard title="Product B" price={450} soldDate="2025-07-20" />

      {/* Floating Plus Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddSoldItem}>
        <Ionicons name="add" size={28} color={colors.pureWhite} />
      </TouchableOpacity>
    </View>
  );
};

export default SoldScreen;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    fab: {
      position: "absolute",
      bottom: 24,
      right: 24,
      backgroundColor: colors.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
  });
