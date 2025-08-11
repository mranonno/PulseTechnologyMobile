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
  KeyboardAvoidingView,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useThemeContext } from "../../theme/ThemeProvider";
import CustomInputField from "../ui/CustomInputField";
import { Product } from "../../types/types";

interface Props {
  product?: Product;
  onSubmit: (product: Product) => void;
  onDismiss: () => void;
}

const ProductAddOrUpdateModal = forwardRef<BottomSheetModal, Props>(
  ({ product, onSubmit, onDismiss }, ref) => {
    const { colors } = useThemeContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => bottomSheetModalRef.current!);

    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<
      null | string | { uri: string; name?: string; type?: string }
    >(null);

    const resetForm = useCallback(() => {
      setProductName("");
      setPrice("");
      setQuantity("");
      setDescription("");
      setImage(null);
    }, []);

    useEffect(() => {
      if (product) {
        setProductName(product.name);
        setPrice(product.price.toString());
        setQuantity(product.quantity.toString());
        setDescription(product.description ?? "");
        setImage(product.image ?? null);
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
          mediaTypes: ["images"],
          quality: 0.8,
          allowsEditing: true,
          aspect: [4, 3],
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
          const asset = result.assets[0];
          const uri = asset.uri!;
          const filename = uri.split("/").pop() || "photo.jpg";
          const match = /\.(\w+)$/.exec(filename);
          const type = `image/${match ? match[1] : "jpeg"}`;

          setImage({ uri, name: filename, type });
        }
      } catch (error) {
        console.error("Error picking image:", error);
        Alert.alert("Error", "Failed to pick image.");
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

      const stockNum = parseInt(quantity, 10);
      if (isNaN(stockNum) || stockNum < 0) {
        return Alert.alert(
          "Validation",
          "Please enter a valid non-negative stock."
        );
      }

      // if (!description.trim() || description.trim().length < 10) {
      //   return Alert.alert(
      //     "Validation",
      //     "Please enter a description of at least 10 characters."
      //   );
      // }

      onSubmit({
        id: product?.id,
        name: productName.trim(),
        price: priceNum,
        quantity: stockNum,
        description: description.trim() || "",
        image: image ?? undefined,
      });

      bottomSheetModalRef.current?.dismiss();
    }, [
      productName,
      price,
      quantity,
      description,
      image,
      onSubmit,
      product?.id,
    ]);

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

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        enablePanDownToClose
        onDismiss={handleDismiss}
        keyboardBlurBehavior="restore"
        handleIndicatorStyle={handleIndicatorStyle}
        backgroundStyle={backgroundStyle}
        backdropComponent={backdropComponent}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              placeholder="Name"
              value={productName}
              onChangeText={setProductName}
            />
            <CustomInputField
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
            <CustomInputField
              placeholder="Stock"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="number-pad"
            />
            <CustomInputField
              placeholder="Optional description..."
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={4}
              style={{ textAlignVertical: "top", height: 80 }}
            />
            <View style={styles.imageContainer}>
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
                  activeOpacity={0.6}
                  style={styles.imageButton}
                  onPress={() => pickImage("camera")}
                >
                  <MaterialIcons
                    name="add-a-photo"
                    size={30}
                    color={colors.placeholder}
                  />
                </TouchableOpacity>
                {typeof image === "string" || (image && "uri" in image) ? (
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
    imageContainer: {
      marginBottom: 16,
    },
    imagePreview: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginBottom: 8,
      marginLeft: 20,
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
    imageButtons: {
      flexDirection: "row",
      gap: 10,
      marginTop: 8,
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
