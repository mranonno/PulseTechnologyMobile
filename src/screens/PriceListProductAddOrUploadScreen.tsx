import React, { useState } from "react";
import {
  View,
  TextInput,
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

type NavigationProp = NativeStackNavigationProp<InnerStackParamList>;

export default function PriceListProductAddOrUpdateScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { product } = route.params as { product?: PriceListProduct };

  const [name, setName] = useState(product?.name || "");
  const [price1, setPrice1] = useState(product?.price1?.toString() || "");
  const [price2, setPrice2] = useState(product?.price2?.toString() || "");
  const [price3, setPrice3] = useState(product?.price3?.toString() || "");
  const [vendorName, setVendorName] = useState(product?.vendorName || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !vendorName.trim() || !price1.trim()) {
      Alert.alert("Error", "Name, Vendor, and Price1 are required");
      return;
    }

    const productData: PriceListProduct = {
      _id: product?._id,
      name: name.trim(),
      vendorName: vendorName.trim(),
      price1: parseFloat(price1) || 0,
      price2: price2 ? parseFloat(price2) : undefined,
      price3: price3 ? parseFloat(price3) : undefined,
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

      // Navigate back to PriceList and pass the updated product for real-time update
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
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Vendor Name"
        value={vendorName}
        onChangeText={setVendorName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price 1"
        value={price1}
        onChangeText={setPrice1}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Price 2"
        value={price2}
        onChangeText={setPrice2}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Price 3"
        value={price3}
        onChangeText={setPrice3}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{product ? "Update" : "Add"}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
