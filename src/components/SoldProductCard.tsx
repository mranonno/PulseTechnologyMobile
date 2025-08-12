import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  GestureResponderEvent,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../theme/ThemeProvider";
import { Product } from "../types/types";
import { formatDate } from "../utils/commonFunction";

// Helper function to calculate days ago string
function getDaysAgo(dateString: string | Date) {
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

type SoldProductCardProps = {
  product: Product;
  onEdit: (event: GestureResponderEvent) => void;
  onDelete: (event: GestureResponderEvent) => void;
};

const SoldProductCard: React.FC<SoldProductCardProps> = ({
  product,
  onDelete,
  onEdit,
}) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const createdAt = product.createdAt ?? new Date().toISOString();

  const placeholder = require("../../assets/placeholder.png");
  const [imgSource, setImgSource] = useState<ImageSourcePropType>(
    product.image ? { uri: product.image } : placeholder
  );

  const handleImageError = () => setImgSource(placeholder);

  return (
    <View style={styles.card}>
      <Image
        source={imgSource}
        style={styles.image}
        resizeMode="cover"
        onError={handleImageError}
        accessibilityLabel={`${product.name} image`}
      />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {product.name}
        </Text>

        <Text style={styles.price}>৳ {product.price.toFixed(2)}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Sold on:</Text>
          <Text style={styles.value}>
            {formatDate(createdAt)} ({getDaysAgo(createdAt)})
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onEdit}
          style={styles.actionButton}
          accessibilityLabel="Edit product"
        >
          <Ionicons name="create-outline" size={22} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          style={styles.actionButton}
          accessibilityLabel="Delete product"
        >
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 6,
      alignItems: "center",
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 12,
      backgroundColor: colors.imageBackground,
    },
    info: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 6,
    },
    row: {
      flexDirection: "row",
      marginBottom: 2,
      alignItems: "center",
    },
    label: {
      fontSize: 13,
      color: colors.text,
      fontWeight: "500",
      marginRight: 6,
    },
    value: {
      fontSize: 13,
      color: colors.mutedText,
    },
    price: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "700",
      marginTop: 4,
    },
    actions: {
      flexDirection: "row",
      marginLeft: 12,
    },
    actionButton: {
      marginHorizontal: 6,
      padding: 4,
    },
  });

export default SoldProductCard;
