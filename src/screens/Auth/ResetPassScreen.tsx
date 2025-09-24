import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { resetPassword } from "services/UserService/userApi";

export default function ResetPasswordScreen({ route, navigation }: any) {
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert("错误", "请输入新密码");
      return;
    }

    try {
      const res = await resetPassword({ email, new_passcode: newPassword });
      if (res.success) {
        Alert.alert("✅ 成功", "密码重置成功，请登录");
        navigation.navigate("Login");
      } else {
        Alert.alert("❌ 失败", res.message || "重置失败");
      }
    } catch (err: any) {
      Alert.alert("网络错误", err.message || "服务器异常");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>为 {email} 设置新密码:</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="请输入新密码"
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>确认重置</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: "#E1C16E", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
