import api from "../apiClient";

const API_BASE_URL = "https://8002606ac2d3.ngrok-free.app/royal/api";

export interface VoteActivity {
  id: number;
  votesId: string;
  name: string;
  desc: string;
  category: string;
  submitAt: string;
  submitStop: string;
  votedAt: string;
  votedStop: string;
  isStatus: number;
  createdAt: string;
  modifyAt: string;
  submissionOpen: boolean;
  votingOpen: boolean;
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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  count: number;
  timestamp: number;
}


export const voteActivityService = {
  // 获取进行中的投票活动
  getVotingActivities: async (): Promise<VoteActivity[]> => {
    try {
      const response = await api.get<ApiResponse<VoteActivity[]>>(
        `${API_BASE_URL}/votes/voting-open`
      );
      return response.data.data;
    } catch (error) {
      console.error("获取投票活动列表出错:", error);
      return [];
    }
  },

  // 获取特定投票活动的产品数据
  getVoteProducts: async (votesId: string): Promise<VoteProduct[]> => {
    try {
      const response = await api.get<ApiResponse<VoteProduct[]>>(
        `${API_BASE_URL}/votes/submit/records/activity/${votesId}`
      );
      
      if (response.data.success) {
        // 只显示 isStatus: 2 的产品（已通过审核）
        return response.data.data.filter((product) => product.isStatus === 2);
      }
      return [];
    } catch (error) {
      console.error("获取投票产品出错:", error);
      return [];
    }
  },
}