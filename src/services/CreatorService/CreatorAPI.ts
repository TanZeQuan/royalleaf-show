// ================================
// Creator API - 统一的 API 服务
// ================================
// 所有 API 请求都使用 fetch 方法

import { Activity, ApiResponse, SubmissionRequest } from "../../screens/Home/Creator/creatorApi";

// ================================
// API 配置
// ================================

const API_BASE_URL = "https://8002606ac2d3.ngrok-free.app/royal/api";

const API_ENDPOINTS = {
  ACTIVITIES_SUBMISSION_OPEN: "/votes/submission-open",
  SUBMIT_ENTRY: "/votes/submit/submit",
  GET_USER_ENTRIES: "/votes/submit/records/user",
} as const;

// ================================
// Creator API 类
// ================================

class CreatorAPI {
  /**
   * 获取开放投稿的活动列表
   * GET /votes/submission-open
   */
  async getSubmissionOpenActivities(): Promise<ApiResponse<Activity[]>> {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.ACTIVITIES_SUBMISSION_OPEN}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return {
          success: true,
          data: result.data || [],
          message: result.message,
        };
      } else {
        return {
          success: false,
          error: result.message || result.error || "获取活动失败",
        };
      }
    } catch (error) {
      console.error("获取开放投稿活动失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "网络错误",
      };
    }
  }

  /**
   * 提交创意作品
   * POST /votes/submit/submit
   * 使用 FormData 提交 votesId, name, desc, file, userId
   */
  async submitEntry(submission: SubmissionRequest): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();

      // 添加表单字段
      formData.append("votesId", submission.votesId);
      formData.append("name", submission.name);
      formData.append("desc", submission.desc);

      if (submission.userId) {
        formData.append("userId", submission.userId);
      }

      // 添加图片文件
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

        console.log("图片信息:", {
          uri: imageUri,
          name: filename,
          type: mimeType,
        });
      }

      console.log("提交数据:", {
        votesId: submission.votesId,
        userId: submission.userId || "未提供",
        name: submission.name,
        desc: submission.desc,
      });

      const url = `${API_BASE_URL}${API_ENDPOINTS.SUBMIT_ENTRY}`;
      console.log("提交到:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
          // 不设置 Content-Type，让系统自动设置 multipart/form-data
        },
        body: formData,
      });

      console.log("响应状态:", response.status);
      const data = await response.json();
      console.log("提交响应:", data);

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
      console.error("提交作品失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "网络错误",
      };
    }
  }

  /**
   * 获取用户的投稿记录
   * GET /votes/submit/records/user/{userId}
   */
  async getUserEntries(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.GET_USER_ENTRIES}/${userId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return {
          success: true,
          data: result.data || [],
          message: result.message,
        };
      } else {
        return {
          success: false,
          error: result.message || result.error || "获取投稿记录失败",
        };
      }
    } catch (error) {
      console.error("获取用户投稿失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "网络错误",
      };
    }
  }
}

// ================================
// 导出 API 实例
// ================================

export const creatorAPI = new CreatorAPI();
export default creatorAPI;
