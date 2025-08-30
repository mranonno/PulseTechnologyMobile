import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useThemeContext } from "../theme/ThemeProvider";
import { PriceListProduct } from "../types/types";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../types/global";

interface Props {
  product: PriceListProduct;
  onDelete: () => void;
  onEdit: () => void;
}

const PriceListCard: React.FC<Props> = ({ product, onDelete, onEdit }) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{product.name}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>৳{product.price1}</Text>
        {product.price2 ? (
          <Text style={styles.price}>৳{product.price2}</Text>
        ) : (
          <Text style={styles.price}>-</Text>
        )}
        {product.price3 ? (
          <Text style={styles.price}>৳{product.price3}</Text>
        ) : (
          <Text style={styles.price}>-</Text>
        )}
      </View>
      <Text style={styles.vendor}>
        Vendor: <Text style={styles.vendorName}>{product.vendorName}</Text>
      </Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={onEdit}
          style={styles.iconButton}
          activeOpacity={0.6}
          accessibilityRole="button"
          accessibilityLabel={`Edit product ${product.name}`}
        >
          <Ionicons name="create-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.iconButton}
          activeOpacity={0.6}
          accessibilityRole="button"
          accessibilityLabel={`Delete product ${product.name}`}
        >
          <Ionicons name="trash-outline" size={24} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PriceListCard;

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      elevation: 3,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      marginBottom: 8,
      padding: 12,
    },
    name: { fontSize: 16, fontWeight: "600", color: colors.text },
    priceContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 4,
    },
    price: { color: colors.primary, fontWeight: "600", marginVertical: 2 },
    vendor: { color: colors.text, marginVertical: 2 },
    vendorName: { color: colors.mutedText },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 10,
    },
    iconButton: {
      padding: 4,
    },
  });
