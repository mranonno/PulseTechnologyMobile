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
import ProductCard from "../components/ProductCard";
import ProductAddOrUpdateModal from "../components/modal/ProductAddOrUpdateModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Product } from "../types/types";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

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

const AllProductsScreen = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const modalRef = useRef<BottomSheetModal>(null);

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
      setLoading(true);
      try {
        let savedProduct: Product;

        if (product.id) {
          savedProduct = await updateProduct(product);
          savedProduct = normalizeProduct(savedProduct);
          setProducts((prev) =>
            prev.map((p) => (p.id === product.id ? savedProduct : p))
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
            setProducts((prev) => prev.filter((p) => p.id !== id));
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
      <View style={styles.searchAndNewAddContainer}>
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
          accessibilityLabel="addNewProduct"
          onPress={openAddModal}
          disabled={loading}
          style={styles.addNewButton}
        >
          <Text style={styles.addNewButtonText}>Add New</Text>
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
          keyExtractor={(item) => item.id ?? Math.random().toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found.</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onEdit={() => openEditModal(item)}
              onDelete={() => handleDelete(item.id!)}
            />
          )}
        />
      )}

      <ProductAddOrUpdateModal
        ref={modalRef}
        product={editingProduct}
        onSubmit={handleSubmit}
        onDismiss={() => modalRef.current?.dismiss()}
        loading={loading}
      />
    </View>
  );
};

export default AllProductsScreen;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 8,
      backgroundColor: colors.background,
    },
    searchAndNewAddContainer: {
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
    addNewButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 100,
    },
    addNewButtonText: {
      color: colors.pureWhite,
      fontWeight: "600",
      fontSize: 16,
    },
    searchInput: { flex: 1, marginLeft: 8, color: colors.text, fontSize: 16 },
    listContent: { paddingBottom: 8 },
    emptyContainer: { marginTop: 32, alignItems: "center" },
    emptyText: { color: colors.mutedText, fontSize: 16 },
  });
