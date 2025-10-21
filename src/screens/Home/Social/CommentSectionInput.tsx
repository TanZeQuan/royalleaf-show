import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
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

      const response = await CreateComment(payload);

      const commentId = response?.data?.commentId || response?.commentId || `temp-${Date.now()}`;

      const newCommentForUI = {
        id: commentId,
        content: commentText,
        user: {
          user_id: currentUser.user_id || currentUser.id || "anonymous",
          username: currentUser.user_id || currentUser.id || "匿名用户",  // ✅ 使用 userId 显示
          avatar: currentUser.image || "🧑🏻",
        },
        likes: 0,
        createdAt: new Date().toISOString(),
        parentCommentId: parentCommentId || null,
        isLiked: false,
      };

      onCommentCreated?.(newCommentForUI);
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
        {currentUser?.image ? (
          <Image
            source={{ uri: currentUser.image }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            onError={(e) => console.log("❌ Input avatar image load error:", e.nativeEvent.error)}
          />
        ) : (
          <Text style={commentModalStyles.commentAvatarText}>
            {currentUser?.image ? " " : "🧑🏻"}
          </Text>
        )}
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
