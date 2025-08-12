import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  GestureResponderEvent,
} from "react-native";
import { useThemeContext } from "../theme/ThemeProvider";
import { Product } from "../types/types";
import { formatDate } from "../utils/commonFunction";

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

        <Text style={styles.meta} numberOfLines={1}>
          Sold on:{" "}
          <Text style={styles.metaValue}>{formatDate(product.createdAt)}</Text>
        </Text>
      </View>
    </View>
  );
};

const getStyles = (colors: Colors) =>
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
      marginBottom: 4,
    },
    price: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "600",
      marginBottom: 2,
    },
    meta: {
      fontSize: 13,
      color: colors.text,
    },
    metaValue: {
      color: colors.mutedText,
      fontWeight: "500",
    },
  });

export default SoldProductCard;
