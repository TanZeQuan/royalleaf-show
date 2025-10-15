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
  name: string;
  desc: string;
  submitStart: string;
  submitStop: string;
  voteStart: string;
  voteStop: string;
  status: "active" | "inactive" | "ended";
  coverImage?: string;
  participantsCount?: number;
  submissionsCount?: number;
}

export interface SubmissionRequest {
  votesId: string;  
  userId: string;   
  targetSubId: string;  
  name: string;     
  desc: string;         
  image: string;     
  isStatus?: number;        // 状态 (1: 审核中, 2: 通过, 3: 拒绝) - 可选
  approveBy?: string;     
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}