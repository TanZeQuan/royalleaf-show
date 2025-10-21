// voteDetailsApi.ts
const API_BASE_URL = "https://8002606ac2d3.ngrok-free.app/royal/api";
import { getUserData } from "../../utils/storage"; // 🔑 引入存储工具

export interface RouteParams {
  productId: string;
  product?: VoteProductDetails;
  activity?: any;
  category: string;
}

export interface Comment {
  id: string | number; // 支持 string 或 number
  commentId?: string; // 可选
  subId?: string; // 可选
  user: string; // 必需 - 用户显示名称
  userId?: string; // 可选 - 保留原始
  text: string; // 必需 - 评论内容
  timeAgo: string; // 必需 - 相对时间
  desc?: string; // 可选 - 保留原始 desc
  createdAt?: string; // 可选 - 添加原始时间
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

export interface CommentRequest {
  subId: string;
  userId: string;
  desc: string;
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    subId: string;
    userId: string;
    desc: string;
    createdAt: string;
  };
  timestamp: number;
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
  name?: string;
  desc?: string;
  image?: string;
  isStatus?: number;
  approveBy?: string;
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

// 提交投票函数
export const submitVoteFetch = async (voteData: VoteRequest) => {
  try {
    const user = await getUserData();
    if (!user) return { success: false, message: "用户未登录" };

    const payload = {
      votesId: voteData.votesId,
      userId: user.user_id,
      targetSubId: voteData.targetSubId
    };

    console.log("🔄 提交投票数据:", payload);
    console.log("🌐 请求URL:", `${API_BASE_URL}/votes/submit/cast`);

    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

    const response = await fetch(`${API_BASE_URL}/votes/submit/cast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log("🌐 Response status:", response.status);

    const data = await response.json();
    console.log("✅ 投票响应:", data);

    return {
      success: data.success,
      message: data.message,
    };
  } catch (error: any) {
    console.error("❌ 投票出错:", error);
    
    // 更详细的错误信息
    if (error.name === 'AbortError') {
      return { success: false, message: "请求超时，请检查网络连接" };
    } else if (error.message === 'Network request failed') {
      return { success: false, message: "网络连接失败，请检查网络设置" };
    }
    
    return {
      success: false,
      message: error.message || "投票失败",
    };
  }
};

// 获取投票产品详情
export const getVoteProductDetails = async (subId: string): Promise<VoteProductDetails | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/votes/submit/records/${subId}`);
    const data = await response.json();

    if (data.success) {
      const productDetails = data.data;
      console.log("获取产品详情成功:", productDetails);
      return productDetails;
    }
    return null;
  } catch (error) {
    console.error("获取投票产品详情出错:", error);
    return null;
  }
};

// 获取评论
export const getComments = async (subId: string): Promise<Comment[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/votes/submit/comments/submission/${subId}`);
    const data = await response.json();

    if (data.success && data.data) {
      const transformedComments = data.data.map(transformComment);
      console.log("获取评论成功:", transformedComments.length, "条评论");
      return transformedComments;
    }
    return [];
  } catch (error) {
    console.error("获取评论出错:", error);
    return [];
  }
};

// 提交评论函数
export const submitComment = async (commentData: CommentRequest): Promise<CommentResponse> => {
  try {
    const user = await getUserData();
    if (!user) {
      return { 
        success: false, 
        message: "用户未登录",
        timestamp: Date.now()
      };
    }

    const payload = {
      subId: commentData.subId,
      userId: user.user_id,
      desc: commentData.desc
    };

    console.log("🔄 提交评论数据:", payload);
    console.log("🌐 请求URL:", `${API_BASE_URL}/votes/submit/comments`);

    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}/votes/submit/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log("🌐 Response status:", response.status);

    const data = await response.json();
    console.log("✅ 评论提交响应:", data);

    return {
      success: data.success,
      message: data.message,
      data: data.data,
      timestamp: data.timestamp || Date.now()
    };
  } catch (error: any) {
    console.error("❌ 提交评论出错:", error);
    
    if (error.name === 'AbortError') {
      return { 
        success: false, 
        message: "请求超时，请检查网络连接",
        timestamp: Date.now()
      };
    } else if (error.message === 'Network request failed') {
      return { 
        success: false, 
        message: "网络连接失败，请检查网络设置",
        timestamp: Date.now()
      };
    }
    
    return {
      success: false,
      message: error.message || "评论提交失败",
      timestamp: Date.now()
    };
  }
};

// 计算相对时间
const getTimeAgo = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "刚刚";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}小时前`;
    return `${Math.floor(diffInSeconds / 86400)}天前`;
  } catch (error) {
    return "未知时间";
  }
};

// 转换评论数据
const transformComment = (apiComment: any): Comment => {
  return {
    id: apiComment.id,
    commentId: apiComment.commentId,
    subId: apiComment.subId,
    userId: apiComment.userId,
    user: apiComment.username || `${apiComment.userId.substring(0, 6)}`, // 使用 username，如果没有就生成友好名称
    text: apiComment.desc || apiComment.text || "",
    desc: apiComment.desc,
    timeAgo: getTimeAgo(apiComment.createdAt),
    createdAt: apiComment.createdAt,
    isDelete: apiComment.isDelete,
    modifyAt: apiComment.modifyAt,
    deleted: apiComment.deleted,
    isDesigner: apiComment.isDesigner || false,
  };
};