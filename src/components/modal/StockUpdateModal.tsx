import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useThemeContext } from "../../theme/ThemeProvider";
import { Colors } from "../../types/global";

interface StockUpdateModalProps {
  productName: string;
  onSubmit: (type: "in" | "out", quantity: number) => void;
}

const StockUpdateModal: React.FC<StockUpdateModalProps> = ({
  productName,
  onSubmit,
}) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  const [type, setType] = useState<"in" | "out">("in");
  const [quantity, setQuantity] = useState("");

  const handleConfirm = useCallback(() => {
    const qty = parseInt(quantity, 10);
    if (!isNaN(qty) && qty > 0) {
      onSubmit(type, qty);
      setQuantity("");
    }
  }, [type, quantity, onSubmit]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{productName}</Text>

      {/* Select Type */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.typeButton, type === "in" && styles.activeButton]}
          onPress={() => setType("in")}
        >
          <Text style={styles.typeText}>Stock In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === "out" && styles.activeButton]}
          onPress={() => setType("out")}
        >
          <Text style={styles.typeText}>Stock Out</Text>
        </TouchableOpacity>
      </View>

      {/* Quantity */}
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.placeholder}
        placeholder="Enter quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StockUpdateModal;

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 20,
      color: colors.text,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      gap: 10,
    },
    typeButton: {
      flex: 1,

      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    activeButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeText: {
      color: colors.pureWhite,
      fontSize: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 14,
      marginBottom: 20,
      color: colors.text,
    },
    confirmButton: {
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    confirmText: {
      color: colors.pureWhite,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
