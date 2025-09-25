import axios from "axios";

const BASE_URL = "http://192.168.0.241:8080/royal";

// 创建 axios 实例
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// ====================== 用户注册/登录 ======================
export const registerUser = async (data: {
  username: string;
  passcode: string;
  name: string;
  phone: string;
  email: string;
  referral?: string;
  dob?: string;
  address?: string;
}) => {
  try {
    const response = await api.post("/register", data);
    return response.data;
  } catch (error: any) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (data: { username: string; passcode: string }) => {
  try {
    const response = await api.post("/login", data);
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

// ====================== OTP ======================
export const sendOtp = async (email: string, phone?: string) => {
  try {
    const response = await api.post("/send_otp", { email, ...(phone ? { phone } : {}) });
    return response.data;
  } catch (error: any) {
    console.error("Send OTP error:", error.response?.data || error.message);
    throw error;
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await api.post("/validate_otp", { email, otp });
    return response.data;
  } catch (error: any) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw error;
  }
};

// ====================== 密码重置 ======================
// 强制重置密码（忘记密码）
export const resetPassword = async (data: { email: string; new_passcode: string }) => {
  try {
    const response = await api.post("/force_reset_password", data);
    return response.data;
  } catch (error: any) {
    console.error("Reset Password error:", error.response?.data || error.message);
    throw error;
  }
};

// 用户在个人资料内修改密码
export const profileResetPassword = async ({
  user_id,
  current_passcode,
  new_passcode,
}: {
  user_id: string;
  current_passcode: string;
  new_passcode: string;
}) => {
  try {
    // ✅ 去掉首尾空格
    const payload = {
      user_id: user_id.trim(),
      current_passcode: current_passcode.trim(),
      new_passcode: new_passcode.trim(),
    };

    console.log("Profile Reset Payload:", payload);

    const response = await api.post(
      `${BASE_URL}/profile_reset_password`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Profile Reset Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Profile Reset Password error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ====================== 用户资料 ======================
export const viewProfile = async (user_id: string) => {
  try {
    const response = await api.post("/view_profile", { user_id });
    return response.data;
  } catch (error: any) {
    console.error("View Profile error:", error.response?.data || error.message);
    throw error;
  }
};

export const editProfile = async (data: {
  user_id: string;
  username?: string;
  name?: string;
  address?: string;
  gender?: number;
  dob?: string;
}) => {
  try {
    const response = await api.post("/edit_profile", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Edit Profile error:", error.response?.data || error.message);
    throw error;
  }
};

// ====================== 文件上传/查看 ======================
export const uploadFile = async (
  user_id: string,
  fileInfo: { uri: string; type: string; name: string }
) => {
  try {
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("file", {
      uri: fileInfo.uri,
      type: fileInfo.type,
      name: fileInfo.name,
    } as any);

    const response = await api.post("/upload_file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error: any) {
    console.error("Upload file error:", error.response?.data || error.message);
    throw error;
  }
};

export const viewFiles = async (user_id: string) => {
  try {
    const response = await api.get("/view_image", {
      params: { user_id },
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    console.error("View Files error:", error.response?.data || error.message);
    throw error;
  }
};

export default api;
