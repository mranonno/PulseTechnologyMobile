import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../theme/ThemeProvider";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Product } from "../types/types";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import SoldProductCard from "../components/SoldProductCard";
import AddSoldProductModal from "../components/modal/AddSoldProductModal";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const normalizeProduct = (p: any): Product => ({
  ...p,
  id: p._id,
});

const SoldScreen = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const modalRef = useRef<BottomSheetModal>(null);

  const openModal = () => modalRef.current?.present();
  const closeModal = () => modalRef.current?.close();

  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredProducts = useMemo(() => {
    const q = debouncedSearchQuery.trim().toLowerCase();
    return q
      ? products.filter((p) => (p.name || "").toLowerCase().includes(q))
      : products;
  }, [debouncedSearchQuery, products]);

  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllProducts();
      const normalized = (response.products || []).map(normalizeProduct);
      setProducts(normalized);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const openAddModal = useCallback(() => {
    setEditingProduct(undefined);
    modalRef.current?.present();
  }, []);

  const openEditModal = useCallback((product: Product) => {
    setEditingProduct(product);
    modalRef.current?.present();
  }, []);

  const handleSubmit = useCallback(
    async (product: Product) => {
      console.log(product);
      setLoading(true);
      try {
        let savedProduct: Product;

        if (product._id) {
          savedProduct = await updateProduct(product);
          savedProduct = normalizeProduct(savedProduct);
          setProducts((prev) =>
            prev.map((p) => (p._id === product._id ? savedProduct : p))
          );
          Alert.alert("Success", "Product updated.");
        } else {
          savedProduct = await addProduct(product);
          savedProduct = normalizeProduct(savedProduct);
          setProducts((prev) => [savedProduct, ...prev]);
          Alert.alert("Success", "Product added.");
        }
        modalRef.current?.dismiss();

        await fetchAllProducts();
      } catch (err: any) {
        Alert.alert("Error", err.message || "Failed to save product.");
      } finally {
        setLoading(false);
      }
    },
    [fetchAllProducts]
  );

  const handleDelete = useCallback((id: string) => {
    Alert.alert("Delete product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p._id !== id));
            Alert.alert("Deleted", "Product deleted successfully.");
          } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to delete product.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchAndSoldNewContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.mutedText} />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor={colors.mutedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            returnKeyType="search"
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          accessibilityLabel="soldNewButton"
          onPress={openAddModal}
          disabled={loading}
          style={styles.soldNewButton}
        >
          <Text style={styles.soldNewButtonText}>Sold New</Text>
        </TouchableOpacity>
      </View>

      {loading && products.length === 0 ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={filteredProducts}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id ?? Math.random().toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found.</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <SoldProductCard
              product={item}
              onEdit={() => openEditModal(item)}
              onDelete={() => handleDelete(item._id!)}
            />
          )}
        />
      )}
      <AddSoldProductModal
        ref={modalRef}
        loading={loading}
        onDismiss={closeModal}
        onSubmit={handleSubmit}
        product={editingProduct}
      />
    </View>
  );
};

export default SoldScreen;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 8,
      backgroundColor: colors.background,
    },
    searchAndSoldNewContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      gap: 8,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flex: 1,
    },
    soldNewButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 100,
    },
    soldNewButtonText: {
      color: colors.pureWhite,
      fontWeight: "600",
      fontSize: 16,
    },
    searchInput: { flex: 1, marginLeft: 8, color: colors.text, fontSize: 16 },
    listContent: { paddingBottom: 8 },
    emptyContainer: { marginTop: 32, alignItems: "center" },
    emptyText: { color: colors.mutedText, fontSize: 16 },
  });
