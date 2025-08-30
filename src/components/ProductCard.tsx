import React, { memo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  Alert,
  Modal,
  Animated,
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

interface ProductCardProps {
  product: Product;
  onEdit: (event: GestureResponderEvent) => void;
  onDelete: (event: GestureResponderEvent) => void;
}

const ProductCard: React.FC<ProductCardProps> = memo(
  ({ product, onEdit, onDelete }) => {
    const { colors } = useThemeContext();
    const styles = getStyles(colors);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const placeholder = require("../../assets/placeholder.png");
    const [isPreviewVisible, setPreviewVisible] = useState(false);

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    /** ------------------------
     * Animations
     * -----------------------*/
    // Card entry animation
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    // Image press animation
    const pressAnim = useRef(new Animated.Value(1)).current;

    // Modal preview animation
    const scalePreview = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    useEffect(() => {
      if (isPreviewVisible) {
        Animated.spring(scalePreview, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }).start();
      } else {
        scalePreview.setValue(0.8);
      }
    }, [isPreviewVisible]);

    const handleOpenModal = () => bottomSheetRef.current?.present();

    const handleStockSubmit = async (type: "in" | "out", quantity: number) => {
      setLoading(true);
      try {
        await updateStock(product._id!, type, quantity);

        // Update quantity safely
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

    /** ------------------------
     * Image press handlers
     * -----------------------*/
    const handleImagePressIn = () => {
      Animated.spring(pressAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handleImagePressOut = () => {
      Animated.spring(pressAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      setPreviewVisible(true);
    };

    const handleClosePreview = () => setPreviewVisible(false);

    return (
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Image */}
        <TouchableOpacity
          onPressIn={handleImagePressIn}
          onPressOut={handleImagePressOut}
          activeOpacity={1}
        >
          <Animated.Image
            source={product.image ? { uri: product.image } : placeholder}
            style={[styles.image, { transform: [{ scale: pressAnim }] }]}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Main Info */}
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
            <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
              <Ionicons
                name="create-outline"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
          {user?.role === "admin" && (
            <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
              <Ionicons name="trash-outline" size={24} color={colors.danger} />
            </TouchableOpacity>
          )}

          <GlobalBottomSheetModal ref={bottomSheetRef}>
            <StockUpdateModal
              productName={product.name}
              onSubmit={handleStockSubmit}
              loading={loading}
            />
          </GlobalBottomSheetModal>

          {/* Image Preview Modal */}
          <Modal
            visible={isPreviewVisible}
            transparent={true}
            onRequestClose={handleClosePreview}
          >
            <View style={styles.modalContainer}>
              {/* Background tap to close */}
              <TouchableOpacity
                style={styles.modalBackground}
                onPress={handleClosePreview}
                activeOpacity={1}
              />

              {/* Close button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClosePreview}
              >
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>

              {/* Image Preview */}
              <Animated.Image
                source={product.image ? { uri: product.image } : placeholder}
                style={[
                  styles.modalImage,
                  { transform: [{ scale: scalePreview }] },
                ]}
                resizeMode="contain"
              />
            </View>
          </Modal>
        </View>
      </Animated.View>
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
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.85)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalBackground: {
      ...StyleSheet.absoluteFillObject,
    },
    modalImage: {
      width: "90%",
      height: "70%",
      borderRadius: 12,
    },
    closeButton: {
      position: "absolute",
      top: 40,
      right: 20,
      zIndex: 10,
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: 6,
      borderRadius: 20,
    },
  });

export default ProductCard;
