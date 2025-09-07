import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as Updates from "expo-updates";
import { useThemeContext } from "../../theme/ThemeProvider";
import { Colors } from "../../types/global";

const UpdateCheckScreen = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const [loading, setLoading] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [status, setStatus] = useState("Checking for updates...");
  const [debugInfo, setDebugInfo] = useState("");

  const checkForUpdate = async () => {
    setLoading(true);
    setStatus("Checking for updates...");
    try {
      const update = await Updates.checkForUpdateAsync();
      setDebugInfo(
        `Runtime: ${Updates.runtimeVersion}\nChannel: ${
          Updates.channel ?? "N/A"
        }`
      );

      if (update.isAvailable) {
        setUpdateAvailable(true);
        setStatus("Update available! Tap below to install.");
      } else {
        setUpdateAvailable(false);
        setStatus("App is up to date.");
      }
    } catch (error: any) {
      console.error("Update check failed:", error);
      setUpdateAvailable(false);
      setStatus("Failed to check for updates.");
      setDebugInfo(error?.message || JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  const handleInstallUpdate = async () => {
    setLoading(true);
    setStatus("Downloading update...");
    try {
      const result = await Updates.fetchUpdateAsync();
      if (result.isNew) {
        setStatus("Update downloaded! Restarting app...");
        await Updates.reloadAsync();
      } else {
        setStatus("No new update found.");
      }
    } catch (error: any) {
      console.error("Update install failed:", error);
      setStatus("Failed to install update. Please try again.");
      setDebugInfo(error?.message || JSON.stringify(error));
      setUpdateAvailable(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkForUpdate();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTA Update Check</Text>
      <Text style={styles.status}>{status}</Text>
      {debugInfo ? <Text style={styles.debug}>{debugInfo}</Text> : null}

      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      )}

      {!loading && updateAvailable && (
        <TouchableOpacity style={styles.button} onPress={handleInstallUpdate}>
          <Text style={styles.buttonText}>Install Update</Text>
        </TouchableOpacity>
      )}

      {!loading && !updateAvailable && (
        <TouchableOpacity style={styles.button} onPress={checkForUpdate}>
          <Text style={styles.buttonText}>Check Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UpdateCheckScreen;

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      backgroundColor: colors.background,
    },
    title: { fontSize: 26, fontWeight: "bold", marginBottom: 24 },
    status: {
      fontSize: 16,
      color: "#333",
      textAlign: "center",
      marginBottom: 10,
    },
    debug: {
      fontSize: 12,
      color: "#666",
      textAlign: "center",
      marginBottom: 20,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 8,
      marginTop: 12,
    },
    buttonText: { color: colors.pureWhite, fontSize: 16, fontWeight: "bold" },
  });
