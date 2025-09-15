import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../navigation/stacks/HomeStack";

type VoteScreenNavProp = NativeStackNavigationProp<HomeStackParamList, "Vote">;

export default function VoteScreen() {
  const navigation = useNavigation<VoteScreenNavProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗳️ Vote Page</Text>
      <Text style={styles.subtitle}>这里是投票页面，你可以在这里展示投票功能。</Text>

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
