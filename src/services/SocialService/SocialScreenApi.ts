
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
export const getCommentsByPostId = async (postId: string, limit = 10, offset = 0) => {
  const res = await fetch(
    `${API_BASE_URL}/posts-comments/post/${postId}/with-logs?limit=${limit}&offset=${offset}`
  );
  const data = await handleResponse(res);

  // 🔍 打印原始数据看看结构
  // console.log("原始API返回:", data.length);

  // 处理两种可能的数据结构
  const commentsList = Array.isArray(data) ? data : (data?.data || []);

  // console.log("处理后的评论列表:", commentsList);

  return {
    comments: commentsList,
    total: data?.total || commentsList.length,
    hasMore: commentsList.length === limit,
  };
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
    console.log("📥 Comment/Reply created successfully:", data);

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
  console.log("🟢 [getPostCommentReplies] 正在请求评论数据 for postId:", postId);

  try {
    const res = await fetch(`${API_BASE_URL}/posts-comment-logs/post/${postId}/with-logs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    console.log("📡 请求已发送到:", `${API_BASE_URL}/posts-comment-logs/post/${postId}/with-logs`);

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

    const data = await handleResponse(res);
    console.log("✅ 评论/回复已创建:", data);
    return data;
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
          // const { comments, total, hasMore } = await getCommentsByPostId(post.postId, 10, 0);

          // const formattedComments = comments.map((comment: any, index: number) => {
          //   // 尝试所有可能的字段名
          //   const commentText = 
          //     comment.desc || 
          //     comment.content || 
          //     comment.comment || 
          //     comment.text || 
          //     comment.message ||
          //     `评论内容 ${index + 1}`;

          //   return {
          //     id: comment.commentId || comment.id || `c${index + 1}`,
          //     user: comment.userId || comment.user || `用户${index}`,
          //     text: commentText,
          //     isDesigner: false,
          //     replyTo: null,
          //     isLiked: false,
          //   };
          // });

          return {
            ...post,
            id: post.postId,
            username: post.userId || "未知用户",
            avatar: getAvatarByUserId(post.userId),
            image: (post.gallery === undefined) ? "assets/images/mock.jpg" : post.gallery,
            caption: post.desc || "暂无描述",
            likes: post.liked || 0,
            comments: post.total,
            timeAgo: formatTimeAgo(post.createdAt),
            isLiked: false,
            isSaved: false,
            // commentsList: formattedComments,
            // hasMoreComments: hasMore,
          };
        } catch (err) {
          console.error(`获取帖子 ${post.postId} 的评论失败:`, err);
          // return {
          //   ...post,
          //   id: post.postId,
          //   username: post.userId || "未知用户",
          //   avatar: getAvatarByUserId(post.userId),
          //   image: post.gallery
          //     ? { uri: post.gallery }
          //     : require("../../assets/images/mock.jpg"),
          //   caption: post.desc || "暂无描述",
          //   likes: post.liked || 0,
          //   comments: 0,
          //   timeAgo: formatTimeAgo(post.createdAt),
          //   isLiked: false,
          //   isSaved: false,
          //   commentsList: [],
          //   hasMoreComments: false,
          // };
        }
      })
    );

    return postsWithComments;
  } catch (err) {
    console.error("获取帖子和评论失败:", err);
    throw err;
  }
};