import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import * as Updates from "expo-updates";

const UpdateCheckScreen = () => {
  const [status, setStatus] = useState("Checking for updates...");

  const checkAndUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setStatus("Downloading update...");
        const result = await Updates.fetchUpdateAsync();
        if (result.isNew) {
          setStatus("Installing update...");
          await Updates.reloadAsync();
        }
      } else {
        setStatus("App is up to date.");
      }
    } catch (error) {
      setStatus("Failed to check or install updates.");
      console.error("OTA update error:", error);
    }
  };

  useEffect(() => {
    checkAndUpdate();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" style={{ marginBottom: 20 }} />
      <Text style={styles.status}>{status}</Text>
    </View>
  );
};

export default UpdateCheckScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  status: { fontSize: 16, textAlign: "center" },
});
