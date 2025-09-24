import api from "../apiClient";

const BASE_URL = "http://192.168.0.241:8080/royal";

// ✅ 注册
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
    const response = await api.post(`${BASE_URL}/register`, data);
    return response.data;
  } catch (error: any) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 登录
export const loginUser = async (data: { username: string; passcode: string }) => {
  try {
    const response = await api.post(`${BASE_URL}/login`, data);
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 发送 OTP (忘记密码)
export const sendOtp = async (email: string, phone?: string) => {
  try {
    const response = await api.post(`${BASE_URL}/send_otp`, { email, ...(phone ? { phone } : {}) });
    return response.data;
  } catch (error: any) {
    console.error("Send OTP error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 验证 OTP
export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await api.post(`${BASE_URL}/validate_otp`, { email, otp });
    return response.data;
  } catch (error: any) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 强制重置密码（忘记密码用）
export const resetPassword = async (data: { email: string; new_passcode: string }) => {
  try {
    const response = await api.post(`${BASE_URL}/force_reset_password`, data);
    return response.data;
  } catch (error: any) {
    console.error("Reset Password error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 查看用户资料
export const viewProfile = async (user_id: string, token: any) => {
  try {
    const response = await api.post(`${BASE_URL}/view_profile`, { user_id });
    return response.data;
  } catch (error: any) {
    console.error("View Profile error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 获取用户资料
export const getUserProfile = async (user_id: string, token: string) => {
  try {
    const response = await api.post("http://192.168.0.241:8080/royal/profile", {
      user_id,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Get Profile error:", error.response?.data || error.message);
    throw error;
  }
};


// ✅ 编辑用户资料
// 定义 RN 的图片上传类型
type RNFile = {
  uri: string;
  type: string;
  name: string;
};

export const editProfile = async (data: {
  user_id: string;
  username?: string;
  name?: string;
  address?: string;
  gender?: number;
  dob?: string;
  image?: RNFile; // ✅ RN 里用这个，而不是 File
}) => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    const response = await api.post(`${BASE_URL}/edit_profile`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error: any) {
    console.error("Edit Profile error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 用户在个人资料内修改密码
export const profileResetPassword = async (data: {
  user_id: string;
  current_passcode: string;
  new_passcode: string;
}) => {
  try {
    const response = await api.post(`${BASE_URL}/profile_reset_password`, data);
    return response.data;
  } catch (error: any) {
    console.error("Profile Reset Password error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 上传文件
export const uploadFile = async (user_id: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("file", file);

    const response = await api.post(`${BASE_URL}/upload_file`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error: any) {
    console.error("Upload File error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 查看文件
export const viewFiles = async (user_id: string) => {
  try {
    const response = await api.get(`${BASE_URL}/view_image`, { params: { user_id } });
    return response.data;
  } catch (error: any) {
    console.error("View Files error:", error.response?.data || error.message);
    throw error;
  }
};
