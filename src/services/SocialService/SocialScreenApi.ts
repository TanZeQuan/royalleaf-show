
const API_BASE_URL = "http://192.168.0.122:8080/royal/api";

// 获取所有活跃帖子
export const getActivePosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    const data = await response.json();
    
    if (data.success) {
      return data.data; // 返回帖子数组
    } else {
      throw new Error(data.message || '获取帖子失败');
    }
  } catch (error) {
    console.error('获取帖子错误:', error);
    throw error;
  }
};

// 根据 postId 获取评论
export const getCommentsByPostId = async (postId: string, limit: number = 10, offset: number = 0) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts-comments/post/${postId}?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    if (data.success) {
      return {
        comments: data.data,
        total: data.total || data.data.length,
        hasMore: data.data.length === limit
      };
    } else {
      throw new Error(data.message || '获取评论失败');
    }
  } catch (error) {
    console.error('获取评论错误:', error);
    throw error;
  }
};

// 获取所有帖子和对应的评论
export const getAllPostsWithComments = async () => {
  try {
    // 1. 获取所有活跃帖子
    const posts = await getActivePosts();

    // 如果没有帖子，返回空数组
    if (!posts || posts.length === 0) {
      return [];
    }

    // 2. 为每个帖子获取前10条评论
    const postsWithComments = await Promise.all(
      posts.map(async (post: any) => {
        try {
          const commentsData = await getCommentsByPostId(post.postId, 10, 0);
          const comments = commentsData.comments;

          // 3. 将评论数据转换为 UI 需要的格式
          const formattedComments = comments.map((comment: any, index: number) => ({
            id: comment.commentId || `c${index + 1}`,
            user: comment.userId || `user${comment.userId?.slice(-3)}`,
            text: comment.content || `评论内容 ${index + 1}`, // 使用默认文本
            isDesigner: comment.userId?.includes('designer') || false,
            replyTo: null
          }));

          // 4. 合并帖子数据和评论数据
          return {
            ...post,
            // 转换为 UI 需要的格式
            id: post.postId,
            username: post.userId || '未知用户',
            avatar: getAvatarByUserId(post.userId),
            image: post.gallery ? { uri: post.gallery } : require('../../assets/images/mock.jpg'),
            caption: post.desc || '暂无描述',
            likes: post.liked || 0,
            comments: commentsData.total || comments.length, // 使用总数而不是当前加载的数量
            timeAgo: formatTimeAgo(post.createdAt),
            isLiked: false,
            isSaved: false,
            commentsList: formattedComments,
            hasMoreComments: commentsData.hasMore // 新增：是否有更多评论
          };
        } catch (error) {
          console.error(`获取帖子 ${post.postId} 的评论失败:`, error);
          // 如果获取评论失败，返回空评论列表的帖子
          return {
            ...post,
            id: post.postId,
            username: post.userId || '未知用户',
            avatar: getAvatarByUserId(post.userId),
            image: post.gallery ? { uri: post.gallery } : require('../../assets/images/mock.jpg'),
            caption: post.desc || '暂无描述',
            likes: post.liked || 0,
            comments: 0,
            timeAgo: formatTimeAgo(post.createdAt),
            isLiked: false,
            isSaved: false,
            commentsList: [],
            hasMoreComments: false
          };
        }
      })
    );

    return postsWithComments;
  } catch (error) {
    console.error('获取帖子和评论失败:', error);
    throw error;
  }
};

// 根据用户ID生成头像emoji（模拟函数）
const getAvatarByUserId = (userId: string) => {
  const avatars = ['👩‍💼', '👨‍🎓', '👩‍🍳', '🧑🏻', '👨🏾'];
  if (!userId) return avatars[0];
  
  // 简单的哈希函数生成固定头像
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return avatars[Math.abs(hash) % avatars.length];
};

// 获取评论的回复（根据 commentId）
export const getCommentReplies = async (commentId: string, limit: number = 10, offset: number = 0) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts-comment-logs?commentId=${commentId}&limit=${limit}&offset=${offset}`);
    const data = await response.json();

    if (data.success) {
      // 按 gens 排序回复
      const sortedReplies = data.data.sort((a: any, b: any) => a.gens - b.gens);
      return {
        replies: sortedReplies,
        total: data.total || sortedReplies.length,
        hasMore: sortedReplies.length === limit
      };
    } else {
      throw new Error(data.message || '获取回复失败');
    }
  } catch (error) {
    console.error('获取回复错误:', error);
    throw error;
  }
};

// 提交新的回复
export const postCommentReply = async (commentId: string, content: string, userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts-comment-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId,
        desc: content,
        userId
      })
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || '发送回复失败');
    }
  } catch (error) {
    console.error('发送回复错误:', error);
    throw error;
  }
};

// 格式化时间显示
const formatTimeAgo = (createdAt: string) => {
  if (!createdAt) return '刚刚';

  const now = new Date();
  const created = new Date(createdAt);
  const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diffInSeconds < 60) return '刚刚';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
  return `${Math.floor(diffInSeconds / 86400)}天前`;
};