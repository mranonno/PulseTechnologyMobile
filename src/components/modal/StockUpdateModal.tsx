import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useThemeContext } from "../../theme/ThemeProvider";
import { Colors } from "../../types/global";
import { useAuth } from "../../context/AuthContext";
import { User } from "../../types/types";

interface StockUpdateModalProps {
  productName: string;
  onSubmit: (type: "in" | "out", quantity: number) => void | Promise<void>;
  loading: boolean;
}

const StockUpdateModal: React.FC<StockUpdateModalProps> = ({
  productName,
  onSubmit,
  loading,
}) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  const { user } = useAuth();
  console.log(user);

  const [type, setType] = useState<"in" | "out">("out");
  const [quantity, setQuantity] = useState("");

  const handleConfirm = useCallback(async () => {
    const qty = Number(quantity);
    if (qty <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid quantity.");
      return;
    }

    try {
      await onSubmit(type, qty);
      setQuantity("");
    } catch (err) {
      Alert.alert("Error", "Failed to update stock. Please try again.");
    }
  }, [type, quantity, onSubmit]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{productName}</Text>

      {/* Stock Type Selector */}
      <View style={styles.row}>
        {(["out", "in"] as const).map((item) => (
          <TouchableOpacity
            disabled={user?.role !== "admin"}
            key={item}
            style={[
              styles.typeButton,
              { opacity: user?.role !== "admin" ? 0.5 : 1 },
              type === item && styles.activeButton,
            ]}
            onPress={() => setType(item)}
          >
            <Text style={[styles.typeText, type === item && styles.activeText]}>
              {item === "out" ? "Stock Out" : "Stock In"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quantity Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        placeholderTextColor={colors.placeholder}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirm}
        disabled={loading}
      >
        <Text style={styles.confirmText}>
          {loading ? "Confirming..." : "Confirm"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StockUpdateModal;

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: { flex: 1 },
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
    typeText: { fontSize: 16, color: colors.text },
    activeText: { color: colors.pureWhite, fontWeight: "600" },
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
    confirmText: { fontSize: 16, fontWeight: "bold", color: colors.pureWhite },
  });
