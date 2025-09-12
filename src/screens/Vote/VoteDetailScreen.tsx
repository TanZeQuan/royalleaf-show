import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function VoteDetailScreen() {
  return (
    <View style={styles.container}>
      <Text>Vote Detail Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
