import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ConfirmPaymentScreen() {
  return (
    <View style={styles.container}>
      <Text>Confirm Payment Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
