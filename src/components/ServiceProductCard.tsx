import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useThemeContext } from "../theme/ThemeProvider";

type ServiceProductCardProps = {
  title: string;
  price: number;
  description?: string;
  imageUrl?: string;
  lastServiceDate?: string;
};

const ServiceProductCard: React.FC<ServiceProductCardProps> = ({
  title,
  price,
  description,
  imageUrl,
  lastServiceDate,
}) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  const placeholder = require("../../assets/placeholder.png");

  const formattedDate = lastServiceDate
    ? new Date(lastServiceDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <View style={styles.card}>
      <Image
        source={imageUrl ? { uri: imageUrl } : placeholder}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <Text style={styles.price}>৳ {price.toFixed(2)}</Text>

        <Text style={styles.meta} numberOfLines={1}>
          Last Service: <Text style={styles.metaValue}>{formattedDate}</Text>
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          Details:{" "}
          <Text style={styles.metaValue}>{description?.trim() || "N/A"}</Text>
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
      marginHorizontal: 12,
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
      backgroundColor: colors.pureWhite,
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
      marginBottom: 4,
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

export default ServiceProductCard;
