import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet} from "react-native";
import { resetPassword } from "../../services/registerApi";
import { SafeAreaView } from "react-native-safe-area-context";

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
        Alert.alert("成功", "密码重置成功，请登录");
        navigation.navigate("Login");
      } else {
        Alert.alert("失败", res.message || "重置失败");
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
  safeArea: { flex: 1, backgroundColor: '#F5F1E8' },
  container: { flex: 1, justifyContent: 'center', padding: 20, paddingBottom: 100 },
  title: { fontSize: 18, fontWeight: '500', color: '#8B7355', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 30, fontSize: 16, color: '#333', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  button: { backgroundColor: '#E1C16E', padding: 15, borderRadius: 12, shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 },
  backText: { textAlign: "center", color: "#007BFF", fontWeight: "500" },
});
