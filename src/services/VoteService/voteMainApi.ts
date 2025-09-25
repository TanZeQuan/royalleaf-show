import api from "../apiClient";

const API_BASE_URL = "http://192.168.0.122:8080/royal/api";

export interface Category {
  id: number;
  cateId: string;
  name: string;
  image: string;
  desc: string;
  isStatus: number;
  isDeleted: number;
  createdAt: string;
  modifyAt: string;
  deleted: boolean;
  active: boolean;
  disabled: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Category[];
  count: number;
  timestamp: number;
}

export const voteService = {
  // 获取投票分类
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get(`${API_BASE_URL}/votes/categories`);
      return response.data.data as Category[];
    } catch (error) {
      console.error("获取投票分类列表出错:", error);
      return [];
    }
  },
};