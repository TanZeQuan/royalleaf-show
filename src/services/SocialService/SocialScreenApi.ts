
const API_BASE_URL = "http://192.168.0.122:8080/royal/api";

/* ------------------- 🔹 Helpers ------------------- */
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "请求失败");
  }
  return data.data || data;
};

const getAvatarByUserId = (userId: string) => {
  const avatars = ["👩‍💼", "👨‍🎓", "👩‍🍳", "🧑🏻", "👨🏾"];
  if (!userId) return avatars[0];
  const hash = userId.split("").reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return avatars[Math.abs(hash) % avatars.length];
};

const formatTimeAgo = (createdAt: string) => {
  if (!createdAt) return "刚刚";
  const now = new Date();
  const created = new Date(createdAt);
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000);
  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  return `${Math.floor(diff / 86400)}天前`;
};

/* ------------------- 🔹 Posts ------------------- */
export const getActivePosts = async () => {
  const res = await fetch(`${API_BASE_URL}/posts`);
  const data = await handleResponse(res);
  return data;
};

export const getAllPosts = getActivePosts;

export const createPost = async (postData: any) => {
  const formData = new FormData();
  for (const key in postData) {
    if (postData[key] !== undefined && postData[key] !== null) {
      formData.append(key, postData[key]);
    }
  }

  const res = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(res);
};


export const updatePost = async (postId: string, postData: any) => {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return handleResponse(res);
};

export const deletePost = async (postId: string) => {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}`, { method: "DELETE" });
  return handleResponse(res);
};

export const incrementView = async (postId: string) => {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/view`, { method: "POST" });
  return handleResponse(res);
};

export const likePost = async (postId: string) => {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/like`, { method: "POST" });
  return handleResponse(res);
};

export const unlikePost = async (postId: string) => {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/like`, { method: "DELETE" });
  return handleResponse(res);
};

/* ------------------- 🔹 Wrapped Posts ------------------- */
export const createWrappedPost = async (postData: any) => {
  const res = await fetch(`${API_BASE_URL}/posts/wrapped`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return handleResponse(res);
};

export const updateWrappedPost = async (postId: string, postData: any) => {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/wrapped`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return handleResponse(res);
};

/* ------------------- 🔹 Comments ------------------- */
export const getCommentsByPostId = async (
  postId: string,
  limit = 10,
  offset = 0
) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/posts-comments/post/${postId}/with-logs?limit=${limit}&offset=${offset}`
    );
    const data = await handleResponse(res);

    // 🧩 提取评论列表（有时 API 返回 data.data / 有时直接返回数组）
    const commentsList = Array.isArray(data) ? data : data?.data || [];

    // ✅ 扁平化 & 提取字段（确保 CommentItem 能正确显示）
    const formattedComments = commentsList.map((item: any) => ({
      id: item.comment?.commentId || item.comment?.id,
      postId: item.comment?.postId,
      userId: item.comment?.userId || item.logs?.[0]?.userId,
      username:
        item.logs?.[0]?.userId ||
        item.comment?.userId ||
        "匿名用户",
      content:
        item.logs?.[0]?.desc ||
        item.logs?.[0]?.content ||
        item.logs?.[0]?.comment_desc ||
        "（无内容）",
      createdAt:
        item.comment?.createdAt ||
        item.logs?.[0]?.createdAt ||
        new Date().toISOString(),
      // 如果你未来要显示子回复可以留个空数组
      replies: [],
    }));

    return {
      comments: formattedComments,
      total: data?.total || formattedComments.length,
      hasMore: formattedComments.length === limit,
    };
  } catch (error) {
    console.error("❌ 获取评论失败:", error);
    return { comments: [], total: 0, hasMore: false };
  }
};

