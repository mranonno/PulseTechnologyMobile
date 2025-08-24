import React, { useCallback, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../theme/ThemeProvider";
import ThemeSettingModal from "../components/modal/ThemeSettingModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAuth } from "../context/AuthContext";
import NavigationService from "../navigation/NavigationService";
import { useNavigation } from "@react-navigation/native";
import { InnerStackParamList } from "../navigation/StackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const SettingItem = React.memo(
  ({
    icon,
    title,
    value,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    value?: string;
    onPress?: () => void;
  }) => {
    const { colors } = useThemeContext();
    const styles = getStyles(colors);

    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={styles.row}>
          <Ionicons
            name={icon}
            size={22}
            color={colors.mutedText}
            style={styles.leftIcon}
          />
          <Text style={styles.settingText}>{title}</Text>
        </View>
        <View style={styles.rightIcon}>
          {value ? <Text style={styles.rightText}>{value}</Text> : null}
          <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
        </View>
      </TouchableOpacity>
    );
  }
);

const SettingsScreen = () => {
  const { logout } = useAuth();
  const { colors, theme } = useThemeContext();
  const styles = getStyles(colors);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<InnerStackParamList>>();

  const handleCheckUpdates = async () => {
    navigation.navigate("UpdateCheck");
  };

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            NavigationService.reset([{ name: "Login" }]);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const settings = [
    {
      title: "App Theme",
      icon: "moon",
      value:
        theme === "dark"
          ? "Dark Mode"
          : theme === "light"
          ? "Light Mode"
          : "System Default",
      action: openBottomSheet,
    },
    {
      title: "Primary Tab",
      icon: "apps",
      value: "Home",
      action: openBottomSheet,
    },
    {
      title: "Check for Updates",
      icon: "cloud-download-outline",
      action: handleCheckUpdates,
    },
    {
      title: "About App",
      icon: "information-circle-outline",
      action: () => {
        Alert.alert("About", "Pulse Technology App\nVersion 1.0.0");
      },
    },
    {
      title: "Logout",
      icon: "log-out-outline",
      action: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      {settings.map((item, idx) => (
        <SettingItem
          key={idx}
          icon={item.icon as keyof typeof Ionicons.glyphMap}
          title={item.title}
          value={item.value}
          onPress={item.action}
        />
      ))}
      <ThemeSettingModal ref={bottomSheetRef} />
    </View>
  );
};

export default SettingsScreen;

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: colors.shadow,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 12,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    settingText: {
      fontSize: 16,
      color: colors.text,
    },
    leftIcon: {
      marginRight: 16,
    },
    rightIcon: {
      flexDirection: "row",
      alignItems: "center",
    },
    rightText: {
      marginRight: 8,
      fontSize: 14,
      color: colors.mutedText,
    },
  });
