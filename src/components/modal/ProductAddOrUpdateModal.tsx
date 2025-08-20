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
  View,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useThemeContext } from "../../theme/ThemeProvider";
import CustomInputField from "../ui/CustomInputField";
import { Product } from "../../types/types";
import useBackButtonHandler from "../../hooks/useBackButtonHandler";
import { ImageSource } from "react-native-vector-icons/Icon";

interface Props {
  product?: Product;
  onSubmit: (product: Product) => void;
  onDismiss: () => void;
  loading: boolean;
}

const SNAP_POINTS = ["56%"];

const ProductAddOrUpdateModal = forwardRef<BottomSheetModal, Props>(
  ({ product, onSubmit, onDismiss: onDismissCallback, loading }, ref) => {
    const { colors } = useThemeContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useImperativeHandle(ref, () => bottomSheetModalRef.current!);

    const [productName, setProductName] = useState("");
    const [productModel, setProductModel] = useState("");
    const [productOrigin, setProductOrigin] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<ImageSource | string | null>(null);

    // ====================
    // Modal State Tracking
    // ====================

    const handleChange = useCallback((index: number) => {
      if (index === -1) {
        setIsModalVisible(false);
      } else {
        setIsModalVisible(true);
      }
    }, []);

    // ====================
    // Back Button Handler
    // ====================

    useBackButtonHandler(() => {
      if (isModalVisible) {
        Keyboard.dismiss();
        bottomSheetModalRef.current?.close();
        return true;
      }
      return false;
    }, isModalVisible);

    // ====================
    // Form Reset & Init
    // ====================

    const resetForm = useCallback(() => {
      setProductName("");
      setProductModel("");
      setProductOrigin("");
      setPrice("");
      setQuantity("");
      setDescription("");
      setImage(null);
    }, []);

    useEffect(() => {
      if (product) {
        setProductName(product.name);
        setProductModel(product.productModel || "");
        setProductOrigin(product.productOrigin || "");
        setPrice(product.price?.toString() || "");
        setQuantity(product.quantity?.toString() || "");
        setDescription(product.description || "");
        setImage(product.image || null);
      } else {
        resetForm();
      }
    }, [product, resetForm]);

    const handleDismiss = useCallback(() => {
      Keyboard.dismiss();
      resetForm();
      onDismissCallback();
    }, [onDismissCallback, resetForm]);

    // ====================
    // Image Picker
    // ====================

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

        const result = await (source === "gallery"
          ? ImagePicker.launchImageLibraryAsync
          : ImagePicker.launchCameraAsync)({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
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
        console.error("Error picking image:", error);
        Alert.alert("Error", "Failed to pick image.");
      }
    }, []);

    // ====================
    // Submit Handler
    // ====================

    const handleSubmit = useCallback(() => {
      if (!productName.trim()) {
        return Alert.alert("Validation", "Please enter a product name.");
      }

      // if (!productModel.trim()) {
      //   return Alert.alert("Validation", "Please enter a product model.");
      // }

      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0) {
        return Alert.alert("Validation", "Please enter a valid price.");
      }

      const quantityNum = parseInt(quantity, 10);
      if (isNaN(quantityNum) || quantityNum < 0) {
        return Alert.alert("Validation", "Please enter a valid quantity.");
      }

      onSubmit({
        id: product?.id ?? Date.now().toString(),
        name: productName.trim(),
        productModel: productModel.trim(),
        productOrigin: productOrigin.trim(),
        price: priceNum,
        quantity: quantityNum,
        description: description.trim(),
        image: image ?? undefined,
      });

      // Close modal
      bottomSheetModalRef.current?.close();
    }, [
      productName,
      productModel,
      productOrigin,
      price,
      quantity,
      description,
      image,
      onSubmit,
      product?.id,
    ]);

    // ====================
    // Backdrop (Typed)
    // ====================

    const backdropComponent = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      ),
      []
    );

    // ====================
    // Styles
    // ====================

    const backgroundStyle = useMemo(
      () => ({ backgroundColor: colors.card, borderRadius: 24 }),
      [colors.card]
    );

    const handleIndicatorStyle = useMemo(
      () => ({
        backgroundColor: colors.primary,
        width: 50,
        height: 5,
        borderRadius: 4,
      }),
      [colors.primary]
    );

    // ====================
    // Render
    // ====================

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={SNAP_POINTS}
        enablePanDownToClose
        onDismiss={handleDismiss}
        onChange={handleChange}
        keyboardBlurBehavior="restore"
        handleIndicatorStyle={handleIndicatorStyle}
        backgroundStyle={backgroundStyle}
        backdropComponent={backdropComponent}
        animateOnMount
        // Animation (optional)
        animationConfigs={{
          damping: 30,
          mass: 1,
          stiffness: 250,
          overshootClamping: true,
          restDisplacementThreshold: 0.5,
          restSpeedThreshold: 0.5,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
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

              <CustomInputField
                required
                label="Product Name"
                placeholder="e.g. Patient Monitor"
                value={productName}
                onChangeText={setProductName}
              />
              <CustomInputField
                label="Product Model"
                placeholder="e.g. WH-1000XM4"
                value={productModel}
                onChangeText={setProductModel}
              />
              <CustomInputField
                label="Product Origin"
                placeholder="e.g. China"
                value={productOrigin}
                onChangeText={setProductOrigin}
              />
              <CustomInputField
                required
                label="Price"
                placeholder="e.g. 99.99"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
              <CustomInputField
                required
                label="Quantity"
                placeholder="e.g. 50"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
              />
              <CustomInputField
                label="Description"
                placeholder="e.g. ECG, SpO2, NIBP monitor"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={{ textAlignVertical: "top", height: 80 }}
              />

              <View style={styles.imageContainer}>
                <Text style={styles.imageLabel}>Select Image</Text>
                <View style={styles.imageButtons}>
                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => pickImage("gallery")}
                    activeOpacity={0.6}
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
                    activeOpacity={0.6}
                  >
                    <MaterialIcons
                      name="add-a-photo"
                      size={30}
                      color={colors.placeholder}
                    />
                  </TouchableOpacity>

                  {image ? (
                    <Image
                      source={{
                        uri: typeof image === "string" ? image : image.uri,
                      }}
                      style={styles.imagePreview}
                    />
                  ) : (
                    <View style={styles.dashedPlaceholder}>
                      <FontAwesome
                        name="image"
                        size={32}
                        color={colors.placeholder}
                      />
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.pureWhite} />
                ) : (
                  <Text style={styles.buttonText}>
                    {product ? "Update" : "Add"} Product
                  </Text>
                )}
              </TouchableOpacity>
            </BottomSheetScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </BottomSheetModal>
    );
  }
);

ProductAddOrUpdateModal.displayName = "ProductAddOrUpdateModal";

export default ProductAddOrUpdateModal;

// ====================
// Styles
// ====================

const getStyles = (colors: Colors) =>
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
    imageContainer: {
      marginBottom: 16,
    },
    imageLabel: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 4,
    },
    imageButtons: {
      flexDirection: "row",
      gap: 10,
    },
    imageButton: {
      justifyContent: "center",
      alignItems: "center",
      height: 60,
      width: 60,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.placeholder,
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
      marginLeft: 20,
    },
    imagePreview: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginLeft: 20,
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
