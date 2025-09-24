import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { sendOtp } from "services/UserService/userApi";

type ForgetPasswordNavProp = NativeStackNavigationProp<
  AuthStackParamList,
  "ForgetPassword"
>;

export default function ForgetPasswordScreen() {
  const navigation = useNavigation<ForgetPasswordNavProp>();
  const [email, setEmail] = useState("");

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert("错误", "请输入邮箱");
      return;
    }

    try {
      const res = await sendOtp(email);
      if (res.success) {
        Alert.alert("✅ 成功", "验证码已发送到邮箱");
        navigation.navigate("OtpVerify", { email });
      } else {
        Alert.alert("❌ 失败", res.message || "发送验证码失败");
      }
    } catch (err: any) {
      Alert.alert("网络错误", err.message || "服务器异常");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>忘记密码</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入您的邮箱"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
          <Text style={styles.buttonText}>发送验证码</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>返回登录</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f2eaff" },
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: "#E1C16E", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loginText: { marginTop: 20, textAlign: "center", color: "#666" },
});
