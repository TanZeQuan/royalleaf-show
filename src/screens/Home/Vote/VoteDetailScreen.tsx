import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  TextInput,
  Dimensions,
  Modal,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { typography, colors } from "styles";

const { width } = Dimensions.get("window");

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
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
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
              maxLength={200}
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
          <Text style={styles.charCount}>{commentText.length}/200</Text>
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
              您确定要投票给{itemData.name ? `"${itemData.name}"` : "这个选项"}吗？
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
            <Text style={styles.notificationMessage}>{notificationMessage}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary_bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: colors.gold_light,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: { fontSize: 20, color: colors.black, fontWeight: "bold" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: colors.black },
  placeholder: { width: 32 },
  content: { flex: 1 },
  mainImageContainer: { position: "relative", marginBottom: 24 },
  mainImage: { width: width, height: width * 0.8 },
  imageTitle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.gold_deep,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  itemName: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "center",
  },
  voteSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  voteCountText: { fontSize: 16, color: "#666666", marginBottom: 8 },
  voteCountNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.green_deep,
  },
  actionSection: { paddingHorizontal: 20, marginBottom: 24 },
  voteButton: {
    backgroundColor: colors.gold_deep,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  votedButton: { backgroundColor: colors.gray_light },
  voteButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },
  votedButtonText: { color: colors.gray_text },
  commentInputSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
    backgroundColor: colors.gold_light,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 12,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 5,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray_deep,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 16,
    color: colors.black,
    backgroundColor: colors.white,
  },
  commentButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  commentButtonActive: { backgroundColor: colors.gold_deep },
  commentButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.gray_text,
  },
  commentButtonTextActive: { color: colors.black },
  charCount: {
    fontSize: 12,
    color: colors.gray_text,
    textAlign: "right",
    marginBottom: 10,
  },
  commentsSection: { paddingHorizontal: 20, marginBottom: 24 },
  commentItem: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.gold_deep,
  },
  commentTime: { fontSize: 12, color: colors.gray_text },
  commentText: { fontSize: 16, color: colors.black, lineHeight: 22 },
  noCommentsText: {
    fontSize: 16,
    color: colors.gray_text,
    textAlign: "center",
    paddingVertical: 24,
  },
  bottomSpacing: { height: 40 },
  // 模态框样式
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.black,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: colors.gray_light,
  },
  confirmButton: {
    backgroundColor: colors.gold_deep,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.gray_text,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
  },
  // 通知样式
  notificationOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  notificationContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  notificationMessage: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
  },
});

export default VoteDetailScreen;