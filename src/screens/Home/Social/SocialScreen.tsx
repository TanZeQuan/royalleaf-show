import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../navigation/stacks/HomeStack";

type SocialScreenNavProp = NativeStackNavigationProp<HomeStackParamList, "Social">;

export default function SocialScreen() {
  const navigation = useNavigation<SocialScreenNavProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌐 Social Page</Text>
      <Text style={styles.subtitle}>这里是社交页面，你可以在这里展示社区或互动内容。</Text>

      <Button title="⬅ Back to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
});
