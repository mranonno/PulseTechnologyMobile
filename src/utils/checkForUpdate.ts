import * as Updates from "expo-updates";
import { Alert } from "react-native";

export const checkForUpdate = async (returnStatus = false) => {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      if (returnStatus) return { isAvailable: true };
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
      if (returnStatus) return { isAvailable: false };
      Alert.alert("Up to Date", "Your app is running the latest version.");
    }
    return update;
  } catch (error) {
    console.error(error);
    if (!returnStatus) Alert.alert("Error", "Failed to check for updates.");
    throw error;
  }
};
