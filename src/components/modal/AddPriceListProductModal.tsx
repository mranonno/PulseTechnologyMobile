import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useThemeContext } from "../../theme/ThemeProvider";
import { PriceListProduct } from "../../types/types";

export interface AddPriceListProductModalProps {
  onAddProduct: (product: PriceListProduct) => void;
}

export interface AddPriceListProductModalRef {
  open: () => void;
  close: () => void;
}

const AddPriceListProductModal = forwardRef<
  AddPriceListProductModalRef,
  AddPriceListProductModalProps
>(({ onAddProduct }, ref) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [name, setName] = useState("");
  const [price1, setPrice1] = useState("");
  const [price2, setPrice2] = useState("");
  const [price3, setPrice3] = useState("");
  const [vendorName, setVendorName] = useState("");

  // Expose open/close
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetModalRef.current?.present(),
    close: () => bottomSheetModalRef.current?.dismiss(),
  }));

  const handleAddProduct = () => {
    if (!name.trim())
      return Alert.alert("Validation", "Product name is required.");

    const newProduct: PriceListProduct = {
      id: Math.random().toString(),
      name: name.trim(),
      price1: price1 ? parseFloat(price1) : undefined,
      price2: price2 ? parseFloat(price2) : undefined,
      price3: price3 ? parseFloat(price3) : undefined,
      vendorName: vendorName || "Unknown Vendor",
    };

    onAddProduct(newProduct);

    // Reset fields
    setName("");
    setPrice1("");
    setPrice2("");
    setPrice3("");
    setVendorName("");
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={["50%", "80%"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>Add New Product</Text>
        <TextInput
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Price 1"
          value={price1}
          onChangeText={setPrice1}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Price 2"
          value={price2}
          onChangeText={setPrice2}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Price 3"
          value={price3}
          onChangeText={setPrice3}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Vendor Name"
          value={vendorName}
          onChangeText={setVendorName}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
          <Text style={styles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
});

export default AddPriceListProductModal;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: colors.background },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.mutedText,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      color: colors.text,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  });
