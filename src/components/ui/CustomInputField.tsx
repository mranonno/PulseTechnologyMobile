// CustomInputField.tsx
import React from "react";
import { TextInput, StyleSheet, TextInputProps, View } from "react-native";
import { useThemeContext } from "../../theme/ThemeProvider";

interface CustomInputFieldProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  style,
  ...rest
}) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
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
