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
  const res = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
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
    `${API_BASE_URL}/posts-comments/post/${postId}?limit=${limit}&offset=${offset}`
  );
  const data = await handleResponse(res);

  return {
    comments: data.data || data,
    total: data.total || data.length,
    hasMore: (data.data || data).length === limit,
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

export const postCommentReply = async (commentId: string, content: string, userId: string) => {
  const res = await fetch(`${API_BASE_URL}/posts-comment-logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commentId, desc: content, userId }),
  });
  const data = await handleResponse(res);
  return data;
};

/* ------------------- 🔹 Combine Posts & Comments ------------------- */
export const getAllPostsWithComments = async () => {
  try {
    const posts = await getActivePosts();
    if (!posts?.length) return [];

    const postsWithComments = await Promise.all(
      posts.map(async (post: any) => {
        try {
          const { comments, total, hasMore } = await getCommentsByPostId(post.postId, 10, 0);
          const formattedComments = comments.map((comment: any, index: number) => ({
            id: comment.commentId || `c${index + 1}`,
            user: comment.userId || `user${comment.userId?.slice(-3)}`,
            text: comment.content || `评论内容 ${index + 1}`,
            isDesigner: comment.userId?.includes("designer") || false,
            replyTo: null,
            isLiked: false,
          }));

          return {
            ...post,
            id: post.postId,
            username: post.userId || "未知用户",
            avatar: getAvatarByUserId(post.userId),
            image: post.gallery
              ? { uri: post.gallery }
              : require("../../assets/images/mock.jpg"),
            caption: post.desc || "暂无描述",
            likes: post.liked || 0,
            comments: total,
            timeAgo: formatTimeAgo(post.createdAt),
            isLiked: false,
            isSaved: false,
            commentsList: formattedComments,
            hasMoreComments: hasMore,
          };
        } catch (err) {
          console.error(`获取帖子 ${post.postId} 的评论失败:`, err);
          return {
            ...post,
            id: post.postId,
            username: post.userId || "未知用户",
            avatar: getAvatarByUserId(post.userId),
            image: post.gallery
              ? { uri: post.gallery }
              : require("../../assets/images/mock.jpg"),
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
  } catch (err) {
    console.error("获取帖子和评论失败:", err);
    throw err;
  }
};
