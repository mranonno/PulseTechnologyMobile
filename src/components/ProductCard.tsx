import React, { memo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../theme/ThemeProvider";
import { Product } from "../types/types";
import { formatDate } from "../utils/commonFunction";

interface ProductCardProps {
  product: Product;
  onEdit: (event: GestureResponderEvent) => void;
  onDelete: (event: GestureResponderEvent) => void;
}

const ProductCard: React.FC<ProductCardProps> = memo(
  ({ product, onEdit, onDelete }) => {
    const { colors } = useThemeContext();
    const styles = getStyles(colors);
    const placeholder = require("../../assets/placeholder.png");

    return (
      <View style={styles.card}>
        {/* Image */}
        <Image
          source={product.image ? { uri: product.image } : placeholder}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Main Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {product.name}
          </Text>
          <Text
            style={styles.productModel}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Model:{" "}
            {product.productModel ? (
              <Text style={styles.productModelText}>
                {product.productModel}
              </Text>
            ) : (
              <Text style={styles.productModelText}>N/A</Text>
            )}
          </Text>

          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>
              Listed on:{" "}
              <Text style={styles.detailValueText}>
                {formatDate(product.createdAt)}
              </Text>
            </Text>
            <Text style={styles.detailText}>
              Stock:{" "}
              <Text style={styles.detailValueText}>
                {product.quantity !== undefined ? product.quantity : "N/A"}
              </Text>
            </Text>
          </View>

          <Text style={styles.priceText}>
            ৳{product.price !== undefined ? product.price.toFixed(2) : "0.00"}
          </Text>
        </View>

        {/* Action Icons */}
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
            onPress={onDelete}
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
  }
);

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 12,
      elevation: 3,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      marginBottom: 8,
      padding: 12,
      alignItems: "center",
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 12,
      backgroundColor: colors.imageBackground,
    },
    infoContainer: {
      flex: 1,
      justifyContent: "center",
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    productModel: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.text,
    },
    productModelText: {
      fontSize: 13,
      color: colors.mutedText,
    },

    detailsRow: {
      flexDirection: "row",
    },
    priceRow: {
      marginTop: 6,
    },
    detailText: {
      fontWeight: "600",
      marginRight: 12,
      color: colors.text,
      fontSize: 12,
    },
    detailValueText: {
      fontSize: 12,
      color: colors.mutedText,
    },
    priceText: {
      fontSize: 14,
      fontWeight: "800",
      color: colors.primary,
    },
    actionsContainer: {
      justifyContent: "space-between",
      height: 80,
    },
    iconButton: {
      padding: 4,
    },
  });

export default ProductCard;
