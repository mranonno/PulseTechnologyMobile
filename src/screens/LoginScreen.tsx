import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { saveObject, signOut } from "../utils/commonFunction";
import axiosInstance from "../constant/axios";
import { useThemeContext } from "../theme/ThemeProvider";

const SignInScreen: React.FC = () => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const validateEmail = (text: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  const handleSignIn = (): void => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.length >= 6;

    setEmailError(!isEmailValid);
    setPasswordError(!isPasswordValid);

    if (isEmailValid && isPasswordValid) {
      axiosInstance
        .post("/user/login", { email, password })
        .then((res) => {
          if (res.data.success) {
            router.dismissAll();
            router.push("/(tabs)");
            saveObject("user", res.data.user);
          } else {
            Alert.alert("Error", "Invalid email or password");
          }
        })
        .catch((error) => {
          router.push("/signin");
          Alert.alert(
            "Login Failed",
            error.response?.data?.message || "Something went wrong"
          );
          signOut();
        });
    } else {
      Alert.alert("Error", "Please fix the errors and try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.pureWhite} />
        </TouchableOpacity>
        <Text style={styles.title}>Sign in to your account!</Text>
      </View>

      <View style={styles.subContainer}>
        <TextInput
          style={[styles.input, emailError && styles.errorBorder]}
          placeholder="Email"
          placeholderTextColor={colors.mutedText}
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text.toLowerCase());
            setEmailError(false);
          }}
          autoCapitalize="none"
        />
        {emailError && (
          <Text style={styles.errorText}>Invalid email format</Text>
        )}

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, passwordError && styles.errorBorder]}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(false);
            }}
            placeholderTextColor={colors.mutedText}
          />
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowPassword((prevState) => !prevState)}
          >
            <Text style={styles.toggleButtonText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>
        {passwordError && (
          <Text style={styles.errorText}>
            Password must be at least 6 characters
          </Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    backButton: {
      backgroundColor: colors.primary,
      borderRadius: 40,
      position: "absolute",
      top: 50,
      left: 20,
      zIndex: 1,
      padding: 10,
    },
    imageContainer: {
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      height: "60%",
      borderRadius: 20,
    },
    subContainer: {
      backgroundColor: colors.primary,
      padding: 30,
      marginTop: -50,
      width: "90%",
      alignSelf: "center",
      borderRadius: 20,
      gap: 10,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "flex-start",
      position: "relative",
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
      color: colors.primary,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 100,
      paddingHorizontal: 10,
      height: 50,
      width: "100%",
      color: colors.mutedText,
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    toggleButton: {
      paddingHorizontal: 10,
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: "center",
    },
    toggleButtonText: {
      color: "#007BFF",
      fontWeight: "bold",
    },
    errorBorder: {
      borderColor: "red",
    },
    errorText: {
      color: "red",
      marginBottom: 10,
    },
    button: {
      backgroundColor: "#007BFF",
      padding: 15,
      borderRadius: 100,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default SignInScreen;
