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
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useThemeContext } from "../../theme/ThemeProvider";

interface Product {
  id?: string;
  name: string;
  price: number;
  stock: number;
  listingDate: string; // ISO string
  image?: string;
}

interface ProductAddOrUpdateModalProps {
  product?: Product; // if present, modal is update mode
  onSubmit: (product: Product) => void;
  onDismiss: () => void;
}

const ProductAddOrUpdateModal = forwardRef<
  BottomSheetModal,
  ProductAddOrUpdateModalProps
>(({ product, onSubmit, onDismiss }, ref) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["52%"], []);

  // Expose present/dismiss methods to parent
  useImperativeHandle(ref, () => bottomSheetModalRef.current!);

  // Form state
  const [productName, setProductName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price.toString() || "");
  const [stock, setStock] = useState(product?.stock.toString() || "");
  const [listingDate, setListingDate] = useState(
    product?.listingDate
      ? new Date(product.listingDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );

  // When product changes, reset form state & open modal
  useEffect(() => {
    setProductName(product?.name || "");
    setPrice(product?.price?.toString() || "");
    setStock(product?.stock?.toString() || "");
    setListingDate(
      product?.listingDate
        ? new Date(product.listingDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10)
    );
  }, [product]);

  // Reset form on dismiss
  const handleDismiss = useCallback(() => {
    onDismiss();
    setProductName("");
    setPrice("");
    setStock("");
    setListingDate(new Date().toISOString().slice(0, 10));
  }, [onDismiss]);

  // Validate and submit
  const handleSubmit = useCallback(() => {
    if (!productName.trim()) {
      Alert.alert("Validation", "Please enter a product name.");
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      Alert.alert("Validation", "Please enter a valid positive price.");
      return;
    }
    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      Alert.alert("Validation", "Please enter a valid non-negative stock.");
      return;
    }
    if (!listingDate) {
      Alert.alert("Validation", "Please enter a listing date.");
      return;
    }

    onSubmit({
      id: product?.id,
      name: productName.trim(),
      price: priceNum,
      stock: stockNum,
      listingDate,
      image: product?.image,
    });

    bottomSheetModalRef.current?.dismiss();
  }, [
    productName,
    price,
    stock,
    listingDate,
    onSubmit,
    product?.id,
    product?.image,
  ]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={handleDismiss}
      enableDynamicSizing={false}
      handleIndicatorStyle={styles.handleBar}
      style={{ zIndex: 10 }}
      backgroundStyle={{ backgroundColor: colors.card, borderRadius: 24 }}
      backdropComponent={({ animatedIndex, animatedPosition }) => (
        <BottomSheetBackdrop
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          animatedIndex={animatedIndex}
          animatedPosition={animatedPosition}
          pressBehavior="close"
        />
      )}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <BottomSheetScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
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

          <TextInput
            placeholder="Listing Date (YYYY-MM-DD)"
            value={listingDate}
            onChangeText={setListingDate}
            placeholderTextColor={colors.placeholder}
            style={styles.input}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.button, { backgroundColor: colors.primary }]}
              accessibilityRole="button"
              accessibilityLabel={product ? "Update product" : "Add product"}
            >
              <Text style={[styles.buttonText, { color: colors.pureWhite }]}>
                {product ? "Update" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
});

export default ProductAddOrUpdateModal;

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      flexGrow: 1,
    },
    handleBar: {
      backgroundColor: colors.mutedText,
      width: 40,
      height: 5,
      borderRadius: 3,
      alignSelf: "center",
      marginVertical: 10,
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
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    button: {
      flex: 1,
      marginHorizontal: 4,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
    },
  });
