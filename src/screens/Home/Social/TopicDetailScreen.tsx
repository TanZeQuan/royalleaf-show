import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
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
import { HomeStackParamList } from "../../../navigation/stacks/HomeNav/HomeStack";
import colors from "../../../styles/colors";
import { topicDetailStyles } from "./styles/TopicDetailCSS";
import {
  TopicData,
  TopicDetailRouteParams,
  mockTopicData,
} from "./types/TopicTypes";

const { width: screenWidth } = Dimensions.get("window");

type TopicDetailScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "TopicDetail"
>;

export default function TopicDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<TopicDetailScreenNavigationProp>();
  const route = useRoute();
  const { topicId, topicTitle, topicDescription } =
    route.params as TopicDetailRouteParams;

  const [topicData, setTopicData] = useState<TopicData | null>(
    mockTopicData[topicId] || null
  );
  const [posts, setPosts] = useState(topicData?.posts_list || []);
  const [newPostText, setNewPostText] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(
    null
  );
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    username: string;
  } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (topicData) {
      setPosts(topicData.posts_list);
    }
  }, [topicData]);

  const handleGoBack = () => navigation.goBack();

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const handleComment = (postId: string) => {
    setActiveCommentPostId((prev) => (prev === postId ? null : postId));
    setCommentText("");
    setReplyingTo(null);
    setReplyText("");
  };

  const handleReply = (commentId: string, username: string) => {
    setReplyingTo({ commentId, username });
    setReplyText(`@${username} `);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim() || !replyingTo) return;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              commentsList: p.commentsList.map((comment) =>
                comment.id === replyingTo.commentId
                  ? {
                      ...comment,
                      replies: [
                        ...comment.replies,
                        {
                          id: Date.now().toString(),
                          user: "我",
                          text: replyText.replace(
                            `@${replyingTo.username} `,
                            ""
                          ),
                          isDesigner: false,
                          replyTo: replyingTo.username,
                          timestamp: new Date().toISOString(),
                          replies: [],
                          likes: 0,
                          isLiked: false,
                        },
                      ],
                    }
                  : comment
              ),
            }
          : p
      )
    );

    setReplyText("");
    setReplyingTo(null);
  };

  const handleAddComment = (postId: string) => {
    // 如果是回复模式
    if (replyingTo) {
      handleAddReply(postId);
      return;
    }

    // 原有的添加评论逻辑
    if (!commentText.trim()) return;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments + 1,
              commentsList: [
                ...p.commentsList,
                {
                  id: Date.now().toString(),
                  user: "我",
                  text: commentText,
                  isDesigner: false,
                  replyTo: null,
                  replies: [],
                  likes: 0,
                  isLiked: false,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : p
      )
    );

    setCommentText("");
  };

  // 评论点赞功能
  const handleCommentLike = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentsList: post.commentsList.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      isLiked: !comment.isLiked,
                      likes: comment.isLiked
                        ? comment.likes - 1
                        : comment.likes + 1,
                    }
                  : comment
              ),
            }
          : post
      )
    );
  };

  // 时间格式化函数
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "刚刚";
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    return `${Math.floor(diffInMinutes / 1440)}天前`;
  };

  // 渲染评论 - 与 SocialScreen 保持一致
  const renderComments = (postId: string, comments: any[]) => {
    return comments.map((comment) => (
      <View key={comment.id}>
        {/* 主评论 */}
        <View style={topicDetailStyles.commentRow}>
          <View style={topicDetailStyles.commentAvatar}>
            <Text style={topicDetailStyles.commentAvatarText}>
              {comment.user.charAt(0)}
            </Text>
          </View>

          <View style={topicDetailStyles.commentContent}>
            <View style={topicDetailStyles.commentUserInfo}>
              <Text style={topicDetailStyles.commentUser}>{comment.user}</Text>
              {comment.isDesigner && (
                <View style={topicDetailStyles.designerBadge}>
                  <Text style={topicDetailStyles.designerBadgeText}>
                    设计师
                  </Text>
                </View>
              )}
              <Text style={topicDetailStyles.commentTime}>
                {formatTimeAgo(comment.timestamp)}
              </Text>
            </View>

            <Text style={topicDetailStyles.commentText}>{comment.text}</Text>

            <View style={topicDetailStyles.commentActions}>
              <TouchableOpacity
                style={topicDetailStyles.commentLikeButton}
                onPress={() => handleCommentLike(postId, comment.id)}
              >
                <Ionicons
                  name={comment.isLiked ? "heart" : "heart-outline"}
                  size={14}
                  style={[
                    topicDetailStyles.commentLikeIcon,
                    comment.isLiked && topicDetailStyles.likedComment,
                  ]}
                />
                <Text
                  style={[
                    topicDetailStyles.commentLikeCount,
                    comment.isLiked && topicDetailStyles.likedCommentText,
                  ]}
                >
                  {comment.likes > 0 ? comment.likes : ""}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={topicDetailStyles.commentLikeButton}
                onPress={() => handleReply(comment.id, comment.user)}
              >
                <Text style={topicDetailStyles.commentLikeCount}>回复</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 回复列表 */}
        {comment.replies && comment.replies.length > 0 && (
          <View style={topicDetailStyles.repliesContainer}>
            {comment.replies.map((reply: any) => (
              <View key={reply.id} style={topicDetailStyles.replyRow}>
                <Text style={topicDetailStyles.replyUser}>{reply.user}</Text>
                <Text style={topicDetailStyles.replyText}>
                  回复{" "}
                  <Text style={topicDetailStyles.replyTo}>
                    @{reply.replyTo}
                  </Text>
                  ：{reply.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    ));
  };

  // 评论输入框组件
  const renderCommentInput = (postId: string) => {
    const inputText = replyingTo ? replyText : commentText;
    const setInputText = replyingTo ? setReplyText : setCommentText;
    const placeholder = replyingTo
      ? `回复 ${replyingTo.username}...`
      : "说点什么...";

    return (
      <View style={topicDetailStyles.commentInputContainer}>
        <TextInput
          style={topicDetailStyles.commentTextInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={200}
        />

        <TouchableOpacity
          style={[
            topicDetailStyles.sendButton,
            !inputText.trim() && { backgroundColor: "#ccc" },
          ]}
          onPress={() => handleAddComment(postId)}
          disabled={!inputText.trim()}
        >
          <Text style={topicDetailStyles.sendButtonText}>发送</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 选择图片
  const pickImage = async (source: "camera" | "library") => {
    try {
      let result: ImagePicker.ImagePickerResult;

      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("需要相机权限", "请允许应用访问相机以拍照");
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("需要相册权限", "请允许应用访问相册以选择图片");
          return;
        }

        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("选择图片错误:", error);
      Alert.alert("错误", "选择图片时出现错误");
    }
  };

  // 移除已选图片
  const removeImage = () => {
    setSelectedImage(null);
  };

  // 发布 Post
  const handleJoinDiscussion = () => {
    if (!newPostText.trim() && !selectedImage) return;

    const newPost = {
      id: Date.now().toString(),
      username: "我",
      avatar: "🧑🏻",
      image: selectedImage
        ? { uri: selectedImage }
        : require("assets/images/mock.jpg"), // 使用选择的图片或默认图片
      caption: newPostText + ` ${topicTitle}`,
      likes: 0,
      comments: 0,
      timeAgo: "刚刚",
      isLiked: false,
      isSaved: false,
      topicTag: topicTitle,
      commentsList: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostText("");
    setSelectedImage(null); // 清空已选图片
    setShowJoinInput(false);

    if (topicData) {
      setTopicData({
        ...topicData,
        posts: topicData.posts + 1,
        posts_list: [newPost, ...topicData.posts_list],
      });
    }
  };

  const handleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (!topicData) {
    return (
      <SafeAreaView style={topicDetailStyles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f7fafc" />
        <View style={topicDetailStyles.errorContainer}>
          <Text style={topicDetailStyles.errorText}>Opps 话题不存在</Text>
          <TouchableOpacity
            style={topicDetailStyles.backButton}
            onPress={handleGoBack}
          >
            <Text style={topicDetailStyles.backButtonText}>返回</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={topicDetailStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7fafc" />

      {/* Header */}
      <View style={topicDetailStyles.header}>
        <TouchableOpacity
          style={topicDetailStyles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={topicDetailStyles.headerContent}>
          <Text style={topicDetailStyles.headerTitle} numberOfLines={1}>
            {topicData.title}
          </Text>
          <Text style={topicDetailStyles.headerSubtitle}>
            {topicData.posts} 帖子 · {topicData.participants} 参与者
          </Text>
        </View>
        <TouchableOpacity
          style={topicDetailStyles.joinButton}
          onPress={() => setShowJoinInput(true)}
        >
          <Text style={topicDetailStyles.joinButtonText}>参与</Text>
        </TouchableOpacity>
      </View>

      {/* 主 ScrollView */}
      <ScrollView
        style={topicDetailStyles.feedContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Topic Info Banner */}
        <View style={topicDetailStyles.topicBanner}>
          <View style={topicDetailStyles.topicBannerContent}>
            <Text style={topicDetailStyles.topicTitle}>{topicData.title}</Text>
            <Text style={topicDetailStyles.topicDescription}>
              {topicData.description}
            </Text>

            <View style={topicDetailStyles.topicStats}>
              <View style={topicDetailStyles.statItem}>
                <Text style={topicDetailStyles.statNumber}>
                  {topicData.posts}
                </Text>
                <Text style={topicDetailStyles.statLabel}>帖子</Text>
              </View>
              <View style={topicDetailStyles.statItem}>
                <Text style={topicDetailStyles.statNumber}>
                  {topicData.participants}
                </Text>
                <Text style={topicDetailStyles.statLabel}>参与者</Text>
              </View>
              <View style={topicDetailStyles.statItem}>
                <Text style={topicDetailStyles.statNumber}>94%</Text>
                <Text style={topicDetailStyles.statLabel}>活跃度</Text>
              </View>
            </View>

            {topicData.isHot && (
              <View style={topicDetailStyles.trendingBadge}>
                <Text style={topicDetailStyles.trendingIcon}>🔥</Text>
                <Text style={topicDetailStyles.trendingText}>热门话题</Text>
              </View>
            )}
          </View>
        </View>

        {/* Join Discussion Input */}
        {showJoinInput && (
          <View style={topicDetailStyles.joinInputContainer}>
            {/* 顶部标题栏 */}
            <View style={topicDetailStyles.joinHeader}>
              <Text style={topicDetailStyles.joinTitle}>发布帖子</Text>
              <TouchableOpacity
                style={topicDetailStyles.closeButton}
                onPress={() => {
                  setShowJoinInput(false);
                  setNewPostText("");
                  setSelectedImage(null);
                }}
              >
                <Ionicons name="close" size={24} color={colors.gray_deep} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={topicDetailStyles.joinInput}
              placeholder={`分享你对 ${topicData.title} 的看法...`}
              multiline
              value={newPostText}
              onChangeText={setNewPostText}
              maxLength={300}
            />

            {/* 图片上传区域 */}
            <View style={topicDetailStyles.imageUploadContainer}>
              <View style={topicDetailStyles.imageUploadRow}>
                <View style={topicDetailStyles.imageUploadButtons}>
                  <TouchableOpacity
                    style={topicDetailStyles.uploadButton}
                    onPress={() => pickImage("camera")}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={20}
                      color={colors.green_deep}
                    />
                    <Text style={topicDetailStyles.uploadButtonText}>拍照</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={topicDetailStyles.uploadButton}
                    onPress={() => pickImage("library")}
                  >
                    <Ionicons
                      name="image-outline"
                      size={20}
                      color={colors.green_deep}
                    />
                    <Text style={topicDetailStyles.uploadButtonText}>相册</Text>
                  </TouchableOpacity>
                </View>

                {/* 发布按钮放在最右边 */}
                <TouchableOpacity
                  style={[
                    topicDetailStyles.publishButtonRow,
                    (newPostText.trim() || selectedImage) &&
                      topicDetailStyles.publishButtonRowActive,
                  ]}
                  onPress={handleJoinDiscussion}
                  disabled={!newPostText.trim() && !selectedImage}
                >
                  <Text
                    style={[
                      topicDetailStyles.publishButtonText,
                      (newPostText.trim() || selectedImage) &&
                        topicDetailStyles.publishButtonTextActive,
                    ]}
                  >
                    发布
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 预览已选图片 */}
              {selectedImage && (
                <View style={topicDetailStyles.selectedImageContainer}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={topicDetailStyles.selectedImage}
                  />
                  <TouchableOpacity
                    style={topicDetailStyles.removeImageButton}
                    onPress={removeImage}
                  >
                    <Ionicons name="close-circle" size={24} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Posts List */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <View key={post.id} style={topicDetailStyles.postCard}>
              {/* Post Header */}
              <View style={topicDetailStyles.postHeader}>
                <View style={topicDetailStyles.postUserInfo}>
                  <View style={topicDetailStyles.postAvatar}>
                    <Text style={topicDetailStyles.avatarEmoji}>
                      {post.avatar}
                    </Text>
                  </View>
                  <View>
                    <Text style={topicDetailStyles.username}>
                      {post.username}
                    </Text>
                    <Text style={topicDetailStyles.timeAgo}>
                      {post.timeAgo}
                    </Text>
                  </View>
                </View>
                <View style={topicDetailStyles.topicTag}>
                  <Text style={topicDetailStyles.topicTagText}>
                    {post.topicTag}
                  </Text>
                </View>
              </View>

              {/* Post Image */}
              <Image
                source={post.image}
                style={[
                  topicDetailStyles.postImage,
                  { width: screenWidth, height: screenWidth * 0.8 },
                ]}
                resizeMode="cover"
              />

              {/* Post Caption */}
              <View style={topicDetailStyles.postContent}>
                <Text style={topicDetailStyles.caption}>{post.caption}</Text>
              </View>

              {/* Post Actions */}
              <View style={topicDetailStyles.postActions}>
                <View style={topicDetailStyles.leftActions}>
                  <TouchableOpacity
                    style={topicDetailStyles.actionButton}
                    onPress={() => handleLike(post.id)}
                  >
                    <Image
                      source={
                        post.isLiked
                          ? require("assets/icons/lovered.png")
                          : require("assets/icons/loveblack.png")
                      }
                      style={topicDetailStyles.actionButtonIcon}
                    />
                    <Text style={topicDetailStyles.actionCount}>
                      {post.likes}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={topicDetailStyles.actionButton}
                    onPress={() => handleComment(post.id)}
                  >
                    <Image
                      source={require("assets/icons/comment.png")}
                      style={topicDetailStyles.actionButtonIcon}
                    />
                    <Text style={topicDetailStyles.actionCount}>
                      {post.comments}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={topicDetailStyles.saveButton}
                  onPress={() => handleSave(post.id)}
                >
                  <Image
                    source={
                      savedPosts.has(post.id)
                        ? require("assets/icons/savefilled.png")
                        : require("assets/icons/saveoutline.png")
                    }
                    style={topicDetailStyles.actionButtonIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* Comment Section - 更新为与 SocialScreen 相同的样式 */}
              {activeCommentPostId === post.id && (
                <View style={topicDetailStyles.commentSection}>
                  {/* 评论列表 */}
                  {post.commentsList.length > 0 ? (
                    renderComments(post.id, post.commentsList)
                  ) : (
                    <Text style={topicDetailStyles.noCommentText}>
                      还没有评论，快来抢沙发吧~ 🛋️
                    </Text>
                  )}

                  {/* 回复提示 */}
                  {replyingTo && (
                    <View style={topicDetailStyles.replyIndicator}>
                      <Text style={topicDetailStyles.replyIndicatorText}>
                        回复 @{replyingTo.username}
                      </Text>
                      <TouchableOpacity onPress={handleCancelReply}>
                        <Text style={topicDetailStyles.cancelReplyText}>
                          取消
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* 评论输入框 */}
                  {renderCommentInput(post.id)}
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={topicDetailStyles.emptyContainer}>
            <Text style={topicDetailStyles.emptyIcon}>💬</Text>
            <Text style={topicDetailStyles.emptyText}>还没有人参与讨论</Text>
            <Text style={topicDetailStyles.emptySubtext}>
              成为第一个分享想法的人吧！
            </Text>
            <TouchableOpacity
              style={topicDetailStyles.startDiscussionButton}
              onPress={() => setShowJoinInput(true)}
            >
              <Text style={topicDetailStyles.startDiscussionButtonText}>
                开始讨论
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={topicDetailStyles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}
