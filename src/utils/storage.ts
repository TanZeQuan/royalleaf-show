import AsyncStorage from "@react-native-async-storage/async-storage";

// 用户接口
export interface User {
  id: string;
  user_id: string;
  username: string;
  wallet_balance?: number;
  crown?: number;
  image?: string;
  token?: string | null;
}

// 获取任意 key 的值
export const getItem = async <T = string>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T; // 如果是 JSON，解析
    } catch {
      return value as unknown as T; // 普通字符串
    }
  } catch (e) {
    console.error("❌ Error reading storage:", e);
    return null;
  }
};

// 存储任意 key 的值
export const setItem = async (key: string, value: any): Promise<void> => {
  try {
    const toStore = typeof value === "string" ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, toStore);
  } catch (e) {
    console.error("❌ Error saving storage:", e);
  }
};

// 移除某个 key
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error("❌ Error removing storage:", e);
  }
};

// 清空所有存储
export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error("❌ Error clearing storage:", e);
  }
};

// 获取用户信息
export const getUserData = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem("userData");
    if (!userData) return null;

    const parsed = JSON.parse(userData);
    return {
      id: parsed.id || parsed.user_id || "",
      user_id: parsed.user_id || parsed.id || "",
      username: parsed.username || "",
      wallet_balance: parsed.wallet_balance ?? 0,
      crown: parsed.crown ?? 0,
      image: parsed.image,
      token: parsed.token ?? null,
    };
  } catch (error) {
    console.error("❌ Error getting user data:", error);
    return null;
  }
};

// 保存用户信息
export const setUserData = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem("userData", JSON.stringify(user));
  } catch (error) {
    console.error("❌ Error saving user data:", error);
  }
};
