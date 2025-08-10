import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../theme/ThemeProvider";
import ProductCard from "../components/ProductCard";

// Sample product data
const products = [
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

// Custom hook to debounce a value with delay
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

  const [searchQuery, setSearchQuery] = useState("");
  // Debounce search input by 300ms
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter((item) => item.name.toLowerCase().includes(query));
  }, [debouncedSearchQuery]);

  // Handlers stable with useCallback, passing product id
  const handleEdit = useCallback((id: string) => {
    Alert.alert("Edit pressed", `Product ID: ${id}`);
  }, []);

  const handleDelete = useCallback((id: string) => {
    Alert.alert("Delete pressed", `Product ID: ${id}`);
  }, []);

  // Empty state UI
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No products found.</Text>
    </View>
  );

  return (
    // Dismiss keyboard when tapping outside input
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Search Bar */}
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

        {/* Product List */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          keyboardDismissMode="on-drag"
          renderItem={({ item }) => (
            <ProductCard
              image={item.image}
              name={item.name}
              price={item.price}
              stock={item.stock}
              listingDate={item.listingDate}
              onEdit={() => handleEdit(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AllProductsScreen;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      color: colors.text,
      fontSize: 16,
    },
    listContent: {
      paddingBottom: 16,
      flexGrow: 1,
    },
    emptyContainer: {
      marginTop: 32,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    emptyText: {
      color: colors.mutedText,
      fontSize: 16,
    },
  });
