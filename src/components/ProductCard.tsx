import React, { memo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  Alert,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../theme/ThemeProvider";
import { Product } from "../types/types";
import { formatDate } from "../utils/commonFunction";
import { Colors } from "../types/global";
import StockUpdateModal from "./modal/StockUpdateModal";
import GlobalBottomSheetModal from "./modal/GlobalBottomSheetModal";
import { updateStock } from "../services/productService";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAuth } from "../context/AuthContext";
import EnhancedImageViewing from "react-native-image-viewing";

interface ProductCardProps {
  product: Product;
  onEdit: (event: GestureResponderEvent) => void;
  onDelete: (event: GestureResponderEvent) => void;
}

const ProductCard: React.FC<ProductCardProps> = memo(
  ({ product, onDelete, onEdit }) => {
    const { colors } = useThemeContext();
    const styles = getStyles(colors);
    const { user } = useAuth();
    const placeholder = require("../../assets/placeholder.png");

    // Image state for fallback
    const [imgSource, setImgSource] = useState<ImageSourcePropType>(
      product.image ? { uri: product.image } : placeholder
    );
    const handleImageError = () => setImgSource(placeholder);

    // Bottom sheet reference
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    // Image preview state
    const [isPreviewVisible, setPreviewVisible] = useState(false);
    const previewImages = [
      product.image ? { uri: product.image } : placeholder,
    ];

    // Stock update state
    const [loading, setLoading] = useState(false);
    const handleStockSubmit = async (type: "in" | "out", quantity: number) => {
      setLoading(true);
      try {
        await updateStock(product._id!, type, quantity);
        product.quantity =
          type === "in"
            ? (product.quantity ?? 0) + quantity
            : Math.max((product.quantity ?? 0) - quantity, 0);

        Alert.alert(
          "Success",
          `Stock ${type === "in" ? "added" : "removed"} successfully!`
        );
        bottomSheetRef.current?.dismiss();
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to update stock. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const handleOpenModal = () => bottomSheetRef.current?.present();

    return (
      <View style={styles.card}>
        {/* Thumbnail */}
        <TouchableOpacity onPress={() => setPreviewVisible(true)}>
          <Image
            source={imgSource}
            style={styles.image}
            resizeMode="cover"
            onError={handleImageError}
            accessibilityLabel={`${product.name} image`}
          />
        </TouchableOpacity>

        {/* Image Preview */}
        <EnhancedImageViewing
          images={previewImages}
          imageIndex={0}
          visible={isPreviewVisible}
          onRequestClose={() => setPreviewVisible(false)}
        />

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productModel}>
            Model:{" "}
            <Text style={styles.productModelText}>
              {product.productModel ?? "N/A"}
            </Text>
          </Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>
              Listed on:{" "}
              <Text style={styles.detailValueText}>
                {formatDate(product.createdAt)}
              </Text>
            </Text>
            <Text style={styles.detailText}>
              Stock:{" "}
              <Text style={styles.detailValueText}>
                {product.quantity ?? "N/A"}
              </Text>
            </Text>
          </View>
          <Text style={styles.priceText}>
            ৳{product.price?.toFixed(2) ?? "0.00"}
          </Text>
        </View>

        {/* Action Icons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={handleOpenModal} style={styles.iconButton}>
            <Ionicons
              name={user?.role === "admin" ? "cube-outline" : "create-outline"}
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>

          {user?.role === "admin" && (
            <>
              <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={colors.danger}
                />
              </TouchableOpacity>
            </>
          )}

          <GlobalBottomSheetModal ref={bottomSheetRef}>
            <StockUpdateModal
              productName={product.name}
              onSubmit={handleStockSubmit}
              loading={loading}
            />
          </GlobalBottomSheetModal>
        </View>
      </View>
    );
  }
);

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 12,
      elevation: 3,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      marginBottom: 8,
      padding: 12,
      alignItems: "center",
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 12,
      backgroundColor: colors.imageBackground,
    },
    infoContainer: { flex: 1, justifyContent: "center" },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    productModel: { fontSize: 13, fontWeight: "600", color: colors.text },
    productModelText: { fontSize: 13, color: colors.mutedText },
    detailsRow: { flexDirection: "row", marginTop: 4 },
    detailText: {
      fontWeight: "600",
      marginRight: 12,
      color: colors.text,
      fontSize: 12,
    },
    detailValueText: { fontSize: 12, color: colors.mutedText },
    priceText: {
      fontSize: 14,
      fontWeight: "800",
      color: colors.primary,
      marginTop: 4,
    },
    actionsContainer: {
      justifyContent: "center",
      alignItems: "center",
      minHeight: 80,
    },
    iconButton: { padding: 2 },
  });

export default ProductCard;
