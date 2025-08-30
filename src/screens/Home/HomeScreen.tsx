import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useThemeContext } from "../../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/HomeStackNavigator";
import { Colors } from "../../types/global";
import { useAuth } from "../../context/AuthContext";

const HomeScreen = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  const { user } = useAuth();
  console.log(user);

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const profileImage = user?.image
    ? { uri: user.image }
    : require("../../../assets/placeholder.png");

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image source={profileImage} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.userIdContainer}>
            <Text style={styles.userIdLabel}>ID:</Text>
            <Text style={styles.userIdValue}>{user?.userId}</Text>
          </View>
        </View>
      </View>

      {/* Navigation Title */}
      <Text style={styles.sectionTitle}>Navigations</Text>

      {/* Navigation Cards */}
      <View style={styles.navGrid}>
        <TouchableOpacity
          onPress={() => navigation.navigate("AllProducts")}
          activeOpacity={0.7}
          style={styles.navCard}
          accessibilityLabel="Navigate to All Products"
        >
          <Ionicons
            name="cube-outline"
            size={32}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={styles.navText}>All Product</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("PriceList")}
          activeOpacity={0.7}
          style={styles.navCard}
          accessibilityLabel="Navigate to Price List"
        >
          <Ionicons
            name="pricetag-outline"
            size={32}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={styles.navText}>Price List</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.navCard}>
          <Ionicons
            name="arrow-down-circle-outline"
            size={32}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={styles.navText}>Stock In</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.navCard}>
          <Ionicons
            name="arrow-up-circle-outline"
            size={32}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={styles.navText}>Stock Out</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.navCard}>
          <Ionicons
            name="people-outline"
            size={32}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={styles.navText}>Users</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    profileContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      borderRadius: 16,
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 50,
      backgroundColor: "#ccc",
      marginRight: 16,
    },
    info: {
      flex: 1,
      justifyContent: "center",
    },
    name: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
    },
    email: {
      fontSize: 15,
      color: colors.mutedText,
      marginTop: 4,
    },
    userIdContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
    },
    userIdLabel: {
      fontSize: 14,
      color: colors.text,
      marginRight: 4,
    },
    userIdValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginVertical: 16,
    },
    navGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 12,
    },
    navCard: {
      width: "48%",
      backgroundColor: colors.card,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    navText: {
      marginTop: 8,
      fontSize: 14,
      color: colors.text,
      textAlign: "center",
    },
    icon: {
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 50,
    },
  });
