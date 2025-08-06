import React, { useCallback, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  View,
  Text,
} from "react-native";
import { useThemeContext } from "../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import SoldProductCard from "../components/SoldProductCard";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AddSoldProductModal from "../components/modal/AddSoldProductModal";

type SoldProduct = {
  id: string;
  title: string;
  price: number;
  soldDate: string;
};

const soldProducts: SoldProduct[] = [
  // Uncomment below to test with real data
  { id: "1", title: "Product A", price: 200, soldDate: "2025-08-01" },
  { id: "2", title: "Product B", price: 450, soldDate: "2025-07-20" },
  { id: "3", title: "Product C", price: 330, soldDate: "2025-06-15" },
];

const SoldScreen = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleAddSoldItem = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const renderItem: ListRenderItem<SoldProduct> = ({ item }) => (
    <SoldProductCard
      title={item.title}
      price={item.price}
      soldDate={item.soldDate}
    />
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={64} color={colors.mutedText} />
      <Text style={styles.emptyText}>No sold items available</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={soldProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          soldProducts.length === 0 ? styles.emptyWrapper : styles.listContent
        }
        ListEmptyComponent={EmptyListComponent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Plus Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.fab}
        onPress={handleAddSoldItem}
      >
        <Ionicons name="add" size={28} color={colors.pureWhite} />
      </TouchableOpacity>

      {/* Add Sold Product Modal */}
      <AddSoldProductModal ref={bottomSheetRef} />
    </SafeAreaView>
  );
};

export default SoldScreen;
const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      padding: 16,
      paddingBottom: 80,
    },
    emptyWrapper: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    emptyContainer: {
      alignItems: "center",
    },
    emptyText: {
      fontSize: 16,
      marginTop: 12,
      color: colors.mutedText,
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
