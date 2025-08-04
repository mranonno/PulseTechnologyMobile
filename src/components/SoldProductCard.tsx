import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useThemeContext } from "../theme/ThemeProvider";

type SoldProductCardProps = {
  title: string;
  price: number;
  imageUrl?: string;
  soldDate: string;
};

const SoldProductCard: React.FC<SoldProductCardProps> = ({
  title,
  price,
  imageUrl,
  soldDate,
}) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const placeholder = require("../../assets/placeholder.png");
  const imageSource = imageUrl ? { uri: imageUrl } : placeholder;

  const formattedDate = soldDate
    ? new Date(soldDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <Text style={styles.price}>৳ {price.toFixed(2)}</Text>

        <Text style={styles.meta} numberOfLines={1}>
          Sold on: <Text style={styles.metaValue}>{formattedDate}</Text>
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
      marginVertical: 6,
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
      alignItems: "center",
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 12,
      backgroundColor: "#ddd",
    },
    info: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
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
      marginBottom: 2,
    },
    metaValue: {
      color: colors.mutedText,
      fontWeight: "500",
    },
  });

export default SoldProductCard;
