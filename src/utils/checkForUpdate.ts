import * as Updates from "expo-updates";
import { Alert } from "react-native";

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
              try {
                await Updates.fetchUpdateAsync();
                Alert.alert(
                  "Update Ready",
                  "Restarting app to apply the update...",
                  [
                    {
                      text: "Restart",
                      onPress: async () => {
                        try {
                          await Updates.reloadAsync();
                        } catch (reloadError) {
                          console.error("Reload failed:", reloadError);
                        }
                      },
                    },
                  ]
                );
              } catch (fetchError) {
                console.error("Fetch update error:", fetchError);
                Alert.alert("Error", "Failed to download update.");
              }
            },
          },
        ]
      );
    } else {
      Alert.alert("Up to Date", "Your app is running the latest version.");
    }
  } catch (error) {
    console.error("Check update error:", error);
    Alert.alert("Error", "Failed to check for updates.");
  }
};
