import React, { useRef, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../theme/ThemeProvider";
import { useFocusEffect } from "@react-navigation/native";
import { getAllProducts } from "../services/productService";
import PriceListCard from "../components/PriceListCard";
import AddPriceListProductModal, {
  AddPriceListProductModalRef,
} from "../components/modal/AddPriceListProductModal";
import { PriceListProduct } from "../types/types";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const normalizeProduct = (p: any): PriceListProduct => ({
  id: p._id?.toString() ?? Math.random().toString(),
  name: p.name ?? "Unnamed Product",
  price1: p.price1 ?? p.price ?? undefined,
  price2: p.price2 ?? undefined,
  price3: p.price3 ?? undefined,
  vendorName: p.vendorName ?? "Unknown Vendor",
});

const PriceListScreen: React.FC = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const [products, setProducts] = useState<PriceListProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const modalRef = useRef<AddPriceListProductModalRef>(null);

  const filteredProducts = useMemo(() => {
    const q = debouncedSearchQuery.toLowerCase().trim();
    return q
      ? products.filter((p) => p.name.toLowerCase().includes(q))
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

  useFocusEffect(
    useCallback(() => {
      fetchAllProducts();
    }, [fetchAllProducts])
  );

  const openModal = () => modalRef.current?.open();

  return (
    <View style={styles.container}>
      <View style={styles.searchAndAddContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.mutedText} />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor={colors.mutedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity
          style={styles.addNewButton}
          onPress={openModal}
          disabled={loading}
        >
          <Text style={styles.addNewButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      {loading && products.length === 0 ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PriceListCard product={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No products found.</Text>
          )}
          refreshing={loading}
          onRefresh={fetchAllProducts}
        />
      )}

      <AddPriceListProductModal
        ref={modalRef}
        onAddProduct={(newProduct) =>
          setProducts((prev) => [newProduct, ...prev])
        }
      />
    </View>
  );
};

export default PriceListScreen;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 8,
      backgroundColor: colors.background,
    },
    searchAndAddContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      gap: 8,
    },
    searchContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    searchInput: { flex: 1, marginLeft: 8, color: colors.text, fontSize: 16 },
    addNewButton: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary,
    },
    addNewButtonText: {
      color: colors.pureWhite,
      fontWeight: "600",
      fontSize: 16,
    },
    listContent: { paddingBottom: 8 },
    emptyText: {
      color: colors.mutedText,
      fontSize: 16,
      textAlign: "center",
      marginTop: 32,
    },
  });
