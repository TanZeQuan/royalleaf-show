import api from "../apiClient";


// ProfileInfo Api
export const viewProfile = async (user_id: any) => {
  try {
    const response = await fetch("http://192.168.0.241:8080/royal/view_profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
    });

    return await response.json();
  } catch (error) {
    console.error("View Profile API Error:", error);
    return { success: false, message: "Network or server error" };
  }
};


// EditProfile Api
interface EditProfileData {
  user_id: string;
  username?: string;
  name?: string;
  image?: any; // file, e.g., from ImagePicker
  address?: string;
  gender?: number;
  dob?: string; // YYYY-MM-DD
}

export const editUserProfile = async (data: EditProfileData) => {
  try {
    const formData = new FormData();

    // Required
    formData.append("user_id", data.user_id);

    // Optional fields
    if (data.username !== undefined) formData.append("username", data.username);
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.address !== undefined) formData.append("address", data.address);
    if (data.gender !== undefined) formData.append("gender", data.gender.toString());
    if (data.dob !== undefined) formData.append("dob", data.dob);

    // Image file handling
    if (data.image) {
      formData.append("image", {
        uri: data.image.uri,
        name: data.image.fileName || "profile.jpg",
        type: data.image.type || "image/jpeg",
      } as any);
    }

    const response = await api.post("http://192.168.0.241:8080/royal/edit_profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Edit User Profile error:", error.response?.data || error.message);
    throw error;
  }
};

// ResetPassword 
export interface ProfileResetPasswordRequest {
  user_id: number;
  current_passcode: string;
  new_passcode: string;
}

// ✅ 函数实现
export const resetPassword = async (data: ProfileResetPasswordRequest) => {
  try {
    const response = await api.post(
      `http://192.168.0.241:8080/royal/profile_reset_password`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "服务器异常");
  }
};

