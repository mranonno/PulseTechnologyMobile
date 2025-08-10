import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useThemeContext } from "../../theme/ThemeProvider";

interface Product {
  id?: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
}

interface Props {
  product?: Product;
  onSubmit: (product: Product) => void;
  onDismiss: () => void;
}

const SNAP_POINTS = ["55%"];

const ProductAddOrUpdateModal = forwardRef<BottomSheetModal, Props>(
  ({ product, onSubmit, onDismiss }, ref) => {
    const { colors } = useThemeContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => SNAP_POINTS, []);

    useImperativeHandle(ref, () => bottomSheetModalRef.current!);

    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null);

    const resetForm = useCallback(() => {
      setProductName("");
      setPrice("");
      setStock("");
      setImageUri(null);
    }, []);

    useEffect(() => {
      if (product) {
        setProductName(product.name);
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setImageUri(product.image ?? null);
      } else {
        resetForm();
      }
    }, [product, resetForm]);

    const handleDismiss = useCallback(() => {
      onDismiss();
      resetForm();
    }, [onDismiss, resetForm]);

    const pickImage = useCallback(async (source: "gallery" | "camera") => {
      try {
        const permissionFn =
          source === "gallery"
            ? ImagePicker.requestMediaLibraryPermissionsAsync
            : ImagePicker.requestCameraPermissionsAsync;

        const { status } = await permissionFn();
        if (status !== "granted") {
          Alert.alert("Permission Required", `Please allow ${source} access.`);
          return;
        }

        const picker =
          source === "gallery"
            ? ImagePicker.launchImageLibraryAsync
            : ImagePicker.launchCameraAsync;

        const result = await picker({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsEditing: true,
          aspect: [4, 3],
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
          setImageUri(result.assets[0].uri);
        }
      } catch (error) {
        console.error("Error picking image:", error);
        Alert.alert("Error", "Failed to pick image. Please try again.");
      }
    }, []);

    const handleSubmit = useCallback(() => {
      if (!productName.trim()) {
        return Alert.alert("Validation", "Please enter a product name.");
      }

      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0) {
        return Alert.alert(
          "Validation",
          "Please enter a valid positive price."
        );
      }

      const stockNum = parseInt(stock, 10);
      if (isNaN(stockNum) || stockNum < 0) {
        return Alert.alert(
          "Validation",
          "Please enter a valid non-negative stock."
        );
      }

      onSubmit({
        id: product?.id,
        name: productName.trim(),
        price: priceNum,
        stock: stockNum,
        image: imageUri ?? undefined,
      });

      bottomSheetModalRef.current?.dismiss();
    }, [productName, price, stock, imageUri, onSubmit, product?.id]);

    const backdropComponent = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      ),
      []
    );

    const backgroundStyle = useMemo(
      () => ({ backgroundColor: colors.card, borderRadius: 24 }),
      [colors.card]
    );

    const handleIndicatorStyle = useMemo(
      () => ({ backgroundColor: colors.primary, width: 50 }),
      [colors.primary]
    );

    const keyboardAvoidingViewStyle = useMemo(() => ({ flex: 1 }), []);

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={handleDismiss}
        enableDynamicSizing={false}
        keyboardBlurBehavior="restore"
        handleIndicatorStyle={handleIndicatorStyle}
        backgroundStyle={backgroundStyle}
        backdropComponent={backdropComponent}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={keyboardAvoidingViewStyle}
        >
          <BottomSheetScrollView
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            contentContainerStyle={styles.container}
          >
            <Text style={styles.title}>
              {product ? "Update Product" : "Add Product"}
            </Text>
            <TextInput
              placeholder="Name"
              value={productName}
              onChangeText={setProductName}
              placeholderTextColor={colors.placeholder}
              style={styles.input}
            />
            <TextInput
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              placeholderTextColor={colors.placeholder}
              keyboardType="decimal-pad"
              style={styles.input}
            />
            <TextInput
              placeholder="Stock"
              value={stock}
              onChangeText={setStock}
              placeholderTextColor={colors.placeholder}
              keyboardType="number-pad"
              style={styles.input}
            />
            <View style={styles.imageContainer}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : (
                <Text style={styles.noImageText}>No image selected</Text>
              )}
              <View style={styles.imageButtons}>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={() => pickImage("gallery")}
                  activeOpacity={0.6}
                >
                  <FontAwesome
                    name="image"
                    size={28}
                    color={colors.placeholder}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.imageButton}
                  onPress={() => pickImage("camera")}
                >
                  <FontAwesome
                    name="camera"
                    size={28}
                    color={colors.placeholder}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSubmit}
              style={styles.submitButton}
              accessibilityRole="button"
              accessibilityLabel={product ? "Update product" : "Add product"}
            >
              <Text style={styles.buttonText}>
                {product ? "Update Product" : "Add Product"}
              </Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </KeyboardAvoidingView>
      </BottomSheetModal>
    );
  }
);

// Add display name for better debugging
ProductAddOrUpdateModal.displayName = "ProductAddOrUpdateModal";

export default ProductAddOrUpdateModal;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      flexGrow: 1,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 20,
      alignSelf: "center",
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      color: colors.text,
      fontSize: 15,
      backgroundColor: colors.card,
    },
    imageContainer: {
      marginBottom: 16,
    },
    imagePreview: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginBottom: 8,
    },
    noImageText: {
      color: colors.placeholder,
      marginBottom: 8,
    },
    imageButtons: {
      flexDirection: "row",
      gap: 10,
      marginTop: 8,
    },
    imageButton: {
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.placeholder,
    },
    submitButton: {
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 16,
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.pureWhite,
    },
  });
