import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../theme/ThemeProvider";

// Sample product data
const products = [
  {
    id: "1",
    name: "Topcare Pulse Oximeter",
    price: "৳1200",
    image: "https://i.ibb.co/5GzXkwq/user-placeholder.png",
  },
  {
    id: "2",
    name: "Digital Blood Pressure Monitor",
    price: "৳3200",
    image: "https://i.ibb.co/6nLzvK7/placeholder-product.png",
  },
];

const AllProductsScreen = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
        />
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AllProductsScreen;

const getStyles = (colors: Colors) =>
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
    card: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 8,
      backgroundColor: "#ccc",
      marginRight: 12,
    },
    details: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    price: {
      fontSize: 14,
      color: colors.primary,
    },
  });
