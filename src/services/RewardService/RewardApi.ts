import axios from 'axios';
import { Coupon, CouponResponse, Voucher } from "../../screens/Home/Reward/RewardSlice";

const API_BASE_URL = "http://192.168.0.122:8080/royal/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAllCoupons = async (): Promise<Coupon[]> => {
  try {
    const response = await apiClient.get<CouponResponse>('/coupons/for-all-users');
    const data = response.data;

    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch coupons');
    } 
  } catch (error) {
    console.error('Error fetching coupons:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请检查网络连接');
      } else if (error.response) {
        throw new Error(`服务器错误: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('无法连接到服务器，请检查网络');
      }
    }
    throw error;
  }
};

// 将 API 数据转换为应用中的 Voucher 格式
export const convertToVoucher = (coupon: Coupon): Voucher => {
  // 如果API没有提供皇冠积分信息，默认设为0
  const pointsNeeded = 0;

  return {
    id: coupon.id,
    code: coupon.name,
    value: `RM ${coupon.amount}`,
    amount: coupon.amount.toString(),
    date: new Date(coupon.expireTime).toLocaleDateString('en-GB'),
    expired: !coupon.isAvailable || new Date(coupon.expireTime) < new Date(),
    status: coupon.isAvailable ? "active" : "expired",
    pointsNeeded: pointsNeeded
  };
};