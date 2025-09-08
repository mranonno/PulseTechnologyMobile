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
      <View style={styles.nameAndActionsContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {product.name}
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

      <View style={styles.priceContainer}>
        <View style={styles.priceInfoContainer}>
          <Text style={styles.price}>৳{product.price1}</Text>
          <Text numberOfLines={1} style={styles.vendor}>
            Vendor: {product.vendorName1}
          </Text>
        </View>
        <View style={styles.divider} />
        {product.price2 ? (
          <View style={styles.priceInfoContainer}>
            <Text style={styles.price}>৳{product.price2}</Text>
            <Text numberOfLines={1} style={styles.vendor}>
              Vendor: {product.vendorName2}
            </Text>
          </View>
        ) : (
          <Text style={styles.price}>-</Text>
        )}
        <View style={styles.divider} />

        {product.price3 ? (
          <View style={styles.priceInfoContainer}>
            <Text style={styles.price}>৳{product.price3}</Text>
            <Text numberOfLines={1} style={styles.vendor}>
              Vendor: {product.vendorName3}
            </Text>
          </View>
        ) : (
          <Text style={styles.price}>-</Text>
        )}
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
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      maxWidth: "80%",
    },
    priceContainer: {
      flexDirection: "column",
      marginVertical: 4,
    },
    price: { color: colors.primary, fontWeight: "600", width: "30%" },
    vendor: { color: colors.mutedText, width: "70%", paddingRight: 6 },
    actionsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconButton: {
      padding: 4,
    },
    nameAndActionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    priceInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
    },
    divider: {
      height: 1,
      width: "100%",
      backgroundColor: colors.border,
      marginVertical: 2,
    },
  });
