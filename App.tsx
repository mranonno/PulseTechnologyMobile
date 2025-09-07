import "react-native-reanimated";
import "react-native-gesture-handler";

import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { ThemeProvider } from "./src/theme/ThemeProvider";
import { GlobalProvider } from "./src/context/GlobalContext";
import Main from "./src/_layout/Main";
import { AuthProvider } from "./src/context/AuthContext";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <GlobalProvider>
          <ThemeProvider>
            <AuthProvider>
              <BottomSheetModalProvider>
                <Toast />
                <Main />
              </BottomSheetModalProvider>
            </AuthProvider>
          </ThemeProvider>
        </GlobalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
