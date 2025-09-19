import api from "../apiClient";

// ✅ 注册
export const registerUser = async (data: {
  username: string;
  passcode: string;
  name: string;
  phone: string;
  email: string;
  referral: string;
  dob: string;
  address: string;
}) => {
  try {
    const response = await api.post("http://192.168.0.241:8080/rl/register", data);
    return response.data;
  } catch (error: any) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 登录
export const loginUser = async (data: { username: string; passcode: string }) => {
  try {
    const response = await api.post("http://192.168.0.241:8080/rl/login", data);
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 发送 OTP (忘记密码用)
export const sendOtp = async (email: string, phone?: string) => {
  try {
    const response = await api.post("http://192.168.0.241:8080/rl/send_otp", {
      email,
      ...(phone ? { phone } : {}), // phone 可选
    });
    return response.data;
  } catch (error: any) {
    console.error("Send OTP error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 验证 OTP
export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await api.post("http://192.168.0.241:8080/rl/validate_otp", {
      email,
      otp,
    });
    return response.data;
  } catch (error: any) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 强制重置密码
export const resetPassword = async (data: { email: string; new_passcode: string }) => {
  try {
    const response = await api.post(
      "http://192.168.0.241:8080/rl/force_reset_password",
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Reset Password error:", error.response?.data || error.message);
    throw error;
  }
};



