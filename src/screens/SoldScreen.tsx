import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import React, { useCallback, useRef } from "react";
import { useThemeContext } from "../theme/ThemeProvider";
import SoldProductCard from "../components/SoldProductCard";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AddSoldProductModal from "../components/modal/AddSoldProductModal";

const SoldScreen = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleAddSoldItem = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Example SoldProductCards */}
      <SoldProductCard title="Product A" price={200} soldDate="2025-08-01" />
      <SoldProductCard title="Product B" price={450} soldDate="2025-07-20" />

      {/* Floating Plus Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddSoldItem}>
        <Ionicons name="add" size={28} color={colors.pureWhite} />
      </TouchableOpacity>
      {/* Add Sold Product Modal */}
      <AddSoldProductModal ref={bottomSheetRef} />
    </SafeAreaView>
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
