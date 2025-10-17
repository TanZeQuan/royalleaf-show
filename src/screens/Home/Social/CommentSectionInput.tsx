import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { commentModalStyles } from '../Social/SocialStyles';
import { CreateComment } from '../../../services/SocialService/SocialScreenApi'; // ✅ 引入 API

interface CommentInputSectionProps {
  commentText: string;
  onTextChange: (text: string) => void;
  postId: string;
  userId: string;          // 当前登录用户ID
  parentCommentId?: string | null; // 回复某条评论时可传
  onCommentCreated?: (newComment: any) => void; // 创建成功回调
}

export const CommentInputSection: React.FC<CommentInputSectionProps> = ({
  commentText,
  onTextChange,
  postId,
  userId,
  parentCommentId = null,
  onCommentCreated,
}) => {
  const [sending, setSending] = useState(false);
  const isDisabled = !commentText.trim() || sending;

  const handleSendPress = async () => {
    if (isDisabled) return;

    setSending(true);
    try {
      const payload = {
        postId: postId,
        userId: userId,
        desc: commentText,
        parentCommentId: parentCommentId,
        gens: parentCommentId ? 2 : 1, // 1=一级评论, 2=回复
      };

      const newComment = await CreateComment(payload);
      if (onCommentCreated) onCommentCreated(newComment.data); // 注意取 data

      onTextChange(''); // 清空输入框
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
          🧑🏻
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
