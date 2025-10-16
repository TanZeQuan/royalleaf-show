// ================================
// 接口定义
// ================================

export interface ContestEntry {
  id: string;
  category: string;
  categoryName: string;
  image: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  feedback?: string;
  likes: number;
  views: number;
  isPublic: boolean;
  authorName?: string;
  authorId?: string;
  activityId?: string;
  activityName?: string;
}

export interface RouteParams {
  entries?: ContestEntry[];
  selectedCategory?: string;
  categoryName?: string;
}

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