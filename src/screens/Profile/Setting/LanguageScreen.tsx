import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SettingStackParamList } from "../../../navigation/stacks/SettingStack";

type LanguageScreenRouteProp = RouteProp<SettingStackParamList, "SettingLanguage">;

export default function LanguageScreen() {
  const route = useRoute<LanguageScreenRouteProp>();
  const { category } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language Settings</Text>
      <Text>Category: {category}</Text>
      {/* TODO: Add language selection */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
});
