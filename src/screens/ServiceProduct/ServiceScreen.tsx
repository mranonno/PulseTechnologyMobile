import React, { useCallback } from "react";
import {
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../../theme/ThemeProvider";
import ServiceProductCard from "../../components/ServiceProductCard";
import { Colors } from "../../types/global";

type Service = {
  id: string;
  title: string;
  price: number;
  description?: string;
  lastServiceDate?: string;
  imageUrl?: string;
};

// Empty array simulating no services
const dummyServices: Service[] = [
  // Uncomment to test with data:
  {
    id: "1",
    title: "AC Repair Service",
    price: 1500,
    description: "Includes diagnostics and filter cleaning",
    lastServiceDate: "2025-08-01",
  },
  {
    id: "2",
    title: "AC Repair Service",
    price: 1500,
    description: "Includes diagnostics and filter cleaning",
    lastServiceDate: "2025-08-01",
  },
  {
    id: "3",
    title: "AC Repair Service",
    price: 1500,
    description: "Includes diagnostics and filter cleaning",
    lastServiceDate: "2025-08-01",
  },
];

const ServiceScreen = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const handleAddServiceItem = useCallback(() => {
    // TODO: Open modal or navigate to add service screen
    console.log("Add new service item");
  }, []);

  const renderItem: ListRenderItem<Service> = ({ item }) => (
    <ServiceProductCard
      title={item.title}
      price={item.price}
      description={item.description}
      lastServiceDate={item.lastServiceDate}
      imageUrl={item.imageUrl}
    />
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={64} color={colors.mutedText} />
      <Text style={styles.emptyText}>No service items available</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dummyServices}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={EmptyListComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          dummyServices.length === 0 ? styles.emptyWrapper : styles.listContent
        }
      />

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.fab}
        onPress={handleAddServiceItem}
        accessibilityRole="button"
        accessibilityLabel="Add new service item"
      >
        <Ionicons name="add" size={28} color={colors.pureWhite} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ServiceScreen;

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      padding: 16,

      paddingBottom: 80,
    },
    emptyWrapper: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    emptyContainer: {
      alignItems: "center",
    },
    emptyText: {
      fontSize: 16,
      color: colors.mutedText,
      textAlign: "center",
      marginTop: 12,
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
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
  });
