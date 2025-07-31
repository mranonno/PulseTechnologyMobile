import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkColors } from "./darkColors";
import { lightColors } from "./lightColors";
import { fonts } from "../constant/fonts";

type ThemeType = "light" | "dark" | "system";

interface ThemeContextProps {
  theme: ThemeType;
  colors: typeof lightColors;
  setTheme: (theme: ThemeType) => void;
  fonts: typeof fonts;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>("system");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem("@theme");
        if (stored === "light" || stored === "dark" || stored === "system") {
          setThemeState(stored);
        }
      } catch (error) {
        console.warn("Failed to load theme from storage:", error);
      }
    };
    loadTheme();
  }, []);

  const setTheme = useCallback(async (newTheme: ThemeType) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem("@theme", newTheme);
    } catch (error) {
      console.warn("Failed to save theme to storage:", error);
    }
  }, []);

  const resolvedTheme =
    theme === "system" ? (systemScheme === "dark" ? "dark" : "light") : theme;

  const colors = useMemo(
    () => (resolvedTheme === "light" ? lightColors : darkColors),
    [resolvedTheme]
  );

  const value = useMemo(
    () => ({
      theme,
      colors,
      setTheme,
      fonts,
    }),
    [theme, colors, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};