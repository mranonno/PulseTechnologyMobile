import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ListRenderItem,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../theme/ThemeProvider";
import ServiceProductCard from "../components/ServiceProductCard";

type Service = {
  id: string;
  title: string;
  price: number;
  description?: string;
  lastServiceDate?: string;
  imageUrl?: string;
};

const ServiceScreen = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const handleAddServiceItem = () => {
    console.log("Add new service item");
  };

  // Dummy services (can be replaced with dynamic data)
  const services: Service[] = [
    {
      id: "1",
      title: "AC Repair Service",
      price: 1500,
      description: "Includes diagnostics and filter cleaning",
      lastServiceDate: "2025-08-01",
      // imageUrl: "https://example.com/service/ac-repair.jpg",
    },
    // Add more items here as needed
  ];

  const renderItem: ListRenderItem<Service> = ({ item }) => (
    <ServiceProductCard
      title={item.title}
      price={item.price}
      description={item.description}
      lastServiceDate={item.lastServiceDate}
      imageUrl={item.imageUrl}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          services.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No service available</Text>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.fab}
        onPress={handleAddServiceItem}
      >
        <Ionicons name="add" size={28} color={colors.pureWhite} />
      </TouchableOpacity>
    </View>
  );
};

export default ServiceScreen;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      paddingVertical: 16,
    },
    emptyContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
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
      elevation: 5,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
  });
