// storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// 添加用户接口
export interface User {
  user_id: string;
  username: string;
  wallet_balance?: number;
  crown?: number;
  image?: string;
}

export const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.log('Error reading storage', e);
    return null;
  }
};

export const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log('Error saving storage', e);
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log('Error removing storage', e);
  }
};

// 新增：获取用户信息的辅助函数
export const getUserData = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) return null;
    
    const parsed = JSON.parse(userData);
    // 确保返回的数据符合User接口
    return {
      user_id: parsed.user_id || parsed.id || '',
      username: parsed.username || '',
      wallet_balance: parsed.wallet_balance || 0,
      crown: parsed.crown || 0,
      image: parsed.image
    };
  } catch (error) {
    console.log('Error getting user data', error);
    return null;
  }
};

// 新增：保存用户信息
export const setUserData = async (user: User) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(user));
  } catch (error) {
    console.log('Error saving user data', error);
  }
};