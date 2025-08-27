import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PriceListProduct } from "../types/types";
import {
  addPriceListProduct,
  updatePriceListProduct,
} from "../services/priceListService";
import { InnerStackParamList } from "../navigation/StackNavigator";
import CustomInputField from "../components/ui/CustomInputField";
import { useThemeContext } from "../theme/ThemeProvider";
import { Colors } from "../types/global";

type NavigationProp = NativeStackNavigationProp<InnerStackParamList>;

const fields = [
  {
    key: "name",
    label: "Product Name",
    keyboardType: "default",
    required: true,
  },
  {
    key: "vendorName",
    label: "Vendor Name",
    keyboardType: "default",
  },
  { key: "price1", label: "Price 1", keyboardType: "numeric", required: true },
  { key: "price2", label: "Price 2", keyboardType: "numeric" },
  { key: "price3", label: "Price 3", keyboardType: "numeric" },
];

export default function PriceListProductAddOrUpdateScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { product } = route.params as { product?: PriceListProduct };

  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  // single form state object
  const [form, setForm] = useState({
    name: product?.name || "",
    vendorName: product?.vendorName || "",
    price1: product?.price1?.toString() || "",
    price2: product?.price2?.toString() || "",
    price3: product?.price3?.toString() || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.vendorName.trim() || !form.price1.trim()) {
      Alert.alert("Error", "Name, Vendor, and Price1 are required");
      return;
    }

    const productData: PriceListProduct = {
      _id: product?._id,
      name: form.name.trim(),
      vendorName: form.vendorName.trim(),
      price1: parseFloat(form.price1) || 0,
      price2: form.price2 ? parseFloat(form.price2) : undefined,
      price3: form.price3 ? parseFloat(form.price3) : undefined,
    };

    try {
      setLoading(true);
      let response: PriceListProduct;

      if (product?._id) {
        response = await updatePriceListProduct(productData);
        Alert.alert("Updated", "Product updated successfully");
      } else {
        response = await addPriceListProduct(productData);
        Alert.alert("Added", "Product added successfully");
      }

      // Navigate back to PriceList and pass updated product
      navigation.navigate("PriceList", { updatedProduct: response });
    } catch (error) {
      console.error("Error saving product", error);
      Alert.alert("Error", "Could not save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {fields.map((f) => (
        <CustomInputField
          key={f.key}
          required={f.required}
          label={f.label}
          placeholder={`Enter ${f.label}`}
          value={form[f.key as keyof typeof form]}
          onChangeText={(text) => handleChange(f.key, text)}
          keyboardType={f.keyboardType as any}
        />
      ))}

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.buttonText}>
            {product ? "Update" : "Add"} Product
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: {
      color: colors.pureWhite,
      fontWeight: "bold",
      fontSize: 16,
    },
  });
