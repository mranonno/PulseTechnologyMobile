import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../theme/ThemeProvider";
import ProductCard from "../components/ProductCard";
import ProductAddOrUpdateModal from "../components/modal/ProductAddOrUpdateModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface Product {
  id?: string;
  name: string;
  price: number;
  stock: number;
  listingDate: string; // ISO string
  image?: string;
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "BMC G3 A20 Auto CPAP Machine",
    price: 1200,
    image: "https://i.ibb.co/5GzXkwq/user-placeholder.png",
    stock: 3,
    listingDate: "2025-08-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Digital Blood Pressure Monitor",
    price: 3200,
    image: "https://i.ibb.co/5GzXkwq/user-placeholder.png",
    stock: 16,
    listingDate: "2025-08-01T00:00:00Z",
  },
];

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const AllProductsScreen = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const modalRef = useRef<BottomSheetModal>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredProducts = useMemo(() => {
    const q = debouncedSearchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [debouncedSearchQuery, products]);

  const openAddModal = () => {
    setEditingProduct(null);
    modalRef.current?.present();
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    modalRef.current?.present();
  };

  const handleSubmit = (product: Product) => {
    if (product.id) {
      // Update product
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, ...product } : p))
      );
      Alert.alert("Success", "Product updated.");
    } else {
      // Add product with new id
      const newProduct = {
        ...product,
        id: (products.length + 1).toString(),
        image: product.image || "https://i.ibb.co/5GzXkwq/user-placeholder.png",
      };
      setProducts((prev) => [newProduct, ...prev]);
      Alert.alert("Success", "Product added.");
    }
    modalRef.current?.dismiss();
  };

  const handleDelete = useCallback((id: string) => {
    Alert.alert("Delete product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setProducts((prev) => prev.filter((p) => p.id !== id)),
      },
    ]);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.mutedText} />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor={colors.mutedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            accessibilityLabel="Search products"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found.</Text>
            </View>
          )}
          keyboardDismissMode="on-drag"
          renderItem={({ item }) => (
            <ProductCard
              image={item.image}
              name={item.name}
              price={item.price}
              stock={item.stock}
              listingDate={item.listingDate}
              onEdit={() => openEditModal(item)}
              onDelete={() => handleDelete(item.id!)}
            />
          )}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.fab}
          onPress={openAddModal}
          accessibilityRole="button"
          accessibilityLabel="Add new product"
        >
          <Ionicons name="add" size={28} color={colors.pureWhite} />
        </TouchableOpacity>

        <ProductAddOrUpdateModal
          ref={modalRef}
          product={editingProduct || undefined}
          onSubmit={handleSubmit}
          onDismiss={() => modalRef.current?.dismiss()}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AllProductsScreen;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: colors.background },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 8,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      color: colors.text,
      fontSize: 16,
    },
    listContent: { paddingBottom: 16, flexGrow: 1 },
    emptyContainer: {
      marginTop: 32,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    emptyText: { color: colors.mutedText, fontSize: 16 },
    fab: {
      position: "absolute",
      bottom: 24,
      right: 24,
      backgroundColor: colors.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
  });
