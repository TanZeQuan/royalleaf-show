// ✅ useCommentLogic.ts
import { useState, useCallback, useRef } from 'react';
import { Alert, Keyboard } from 'react-native';
import {
  postComment,
  likeComment,
  getCommentReplies,
} from '../../../services/SocialService/SocialScreenApi';

export function useCommentLogic(isMountedRef?: React.MutableRefObject<boolean>) {
  const mountRef = isMountedRef || useRef(true);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<any>(null);
  const [commentText, setCommentText] = useState("");

  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [commentReplies, setCommentReplies] = useState<Record<string, any[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());
  const [visibleRepliesCount, setVisibleRepliesCount] = useState<Record<string, number>>({});

  /* ---------------- 🟢 打开 & 关闭评论 ---------------- */
  const openCommentModal = useCallback((post: any) => {
    setSelectedPostForComments(post);
    setShowCommentModal(true);
    setCommentText("");
  }, []);

  const closeCommentModal = useCallback(() => {
    setShowCommentModal(false);
    setSelectedPostForComments(null);
    setCommentText("");
    setActiveReplyCommentId(null);
    setReplyText("");
    Keyboard.dismiss();
  }, []);

  /* ---------------- 🟢 发布评论 ---------------- */
  const handleAddComment = useCallback(
    async (user: any) => {
      if (!commentText.trim() || !selectedPostForComments) return;

      const postId = selectedPostForComments.id;
      const content = commentText.trim();
      const author = user?.username || user?.user_id || "匿名用户";

      try {
        const apiResponse = await postComment(postId, content, author, null);
        console.log("✅ 评论成功:", apiResponse);

        const newComment = {
          id: apiResponse?.commentId || Date.now().toString(),
          user: {
            username: apiResponse?.data?.author || "匿名用户",
            id: apiResponse?.data?.author || "unknown", // 如果没有真实 userId，可以暂时用 author
          },
          content: apiResponse?.data?.content || commentText,
          createdAt: apiResponse?.data?.createdAt || new Date().toISOString(),
          isLiked: false,
        };


        // ✅ 本地更新评论列表
        setSelectedPostForComments((prev: any) => ({
          ...prev,
          comments: (prev.comments || 0) + 1,
          commentsList: [...(prev.commentsList || []), newComment],
        }));

        setCommentText("");
        Alert.alert("成功", "评论已发布");
      } catch (error) {
        console.error("❌ 发布评论失败:", error);
        Alert.alert("错误", "评论发送失败，请稍后重试");
      }
    },
    [commentText, selectedPostForComments]
  );

  /* ---------------- 🟢 点赞评论 ---------------- */
  const handleCommentLike = useCallback(async (commentId: string) => {
    try {
      await likeComment(commentId);
      Alert.alert("成功", "点赞成功");
    } catch (error) {
      console.error("❌ 评论点赞失败:", error);
      Alert.alert("错误", "点赞失败，请稍后重试");
    }
  }, []);

  /* ---------------- 🟢 展开回复 ---------------- */
  const handleReply = useCallback((commentId: string) => {
    setActiveReplyCommentId((prev) => (prev === commentId ? null : commentId));
    setReplyText("");
  }, []);

  /* ---------------- 🟢 加载回复 ---------------- */
  const loadCommentReplies = useCallback(async (commentId: string) => {
    if (loadingReplies.has(commentId) || commentReplies[commentId]) return;

    setLoadingReplies((prev) => new Set(prev).add(commentId));
    try {
      const repliesData = await getCommentReplies(commentId);
      console.log("📥 加载到的回复数据:", repliesData);

      const formattedReplies = (repliesData?.replies || []).map((reply: any) => ({
        id: reply.id || reply.commentId || Math.random().toString(36).slice(2),
        userId: reply.userId || "未知用户",
        desc: reply.desc || reply.content || "(无内容)",
        createdAt: reply.createdAt || "",
      }));

      if (mountRef.current) {
        setCommentReplies((prev) => ({
          ...prev,
          [commentId]: formattedReplies,
        }));
        setVisibleRepliesCount((prev) => ({
          ...prev,
          [commentId]: Math.min(3, formattedReplies.length),
        }));
      }
    } catch (error) {
      console.error("❌ 获取回复失败:", error);
      Alert.alert("错误", "加载回复失败，请稍后重试");
    } finally {
      setLoadingReplies((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  }, [commentReplies, loadingReplies]);

  /* ---------------- 🟢 查看更多回复 ---------------- */
  const showMoreReplies = useCallback((commentId: string) => {
    setVisibleRepliesCount((prev) => {
      const currentCount = prev[commentId] || 3;
      const totalReplies = commentReplies[commentId]?.length || 0;
      const newCount = Math.min(currentCount + 10, totalReplies);
      return { ...prev, [commentId]: newCount };
    });
  }, [commentReplies]);

  /* ---------------- 🟢 发送回复 ---------------- */
  const handleSendReply = useCallback(
    async (commentId: string) => {
      if (!replyText.trim() || !selectedPostForComments) return;

      const userId = "Me";
      const username = "我";

      try {
        const apiResponse = await postComment(selectedPostForComments.id, replyText.trim(), userId, commentId);
        const newReply = {
          id: apiResponse?.commentId || Date.now().toString(),
          user: {
            username: apiResponse?.data?.author || username || "匿名用户",
            id: apiResponse?.data?.author || userId || "unknown",
          },
          content: apiResponse?.data?.content || replyText,
          createdAt: apiResponse?.data?.createdAt || new Date().toISOString(),
          parentCommentId: commentId,
        };

        setCommentReplies((prev) => ({
          ...prev,
          [commentId]: [...(prev[commentId] || []), newReply],
        }));

        setReplyText("");
        setActiveReplyCommentId(null);
        Keyboard.dismiss();
        Alert.alert("成功", "回复已发送");
      } catch (error) {
        console.error("❌ 回复发送失败:", error);
        Alert.alert("错误", "发送回复失败，请稍后重试");
      }
    },
    [replyText, selectedPostForComments]
  );

  return {
    // 状态
    showCommentModal,
    selectedPostForComments,
    commentText,
    activeReplyCommentId,
    replyText,
    commentReplies,
    loadingReplies,
    visibleRepliesCount,

    // 方法
    openCommentModal,
    closeCommentModal,
    setCommentText,
    handleAddComment,
    handleCommentLike,
    handleReply,
    setReplyText,
    handleSendReply,
    loadCommentReplies,
    showMoreReplies,
    setSelectedPostForComments,
  };
}
