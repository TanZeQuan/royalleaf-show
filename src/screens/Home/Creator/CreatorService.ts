import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Activity,
  ApiResponse,
  ContestEntry,
  SubmissionRequest,
} from "./CreatorSlice";

// ================================
// API 配置
// ================================

const API_BASE_URL = "http://192.168.0.122:8080/royal/api";

const API_ENDPOINTS = {
  ACTIVITIES_SUBMISSION_OPEN: "/votes/submission-open",
  SUBMIT_ENTRY: "/votes/submit/submit", // 修改为实际的提交端点
  GET_ENTRIES: "/votes/submit/records/user", // 获取用户的投稿记录
  UPDATE_ENTRY: "/submissions",
  DELETE_ENTRY: "/submissions",
} as const;

// ================================
// API 服务类
// ================================

class CreatorAPI {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.data || data,
          message: data.message,
        };
      } else {
        return {
          success: false,
          error: data.message || data.error || "请求失败",
        };
      }
    } catch (error) {
      console.error("API Request Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "网络错误",
      };
    }
  }

  // 获取开放投稿的活动
  async getSubmissionOpenActivities(): Promise<ApiResponse<Activity[]>> {
    return this.makeRequest<Activity[]>(
      API_ENDPOINTS.ACTIVITIES_SUBMISSION_OPEN,
      {
        method: "GET",
      }
    );
  }

  // 提交创意作品 - 使用 FormData 提交 votesId, name, desc, image
  async submitEntry(submission: SubmissionRequest): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();

      // ✅ 保留 votesId / userId / name / desc
      formData.append("votesId", submission.votesId);
      formData.append("name", submission.name);
      formData.append("desc", submission.desc);
      if (submission.userId) {
        formData.append("userId", submission.userId);
      }

      // ✅ 改这段 - 只改 image 格式，不动其他
      if (submission.image) {
        const imageUri =
          typeof submission.image === "string"
            ? submission.image
            : submission.image.toString();
        const filename = imageUri.split("/").pop() || `photo_${Date.now()}.jpg`;
        const ext = filename.split(".").pop()?.toLowerCase();
        const mimeType =
          ext === "png"
            ? "image/png"
            : ext === "webp"
            ? "image/webp"
            : "image/jpeg";

        formData.append("file", {
          uri: imageUri,
          name: filename,
          type: mimeType,
        } as any);

        console.log("✅ Image details:", {
          uri: imageUri,
          name: filename,
          type: mimeType,
        });
      }

      console.log("✅ Submitting FormData fields:", {
        votesId: submission.votesId,
        userId: submission.userId || "not provided",
        name: submission.name,
        desc: submission.desc,
      });

      const url = `${API_BASE_URL}${API_ENDPOINTS.SUBMIT_ENTRY}`;
      console.log("Posting to URL:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
          // ❌ 不设 Content-Type，让 RN 自己带 multipart/form-data
        },
        body: formData,
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Submit Response:", data);

      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message || "提交成功",
        };
      } else {
        return {
          success: false,
          error: data.message || data.error || "提交失败",
        };
      }
    } catch (error) {
      console.error("Submit Entry Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "网络错误",
      };
    }
  }

  // 获取用户的投稿记录
  async getUserEntries(userId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>(
      `${API_ENDPOINTS.GET_ENTRIES}/${userId}`,
      {
        method: "GET",
      }
    );
  }

  // 更新投稿
  async updateEntry(
    id: string,
    updates: Partial<SubmissionRequest>
  ): Promise<ApiResponse<ContestEntry>> {
    return this.makeRequest<ContestEntry>(
      `${API_ENDPOINTS.UPDATE_ENTRY}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updates),
      }
    );
  }

  // 删除投稿
  async deleteEntry(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`${API_ENDPOINTS.DELETE_ENTRY}/${id}`, {
      method: "DELETE",
    });
  }
}

// ================================
// 本地存储服务
// ================================

class CreatorStorage {
  private static readonly STORAGE_KEYS = {
    CONTEST_ENTRIES: "contestEntries",
    ACTIVITIES_CACHE: "activitiesCache",
    USER_DRAFTS: "userDrafts",
  } as const;

  // 保存投稿记录到本地
  static async saveEntries(entries: ContestEntry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.CONTEST_ENTRIES,
        JSON.stringify(
          entries.map((entry) => ({
            ...entry,
            submittedAt: entry.submittedAt.toISOString(),
          }))
        )
      );
    } catch (error) {
      console.error("保存投稿记录失败:", error);
    }
  }

  // 从本地加载投稿记录
  static async loadEntries(): Promise<ContestEntry[]> {
    try {
      const stored = await AsyncStorage.getItem(
        this.STORAGE_KEYS.CONTEST_ENTRIES
      );
      if (!stored) return [];

      const entries = JSON.parse(stored);
      return entries.map((entry: any) => ({
        ...entry,
        submittedAt: new Date(entry.submittedAt),
        reviewedAt: entry.reviewedAt ? new Date(entry.reviewedAt) : undefined,
      }));
    } catch (error) {
      console.error("加载投稿记录失败:", error);
      return [];
    }
  }

  // 缓存活动列表
  static async cacheActivities(activities: Activity[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.ACTIVITIES_CACHE,
        JSON.stringify({
          data: activities,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("缓存活动列表失败:", error);
    }
  }

  // 获取缓存的活动列表
  static async getCachedActivities(): Promise<Activity[]> {
    try {
      const cached = await AsyncStorage.getItem(
        this.STORAGE_KEYS.ACTIVITIES_CACHE
      );
      if (!cached) return [];

      const { data, timestamp } = JSON.parse(cached);

      // 缓存有效期 5 分钟
      if (Date.now() - timestamp > 5 * 60 * 1000) {
        return [];
      }

      return data;
    } catch (error) {
      console.error("获取缓存活动列表失败:", error);
      return [];
    }
  }

  // 保存草稿
  static async saveDraft(draft: Partial<SubmissionRequest>): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.USER_DRAFTS,
        JSON.stringify({
          ...draft,
          savedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("保存草稿失败:", error);
    }
  }

  // 获取草稿
  static async getDraft(): Promise<Partial<SubmissionRequest> | null> {
    try {
      const draft = await AsyncStorage.getItem(this.STORAGE_KEYS.USER_DRAFTS);
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error("获取草稿失败:", error);
      return null;
    }
  }

  // 清除草稿
  static async clearDraft(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEYS.USER_DRAFTS);
    } catch (error) {
      console.error("清除草稿失败:", error);
    }
  }
}

// ================================
// 工具函数
// ================================

export class CreatorUtils {
  // 格式化日期
  static formatDate(date: Date): string {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // 获取状态文本
  static getStatusText(status: ContestEntry["status"]): string {
    switch (status) {
      case "approved":
        return "已通过";
      case "rejected":
        return "已拒绝";
      case "pending":
        return "审核中";
      default:
        return status;
    }
  }

  // 获取状态颜色（需要从 colors 导入）
  static getStatusColor(status: ContestEntry["status"], colors: any): string {
    switch (status) {
      case "approved":
        return colors.success;
      case "rejected":
        return colors.error;
      case "pending":
        return colors.pending;
      default:
        return colors.gray_text;
    }
  }

  // 验证投稿表单
  static validateSubmission(submission: {
    title?: string;
    description?: string;
    image?: string;
    activityId?: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!submission.title?.trim()) {
      errors.push("请输入创意标题");
    }

    if (!submission.description?.trim()) {
      errors.push("请输入创意描述");
    }

    if (!submission.image) {
      errors.push("请选择一张图片");
    }

    if (!submission.activityId) {
      errors.push("请选择投稿活动");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 生成唯一ID
  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // 检查活动是否可投稿
  static isActivitySubmissionOpen(activity: Activity): boolean {
    const now = new Date();
    const submitStart = new Date(activity.submitAt);
    const submitStop = new Date(activity.submitStop);

    return now >= submitStart && now <= submitStop && activity.submissionOpen;
  }

  // 获取活动剩余时间文本
  static getActivityTimeRemaining(activity: Activity): string {
    const now = new Date();
    const submitStop = new Date(activity.submitStop);
    const timeDiff = submitStop.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return "已截止";
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (days > 0) {
      return `还剩 ${days} 天`;
    } else if (hours > 0) {
      return `还剩 ${hours} 小时`;
    } else {
      return "即将截止";
    }
  }
}

// ================================
// 主要服务实例
// ================================

export const creatorAPI = new CreatorAPI();
export const creatorStorage = CreatorStorage;

// ================================
// 导出所有类型和服务
// ================================

export default {
  api: creatorAPI,
  storage: creatorStorage,
  utils: CreatorUtils,
};
