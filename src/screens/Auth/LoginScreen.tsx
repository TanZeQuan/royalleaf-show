import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '@services/UserService/userApi';
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginScreenProps {
  navigation: any;
  onLogin: (username: string) => void;
}

const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation, onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("错误", "请输入用户名和密码");
      return false;
    }
    return true;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await loginUser({
        username: username.trim(),
        passcode: password,
      });

      if (response.success) {
        // 🔹 统一保存
        const userData = {
          user_id: response.data?.user_id,    // ✅ 来自 response.data
          username: response.data?.username,
          token: response.token ?? null,
        };

        // login screen 成功后
         await AsyncStorage.setItem("userData", JSON.stringify(userData));

        // 👉 保持 onLogin 传 username（如果你只想改 Profile，就不用动 AppNavigator）
        onLogin(userData.username);

        // Alert.alert("✅ 登录成功", response.message || "欢迎回来！");
      } else {
        Alert.alert("❌ 登录失败", response.message || "账号或密码错误");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      Alert.alert("错误", error.response?.data?.message || error.message || "登录失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform: string): void => {
    Alert.alert("Coming Soon", `${platform} login will be available soon!`);
  };

  const navigateToForgotPassword = (): void => {
    navigation.navigate("ForgetPassword");
  };

  const navigateToRegister = (): void => {
    navigation.navigate("Register");
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Background Pattern */}
          <Image
            source={require('assets/icons/login-bg.png')}
            style={styles.backgroundPattern}
            resizeMode="cover"
          />
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require('assets/icons/New-Login-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Welcome Section
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.appName}>Royal Leaf</Text>
            <Text style={styles.subtitle}>Sign in to continue to your account</Text>
          </View> */}

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Image
                source={require('assets/icons/login-user.png')}
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.input}
                placeholder="输入您的电子邮件或电话号码"
                placeholderTextColor="#B4B4B4"
                value={username}
                onChangeText={setUsername}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="email-input"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Image
                source={require('assets/icons/login-pass.png')}
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.input}
                placeholder="输入您的密码"
                placeholderTextColor="#B4B4B4"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                testID="password-input"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={height * 0.025} // responsive size
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword} onPress={navigateToForgotPassword}>
            <Text style={styles.forgotPasswordText}>忘记密码?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            testID="login-button"
          >
            <Text style={styles.loginButtonText}>
              {loading ? "登录中..." : "登录"}
            </Text>
          </TouchableOpacity>

          {/* Social Login */}
          <View style={styles.socialSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>或登录</Text>
              <View style={styles.divider} />
            </View>

            {/* First row */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Google")}
              >
                <Image
                  source={require('assets/icons/login-google.png')}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Apple")}
              >
                <Image
                  source={require('assets/icons/login-apple.png')}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Second row */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Facebook")}
              >
                <Image
                  source={require('assets/icons/login-facebook.png')}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Instagram")}
              >
                <Image
                  source={require('assets/icons/login-ins.png')}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <Text style={styles.socialButtonText}>Instagram</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Register */}
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>还没有账户?</Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.registerLink}>注册</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f2eaff',
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backgroundPattern: {
    position: 'absolute',
    top: -80,
    left: -20,
    right: 0,
    height: height * 0.35,
    width: width,
    opacity: 0.12,
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: height * 0.25,
    height: height * 0.25,
    marginTop: 30,
    alignSelf: "center",
  },

  // brandName: {
  //   fontSize: height * 0.02,
  //   fontWeight: 'bold',
  //   color: '#8B4513',
  // },
  // brandSubtitle: {
  //   fontSize: height * 0.012,
  //   color: '#8B4513',
  //   letterSpacing: 1,
  // },
  // welcomeSection: {
  //   alignItems: 'center',
  // },
  // welcomeText: {
  //   fontSize: height * 0.03,
  //   color: '#000000ff',
  //   fontWeight: 'bold',
  //   marginBottom: height * 0.005,
  // },
  // appName: {
  //   fontSize: height * 0.04,
  //   fontWeight: 'bold',
  //   color: '#2c2c2c',
  //   marginBottom: height * 0.01,
  // },
  // subtitle: {
  //   fontSize: height * 0.018,
  //   color: '#626B73',
  //   textAlign: 'center',
  //   marginBottom: height * 0.03,
  // },
  inputContainer: {
    marginBottom: height * 0.001,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    marginBottom: height * 0.013,
    paddingHorizontal: 23,
    paddingVertical: height * 0.020,
    shadowColor: '#000',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 5 },
        shadowOpacity: 0.28,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  inputIcon: {
    width: height * 0.030,  // adjust size as needed
    height: height * 0.025,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: height * 0.018,
    color: '#2c2c2ca6',
  },
  eyeIcon: {
    padding: 5,
  },
  eyeIconText: {
    fontSize: height * 0.018,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: height * 0.02,
  },
  forgotPasswordText: {
    color: '#080808ff',
    fontSize: height * 0.018,
  },
  loginButton: {
    backgroundColor: '#E1C16E',
    borderRadius: 25,
    paddingVertical: height * 0.016,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#000000ff',
    fontSize: height * 0.022,
    textAlign: 'center',
    fontFamily: "Inter-Medium",
  },
  socialSection: {},
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.020,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#9D9D9B',
    fontSize: height * 0.018,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.012,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: height * 0.015,
    width: '48%',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 5 },
        shadowOpacity: 0.30,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  socialIcon: {
    width: height * 0.025, // responsive width
    height: height * 0.025, // responsive height
    marginRight: 8,
    marginLeft: 20,
  },
  socialButtonText: {
    fontSize: height * 0.018,
    color: '#7C838A',
    fontWeight: '500',
  },
  registerSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#5F6734",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
});