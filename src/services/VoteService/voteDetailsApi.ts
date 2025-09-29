// voteDetailsApi.ts
import api from "../apiClient";
import { getUserData } from "../../utils/storage"; // 🔑 引入存储工具

const API_BASE_URL = "http://192.168.0.122:8080/royal";

export interface RouteParams {
  productId: string;
  product?: VoteProductDetails;
  activity?: any;
  category: string;
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  timeAgo: string;
  isDesigner?: boolean;
  replyTo?: string;
  replyText?: string;
}

export interface ItemData {
  image: any;
  name?: string;
  designer?: {
    name: string;
    desc: string;
  };
}

export interface VoteRequest {
  votesId: string;
  targetSubId: string;
  name: string;
  desc: string;
  image: string;
  isStatus: number;
  approveBy: string;
}

export interface VoteResponse {
  success: boolean;
  message: string;
  data: {
    voteId: string;
    votedAt: string;
  };
  timestamp: number;
}

export interface VoteProduct {
  subId: string;
  votesId: string;
  userId: string;
  voted: number;
  name: string;
  desc: string;
  image: string;
  approveBy: string;
  isStatus: number;
  isDeleted: number;
  createdAt: string;
  modifyAt: string;
  statusDescription: string;
}

export interface VoteProductDetails extends VoteProduct {
  designer?: {
    name: string;
    desc: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  count: number;
  timestamp: number;
}

export const voteActivityService = {
  // ✅ 提交投票
  submitVote: async (voteData: VoteRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const user = await getUserData();
      if (!user) {
        return { success: false, message: "用户未登录" };
      }

      const payload = {
        ...voteData,
        userId: user.user_id, // 🔑 自动加上 userId
      };

      const response = await api.post<ApiResponse<VoteResponse>>(
        `${API_BASE_URL}/votes/submit/cast`,
        payload
      );

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("投票出错:", error);
      return {
        success: false,
        message: error.response?.data?.message || "投票失败，请稍后重试",
      };
    }
  },

  // ✅ 获取投票产品详情
  getVoteProductDetails: async (subId: string): Promise<VoteProductDetails | null> => {
    try {
      const response = await api.get<ApiResponse<VoteProductDetails>>(
        `${API_BASE_URL}/votes/submit/records/${subId}`
      );

      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("获取投票产品详情出错:", error);
      return null;
    }
  },

  // ✅ 检查用户是否已投票
  checkUserVote: async (votesId: string): Promise<boolean> => {
    try {
      const user = await getUserData();
      if (!user) return false;

      const response = await api.get<ApiResponse<{ hasVoted: boolean }>>(
        `${API_BASE_URL}/votes/check-vote/${votesId}/${user.user_id}`
      );

      return response.data.data?.hasVoted || false;
    } catch (error) {
      console.error("检查投票状态出错:", error);
      return false;
    }
  },
};
