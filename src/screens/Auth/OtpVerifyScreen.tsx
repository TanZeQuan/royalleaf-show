import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { verifyOtp } from "services/UserService/userApi";

export default function OtpVerifyScreen({ route, navigation }: any) {
  const { email } = route.params;
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert("错误", "请输入验证码");
      return;
    }

    try {
      const res = await verifyOtp(email, otp);
      if (res.success) {
        Alert.alert("✅ 验证成功", "请设置新密码");
        navigation.navigate("ResetPassword", { email });
      } else {
        Alert.alert("❌ 验证失败", res.message || "验证码错误或已过期");
      }
    } catch (err: any) {
      Alert.alert("网络错误", err.message || "服务器异常");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>输入发送到 {email} 的验证码:</Text>
        <TextInput
          style={styles.input}
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          placeholder="请输入验证码"
        />
        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
          <Text style={styles.buttonText}>验证验证码</Text>
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
