// services/SocialService/PostsApi.ts
const API_BASE_URL = "http://18.166.69.97:8080/royal/api";

/**
 * 获取所有活跃帖子
 * GET /api/posts
 */
export async function getAllPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get all posts: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting all posts:", error);
    throw error;
  }
}

/**
 * 创建新帖子（支持可选图片）
 * POST /api/posts
 */
export async function createPost(postData: {
  title: string;
  content: string;
  author: string;
  file?: {
    uri: string;
    name: string;
    type: string;
  };
}) {
  try {
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("author", postData.author);

    if (postData.file) {
      formData.append("file", {
        uri: postData.file.uri,
        name: postData.file.name,
        type: postData.file.type,
      } as any);
    }

    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

/**
 * 编辑帖子
 * PUT /api/posts/{postId}
 */
export async function updatePost(postId: string, postData: { content: string; title?: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

/**
 * 删除帖子
 * DELETE /api/posts/{postId}
 */
export async function deletePost(postId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

/**
 * 增加浏览次数
 * POST /api/posts/{postId}/view
 */
export async function incrementPostViews(postId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to increment views: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error incrementing views:", error);
    throw error;
  }
}

/**
 * 点赞帖子
 * POST /api/posts/{postId}/like
 */
export async function likePost(postId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to like post: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
}

/**
 * 取消点赞帖子
 * DELETE /api/posts/{postId}/like
 */
export async function unlikePost(postId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to unlike post: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
}

/**
 * 获取帖子列表（用于表格组件）
 * POST /api/posts/table
 */
export async function getPostsForTable(pagination?: {
  page?: number;
  pageSize?: number;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/table`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pagination || {}),
    });

    if (!response.ok) {
      throw new Error(`Failed to get posts for table: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting posts for table:", error);
    throw error;
  }
}

/**
 * 按标题搜索帖子
 * GET /api/posts/search/title?title=xxx
 */
export async function searchPostsByTitle(title: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/posts/search/title?title=${encodeURIComponent(title)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search posts by title: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching posts by title:", error);
    throw error;
  }
}

/**
 * 按标签搜索帖子
 * GET /api/posts/search/tag?tag=xxx
 */
export async function searchPostsByTag(tag: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/posts/search/tag?tag=${encodeURIComponent(tag)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search posts by tag: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching posts by tag:", error);
    throw error;
  }
}

/**
 * 按内容搜索帖子
 * GET /api/posts/search/content?content=xxx
 */
export async function searchPostsByContent(content: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/posts/search/content?content=${encodeURIComponent(content)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search posts by content: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching posts by content:", error);
    throw error;
  }
}

/**
 * 获取特定帖子
 * GET /api/posts/post/{postId}
 */
export async function getPostById(postId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/post/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get post: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting post:", error);
    throw error;
  }
}

/**
 * 获取热门帖子
 * GET /api/posts/popular
 */
export async function getPopularPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/popular`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get popular posts: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting popular posts:", error);
    throw error;
  }
}

/**
 * 获取最新帖子
 * GET /api/posts/latest
 */
export async function getLatestPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/latest`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get latest posts: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting latest posts:", error);
    throw error;
  }
}

/**
 * 按分类获取帖子
 * GET /api/posts/category/{category}
 */
export async function getPostsByCategory(category: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/category/${category}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get posts by category: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting posts by category:", error);
    throw error;
  }
}

/**
 * 获取分类下的帖子数量
 * GET /api/posts/category/{category}/count
 */
export async function getPostCountByCategory(category: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/category/${category}/count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get post count by category: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting post count by category:", error);
    throw error;
  }
}

/**
 * 按作者获取帖子
 * GET /api/posts/author/{author}
 */
export async function getPostsByAuthor(author: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/author/${author}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get posts by author: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting posts by author:", error);
    throw error;
  }
}

/**
 * 获取作者的帖子数量
 * GET /api/posts/author/{author}/count
 */
export async function getPostCountByAuthor(author: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/author/${author}/count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get post count by author: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting post count by author:", error);
    throw error;
  }
}