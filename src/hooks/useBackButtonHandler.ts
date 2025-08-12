// hooks/useBackButtonHandler.ts
import { useCallback, useEffect } from "react";
import { BackHandler, Platform } from "react-native";

const useBackButtonHandler = (
  onBackPress: () => boolean,
  enabled = true // Control whether handler is active
) => {
  const handleBackPress = useCallback(() => {
    if (enabled) {
      return onBackPress() === true;
    }
    return false;
  }, [enabled, onBackPress]);

  useEffect(() => {
    if (Platform.OS === "android") {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );
      return () => subscription.remove();
    }
  }, [handleBackPress]);

  return null;
};

export default useBackButtonHandler;
