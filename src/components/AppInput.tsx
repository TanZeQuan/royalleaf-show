import React from "react";
import { TextInput, StyleSheet, View } from "react-native";

type Props = { value: string; onChangeText: (text: string) => void; placeholder?: string; secureTextEntry?: boolean };

export default function AppInput({ value, onChangeText, placeholder, secureTextEntry }: Props) {
  return (
    <View style={styles.wrapper}>
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} placeholder={placeholder} secureTextEntry={secureTextEntry} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%", marginVertical: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, fontSize: 16 },
});
