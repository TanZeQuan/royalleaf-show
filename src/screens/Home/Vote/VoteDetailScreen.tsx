// 投票详情页面

import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import colors from "@styles/colors";
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
  isDesigner?: boolean; // 标记是否为设计师
  replyTo?: string; // 回复的用户名
  replyText?: string; // 回复内容
}

interface ItemData {
  image: any;
  name?: string; // name 为可选
  designer?: {
    name: string;
    desc: string;
  };
}

const VoteDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<VoteDetailNavigationProp>();
  const route = useRoute();
  const { imageId, category } = route.params as RouteParams;

  const [voteCount, setVoteCount] = useState(156);
  const [hasVoted, setHasVoted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState(""); // 回复输入框
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // 正在回复的用户
  const [showNotification, setShowNotification] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [commentsDisplayCount, setCommentsDisplayCount] = useState(10); // 显示的评论数量
  
  // 模拟更多评论数据
  const allComments: Comment[] = [
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
    {
      id: "4",
      user: "设计师小美",
      text: "感谢您的反馈！我们会继续努力",
      timeAgo: "5小时前",
      isDesigner: true,
      replyTo: "茶友小王",
      replyText: "这个选择太棒了！我也很喜欢"
    },
    {
      id: "5",
      user: "茶饮探索者",
      text: "包装设计很有特色",
      timeAgo: "8小时前",
    },
    {
      id: "6",
      user: "设计师小美",
      text: "谢谢您的认可！包装是我们团队精心设计的",
      timeAgo: "7小时前",
      isDesigner: true,
      replyTo: "茶饮探索者",
      replyText: "包装设计很有特色"
    },
    {
      id: "7",
      user: "奶茶控",
      text: "口感如何？有人试过吗？",
      timeAgo: "9小时前",
    },
    {
      id: "8",
      user: "资深茶友",
      text: "试过了，口感很顺滑，推荐！",
      timeAgo: "8小时前",
    },
    {
      id: "9",
      user: "设计师小美",
      text: "我们的产品注重口感和品质，欢迎尝试！",
      timeAgo: "7小时前",
      isDesigner: true,
      replyTo: "奶茶控",
      replyText: "口感如何？有人试过吗？"
    },
    {
      id: "10",
      user: "新茶友",
      text: "第一次尝试，很惊喜！",
      timeAgo: "6小时前",
    },
    // 更多评论...
    {
      id: "11",
      user: "茶文化爱好者",
      text: "这个茶饮很有创意，结合了传统和现代元素",
      timeAgo: "5小时前",
    },
    {
      id: "12",
      user: "设计师小美",
      text: "很高兴您能感受到我们的设计理念！",
      timeAgo: "4小时前",
      isDesigner: true,
      replyTo: "茶文化爱好者",
      replyText: "这个茶饮很有创意，结合了传统和现代元素"
    },
    {
      id: "13",
      user: "日常消费者",
      text: "价格也很合理，性价比高",
      timeAgo: "3小时前",
    },
    {
      id: "14",
      user: "品质追求者",
      text: "原料来源可靠吗？",
      timeAgo: "2小时前",
    },
    {
      id: "15",
      user: "设计师小美",
      text: "我们使用优质原料，有完整的供应链保障",
      timeAgo: "1小时前",
      isDesigner: true,
      replyTo: "品质追求者",
      replyText: "原料来源可靠吗？"
    },
  ];

  const [comments, setComments] = useState<Comment[]>(allComments);

  // 当前显示的评论
  const displayedComments = comments.slice(0, commentsDisplayCount);
  const hasMoreComments = comments.length > commentsDisplayCount;

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
      1: { 
        name: "珍珠奶茶", 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "设计师小美",
          desc: "资深茶饮设计师，拥有5年茶饮设计经验，专注于将传统茶文化与现代审美相结合"
        }
      },
      2: { 
        name: "芋圆奶茶", 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "创意阿杰",
          desc: "新锐茶饮设计师，擅长创新口味和视觉设计，致力于带给消费者全新体验"
        }
      },
      3: { 
        name: "红豆奶茶", 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "传统大师",
          desc: "传统茶艺传承人，注重原料品质和传统工艺，坚持做最地道的茶饮"
        }
      },
      4: { 
        name: "椰果奶茶", 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "热带风情",
          desc: "擅长热带风味茶饮设计，带来阳光般的口感体验"
        }
      },
      5: { 
        name: "布丁奶茶", 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "甜美时光",
          desc: "专注于甜品与茶饮的完美结合，创造甜蜜的味觉旅程"
        }
      },
      6: { 
        name: "仙草奶茶", 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "清凉一夏",
          desc: "擅长清凉系茶饮，为炎炎夏日带来一丝清凉"
        }
      },
      7: { 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "神秘设计师",
          desc: "保持神秘感的设计师，作品总是充满惊喜"
        }
      },
      8: { 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "简约派",
          desc: "崇尚简约设计理念，less is more"
        }
      },
      9: { 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "色彩大师",
          desc: "擅长运用色彩心理学，通过颜色影响味觉体验"
        }
      },
      10: { 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "自然主义者",
          desc: "追求自然原味，减少人工添加，还原茶的本真"
        }
      },
      11: { 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "科技先锋",
          desc: "将科技与茶饮结合，创造未来感十足的茶饮体验"
        }
      },
      12: { 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "文化传承者",
          desc: "致力于茶文化的现代传承与创新"
        }
      },
      13: { 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "跨界玩家",
          desc: "擅长不同领域的跨界融合，创造独特茶饮"
        }
      },
      14: { 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "健康倡导者",
          desc: "关注健康饮食，设计低糖低卡的健康茶饮"
        }
      },
      15: { 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "怀旧经典",
          desc: "重现经典口味，唤起美好回忆"
        }
      },
      16: { 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "时尚潮流",
          desc: "紧跟时尚潮流，设计年轻人喜爱的茶饮"
        }
      },
      17: { 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "地域特色",
          desc: "挖掘各地特色食材，打造地域风味茶饮"
        }
      },
      18: { 
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "季节限定",
          desc: "根据不同季节设计限定款茶饮"
        }
      },
    };

    return (
      items[id] || {
        name: "未知选项",
        image: require("assets/images/mock.jpg"),
        designer: {
          name: "默认设计师",
          desc: "这位设计师的信息暂时无法获取"
        }
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

  const handleAddReply = (user: string) => {
    if (!replyText.trim()) {
      showCustomNotification("提示", "请输入回复内容");
      return;
    }

    const newReply: Comment = {
      id: Date.now().toString(),
      user: "设计师小美", // 假设固定为设计师回复
      text: replyText.trim(),
      timeAgo: "刚刚",
      isDesigner: true,
      replyTo: user,
      replyText: comments.find(c => c.user === user)?.text || ""
    };

    setComments((prev) => [newReply, ...prev]);
    setReplyText("");
    setReplyingTo(null);
    showCustomNotification("回复成功", "您的回复已发表");
  };

  const handleLoadMore = () => {
    setCommentsDisplayCount(prev => prev + 10);
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

        {/* Designer Info */}
        {itemData.designer && (
          <View style={styles.designerSection}>
            <Text style={styles.sectionTitle}>设计师信息</Text>
            <View style={styles.designerInfo}>
              <View style={styles.designerAvatar}>
                <Ionicons name="person-circle" size={40} color={colors.green_deep} />
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
          <Text style={styles.sectionTitle}>评论区 ({comments.length})</Text>
          {displayedComments.length > 0 ? (
            <>
              {displayedComments.map((comment) => (
                <View key={comment.id} style={[
                  styles.commentItem,
                  comment.isDesigner && styles.designerComment
                ]}>
                  {/* 设计师回复的样式 */}
                  {comment.isDesigner && comment.replyTo ? (
                    <View style={styles.replyComment}>
                      <View style={styles.replyHeader}>
                        <View style={styles.designerBadge}>
                          <Ionicons name="checkmark-circle" size={12} color={colors.white} />
                          <Text style={styles.designerBadgeText}>设计师</Text>
                        </View>
                        <Text style={styles.commentUser}>{comment.user}</Text>
                        <Text style={styles.commentTime}>{comment.timeAgo}</Text>
                      </View>
                      
                      {/* 回复的原文引用 */}
                      <View style={styles.replyOriginal}>
                        <Text style={styles.replyToText}>回复 {comment.replyTo}:</Text>
                        <Text style={styles.replyOriginalText}>"{comment.replyText}"</Text>
                      </View>
                      
                      <Text style={styles.commentText}>{comment.text}</Text>
                      
                      {/* 回复按钮 - 不对设计师评论显示 */}
                    </View>
                  ) : (
                    <View>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentUser}>{comment.user}</Text>
                        <Text style={styles.commentTime}>{comment.timeAgo}</Text>
                      </View>
                      <Text style={styles.commentText}>{comment.text}</Text>
                      
                      {/* 回复按钮 - 不对自己的评论显示 */}
                      {comment.user !== "我" && !comment.isDesigner && (
                        <TouchableOpacity 
                          style={styles.replyButton}
                          onPress={() => setReplyingTo(replyingTo === comment.user ? null : comment.user)}
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
                  <Ionicons name="chevron-down" size={16} color={colors.green_deep} />
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