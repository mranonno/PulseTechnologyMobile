import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { checkForUpdate } from "../utils/checkForUpdate";

const UpdateCheckScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check for Update</Text>
      <Button title="Check OTA Update" onPress={checkForUpdate} />
    </View>
  );
};

export default UpdateCheckScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
