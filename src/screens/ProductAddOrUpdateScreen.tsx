import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import CustomInputField from "../components/ui/CustomInputField";
import { useThemeContext } from "../theme/ThemeProvider";
import { Product } from "../types/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { addProduct, updateProduct } from "../services/productService";

export type ProductImage =
  | { uri: string; name?: string; type?: string }
  | string
  | null;

interface Props {
  product?: Product;
}

const fields = [
  {
    key: "name",
    label: "Product Name",
    keyboardType: "default",
    required: true,
  },
  { key: "brand", label: "Product Brand", keyboardType: "default" },
  { key: "model", label: "Product Model", keyboardType: "default" },
  { key: "origin", label: "Product Origin", keyboardType: "default" },
  {
    key: "price",
    label: "Product Price",
    keyboardType: "decimal-pad",
    required: true,
  },
  {
    key: "quantity",
    label: "Product Quantity",
    keyboardType: "number-pad",
    required: true,
  },
  {
    key: "description",
    label: "Description",
    keyboardType: "default",
    multiline: true,
    numberOfLines: 4,
  },
];

const ProductAddOrUpdateScreen: React.FC<Props> = ({ product }) => {
  const { colors } = useThemeContext();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    model: "",
    origin: "",
    price: "",
    quantity: "",
    description: "",
  });
  const [image, setImage] = useState<ProductImage>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        brand: product.productBrand || "",
        model: product.productModel || "",
        origin: product.productOrigin || "",
        price: product.price?.toString() || "",
        quantity: product.quantity?.toString() || "",
        description: product.description || "",
      });
      setImage(product.image ?? null);
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = useCallback(() => {
    setForm({
      name: "",
      brand: "",
      model: "",
      origin: "",
      price: "",
      quantity: "",
      description: "",
    });
    setImage(null);
  }, []);

  const handleChange = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const pickImage = useCallback(async (source: "gallery" | "camera") => {
    try {
      const permissionFn =
        source === "gallery"
          ? ImagePicker.requestMediaLibraryPermissionsAsync
          : ImagePicker.requestCameraPermissionsAsync;
      const { status } = await permissionFn();
      if (status !== "granted")
        return Alert.alert(
          "Permission Required",
          `Please allow ${source} access.`
        );

      const result = await (source === "gallery"
        ? ImagePicker.launchImageLibraryAsync
        : ImagePicker.launchCameraAsync)({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const { uri } = result.assets[0];
        const filename = uri.split("/").pop() || "photo.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = `image/${match ? match[1].toLowerCase() : "jpeg"}`;
        setImage({ uri, name: filename, type });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to pick image.");
    }
  }, []);

  const handleSubmit = async () => {
    if (loading) return;

    if (!form.name.trim())
      return Alert.alert("Validation", "Please enter a product name.");

    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0)
      return Alert.alert("Validation", "Please enter a valid price.");

    const quantityNum = parseInt(form.quantity, 10);
    if (isNaN(quantityNum) || quantityNum < 0)
      return Alert.alert("Validation", "Please enter a valid quantity.");

    const normalizedImage = !image
      ? undefined
      : typeof image === "string"
      ? { uri: image }
      : image;

    const productData: Product = {
      _id: product?._id ?? undefined,
      name: form.name.trim(),
      productBrand: form.model.trim(),
      productModel: form.model.trim(),
      productOrigin: form.origin.trim(),
      price: priceNum,
      quantity: quantityNum,
      description: form.description.trim(),
      image: normalizedImage,
    };

    try {
      setLoading(true);
      if (product?._id) {
        await updateProduct(productData);
        Alert.alert("Success", "Product updated successfully!");
      } else {
        await addProduct(productData);
        Alert.alert("Success", "Product added successfully!");
      }
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
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
      }}
      enableOnAndroid
      extraScrollHeight={120}
      keyboardShouldPersistTaps="handled"
    >
      {fields.map((f) => (
        <CustomInputField
          required={f.required}
          key={f.key}
          label={f.label}
          placeholder={`Enter ${f.label}`}
          value={form[f.key as keyof typeof form]}
          onChangeText={(text) => handleChange(f.key, text)}
          keyboardType={f.keyboardType as any}
          multiline={f.multiline}
          numberOfLines={f.numberOfLines}
          style={f.multiline ? { height: 80, textAlignVertical: "top" } : {}}
        />
      ))}

      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Text style={styles.imageLabel}>Select Image</Text>
        <View style={styles.imageButtons}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => pickImage("gallery")}
          >
            <MaterialIcons
              name="add-photo-alternate"
              size={34}
              color={colors.placeholder}
              style={{ transform: [{ scaleX: -1 }] }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => pickImage("camera")}
          >
            <MaterialIcons
              name="add-a-photo"
              size={30}
              color={colors.placeholder}
            />
          </TouchableOpacity>

          {image ? (
            <TouchableOpacity
              style={styles.imagePreviewContainer}
              onPress={() => setImage(null)}
            >
              <Image
                source={{ uri: typeof image === "string" ? image : image.uri }}
                style={styles.imagePreview}
              />
              <View style={styles.removeOverlay}>
                <MaterialIcons
                  name="close"
                  size={16}
                  color={colors.pureWhite}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.dashedPlaceholder}>
              <MaterialIcons
                name="image"
                size={32}
                color={colors.placeholder}
              />
            </View>
          )}
        </View>
      </View>

      {/* Buttons */}
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
          onPress={handleSubmit}
          style={styles.submitButton}
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

export default ProductAddOrUpdateScreen;

const getStyles = (colors: any) =>
  StyleSheet.create({
    imageContainer: { marginBottom: 16 },
    imageButton: {
      justifyContent: "center",
      alignItems: "center",
      height: 60,
      width: 60,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.placeholder,
      backgroundColor: colors.card,
    },
    imageButtons: { flexDirection: "row", gap: 10 },
    imageLabel: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
    },
    dashedPlaceholder: {
      width: 60,
      height: 60,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.placeholder,
      borderStyle: "dashed",
      justifyContent: "center",
      alignItems: "center",
    },
    imagePreview: { width: 60, height: 60, borderRadius: 8 },
    imagePreviewContainer: {
      position: "relative",
      width: 60,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
    },
    removeOverlay: {
      position: "absolute",
      top: -8,
      right: -8,
      backgroundColor: "#b90000",
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
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
      borderColor: colors.primary,
      borderWidth: 1,
      flex: 1,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: { fontSize: 16, fontWeight: "600", color: colors.pureWhite },
  });
