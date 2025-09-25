// VoteDetailScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import colors from "@styles/colors";
import React, { useEffect, useState } from "react"; // 添加 useEffect
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
import {
  Comment,
  ItemData,
  RouteParams,
  voteActivityService,
  VoteProductDetails,
} from "../../../services/VoteService/voteDetailsApi"; // 导入API服务
import { styles } from "./VoteDetailCSS";

type VoteDetailNavigationProp = NativeStackNavigationProp<any>;

const VoteDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<VoteDetailNavigationProp>();
  const route = useRoute();
  const {
    productId,
    product: initialProduct,
    activity,
    category,
  } = route.params as RouteParams;

  const [product, setProduct] = useState<VoteProductDetails | null>(
    initialProduct || null
  );
  const [loading, setLoading] = useState(!initialProduct); // 如果没有初始数据则加载
  const [voteCount, setVoteCount] = useState(initialProduct?.voted || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [commentsDisplayCount, setCommentsDisplayCount] = useState(10);

  // 获取产品详情
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!initialProduct && productId) {
        try {
          setLoading(true);
          const productDetails =
            await voteActivityService.getVoteProductDetails(productId);
          if (productDetails) {
            setProduct(productDetails);
            setVoteCount(productDetails.voted);
          }
        } catch (error) {
          console.error("获取产品详情出错:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductDetails();
  }, [productId, initialProduct]);

  // 模拟评论数据（暂时保留，后续可以替换为真实API）
  const allComments: Comment[] = [
    // ... 保持原有的评论数据不变
  ];

  const [comments, setComments] = useState<Comment[]>(allComments);
  const displayedComments = comments.slice(0, commentsDisplayCount);
  const hasMoreComments = comments.length > commentsDisplayCount;

  // 显示自定义通知
  const showCustomNotification = (title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // 使用真实数据替换模拟数据
  const getItemData = (): ItemData => {
    if (!product) {
      return {
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "加载中...",
          desc: "正在获取设计师信息",
        },
      };
    }

    return {
      name: product.name,
      image: product.image
        ? { uri: product.image }
        : require("assets/images/mock.jpg"),
      designer: {
        name: product.userId || "未知设计师",
        desc: product.desc || "这位设计师很神秘，没有留下描述",
      },
    };
  };

  const itemData = getItemData();

  const handleVotePress = () => {
    if (hasVoted) {
      showCustomNotification("提示", "您已经投过票了！");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmVote = () => {
    // 这里可以添加实际的投票API调用
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

  const handleAddReply = (user: string) => {
    if (!replyText.trim()) {
      showCustomNotification("提示", "请输入回复内容");
      return;
    }

    const newReply: Comment = {
      id: Date.now().toString(),
      user: "设计师小美",
      text: replyText.trim(),
      timeAgo: "刚刚",
      isDesigner: true,
      replyTo: user,
      replyText: comments.find((c) => c.user === user)?.text || "",
    };

    setComments((prev) => [newReply, ...prev]);
    setReplyText("");
    setReplyingTo(null);
    showCustomNotification("回复成功", "您的回复已发表");
  };

  const handleLoadMore = () => {
    setCommentsDisplayCount((prev) => prev + 10);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
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
        <View style={styles.centerContainer}>
          <Text style={styles.centerText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

          {itemData.name ? (
            <View style={styles.imageTitle}>
              <Text style={styles.itemName}>{itemData.name}</Text>
            </View>
          ) : null}
        </View>

        {/* Designer Info */}
        {itemData.designer && (
          <View style={styles.designerSection}>
            <Text style={styles.sectionTitle}>设计师信息</Text>
            <View style={styles.designerInfo}>
              <View style={styles.designerAvatar}>
                <Ionicons
                  name="person-circle"
                  size={40}
                  color={colors.green_deep}
                />
              </View>
              <View style={styles.designerDetails}>
                <Text style={styles.designerName}>
                  {itemData.designer.name}
                </Text>
                <Text style={styles.designerDesc}>
                  {itemData.designer.desc}
                </Text>
              </View>
            </View>
          </View>
        )}

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
          {displayedComments.length > 0 ? (
            <>
              {displayedComments.map((comment) => (
                <View
                  key={comment.id}
                  style={[
                    styles.commentItem,
                    comment.isDesigner && styles.designerComment,
                  ]}
                >
                  {/* 设计师回复的样式 */}
                  {comment.isDesigner && comment.replyTo ? (
                    <View style={styles.replyComment}>
                      <View style={styles.replyHeader}>
                        <View style={styles.designerBadge}>
                          <Ionicons
                            name="checkmark-circle"
                            size={12}
                            color={colors.white}
                          />
                          <Text style={styles.designerBadgeText}>设计师</Text>
                        </View>
                        <Text style={styles.commentUser}>{comment.user}</Text>
                        <Text style={styles.commentTime}>
                          {comment.timeAgo}
                        </Text>
                      </View>

                      {/* 回复的原文引用 */}
                      <View style={styles.replyOriginal}>
                        <Text style={styles.replyToText}>
                          回复 {comment.replyTo}:
                        </Text>
                        <Text style={styles.replyOriginalText}>
                          "{comment.replyText}"
                        </Text>
                      </View>

                      <Text style={styles.commentText}>{comment.text}</Text>

                      {/* 回复按钮 - 不对设计师评论显示 */}
                    </View>
                  ) : (
                    <View>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentUser}>{comment.user}</Text>
                        <Text style={styles.commentTime}>
                          {comment.timeAgo}
                        </Text>
                      </View>
                      <Text style={styles.commentText}>{comment.text}</Text>

                      {/* 回复按钮 - 不对自己的评论显示 */}
                      {comment.user !== "我" && !comment.isDesigner && (
                        <TouchableOpacity
                          style={styles.replyButton}
                          onPress={() =>
                            setReplyingTo(
                              replyingTo === comment.user ? null : comment.user
                            )
                          }
                        >
                          <Text style={styles.replyButtonText}>
                            {replyingTo === comment.user ? "取消回复" : "回复"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {/* 回复输入框 */}
                  {replyingTo === comment.user && (
                    <View style={styles.replyInputContainer}>
                      <TextInput
                        style={styles.replyInput}
                        placeholder={`回复 ${comment.user}...`}
                        value={replyText}
                        onChangeText={setReplyText}
                        multiline
                        maxLength={100}
                      />
                      <TouchableOpacity
                        style={[
                          styles.replySubmitButton,
                          replyText.trim() && styles.replySubmitButtonActive,
                        ]}
                        onPress={() => handleAddReply(comment.user)}
                      >
                        <Text style={styles.replySubmitButtonText}>发送</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}

              {/* 加载更多按钮 */}
              {hasMoreComments && (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={handleLoadMore}
                >
                  <Text style={styles.loadMoreText}>加载更多评论</Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={colors.green_deep}
                  />
                </TouchableOpacity>
              )}
            </>
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
