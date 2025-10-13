import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { profileResetPassword, viewProfile } from "../../../../services/UserService/userApi";

// 🔹 可复用密码输入框组件
const PasswordInput = ({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <View style={styles.lockIconContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" />
        </View>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function ResetPasswordScreen() {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔹 获取登录用户信息
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (!storedUser) {
          Alert.alert("请先登录");
          navigation.goBack();
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const user_id = parsedUser.user_id || parsedUser.id;

        if (!user_id) {
          Alert.alert("用户信息不完整");
          navigation.goBack();
          return;
        }

        // 可选：用 viewProfile 验证用户是否存在
        const res = await viewProfile(user_id);
        if (!res.success) {
          Alert.alert(res.message || "用户信息获取失败");
          navigation.goBack();
          return;
        }

        setUserId(user_id);
      } catch (err) {
        console.error("Error getting user info:", err);
        Alert.alert("获取用户信息失败，请重试");
        navigation.goBack();
      }
    };
    fetchUser();
  }, []);

  const handleReset = async () => {
    if (!oldPassword.trim() || !newPassword.trim()) {
      Alert.alert("请填写完整的密码");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("新密码至少需要6位");
      return;
    }

    try {
      setLoading(true); // 开始加载
      const storedUser = await AsyncStorage.getItem("userData");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      const user_id = parsedUser.user_id || parsedUser.id;

      const res = await profileResetPassword({
        user_id,
        current_passcode: oldPassword.trim(),
        new_passcode: newPassword.trim(),
      });

      if (res.success) {
        Alert.alert("成功", "密码修改成功 ✅", [
          {
            text: "确定",
            onPress: () => navigation.goBack(), // ✅ 成功后返回上一页
          },
        ]);
      } else {
        Alert.alert("失败", res.message);
      }
    } catch (err: any) {
      Alert.alert("错误", err.message || "修改失败");
    } finally {
      setLoading(false); // 结束加载
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F5EC" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#2C2C2C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>更改密码</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 输入框 */}
        <View style={styles.inputSection}>
          <PasswordInput
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder="旧密码"
          />
          <PasswordInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="新密码"
          />
        </View>

        {/* 重置按钮 */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.resetButtonText}>更改密码</Text>
              <View style={styles.lockButtonIcon}>
                <Ionicons name="lock-closed" size={16} color="#fff" />
              </View>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9F5EC" },
  container: { flex: 1, padding: 24 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 40 },
  backButton: {
    padding: 5, width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "500", color: "#2C2C2C" },
  headerSpacer: { width: 24 },
  inputSection: { marginBottom: 24 },
  inputContainer: { marginBottom: 16 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lockIconContainer: { paddingRight: 12 },
  textInput: { flex: 1, height: 52, color: "#333", fontSize: 14 },
  eyeIcon: { paddingLeft: 12 },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D4AF37",
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  resetButtonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  lockButtonIcon: { marginLeft: 8 },
});