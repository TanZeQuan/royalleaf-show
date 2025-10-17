// CommentItem.tsx - 单条评论组件（改进版）
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { commentModalStyles } from '../Social/SocialStyles';
import { Comment } from './TopicSlice';

interface CommentItemProps {
  comment: Comment;
  activeReplyCommentId: string | null;
  replyText: string;
  commentReplies: Record<string, any[]>;
  loadingReplies: Set<string>;
  visibleRepliesCount: Record<string, number>;
  onReply: (commentId: string) => void;           // 切换回复框开/关
  onCommentLike: (commentId: string) => void;
  onSendReply: (commentId: string) => Promise<void>;
  onLoadReplies: (commentId: string) => void;
  onShowMoreReplies: (commentId: string) => void;
  onReplyTextChange: (text: string) => void;      // 更改回复文本
}

export const CommentItem: React.FC<CommentItemProps> = ({
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
}) => {
  const replies = commentReplies[comment.id] || [];
  const visibleCount = visibleRepliesCount[comment.id] || 3;
  const isReplying = activeReplyCommentId === comment.id;

  // 处理发送回复 - 发送后自动关闭输入框
  const handleSendReply = async () => {
    await onSendReply(comment.id);
    // onSendReply 内部会自动清空 replyText 和关闭回复框
  };

  // 处理取消回复 - 只需要切换回复状态
  const handleCancelReply = () => {
    onReply(comment.id); // 这会自动关闭回复框
    onReplyTextChange(""); // 清空文本
  };

  return (
    <View style={commentModalStyles.commentItem}>
      <View style={commentModalStyles.commentAvatar}>
        <Text style={commentModalStyles.commentAvatarText}>👤</Text>
      </View>
      <View style={commentModalStyles.commentContent}>
        {/* 评论用户名和内容 */}
        <Text style={commentModalStyles.commentUser}>{comment.user}</Text>
        <Text style={commentModalStyles.commentText}>{comment.text}</Text>

        {/* 评论操作栏：时间、回复按钮、点赞按钮 */}
        <View style={commentModalStyles.commentMeta}>
          <Text style={commentModalStyles.commentTime}>刚刚</Text>
          
          <TouchableOpacity
            onPress={() => onReply(comment.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={commentModalStyles.commentReplyButton}>
              {isReplying ? "关闭" : "回复"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onCommentLike(comment.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={commentModalStyles.commentLikeIcon}>
              {comment.isLiked ? '❤️' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 回复输入框 - 只在 isReplying 为 true 时显示 */}
        {isReplying && (
          <View style={commentModalStyles.replyInputContainer}>
            <View style={commentModalStyles.replyInputWrapper}>
              <TextInput
                style={commentModalStyles.replyInput}
                placeholder={`回复 ${comment.user}...`}
                value={replyText}
                onChangeText={onReplyTextChange}
                multiline
                maxLength={500}
                autoFocus
              />
              <View style={commentModalStyles.replyActions}>
                <TouchableOpacity
                  style={commentModalStyles.replyActionButton}
                  onPress={handleCancelReply}
                >
                  <Text style={commentModalStyles.replyActionText}>取消</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    commentModalStyles.replyActionButton,
                    commentModalStyles.replyActionButtonActive,
                    !replyText.trim() && commentModalStyles.replyActionButtonDisabled
                  ]}
                  onPress={handleSendReply}
                  disabled={!replyText.trim()}
                >
                  <Text style={[
                    commentModalStyles.replyActionText,
                    commentModalStyles.replyActionTextActive,
                    !replyText.trim() && commentModalStyles.replyActionTextDisabled
                  ]}>发送</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* 回复列表 */}
        {replies.length > 0 && (
          <View style={commentModalStyles.repliesContainer}>
            {replies.slice(0, visibleCount).map((reply: any, index: number) => (
              <View key={reply.commentLogId || reply.id || index} style={commentModalStyles.replyItem}>
                <View style={commentModalStyles.replyAvatar}>
                  <Text style={commentModalStyles.replyAvatarText}>👤</Text>
                </View>
                <View style={commentModalStyles.replyContent}>
                  <Text style={commentModalStyles.replyUser}>{reply.userId || 'User'}</Text>
                  <Text style={commentModalStyles.replyText}>{reply.desc}</Text>
                </View>
              </View>
            ))}

            {/* 查看更多回复按钮 */}
            {replies.length > visibleCount && (
              <TouchableOpacity
                style={commentModalStyles.loadMoreReplies}
                onPress={() => onShowMoreReplies(comment.id)}
              >
                <Text style={commentModalStyles.loadMoreRepliesText}>
                  查看更多回复 ({replies.length - visibleCount}条)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* 加载回复按钮 - 当还没加载过回复时显示 */}
        {!commentReplies[comment.id] && !loadingReplies.has(comment.id) && (
          <TouchableOpacity
            style={commentModalStyles.loadRepliesButton}
            onPress={() => onLoadReplies(comment.id)}
          >
            <Text style={commentModalStyles.loadRepliesButtonText}>查看回复</Text>
          </TouchableOpacity>
        )}

        {/* 加载状态 */}
        {loadingReplies.has(comment.id) && (
          <View style={commentModalStyles.loadingReplies}>
            <Text style={commentModalStyles.loadingRepliesText}>加载回复中...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// EmptyComments.tsx - 空评论状态组件
export const EmptyComments: React.FC = () => (
  <View style={commentModalStyles.emptyCommentsContainer}>
    <Text style={commentModalStyles.emptyCommentsIcon}>💬</Text>
    <Text style={commentModalStyles.emptyCommentsTitle}>还没有评论</Text>
    <Text style={commentModalStyles.emptyCommentsText}>快来抢沙发吧！</Text>
  </View>
);