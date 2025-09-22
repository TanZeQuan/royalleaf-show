// 投票详情页面

import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { styles } from "./VoteDetailCSS";

type VoteDetailNavigationProp = NativeStackNavigationProp<any>;

interface RouteParams {
  imageId: number;
  category: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  timeAgo: string;
}

interface ItemData {
  image: any;
  name?: string; // name 为可选
}

const VoteDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<VoteDetailNavigationProp>();
  const route = useRoute();
  const { imageId, category } = route.params as RouteParams;

  const [voteCount, setVoteCount] = useState(156);
  const [hasVoted, setHasVoted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: "茶友小王",
      text: "这个选择太棒了！我也很喜欢",
      timeAgo: "2小时前",
    },
    {
      id: "2",
      user: "奶茶爱好者",
      text: "确实是不错的选择，味道很好",
      timeAgo: "4小时前",
    },
    {
      id: "3",
      user: "品茶达人",
      text: "支持这个！质量很高",
      timeAgo: "6小时前",
    },
  ]);

  // 显示自定义通知
  const showCustomNotification = (title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotification(true);

    // 3秒后自动关闭
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // 明确返回类型 ItemData，name 是可选的
  const getItemData = (id: number, cat: string): ItemData => {
    const items: Record<number, ItemData> = {
      1: { name: "珍珠奶茶", image: require("assets/images/mock.jpg") },
      2: { name: "芋圆奶茶", image: require("assets/images/mock.jpg") },
      3: { name: "红豆奶茶", image: require("assets/images/mock.jpg") },
      4: { name: "椰果奶茶", image: require("assets/images/mock.jpg") },
      5: { name: "布丁奶茶", image: require("assets/images/mock.jpg") },
      6: { name: "仙草奶茶", image: require("assets/images/mock.jpg") },
      7: { image: require("assets/images/mock.jpg") }, // 没有 name
      8: { image: require("assets/images/mock.jpg") },
      9: { image: require("assets/images/mock.jpg") },
      10: { image: require("assets/images/mock.jpg") },
      11: { image: require("assets/images/mock.jpg") },
      12: { image: require("assets/images/mock.jpg") },
      13: { image: require("assets/images/mock.jpg") },
      14: { image: require("assets/images/mock.jpg") },
      15: { image: require("assets/images/mock.jpg") },
      16: { image: require("assets/images/mock.jpg") },
      17: { image: require("assets/images/mock.jpg") },
      18: { image: require("assets/images/mock.jpg") },
    };

    return (
      items[id] || {
        name: "未知选项",
        image: require("assets/images/mock.jpg"),
      }
    );
  };

  const itemData = getItemData(imageId, category);

  const handleVotePress = () => {
    if (hasVoted) {
      showCustomNotification("提示", "您已经投过票了！");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmVote = () => {
    setVoteCount((prev) => prev + 1);
    setHasVoted(true);
    setShowConfirmModal(false);
    showCustomNotification("投票成功", "感谢您的投票！");
  };

  const cancelVote = () => {
    setShowConfirmModal(false);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) {
      showCustomNotification("提示", "请输入评论内容");
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      user: "我",
      text: commentText.trim(),
      timeAgo: "刚刚",
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
    showCustomNotification("发表成功", "您的评论已发表");
  };

  const handleGoBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>投票详情</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <View style={styles.mainImageContainer}>
          <Image
            source={itemData.image}
            style={styles.mainImage}
            resizeMode="cover"
          />

          {/* 这里用条件渲染：只有 itemData.name 存在时才渲染黄底和名字 */}
          {itemData.name ? (
            <View style={styles.imageTitle}>
              <Text style={styles.itemName}>{itemData.name}</Text>
            </View>
          ) : null}
        </View>

        {/* Vote Count */}
        <View style={styles.voteSection}>
          <Text style={styles.voteCountText}>当前投票数</Text>
          <Text style={styles.voteCountNumber}>{voteCount}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.voteButton, hasVoted && styles.votedButton]}
            onPress={handleVotePress}
          >
            <Text
              style={[
                styles.voteButtonText,
                hasVoted && styles.votedButtonText,
              ]}
            >
              {hasVoted ? "已投票" : "投票"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Comment Input */}
        <View style={styles.commentInputSection}>
          <Text style={styles.sectionTitle}>发表评论</Text>
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="写下您的评论..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={100}
            />
            <TouchableOpacity
              style={[
                styles.commentButton,
                commentText.trim() && styles.commentButtonActive,
              ]}
              onPress={handleAddComment}
            >
              <Text
                style={[
                  styles.commentButtonText,
                  commentText.trim() && styles.commentButtonTextActive,
                ]}
              >
                发表
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.charCount}>{commentText.length}/100</Text>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>评论区 ({comments.length})</Text>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>{comment.user}</Text>
                  <Text style={styles.commentTime}>{comment.timeAgo}</Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noCommentsText}>
              还没有评论，快来抢沙发吧！
            </Text>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* 投票确认模态框 */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelVote}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>确认投票</Text>
            <Text style={styles.modalMessage}>
              您确定要投票给{itemData.name ? `"${itemData.name}"` : "这个选项"}
              吗？
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelVote}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmVote}
              >
                <Text style={styles.confirmButtonText}>确认投票</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 自定义通知 - 无按钮版本 */}
      <Modal
        visible={showNotification}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotification(false)}
      >
        <View style={styles.notificationOverlay}>
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationTitle}>{notificationTitle}</Text>
            <Text style={styles.notificationMessage}>
              {notificationMessage}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default VoteDetailScreen;
