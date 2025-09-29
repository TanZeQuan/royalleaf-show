export interface Voucher {
  id: number;
  code: string;
  value: string;
  date: string;
  amount: string;
  expired: boolean;
  status: "active" | "expired" | "used" | string;
  pointsNeeded?: number; 
}

export interface HistoryItem {
  id: number;
  action?: string;
  item?: string;
  date: string;
  points: string;
  balance: number;
}

export interface Coupon {
  id: number;
  couponId: string;
  name: string;
  code: string;
  limit: number;
  max: number;
  listing: string;
  amount: number;
  isFixed: number;
  duration: number;
  isUsers: number;
  isStatus: number;
  isDelete: number;
  createdBy: string;
  createdAt: string;
  modifyAt: string;
  expireTime: string;
  isAvailable: boolean;
  hasUsageLimit: boolean;
  isForAllUsers: boolean;
}

export interface CouponResponse {
  success: boolean;
  message: string;
  data: Coupon[];
  count: number;
  timestamp: number;
}