import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { verifyOtp } from "../../services/registerApi";

export default function OtpVerificationScreen({ route, navigation }: any) {
  const { email } = route.params; // 从 ForgotPassword 页面传过来的
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp(email, otp);
      if (res.success) {
        Alert.alert("成功", "OTP 验证成功，请重置密码");
        navigation.navigate("ResetPassword", { email }); // ✅ 传 email
      } else {
        Alert.alert("失败", res.message || "OTP 验证失败");
      }
    } catch (err) {
      Alert.alert("错误", "服务器异常");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>输入发送到 {email} 的 OTP:</Text>
        <TextInput
          style={styles.input}
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          placeholder="请输入 OTP"
        />
        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
          <Text style={styles.buttonText}>验证 OTP</Text>
        </TouchableOpacity>

        {/* 👇 返回上一页按钮 */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>返回上一页</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F1E8', // Cream/beige background matching the image
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#8B7355',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#E1C16E', // Golden color matching the image
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#D4AF37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  backText: {
    textAlign: 'center',
    color: '#000000ff',
    fontSize: 16,
  },
});