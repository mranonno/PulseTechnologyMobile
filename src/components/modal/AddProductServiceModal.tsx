import React, { forwardRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import GlobalBottomSheetModal from "./GlobalBottomSheetModal";
import { useThemeContext } from "../../theme/ThemeProvider";

const AddProductServiceModal = forwardRef<BottomSheetModal>((_, ref) => {
  const { colors } = useThemeContext();
  const styles = getStyles(colors);

  const [form, setForm] = useState({
    productName: "",
    model: "",
    serial: "",
    price: "",
    date: "",
    customerName: "",
    contact: "",
    address: "",
    description: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", form);
    (ref as React.RefObject<BottomSheetModal>)?.current?.close();
    setForm({
      productName: "",
      model: "",
      serial: "",
      price: "",
      date: "",
      customerName: "",
      contact: "",
      address: "",
      description: "",
    });
  };

  const handleCancel = () => {
    (ref as React.RefObject<BottomSheetModal>)?.current?.close();
  };

  return (
    <GlobalBottomSheetModal snapPoints={["75%", "95%"]} ref={ref}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Product Details
        </Text>

        <TextInput
          placeholder="Name"
          value={form.productName}
          onChangeText={(v) => handleChange("productName", v)}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholderTextColor={colors.mutedText}
        />

        <TextInput
          placeholder="Model"
          value={form.model}
          onChangeText={(v) => handleChange("model", v)}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholderTextColor={colors.mutedText}
        />

        <TextInput
          placeholder="S/N"
          value={form.serial}
          onChangeText={(v) => handleChange("serial", v)}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholderTextColor={colors.mutedText}
        />

        <TextInput
          placeholder="Price"
          keyboardType="numeric"
          value={form.price}
          onChangeText={(v) => handleChange("price", v)}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholderTextColor={colors.mutedText}
        />

        {/* DATE PICKER */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.input,
            {
              justifyContent: "center",
              borderColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
        >
          <Text style={{ color: form.date ? colors.text : colors.mutedText }}>
            {form.date || "Select Date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={form.date ? new Date(form.date) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (event.type === "set" && selectedDate) {
                const formattedDate = selectedDate.toISOString().split("T")[0];
                handleChange("date", formattedDate);
              }
            }}
          />
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Customer Details
        </Text>

        <TextInput
          placeholder="Customer Name"
          value={form.customerName}
          onChangeText={(v) => handleChange("customerName", v)}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholderTextColor={colors.mutedText}
        />

        <TextInput
          placeholder="Contact No"
          keyboardType="phone-pad"
          value={form.contact}
          onChangeText={(v) => handleChange("contact", v)}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholderTextColor={colors.mutedText}
        />

        <TextInput
          placeholder="Address"
          value={form.address}
          onChangeText={(v) => handleChange("address", v)}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholderTextColor={colors.mutedText}
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Description
        </Text>

        <TextInput
          placeholder="Enter description..."
          value={form.description}
          onChangeText={(v) => handleChange("description", v)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={[
            styles.textArea,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholderTextColor={colors.mutedText}
        />

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={handleCancel}
            style={[styles.button, { backgroundColor: colors.border }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.button, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText]}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GlobalBottomSheetModal>
  );
});

export default AddProductServiceModal;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingBottom: 40,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 16,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
      marginBottom: 12,
    },
    textArea: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      minHeight: 100,
      marginBottom: 20,
    },
    buttonWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
      marginBottom: 16,
    },
    button: {
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      marginHorizontal: 4,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
