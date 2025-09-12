import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function VoucherScreen() {
  return (
    <View style={styles.container}>
      <Text>Voucher Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
