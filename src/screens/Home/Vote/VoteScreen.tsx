// screens/VoteDetail/VoteDetailScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Comment,
  ItemData,
  RouteParams,
  VoteProductDetails,
  getComments,
  getVoteProductDetails,
  submitComment,
  submitVoteFetch,
} from "../../../services/VoteService/voteDetailsApi";
import { getUserData } from "../../../utils/storage";
import { styles } from "./Styles/VoteCSS";

type VoteDetailNavigationProp = NativeStackNavigationProp<any>;

const VoteDetailScreen = () => {
  const navigation = useNavigation<VoteDetailNavigationProp>();
  const route = useRoute();
  const {
    productId,
    product: initialProduct,
  } = route.params as RouteParams;

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

  useEffect(() => {
    const fetchProductDetailsAndComments = async () => {
      try {
        setLoading(true);
        const [productDetails, commentsData] = await Promise.all([
          getVoteProductDetails(productId),
          getComments(productId),
        ]);

        if (productDetails) {
          setProduct(productDetails);
          setVoteCount(productDetails.voted);
        }

        if (commentsData && commentsData.length > 0) {
          setComments(commentsData);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error("❌ 获取数据出错:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetailsAndComments();
  }, [productId]);

  const refreshComments = async () => {
    if (!productId) return;
    try {
      const commentsData = await getComments(productId);
      if (commentsData) {
        setComments(commentsData);
        showCustomNotification("刷新成功", "评论列表已更新");
      }
    } catch (error) {
      console.error("刷新评论出错:", error);
      showCustomNotification("刷新失败", "无法获取最新评论");
    }
  };

  const showCustomNotification = (title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const getItemData = (): ItemData => {
    if (!product) {
      return {
        image: require("assets/images/mock.jpg"),
        designer: { name: "加载中...", desc: "正在获取设计师信息" },
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

  const confirmVote = async () => {
    if (!product) return;
    try {
      const user = await getUserData();
      if (!user || !user.user_id) {
        showCustomNotification("错误", "请先登录再投票");
        return;
      }
      if (!product.votesId || !product.subId) {
        showCustomNotification("错误", "投票数据不完整");
        return;
      }
      const voteData = {
        votesId: product.votesId,
        targetSubId: product.subId,
      };
      const response = await submitVoteFetch(voteData);
      if (response.success) {
        setVoteCount((prev) => prev + 1);
        setHasVoted(true);
        setShowConfirmModal(false);
        showCustomNotification("投票成功", "感谢您的投票！");
      } else {
        showCustomNotification("投票失败", response.message);
      }
    } catch (error) {
      console.error("💥 投票过程出错:", error);
      showCustomNotification("错误", "投票失败，请稍后再试");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      showCustomNotification("提示", "请输入评论内容");
      return;
    }
    if (!productId) {
      showCustomNotification("错误", "无法提交评论，缺少产品ID");
      return;
    }
    try {
      const user = await getUserData();
      if (!user || !user.user_id) {
        showCustomNotification("错误", "请先登录再发表评论");
        return;
      }
      const response = await submitComment({
        subId: productId,
        userId: user.user_id,
        desc: commentText.trim(),
      });
      if (response.success) {
        setCommentText("");
        await refreshComments();
        showCustomNotification("发表成功", "您的评论已发表");
      } else {
        showCustomNotification("发表失败", response.message);
      }
    } catch (error) {
      console.error("💥 发表评论出错:", error);
      showCustomNotification("错误", "评论发表失败，请稍后再试");
    }
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
        <View style={styles.mainImageContainer}>
          <Image
            source={itemData.image}
            style={styles.mainImage}
            resizeMode="cover"
          />
          {itemData.name && (
            <View style={styles.imageTitle}>
              <Text style={styles.itemName}>{itemData.name}</Text>
            </View>
          )}
        </View>
        {itemData.designer && (
          <View style={styles.designerSection}>
            <Text style={styles.sectionTitle}>设计师信息</Text>
            <View style={styles.designerInfo}>
              <View style={styles.designerAvatar}>
                <Ionicons
                  name="person-circle"
                  size={40}
                  color={styles.designerIcon.color}
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
        <View style={styles.voteSection}>
          <Text style={styles.voteCountText}>当前投票数</Text>
          <Text style={styles.voteCountNumber}>{voteCount}</Text>
        </View>
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
        <View style={styles.commentsSection}>
          <View style={styles.commentsHeader}>
            <Text style={styles.sectionTitle}>评论区 ({comments.length})</Text>
          </View>
          {displayedComments.length > 0 ? (
            <>
              {displayedComments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
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
                  onPress={() => setCommentsDisplayCount(prev => prev + 10)}
                >
                  <Text style={styles.loadMoreText}>加载更多评论</Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={styles.loadMoreIcon.color}
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

      {/* Modals */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
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
                onPress={() => setShowConfirmModal(false)}
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