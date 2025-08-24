import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Updates from "expo-updates";
import { useThemeContext } from "../theme/ThemeProvider";

const UpdateCheckScreen = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  const [loading, setLoading] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [status, setStatus] = useState<string | null>(
    "Checking for updates..."
  );

  // Function to check for OTA update
  const checkForUpdate = async () => {
    setLoading(true);
    setStatus("Checking for updates...");
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setUpdateAvailable(true);
        setStatus("Update available! Tap below to install.");
      } else {
        setUpdateAvailable(false);
        setStatus("App is up to date.");
      }
    } catch (error) {
      console.error(error);
      setUpdateAvailable(false);
      setStatus("Failed to check for updates.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch & apply the update
  const handleInstallUpdate = async () => {
    setLoading(true);
    setStatus("Downloading update...");
    try {
      await Updates.fetchUpdateAsync();
      setStatus("Update downloaded! Restarting app...");
      await Updates.reloadAsync();
    } catch (error) {
      console.error(error);
      setStatus("Failed to install update.");
    } finally {
      setLoading(false);
    }
  };

  // Automatically check for update when screen mounts
  useEffect(() => {
    checkForUpdate();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTA Update Check</Text>
      {status && <Text style={styles.status}>{status}</Text>}

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
    title: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 24,
    },
    status: {
      fontSize: 16,
      color: "#333",
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
    buttonText: {
      color: colors.pureWhite,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
