import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { commentModalStyles } from "../Social/SocialStyles";
import { useCommentLogic } from "../Social/useCommentLogic";
import { Comment } from "./TopicSlice";
import { getUserData } from "utils/storage";

/* ------------------------- 🔹 单条评论组件 ------------------------- */
export const CommentItem: React.FC<{
  comment: Comment;
  activeReplyCommentId: string | null;
  replyText: string;
  commentReplies: Record<string, any[]>;
  loadingReplies: Set<string>;
  visibleRepliesCount: Record<string, number>;
  onReply: (commentId: string) => void;
  onCommentLike: (commentId: string) => void;
  onSendReply: (commentId: string) => Promise<void>;
  onLoadReplies: (commentId: string) => void;
  onShowMoreReplies: (commentId: string) => void;
  onReplyTextChange: (text: string) => void;
  currentUser?: string;
}> = ({
  comment,
  activeReplyCommentId,
  replyText,
  commentReplies,
  loadingReplies,
  visibleRepliesCount,
  onReply,
  onCommentLike,
  onSendReply,
  onLoadReplies,
  onShowMoreReplies,
  onReplyTextChange,
  currentUser,
}) => {
    const replies = commentReplies[comment?.comment?.id] || [];
    const visibleCount = visibleRepliesCount[comment?.comment?.id] || 3;
    const isReplying = activeReplyCommentId === comment?.comment?.id;

    const handleSendReply = async () => {
      await onSendReply(comment?.comment?.id);
    };

    const handleCancelReply = () => {
      onReply(comment?.comment?.id);
      onReplyTextChange("");
    };

    // 🔹 显示用户名 & 评论内容
    const username =
      comment?.logs?.[0]?.userId ||
      comment?.comment?.userId ||
      "匿名用户";

    const content =
      comment?.logs?.[0]?.desc ||
      comment?.logs?.[0]?.content ||
      comment?.logs?.[0]?.comment_desc ||
      "（无内容）";

    return (
      <View style={commentModalStyles.commentItem}>
        {/* 头像 */}
        <View style={commentModalStyles.commentAvatar}>
          <Text style={commentModalStyles.commentAvatarText}>👤</Text>
        </View>

        {/* 评论内容 */}
        <View style={commentModalStyles.commentContent}>
          <Text style={commentModalStyles.commentUser}>
            {currentUser || comment.user || "匿名用户"}
          </Text>

          <Text style={commentModalStyles.commentText}>{comment.content}</Text>
          <View style={commentModalStyles.commentMeta}>
            <Text style={commentModalStyles.commentTime}>
              {comment?.logs?.[0]?.createdAt
                ? new Date(comment.logs[0].createdAt).toLocaleString()
                : "刚刚"}
            </Text>
            <TouchableOpacity onPress={() => onReply(comment.comment?.id)}>
              <Text style={commentModalStyles.commentReplyButton}>
                {isReplying ? "关闭" : "回复"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onCommentLike(comment.comment?.id)}>
              <Text style={commentModalStyles.commentLikeIcon}>
                {comment.isLiked ? "❤️" : "♡"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 回复输入框 */}
          {isReplying && (
            <View style={commentModalStyles.replyInputContainer}>
              <TextInput
                style={commentModalStyles.replyInput}
                placeholder={`回复 ${currentUser || username}...`}
                value={replyText}
                onChangeText={onReplyTextChange}
                multiline
                maxLength={500}
                autoFocus
              />
              <View style={commentModalStyles.replyActions}>
                <TouchableOpacity onPress={handleCancelReply}>
                  <Text style={commentModalStyles.replyActionText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSendReply}
                  disabled={!replyText.trim()}
                >
                  <Text
                    style={[
                      commentModalStyles.replyActionText,
                      !replyText.trim() && { color: "#999" },
                    ]}
                  >
                    发送
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 回复列表 */}
          {replies.length > 0 && (
            <View style={commentModalStyles.repliesContainer}>
              {replies.slice(0, visibleCount).map((reply, index) => (
                <View
                  key={reply.commentLogId || reply.id || index}
                  style={commentModalStyles.replyItem}
                >
                  <View style={commentModalStyles.replyAvatar}>
                    <Text style={commentModalStyles.replyAvatarText}>👤</Text>
                  </View>
                  <View style={commentModalStyles.replyContent}>
                    <Text style={commentModalStyles.replyUser}>
                      {reply.userId || "User"}
                    </Text>
                    <Text style={commentModalStyles.replyText}>
                      {reply.desc || reply.content || "（无内容）"}
                    </Text>
                  </View>
                </View>
              ))}

              {replies.length > visibleCount && (
                <TouchableOpacity
                  onPress={() => onShowMoreReplies(comment.comment?.id)}
                  style={commentModalStyles.loadMoreReplies}
                >
                  <Text style={commentModalStyles.loadMoreRepliesText}>
                    查看更多回复 ({replies.length - visibleCount}条)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* 加载回复 */}
          {!commentReplies[comment.comment?.id] &&
            !loadingReplies.has(comment.comment?.id) && (
              <TouchableOpacity onPress={() => onLoadReplies(comment.comment?.id)}>
                <Text style={commentModalStyles.loadRepliesButtonText}>
                  查看回复
                </Text>
              </TouchableOpacity>
            )}

          {loadingReplies.has(comment.comment?.id) && (
            <Text style={commentModalStyles.loadingRepliesText}>加载中...</Text>
          )}
        </View>
      </View>
    );
  };

/* ------------------------- 🔹 空评论状态 ------------------------- */
export const EmptyComments = () => (
  <View style={commentModalStyles.emptyCommentsContainer}>
    <Text style={commentModalStyles.emptyCommentsIcon}>💬</Text>
    <Text style={commentModalStyles.emptyCommentsTitle}>还没有评论</Text>
    <Text style={commentModalStyles.emptyCommentsText}>快来抢沙发吧！</Text>
  </View>
);

/* ------------------------- 🔹 主组件 ------------------------- */
export const SocialComment: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string>("");

  const logic = useCommentLogic() as any;
  const {
    commentList = [],
    replyText,
    activeReplyCommentId,
    commentReplies,
    visibleRepliesCount,
    loadingReplies,
    handleReply,
    handleCommentLike,
    handleSendReply,
    handleLoadReplies,
    handleShowMoreReplies,
    handleReplyTextChange,
  } = logic;

  // 🔹 获取当前用户 AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const user = await getUserData();
      if (user?.username) {
        setCurrentUser(user.username);
      }
    };
    loadUser();
  }, []);

  return (
    <View style={commentModalStyles.commentModal}>
      {commentList.length === 0 ? (
        <EmptyComments />
      ) : (
        <FlatList
          data={commentList}
          keyExtractor={(item, index) =>
            item?.comment?.id?.toString?.() || index.toString()
          }
          renderItem={({ item }) => (
            <CommentItem
              comment={item}
              activeReplyCommentId={activeReplyCommentId}
              replyText={replyText}
              commentReplies={commentReplies}
              loadingReplies={loadingReplies}
              visibleRepliesCount={visibleRepliesCount}
              onReply={handleReply}
              onCommentLike={handleCommentLike}
              onSendReply={handleSendReply}
              onLoadReplies={handleLoadReplies}
              onShowMoreReplies={handleShowMoreReplies}
              onReplyTextChange={handleReplyTextChange}
              currentUser={currentUser}
            />
          )}
        />
      )}
    </View>
  );
};
