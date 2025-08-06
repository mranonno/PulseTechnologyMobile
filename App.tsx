// App.tsx
import "react-native-reanimated";
import "react-native-gesture-handler";

import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { ThemeProvider } from "./src/theme/ThemeProvider";
import Main from "./src/_layout/Main";

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <ThemeProvider>
            <Main />
          </ThemeProvider>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
