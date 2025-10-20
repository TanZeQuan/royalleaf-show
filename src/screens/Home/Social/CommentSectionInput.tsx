import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { commentModalStyles } from '../Social/SocialStyles';
import { CreateComment } from '../../../services/SocialService/SocialScreenApi';
import { getUserData, User } from '../../../utils/storage';

interface CommentInputSectionProps {
  commentText: string;
  onTextChange: (text: string) => void;
  postId: string;
  parentCommentId?: string | null;
  onCommentCreated?: (newComment: any) => void; // 创建成功回调
}

export const CommentInputSection: React.FC<CommentInputSectionProps> = ({
  commentText,
  onTextChange,
  postId,
  parentCommentId = null,
  onCommentCreated,
}) => {
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isDisabled = !commentText.trim() || sending;

  // 获取当前用户信息
  useEffect(() => {
    (async () => {
      const user = await getUserData();
      setCurrentUser(user);
    })();
  }, []);

  const handleSendPress = async () => {
    if (isDisabled || !currentUser) return;

    setSending(true);
    try {
      const payload = {
        postId,
        userId: currentUser.user_id,
        desc: commentText,
        parentCommentId,
        gens: parentCommentId ? 2 : 1,
      };

      console.log("🟢 准备发送评论:", payload);

      // 调用创建评论 API
      const response = await CreateComment(payload);

      // 使用后端返回的对象，如果没有 commentId，则生成一个临时 id
      const commentId = response?.data?.commentId || response?.commentId || `temp-${Date.now()}`;

      // 构造用于 UI 显示的新评论
      const newCommentForUI = {
        id: commentId,
        content: commentText,
        user: {
          user_id: currentUser.user_id || currentUser.id || "anonymous",
          username: currentUser.username || "匿名用户",
          avatar: currentUser.image || "🧑🏻",
        },
        likes: 0,
        createdAt: new Date().toISOString(),
        parentCommentId: parentCommentId || null,
        isLiked: false,
      };

      // 立即更新评论区
      onCommentCreated?.(newCommentForUI);

      // 清空输入框
      onTextChange("");

    } catch (error) {
      console.error("❌ 评论发送失败:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={commentModalStyles.commentInputSection}>
      <View style={commentModalStyles.commentInputAvatar}>
        <Text style={commentModalStyles.commentAvatarText}>
          {currentUser?.image || "🧑🏻"}
        </Text>
      </View>

      <View style={commentModalStyles.commentInputWrapper}>
        <TextInput
          style={commentModalStyles.commentInput}
          placeholder="添加评论..."
          placeholderTextColor="#999"
          value={commentText}
          onChangeText={onTextChange}
          multiline
          maxLength={500}
          editable={!sending}
        />

        <TouchableOpacity
          style={[
            commentModalStyles.commentSendButton,
            isDisabled && { opacity: 0.5 },
          ]}
          onPress={handleSendPress}
          disabled={isDisabled}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text
              style={[
                commentModalStyles.commentSendButtonText,
                isDisabled && { color: '#ccc' },
              ]}
            >
              发布
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
