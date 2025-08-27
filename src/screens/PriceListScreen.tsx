import React, { useState, useCallback, useMemo } from "react";
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
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import PriceListCard from "../components/PriceListCard";
import {
  getAllPriceListProducts,
  deletePriceListProduct,
} from "../services/priceListService";
import { PriceListProduct } from "../types/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { InnerStackParamList } from "../navigation/StackNavigator";
import { Colors } from "../types/global";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const PriceListScreen: React.FC = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  const [products, setProducts] = useState<PriceListProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const navigation =
    useNavigation<NativeStackNavigationProp<InnerStackParamList>>();
  const route = useRoute();

  const openAddScreen = (product?: PriceListProduct) => {
    navigation.navigate("PriceListProductOrUpdate", { product });
  };

  const filteredProducts = useMemo(() => {
    const q = debouncedSearchQuery.toLowerCase().trim();
    return q
      ? products.filter((p) => p.name.toLowerCase().includes(q))
      : products;
  }, [debouncedSearchQuery, products]);

  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllPriceListProducts();
      setProducts(response);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to fetch price list.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deletePriceListProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      Alert.alert("Error", "Failed to delete product.");
    }
  };

  // Update product if returning from Add/Update screen
  React.useEffect(() => {
    const updatedProduct = (route.params as any)?.updatedProduct as
      | PriceListProduct
      | undefined;
    if (updatedProduct) {
      setProducts((prev) => {
        const index = prev.findIndex((p) => p._id === updatedProduct._id);
        if (index !== -1) {
          const newProducts = [...prev];
          newProducts[index] = updatedProduct;
          return newProducts;
        } else {
          return [updatedProduct, ...prev];
        }
      });
    }
  }, [route.params]);

  useFocusEffect(
    useCallback(() => {
      fetchAllProducts();
    }, [fetchAllProducts])
  );

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
          onPress={() => openAddScreen()}
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
          keyExtractor={(item) => item._id!}
          renderItem={({ item }) => (
            <PriceListCard
              product={item}
              onDelete={() => handleDelete(item._id!)}
              onEdit={() => openAddScreen(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No price list found.</Text>
          )}
          refreshing={loading}
          onRefresh={fetchAllProducts}
        />
      )}
    </View>
  );
};

export default PriceListScreen;

const getStyles = (colors: Colors) =>
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
