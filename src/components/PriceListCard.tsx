import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useThemeContext } from "../theme/ThemeProvider";
import { PriceListProduct } from "../types/types";
import { useNavigation } from "@react-navigation/native";
import { InnerStackParamList } from "../navigation/StackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface PriceListCardProps {
  product: PriceListProduct;
}

const PriceListCard: React.FC<PriceListCardProps> = ({ product }) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  const navigation =
    useNavigation<NativeStackNavigationProp<InnerStackParamList>>();

  const handleEdit = () =>
    navigation.navigate("PriceListProductOrUpdate", { product });
  const handleDelete = () =>
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => console.log("Delete", product.id),
      },
    ]);

  return (
    <View style={styles.card}>
      <Text style={styles.productName}>{product.name}</Text>
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
      <Text style={styles.vendorText}>Vendor: {product.vendorName}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={handleEdit}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.danger }]}
          onPress={handleDelete}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
    priceRow: { flexDirection: "row", justifyContent: "space-between" },
    priceValue: { fontSize: 16, fontWeight: "600", color: colors.primary },
    vendorText: {
      marginTop: 8,
      fontSize: 13,
      fontStyle: "italic",
      color: colors.mutedText,
    },
    buttonRow: { flexDirection: "row", marginTop: 8, gap: 8 },
    actionButton: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: "center",
    },
    actionText: { color: colors.pureWhite, fontWeight: "600" },
  });
