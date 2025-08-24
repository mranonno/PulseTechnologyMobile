import * as Updates from "expo-updates";
import { Alert } from "react-native";

/**
 * Manual OTA update check
 */
export const checkForUpdate = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      Alert.alert(
        "Update Available",
        "A new version is available. Do you want to install it now?",
        [
          { text: "Later", style: "cancel" },
          {
            text: "Update",
            onPress: async () => {
              await Updates.fetchUpdateAsync();
              Alert.alert(
                "Update Ready",
                "Restarting app to apply the update...",
                [
                  {
                    text: "Restart",
                    onPress: () => Updates.reloadAsync(),
                  },
                ]
              );
            },
          },
        ]
      );
    } else {
      Alert.alert("Up to Date", "Your app is running the latest version.");
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to check for updates.");
  }
};
