import api from "../apiClient";

const API_BASE_URL = "http://192.168.0.122:8080/royal/api";

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
  userId: string;
  targetSubId: string;
  name: string;
  desc: string;
  image: string;
  isStatus: number;
  approveBy: string;
}

// 投票响应接口
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


// 投票产品详情接口
export interface VoteProductDetails extends VoteProduct {
  // 可以添加更多详情字段
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
 submitVote: async (subId: string, voteData: Omit<VoteRequest, 'targetSubId'>): Promise<boolean> => {
    try {
      const requestData: VoteRequest = {
        ...voteData,
        targetSubId: subId
      };

      const response = await api.post<ApiResponse<VoteResponse>>(
        `${API_BASE_URL}/votes/submit/records/${subId}`,
        requestData
      );
      
      return response.data.success;
    } catch (error) {
      console.error("投票出错:", error);
      return false;
    }
  },
    // 获取投票产品详情
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
}