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

interface ProductCardProps {
  image?: string;
  name: string;
  price: number;
  stock?: number;
  listingDate?: string; // ISO string
  onEdit: (event: GestureResponderEvent) => void;
  onDelete: (event: GestureResponderEvent) => void;
}

const placeholderImage = "https://via.placeholder.com/80?text=No+Image";

const ProductCard: React.FC<ProductCardProps> = memo(
  ({ image, name, price, stock, listingDate, onEdit, onDelete }) => {
    const { colors } = useThemeContext();
    const styles = getStyles(colors);
    const formattedDate = listingDate
      ? new Date(listingDate).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

    return (
      <View style={styles.card}>
        {/* Image */}
        <Image
          source={{ uri: image || placeholderImage }}
          style={styles.image}
          resizeMode="cover"
          defaultSource={{ uri: placeholderImage }}
        />

        {/* Main Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {name}
          </Text>

          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>Date: {formattedDate}</Text>
            <Text style={styles.detailText}>
              Stock: {stock !== undefined ? stock : "N/A"}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>Price: ${price.toFixed(2)}</Text>
          </View>
        </View>

        {/* Action Icons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={onEdit}
            style={styles.iconButton}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel={`Edit product ${name}`}
          >
            <Ionicons name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            style={styles.iconButton}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel={`Delete product ${name}`}
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
      marginVertical: 8,
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
      marginBottom: 6,
    },
    detailsRow: {
      flexDirection: "row",
      gap: 12,
    },
    priceRow: {
      marginTop: 6,
    },
    detailText: {
      fontSize: 12,
      color: colors.mutedText,
    },
    priceText: {
      fontSize: 14,
      fontWeight: "700",
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
