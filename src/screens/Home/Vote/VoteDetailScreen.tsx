// VoteDetailScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import colors from "@styles/colors";
import React, { useEffect, useState } from "react";
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
} from "../../../services/VoteService/voteDetailsApi"; // API服务
import { getUserData } from "../../../utils/storage"; // ✅ 从 AsyncStorage 获取 userData
import { styles } from "./VoteDetailCSS";

type VoteDetailNavigationProp = NativeStackNavigationProp<any>;

const VoteDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<VoteDetailNavigationProp>();
  const route = useRoute();
  const { productId, product: initialProduct, activity, category } =
    route.params as RouteParams;

  const [product, setProduct] = useState<VoteProductDetails | null>(
    initialProduct || null
  );
  const [loading, setLoading] = useState(!initialProduct);
  const [voteCount, setVoteCount] = useState(initialProduct?.voted || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [commentsDisplayCount, setCommentsDisplayCount] = useState(10);
  const [comments, setComments] = useState<Comment[]>([]);
  const displayedComments = comments.slice(0, commentsDisplayCount);
  const hasMoreComments = comments.length > commentsDisplayCount;

  // 获取产品详情和评论
  useEffect(() => {
   const fetchProductDetailsAndComments = async () => {
  if (!initialProduct && productId) {
    try {
      setLoading(true);
      
      console.log("🔄 开始获取产品详情和评论...", { productId });
      
      const [productDetails, commentsData] = await Promise.all([
        voteActivityService.getVoteProductDetails(productId),
        voteActivityService.getComments(productId)
      ]);
      
      console.log("📦 产品详情结果:", productDetails);
      console.log("💬 评论数据结果:", commentsData);
      console.log("评论数据类型:", typeof commentsData);
      console.log("评论数据长度:", commentsData?.length);
      
      if (productDetails) {
        setProduct(productDetails);
        setVoteCount(productDetails.voted);
      }
      
      if (commentsData && commentsData.length > 0) {
        setComments(commentsData);
        console.log("✅ 成功加载评论数据:", commentsData);
      } else {
        console.log("❌ 没有评论数据或数据为空");
        setComments([]);
      }
      
    } catch (error) {
      console.error("❌ 获取数据出错:", error);
    } finally {
      setLoading(false);
    }
  } else if (initialProduct) {
    // 如果从导航传入了 initialProduct，单独获取评论
    try {
      console.log("🔄 单独获取评论...", { productId });
      const commentsData = await voteActivityService.getComments(productId);
      
      console.log("💬 单独获取的评论数据:", commentsData);
      console.log("评论数据长度:", commentsData?.length);
      
      if (commentsData && commentsData.length > 0) {
        setComments(commentsData);
        console.log("✅ 成功加载评论数据:", commentsData.length, "条");
      } else {
        console.log("❌ 没有评论数据");
        setComments([]);
      }
    } catch (error) {
      console.error("❌ 获取评论出错:", error);
    }
  }
};

    fetchProductDetailsAndComments();
  }, [productId, initialProduct]);

  // 刷新评论函数
  const refreshComments = async () => {
    if (!productId) return;
    
    try {
      const commentsData = await voteActivityService.getComments(productId);
      if (commentsData) {
        setComments(commentsData);
        console.log("评论数据已刷新:", commentsData.length, "条");
        showCustomNotification("刷新成功", "评论列表已更新");
      }
    } catch (error) {
      console.error("刷新评论出错:", error);
      showCustomNotification("刷新失败", "无法获取最新评论");
    }
  };

  // 显示通知
  const showCustomNotification = (title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // 获取 itemData
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

  // 点击投票
  const handleVotePress = () => {
    if (hasVoted) {
      showCustomNotification("提示", "您已经投过票了！");
      return;
    }
    setShowConfirmModal(true);
  };

  // 确认投票 - ✅ 调用真实 API
  const confirmVote = async () => {
    if (!product) return;

    try {
      // 🔹 获取已登录用户
      const user = await getUserData();
      if (!user || !user.user_id) {
        showCustomNotification("错误", "请先登录再投票");
        return;
      }

      const voteData = {
        votesId: product.votesId,
        userId: user.user_id, // ✅ 使用登录时存储的 user_id
        targetSubId: product.subId,
        name: product.name,
        desc: product.desc,
        image: product.image,
        isStatus: 1,
        approveBy: "system",
      };

      console.log("提交投票数据:", voteData);

      const response = await voteActivityService.submitVote(voteData);

      if (response.success) {
        setVoteCount((prev) => prev + 1);
        setHasVoted(true);
        setShowConfirmModal(false);
        showCustomNotification("投票成功", response.message);
      } else {
        showCustomNotification("投票失败", response.message);
      }
    } catch (error) {
      console.error("投票出错:", error);
      showCustomNotification("错误", "投票失败，请稍后再试");
    }
  };

  const cancelVote = () => {
    setShowConfirmModal(false);
  };

  // 添加评论
  const handleAddComment = async () => {
    if (!commentText.trim()) {
      showCustomNotification("提示", "请输入评论内容");
      return;
    }

    // 这里应该调用提交评论的API
    // await voteActivityService.submitComment(productId, commentText.trim());
    
    // 暂时使用本地状态更新，实际应该等API成功后再刷新
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
                <Text style={styles.designerName}>{itemData.designer.name}</Text>
                <Text style={styles.designerDesc}>{itemData.designer.desc}</Text>
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
          <View style={styles.commentsHeader}>
            <Text style={styles.sectionTitle}>评论区 ({comments.length})</Text>
          </View>
          
          {displayedComments.length > 0 ? (
            <>
              {displayedComments.map((comment) => (
                <View
                  key={comment.id}
                  style={styles.commentItem}
                >
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{comment.user}</Text>
                    <Text style={styles.commentTime}>{comment.timeAgo}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))}
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
            <Text style={styles.noCommentsText}>还没有评论，快来抢沙发吧！</Text>
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
              您确定要投票给
              {itemData.name ? `"${itemData.name}"` : "这个选项"}吗？
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

      {/* 通知 */}
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

export default VoteDetailScreen;