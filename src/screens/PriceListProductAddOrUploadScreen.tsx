import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useThemeContext } from "../theme/ThemeProvider";
import CustomInputField from "../components/ui/CustomInputField";
import { PriceListProduct } from "../types/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  addPriceListProduct,
  updatePriceListProduct,
} from "../services/productService";

interface Props {
  product?: PriceListProduct;
}

const PriceListProductAddOrUpdateScreen: React.FC<Props> = ({ product }) => {
  const { colors } = useThemeContext();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: "",
    price1: "",
    price2: "",
    price3: "",
    vendor: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price1: product.price1?.toString() || "",
        price2: product.price2?.toString() || "",
        price3: product.price3?.toString() || "",
        vendor: product.vendorName || "",
      });
    } else resetForm();
  }, [product]);

  const resetForm = useCallback(
    () => setForm({ name: "", price1: "", price2: "", price3: "", vendor: "" }),
    []
  );

  const handleChange = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim())
      return Alert.alert("Validation", "Please enter product name.");
    const productData: PriceListProduct = {
      id: product?.id ?? Math.random().toString(),
      name: form.name.trim(),
      price1: parseFloat(form.price1) || 0,
      price2: parseFloat(form.price2) || 0,
      price3: parseFloat(form.price3) || 0,
      vendorName: form.vendor.trim() || "Unknown Vendor",
    };

    try {
      setLoading(true);
      if (product?.id) await updatePriceListProduct(productData);
      else await addPriceListProduct(productData);

      Alert.alert(
        "Success",
        `Product ${product?.id ? "updated" : "added"} successfully!`
      );
      resetForm();
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 20 }}
      enableOnAndroid
      extraScrollHeight={120}
      keyboardShouldPersistTaps="handled"
    >
      <CustomInputField
        label="Name"
        placeholder="Enter Name"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <CustomInputField
        label="Price 1"
        placeholder="Enter Price 1"
        keyboardType="decimal-pad"
        value={form.price1}
        onChangeText={(text) => handleChange("price1", text)}
      />
      <CustomInputField
        label="Price 2"
        placeholder="Enter Price 2"
        keyboardType="decimal-pad"
        value={form.price2}
        onChangeText={(text) => handleChange("price2", text)}
      />
      <CustomInputField
        label="Price 3"
        placeholder="Enter Price 3"
        keyboardType="decimal-pad"
        value={form.price3}
        onChangeText={(text) => handleChange("price3", text)}
      />
      <CustomInputField
        label="Vendor"
        placeholder="Enter Vendor Name"
        value={form.vendor}
        onChangeText={(text) => handleChange("vendor", text)}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.pureWhite} />
          ) : (
            <Text style={styles.buttonText}>
              {product ? "Update" : "Add"} Product
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default PriceListProductAddOrUpdateScreen;

const getStyles = (colors: any) =>
  StyleSheet.create({
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      gap: 12,
    },
    submitButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
      backgroundColor: colors.primary,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.pureWhite,
      textAlign: "center",
    },
  });
