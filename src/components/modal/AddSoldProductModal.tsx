import React, {
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  BackHandler,
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
import CustomInputField from "../ui/CustomInputField";
import { Product } from "../../types/types";

export type Props = {
  product?: Product;
  onSubmit: (product: Product) => void;
  onDismiss: () => void;
  loading: boolean;
};

const AddSoldProductModal = forwardRef<BottomSheetModal, Props>(
  ({ product, onSubmit, onDismiss, loading }, ref) => {
    useImperativeHandle(ref, () => bottomSheetModalRef.current!);

    const { colors } = useThemeContext();
    const { bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (isModalOpen) {
            onDismiss();
            return true;
          }
          return false;
        }
      );

      return () => backHandler.remove();
    }, [isModalOpen]);

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

    const validateForm = () => {
      if (!productName || !model || !price || !customerName || !contact) {
        Alert.alert("Missing Fields", "Please fill all required fields.");
        return false;
      }
      if (isNaN(Number(price)) || Number(price) <= 0) {
        Alert.alert("Invalid Price", "Price should be a positive number.");
        return false;
      }
      if (!/^\d{6,}$/.test(contact)) {
        Alert.alert("Invalid Contact", "Contact must be at least 6 digits.");
        return false;
      }
      return true;
    };

    const submitHandler = () => {};

    return (
      <BottomSheetModal
        name="AddSoldProductModal"
        ref={bottomSheetModalRef}
        snapPoints={["80%"]}
        enablePanDownToClose
        onDismiss={onDismiss}
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
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛒 Product Details</Text>
            <CustomInputField
              autoFocus
              placeholder="Name"
              value={productName}
              onChangeText={setProductName}
            />
            <CustomInputField
              placeholder="Model"
              value={model}
              onChangeText={setModel}
            />
            <CustomInputField
              placeholder="S/N"
              value={serial}
              onChangeText={setSerial}
            />
            <CustomInputField
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
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
                {/* {isDateSelected ? formatDate(date) : "Select date"} */}
                select date
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Customer Details</Text>
            <CustomInputField
              placeholder="Name"
              value={customerName}
              onChangeText={setCustomerName}
            />
            <CustomInputField
              placeholder="Contact no"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
            />
            <CustomInputField
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              style={{ textAlignVertical: "top", height: 80 }}
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Description</Text>
            <CustomInputField
              placeholder="Optional notes..."
              value={note}
              onChangeText={setNote}
              placeholderTextColor={colors.placeholder}
              multiline
              numberOfLines={3}
              style={{ textAlignVertical: "top", height: 80 }}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                resetForm();
                onDismiss();
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={submitHandler}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.pureWhite} />
              ) : (
                <Text style={styles.confirmText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

export default AddSoldProductModal;

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
      marginTop: 8,
      marginBottom: 12,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
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

    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    dateInput: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