export const likeComment = async (commentId: string) => {
  const res = await fetch(`${API_BASE_URL}/posts-comments/${commentId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(res);
};

export const unlikeComment = async (commentId: string) => {
  const res = await fetch(`${API_BASE_URL}/posts-comments/${commentId}/like`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(res);
};


/* ------------------- 🔹 Create Comment or Reply ------------------- */
export const postComment = async (
  postId: string,
  content: string,
  author: string,
  parentCommentId: string | null = null,
  repliedOnLog: string | null = null
) => {
  try {
    // ✅ 动态设置层级 gens
    const gens = parentCommentId ? 2 : 1;

    const payload = {
      postId: postId,
      userId: author,
      desc: content,
      parentCommentId: parentCommentId || null,
      repliedOnLog: repliedOnLog || "",
      gens: gens
    };

    // console.log("📤 Sending comment payload:", payload);
    const res = await fetch(`${API_BASE_URL}/posts-comments/compose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(res);
    // console.log("📥 Comment/Reply created successfully:", data);

    return data;
  } catch (error: any) {
    console.error("❌ 创建评论失败:", error);
    throw error;
  }
};

/* ------------------- 🔹 Replies ------------------- */
export const getCommentReplies = async (commentId: string, limit = 10, offset = 0) => {
  const res = await fetch(
    `${API_BASE_URL}/posts-comment-logs?commentId=${commentId}&limit=${limit}&offset=${offset}`
  );
  const data = await handleResponse(res);

  const sortedReplies = (data.data || data).sort((a: any, b: any) => a.gens - b.gens);
  return {
    replies: sortedReplies,
    total: data.total || sortedReplies.length,
    hasMore: sortedReplies.length === limit,
  };
};

export const getPostCommentReplies = async (postId: string) => {
  // console.log("🟢 [getPostCommentReplies] 正在请求评论数据 for postId:", postId);

  try {
    const res = await fetch(`${API_BASE_URL}/posts-comment-logs/post/${postId}/with-logs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    // console.log("📡 请求已发送到:", `${API_BASE_URL}/posts-comment-logs/post/${postId}/with-logs`);

    const data = await handleResponse(res);
    // console.log("📥 获取帖子评论及回复成功:", data);

    return data;
  } catch (error: any) {
    console.error("❌ 获取帖子评论及回复失败 for postId:", postId, "错误信息:", error);
    throw error;
  }
};

export const CreateComment = async (payload: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/posts-comments/compose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await handleResponse(res);
    return result.data; // 确保这里返回 { commentId, postId, ... }
  } catch (error) {
    console.error("❌ 评论/回复创建失败:", error);
    throw error;
  }
};


// 创建回复 API 调用
export const sendPostCommentReply = async (payload: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/posts-comment-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("✅ 回复已发送:", data);
    return data;
  } catch (error) {
    console.error("❌ 回复发送失败:", error);
    throw error;
  }
};

/* ------------------- 🔹 Combine Posts & Comments ------------------- */
export const getAllPostsWithComments = async () => {
  try {
    const posts = await getActivePosts();
    if (!posts?.length) return [];

    const postsWithComments = await Promise.all(
      posts.map(async (post: any) => {
        try {
          const { comments, total, hasMore } = await getCommentsByPostId(
            post.postId,
            10,
            0
          );

          const formattedComments = comments.map((comment: any) => ({
            id: comment.id || comment.commentId,
            user: comment.userId || "匿名用户",
            username: comment.username || "匿名用户",
            text: comment.content || "（无内容）",
            isDesigner: false,
            replyTo: null,
            isLiked: false,
            createdAt: comment.createdAt,
          }));

          return {
            ...post,
            id: post.postId,
            username: post.userId || "未知用户",
            avatar: getAvatarByUserId(post.userId),
            image: post.gallery || "assets/images/mock.jpg",
            caption: post.desc || "暂无描述",
            likes: post.liked || 0,
            comments: total || formattedComments.length,
            timeAgo: formatTimeAgo(post.createdAt),
            isLiked: false,
            isSaved: false,
            commentsList: formattedComments,
            hasMoreComments: hasMore,
          };
        } catch {
          return {
            ...post,
            id: post.postId,
            username: post.userId || "未知用户",
            avatar: getAvatarByUserId(post.userId),
            image: post.gallery || "assets/images/mock.jpg",
            caption: post.desc || "暂无描述",
            likes: post.liked || 0,
            comments: 0,
            timeAgo: formatTimeAgo(post.createdAt),
            isLiked: false,
            isSaved: false,
            commentsList: [],
            hasMoreComments: false,
          };
        }
      })
    );

    return postsWithComments;
  } catch {
    throw new Error("获取帖子和评论失败");
  }
};
