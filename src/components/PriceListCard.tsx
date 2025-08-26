import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeContext } from "../theme/ThemeProvider";
import { PriceListProduct } from "../types/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { InnerStackParamList } from "../navigation/StackNavigator";

interface Props {
  product: PriceListProduct;
  onDelete: () => void;
  onEdit: () => void;
}

const PriceListCard: React.FC<Props> = ({ product, onDelete, onEdit }) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  const navigation =
    useNavigation<NativeStackNavigationProp<InnerStackParamList>>();

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>Price1: {product.price1}</Text>
      {product.price2 ? <Text>Price2: {product.price2}</Text> : null}
      {product.price3 ? <Text>Price3: {product.price3}</Text> : null}
      <Text style={styles.vendor}>Vendor: {product.vendorName}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
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
      padding: 12,
      marginBottom: 10,
      borderRadius: 10,
    },
    name: { fontSize: 16, fontWeight: "600", color: colors.text },
    price: { color: colors.text, marginVertical: 2 },
    vendor: { color: colors.mutedText, marginVertical: 2 },
    actions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 10,
      gap: 10,
    },
    editBtn: { padding: 6, backgroundColor: colors.primary, borderRadius: 6 },
    deleteBtn: { padding: 6, backgroundColor: "red", borderRadius: 6 },
    actionText: { color: "white", fontWeight: "600" },
  });
