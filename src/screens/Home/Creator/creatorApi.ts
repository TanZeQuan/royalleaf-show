import creatorAPI from "../../../services/CreatorService/CreatorAPI";
import { getUserData } from "../../../utils/storage";

// ================================
// 接口定义 (API-specific types)
// ================================
export interface Activity {
  id: number;
  votesId: string;  // 活动的 votesId，用于投稿
  name: string;
  desc: string;
  category: string;
  submitAt: string;     // 投稿开始时间
  submitStop: string;   // 投稿结束时间
  votedAt: string;      // 投票开始时间
  votedStop: string;    // 投票结束时间
  isStatus: number;
  createdAt: string;
  modifyAt: string;
  submissionOpen: boolean;
  votingOpen: boolean;
}

export interface SubmissionRequest {
  votesId: string;  // 从 GET submission-open 获取的活动 votesId
  name: string;     // 作品标题
  desc: string;     // 作品描述
  image?: string | { uri: string; name: string; type: string };
  userId?: string;  // 可选：用户ID（后端可能需要）
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ================================
// API 函数
// ================================

/**
 * 获取开放投稿的活动列表
 */
const getSubmissionOpenActivities = async (): Promise<ApiResponse<Activity[]>> => {
  return creatorAPI.getSubmissionOpenActivities();
};

/**
 * 获取指定用户的投稿列表
 * @param userId 用户ID
 */
const getUserEntries = async (userId: string): Promise<ApiResponse<any[]>> => {
  return creatorAPI.getUserEntries(userId);
};

/**
 * 提交新的创意作品
 * @param submissionData 投稿数据
 */
const submitEntry = async (submissionData: SubmissionRequest): Promise<ApiResponse<any>> => {
    const userData = await getUserData();
    if (!userData || !userData.user_id) {
        return { success: false, error: "User not logged in" };
    }

    const dataToSubmit = {
        ...submissionData,
        userId: userData.user_id,
    };

    return creatorAPI.submitEntry(dataToSubmit);
};

export const creatorApi = {
  getSubmissionOpenActivities,
  getUserEntries,
  submitEntry,
};