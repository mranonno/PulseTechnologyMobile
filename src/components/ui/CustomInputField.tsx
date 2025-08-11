import React from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Text,
} from "react-native";
import { useThemeContext } from "../../theme/ThemeProvider";

interface CustomInputFieldProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  required?: boolean;
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  required = false,
  style,
  ...rest
}) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      ) : null}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.placeholder}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      width: "100%",
    },
    label: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 4,
      flexDirection: "row",
      alignItems: "center",
    },
    required: {
      color: "red",
      fontWeight: "700",
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      color: colors.text,
      fontSize: 15,
      backgroundColor: colors.card,
    },
  });

export default CustomInputField;
