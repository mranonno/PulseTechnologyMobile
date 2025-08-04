import React, {
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeContext } from "../../theme/ThemeProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "../../utils/commonFunction";

export type AddSoldProductModalRef = {
  present: () => void;
  dismiss: () => void;
};

const AddSoldProductModal = forwardRef<AddSoldProductModalRef>((_, ref) => {
  const { colors } = useThemeContext();
  const { bottom } = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // States for inputs
  const [productName, setProductName] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [price, setPrice] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const [date, setDate] = useState(new Date());
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePresent = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismiss = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setIsDateSelected(true);
    }
  };

  const resetForm = () => {
    setProductName("");
    setModel("");
    setSerial("");
    setPrice("");
    setCustomerName("");
    setContact("");
    setAddress("");
    setNote("");
    setDate(new Date());
    setIsDateSelected(false);
  };

  useImperativeHandle(ref, () => ({
    present: handlePresent,
    dismiss: () => bottomSheetModalRef.current?.dismiss(),
  }));

  return (
    <BottomSheetModal
      name="AddSoldProductModal"
      ref={bottomSheetModalRef}
      snapPoints={["80%"]}
      enablePanDownToClose
      onDismiss={handleDismiss}
      enableDynamicSizing={false}
      handleIndicatorStyle={styles.handleBar}
      style={{ zIndex: 10 }}
      backgroundStyle={{ backgroundColor: colors.card, borderRadius: 24 }}
      backdropComponent={({ animatedIndex, animatedPosition }) => (
        <BottomSheetBackdrop
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          animatedIndex={animatedIndex}
          animatedPosition={animatedPosition}
          pressBehavior="close"
        />
      )}
    >
      <Text style={styles.title}>Sold Product</Text>
      <BottomSheetScrollView
        keyboardDismissMode={"on-drag"}
        contentContainerStyle={styles.container}
      >
        {/* Product Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛒 Product Details</Text>

          <TextInput
            value={productName}
            onChangeText={setProductName}
            placeholder="Name"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
          />
          <TextInput
            value={model}
            onChangeText={setModel}
            placeholder="Model"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
          />
          <TextInput
            value={serial}
            onChangeText={setSerial}
            placeholder="S/N"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
          />
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="Price"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.input, styles.dateInput]}
          >
            <Text
              style={{
                color: isDateSelected ? colors.text : colors.placeholder,
              }}
            >
              {isDateSelected ? formatDate(date) : "Select date"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={colors.placeholder}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
            />
          )}
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Customer Details</Text>
          <TextInput
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Name"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
          />
          <TextInput
            value={contact}
            onChangeText={setContact}
            placeholder="Contact no"
            keyboardType="phone-pad"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
          />
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
          />
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Description</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Optional notes..."
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={3}
            style={[styles.input, { textAlignVertical: "top", height: 80 }]}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              resetForm();
              handleDismiss();
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => {
              // 👉 API call or submit logic here
              resetForm();
              bottomSheetModalRef.current?.dismiss();
            }}
          >
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default AddSoldProductModal;

// Style generator
const getStyles = (colors: Colors, bottom: number) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingBottom: bottom,
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 16,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
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
    dateInput: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    cancelBtn: {
      flex: 1,
      padding: 12,
      borderRadius: 10,
      borderColor: colors.primary,
      borderWidth: 1,
      marginRight: 8,
      alignItems: "center",
    },
    cancelText: {
      color: colors.primary,
      fontWeight: "500",
    },
    confirmBtn: {
      flex: 1,
      padding: 12,
      backgroundColor: colors.primary,
      borderRadius: 10,
      alignItems: "center",
      marginLeft: 8,
    },
    confirmText: {
      color: colors.pureWhite,
      fontWeight: "600",
    },
    handleBar: { backgroundColor: colors.primary, width: 50 },
  });
