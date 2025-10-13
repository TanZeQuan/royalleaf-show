// voteDetailsApi.ts
import { getUserData } from "../../utils/storage"; // 🔑 引入存储工具
import api from "../apiClient";

const API_BASE_URL = "http://192.168.0.122:8080/royal";

export interface RouteParams {
  productId: string;
  product?: VoteProductDetails;
  activity?: any;
  category: string;
}

export interface Comment {
  id: string | number;  // 支持 string 或 number
  commentId?: string;   // 可选
  subId?: string;       // 可选
  user: string;         // 必需 - 用户显示名称
  userId?: string;      // 可选 - 保留原始
  text: string;         // 必需 - 评论内容
  timeAgo: string;      // 必需 - 相对时间
  desc?: string;        // 可选 - 保留原始 desc
  createdAt?: string;   // 可选 - 添加原始时间
  isDelete?: number;
  modifyAt?: string;
  deleted?: boolean;
  isDesigner?: boolean;
  replyTo?: string;
  replyText?: string;
  upvotes?: number;
  downvotes?: number;
  hasVoted?: boolean;
  voteType?: "upvote" | "downvote";
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
  comments?: Comment[];
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

  // ✅ 获取投票产品详情（不包含评论）
  getVoteProductDetails: async (subId: string): Promise<VoteProductDetails | null> => {
    try {
      const response = await api.get<ApiResponse<VoteProductDetails>>(
        `${API_BASE_URL}/api/votes/submit/records/${subId}`
      );

      if (response.data.success) {
        const productDetails = response.data.data;
        console.log("获取产品详情成功:", productDetails);
        return productDetails;
      }
      return null;
    } catch (error) {
      console.error("获取投票产品详情出错:", error);
      return null;
    }
  },

  getComments: async (subId: string): Promise<Comment[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        `${API_BASE_URL}/api/votes/submit/comments/submission/${subId}`
      );

      if (response.data.success && response.data.data) {
        // 使用 transformComment 函数转换后端数据为前端格式
        const transformedComments = response.data.data.map(transformComment);
        console.log("获取评论成功:", transformedComments.length, "条评论");
        return transformedComments;
      }
      return [];
    } catch (error) {
      console.error("获取评论出错:", error);
      return [];
    }
  },

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

// 计算相对时间
const getTimeAgo = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return '刚刚';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
    return `${Math.floor(diffInSeconds / 86400)}天前`;
  } catch (error) {
    return '未知时间';
  }
};

// 转换评论数据
const transformComment = (apiComment: any): Comment => {
  return {
    id: apiComment.id,
    commentId: apiComment.commentId,
    subId: apiComment.subId,
    userId: apiComment.userId,
    user: apiComment.userId, // 先用 userId 作为显示名
    text: apiComment.desc || apiComment.text || '',
    desc: apiComment.desc,
    timeAgo: getTimeAgo(apiComment.createdAt),
    createdAt: apiComment.createdAt,
    isDelete: apiComment.isDelete,
    modifyAt: apiComment.modifyAt,
    deleted: apiComment.deleted,
    isDesigner: apiComment.isDesigner || false
  };
};