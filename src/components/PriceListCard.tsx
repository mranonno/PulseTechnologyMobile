import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeContext } from "../theme/ThemeProvider";
import { PriceListProduct } from "../types/types";

interface PriceListCardProps {
  product: PriceListProduct;
}

const PriceListCard: React.FC<PriceListCardProps> = ({ product }) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  return (
    <View style={styles.card}>
      {/* Product Name */}
      <Text style={styles.productName}>{product.name}</Text>

      {/* Price Values */}
      <View style={styles.priceRow}>
        <Text style={styles.priceValue}>
          {product.price1 !== undefined
            ? `৳${product.price1.toLocaleString()}`
            : "-"}
        </Text>
        <Text style={styles.priceValue}>
          {product.price2 !== undefined
            ? `৳${product.price2.toLocaleString()}`
            : "-"}
        </Text>
        <Text style={styles.priceValue}>
          {product.price3 !== undefined
            ? `৳${product.price3.toLocaleString()}`
            : "-"}
        </Text>
      </View>

      {/* Vendor */}
      <Text style={styles.vendorText}>Vendor: {product.vendorName}</Text>
    </View>
  );
};

export default PriceListCard;

const getStyles = (colors: any) =>
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
    productName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    priceLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    priceLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.mutedText,
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    priceValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    vendorText: {
      marginTop: 8,
      fontSize: 13,
      fontStyle: "italic",
      color: colors.mutedText,
    },
  });
