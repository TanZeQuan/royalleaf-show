import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useLayoutEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { HomeStackParamList } from "../../../navigation/stacks/HomeNav/HomeStack";
import { mockPosts, mockTopics } from "./data/mockData";
import {
  buttonStyles,
  newStylesdropdown,
  shareStyles,
  styles,
} from "./styles/SocialCSS";
import { topicStyles } from "./styles/TopicMainCSS";

const { width: screenWidth } = Dimensions.get("window");

type SocialScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "Social"
>;

export default function SocialScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SocialScreenNavigationProp>();
  const [posts, setPosts] = useState(mockPosts);
  const [newPostText, setNewPostText] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(
    null
  );
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    username: string;
  } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showShareOverlay, setShowShareOverlay] = useState(false);
  const [currentSharePostId, setCurrentSharePostId] = useState<string | null>(
    null
  );
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editPostText, setEditPostText] = useState("");
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [sharePlatform, setSharePlatform] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [showPhotoRequired, setShowPhotoRequired] = useState(false);
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"posts" | "topics">("posts");

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          backgroundColor: "#F9F5EC",
          height: 80,
          paddingTop: 2,
          paddingBottom: Platform.OS === "ios" ? 10 : 8, // 调小底部间距
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          marginTop: 5,
        },
      });
    };
  }, [navigation]);

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
                          user: "Me", // 当前用户
                          text: replyText.replace(
                            `@${replyingTo.username} `,
                            ""
                          ), // 移除@用户名
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

  // 支持回复
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
                  user: "Me",
                  text: commentText,
                  isDesigner: false,
                  replyTo: null,
                  replies: [],
                  likes: 0,
                  isLiked: false,
                },
              ],
            }
          : p
      )
    );

    setCommentText("");
  };

  const renderComments = (comments: any[]) => {
    return comments.map((comment) => (
      <View key={comment.id}>
        {/* 主评论 - 小红书风格 */}
        <View style={styles.commentRow}>
          <View style={styles.commentAvatar}>
            <Text style={styles.commentAvatarText}>
              {comment.user.charAt(0)}
            </Text>
          </View>

          <View style={styles.commentContent}>
            <View style={styles.commentUserInfo}>
              <Text style={styles.commentUser}>{comment.user}</Text>
              {comment.isDesigner && (
                <View style={styles.designerBadge}>
                  <Text style={styles.designerBadgeText}>设计师</Text>
                </View>
              )}
              <Text style={styles.commentTime}>
                {formatTimeAgo(comment.timestamp)}
              </Text>
            </View>

            <Text style={styles.commentText}>{comment.text}</Text>

            <View style={styles.commentActions}>
              <TouchableOpacity
                style={styles.commentLikeButton}
                onPress={() => handleCommentLike(comment.id)}
              >
                <Ionicons
                  name={comment.isLiked ? "heart" : "heart-outline"}
                  size={14}
                  style={[
                    styles.commentLikeIcon,
                    comment.isLiked && styles.likedComment,
                  ]}
                />
                <Text
                  style={[
                    styles.commentLikeCount,
                    comment.isLiked && styles.likedCommentText,
                  ]}
                >
                  {comment.likes > 0 ? comment.likes : ""}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.commentLikeButton}
                onPress={() => handleReply(comment.id, comment.user)}
              >
                <Text style={styles.commentLikeCount}>回复</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 回复列表 */}
        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.map((reply: any) => (
              <View key={reply.id} style={styles.replyRow}>
                <Text style={styles.replyUser}>{reply.user}</Text>
                <Text style={styles.replyText}>
                  回复 <Text style={styles.replyTo}>@{reply.replyTo}</Text>：
                  {reply.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    ));
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

  // 评论点赞功能
  const handleCommentLike = (commentId: string) => {
    setPosts((prev) =>
      prev.map((post) => ({
        ...post,
        commentsList: post.commentsList.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                isLiked: !comment.isLiked,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              }
            : comment
        ),
      }))
    );
  };

  // 评论输入框组件
  const renderCommentInput = (postId: string) => {
    const inputText = replyingTo ? replyText : commentText;
    const setInputText = replyingTo ? setReplyText : setCommentText;
    const placeholder = replyingTo
      ? `回复 ${replyingTo.username}...`
      : "说点什么...";

    return (
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentTextInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={200}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && { backgroundColor: "#ccc" },
          ]}
          onPress={() => handleAddComment(postId)}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>发送</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleCreatePost = () => {
    // 检查是否有照片，如果没有就显示提示
    if (!newPostImage) {
      setShowPhotoRequired(true); // 显示红色提示文字
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      username: "Me",
      avatar: "🧑🏻",
      image: { uri: newPostImage },
      caption: newPostText,
      likes: 0,
      comments: 0,
      timeAgo: "刚刚",
      isLiked: false,
      isSaved: false,
      commentsList: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostText("");
    setNewPostImage(null);
    setShowCreatePost(false);
    setShowPhotoRequired(false); // 发布成功后隐藏提示
  };

  const handleCloseCreatePost = () => {
    setShowCreatePost(false);
    setNewPostText(""); // 清空文字
    setNewPostImage(null); // 清空图片
    setShowPhotoRequired(false); // 清空提示
  };

  // 拍照
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("权限不足", "需要相机权限才能拍照");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewPostImage(result.assets[0].uri);
      setShowPhotoRequired(false); // Hide the warning when photo is selected
    }
  };

  // 相册
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("权限不足", "需要访问相册权限才能选择照片");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewPostImage(result.assets[0].uri);
      setShowPhotoRequired(false); // Hide the warning when photo is selected
    }
  };

  const handleGoBack = () => navigation.goBack();
  const handleCameraClick = () => setShowCreatePost((prev) => !prev);

  // Share 功能
  const handleShare = (postId: string) => {
    setCurrentSharePostId(postId);
    setShowShareOverlay(true);
  };

  const handleCloseShare = () => {
    setShowShareOverlay(false);
    setCurrentSharePostId(null);
  };

  const handleShareToPlatform = (platform: string) => {
    if (currentSharePostId) {
      const post = posts.find((p) => p.id === currentSharePostId);
      const shareText = getShareText(platform, post);

      console.log(
        `Shared to ${platform} (post ${currentSharePostId}): ${shareText}`
      );

      setShowShareSuccess(true);
      setSharePlatform(platform);
      setTimeout(() => {
        setShowShareSuccess(false);
        setSharePlatform("");
        handleCloseShare();
      }, 1500);
    }
  };

  // 话题相关功能
  const handleTopicSelect = (topicId: string) => {
    const selectedTopicData = mockTopics.find((t) => t.id === topicId);
    if (selectedTopicData) {
      navigation.navigate("TopicDetail", {
        topicId: topicId,
        topicTitle: selectedTopicData.title,
        topicDescription: selectedTopicData.description,
      });
    }
  };

  // 生成专属分享语
  const getShareText = (platform: string, post: any) => {
    const baseText = post?.caption || "";
    const platformTexts: Record<string, string> = {
      Instagram: `${baseText} \n\n✨ 来自Royal Leaf茶饮创意分享 \n#RoyalLeaf #茶文化创意 #BubbleTea #共创`,
      Facebook: `${baseText} \n\n🍃 在Royal Leaf发现了这个精彩的茶文化创意！\n大家一起来分享你的茶饮灵感吧~ \n#RoyalLeaf #茶饮创意`,
      WhatsApp: `看看这个超棒的茶饮创意！${baseText} \n\n🧋 Royal Leaf - 传统与现代的完美融合`,
      WeChat: `${baseText} \n\n🌿 来自Royal Leaf茶会的精彩分享\n一起探索茶文化的无限可能！`,
      链接: `${baseText} \n\n📱 Royal Leaf茶会 - 发现更多茶文化创意`,
    };
    return platformTexts[platform] || baseText;
  };

  // More Menu - Fixed the event handling
  const handleMore = (postId: string, event: any) => {
    // Use nativeEvent to get the touch coordinates
    const { locationX, locationY, pageX, pageY } = event.nativeEvent;

    // Set position for dropdown - adjust as needed for your UI
    setDropdownPosition({
      x: Math.max(10, pageX - 100), // Ensure it doesn't go off screen
      y: pageY + 20,
    });
    setSelectedPostId(postId);
    setShowDropdown(true);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
    setSelectedPostId(null);
  };

  // 删除 post
  const handleDelete = () => {
    if (selectedPostId) {
      // 移除原有的 Alert.alert，改为使用自定义模态框
      setPostToDelete(selectedPostId);
      setShowDeleteDropdown(true);
      closeDropdown();
    }
  };

  const confirmDelete = () => {
    if (postToDelete) {
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete));
      setShowDeleteDropdown(false);
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDropdown(false);
    setPostToDelete(null);
  };

  // Edit 编辑
  const handleEdit = () => {
    if (selectedPostId) {
      const post = posts.find((p) => p.id === selectedPostId);
      if (post) {
        setEditingPostId(selectedPostId);
        setEditPostText(post.caption);
        closeDropdown();
      }
    }
  };

  const confirmEdit = () => {
    if (editingPostId && editPostText.trim()) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingPostId ? { ...p, caption: editPostText } : p
        )
      );
      Alert.alert("编辑成功", "帖子已更新");
      setEditingPostId(null);
      setEditPostText("");
    }
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditPostText("");
  };

  // 收藏
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7fafc" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>茶会</Text>
        <TouchableOpacity onPress={handleCameraClick}>
          <View style={styles.postIcon}>
            <Image
              source={require("assets/icons/postemoji.png")}
              style={{ width: 24, height: 24 }}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={topicStyles.tabContainer}>
        <TouchableOpacity
          style={[
            topicStyles.tab,
            activeTab === "posts" && topicStyles.activeTab,
          ]}
          onPress={() => setActiveTab("posts")}
        >
          <Text
            style={[
              topicStyles.tabText,
              activeTab === "posts" && topicStyles.activeTabText,
            ]}
          >
            动态分享
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            topicStyles.tab,
            activeTab === "topics" && topicStyles.activeTab,
          ]}
          onPress={() => setActiveTab("topics")}
        >
          <Text
            style={[
              topicStyles.tabText,
              activeTab === "topics" && topicStyles.activeTabText,
            ]}
          >
            话题讨论
          </Text>
        </TouchableOpacity>
      </View>

      {/* Create Post Modal */}
      {showCreatePost && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={buttonStyles.overlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={styles.createPostSection}>
                {/* 关闭按钮绝对定位 */}
                <TouchableOpacity
                  onPress={handleCloseCreatePost}
                  style={styles.closeButtonAbsolute}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>

                {/* 原有布局保持不变 */}
                <View style={styles.userAvatar}>
                  <Text style={styles.avatarEmoji}>👨🏾</Text>
                </View>
                <View style={styles.createPostContainer}>
                  <TextInput
                    style={styles.createPostInput}
                    placeholder="分享您的感想..."
                    multiline
                    value={newPostText}
                    onChangeText={setNewPostText}
                  />

                  {/* 预览图片 */}
                  {newPostImage ? (
                    <View style={styles.previewContainer}>
                      <Image
                        source={{ uri: newPostImage }}
                        style={styles.previewImage}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setNewPostImage(null);
                          setShowPhotoRequired(false);
                        }}
                        style={styles.removeImageButton}
                      >
                        <Text style={styles.removeImageText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {/* 提示 */}
                  {showPhotoRequired && (
                    <Text
                      style={{ color: "red", fontSize: 12, marginBottom: 8 }}
                    >
                      ⚠︎ 请添加照片才能发布
                    </Text>
                  )}

                  <View style={styles.createPostActions}>
                    <TouchableOpacity
                      style={styles.photoButton}
                      onPress={handleTakePhoto}
                    >
                      <Text style={styles.actionIcon}>📸</Text>
                      <Text style={styles.actionText}>拍照</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.photoButton}
                      onPress={handlePickImage}
                    >
                      <Text style={styles.actionIcon}>🖼️</Text>
                      <Text style={styles.actionText}>相册</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.postButton,
                        newPostText.trim() || newPostImage
                          ? styles.postButtonActive
                          : null,
                      ]}
                      onPress={handleCreatePost}
                    >
                      <Text
                        style={[
                          styles.postButtonText,
                          newPostText.trim() || newPostImage
                            ? styles.postButtonTextActive
                            : null,
                        ]}
                      >
                        Post
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Share Overlay */}
      {showShareOverlay && (
        <TouchableWithoutFeedback onPress={handleCloseShare}>
          <View style={shareStyles.overlay}>
            <TouchableWithoutFeedback>
              <View style={shareStyles.shareContainer}>
                {/* 标题和关闭按钮 */}
                <View style={shareStyles.shareHeader}>
                  <Text style={shareStyles.shareTitle}>分享至</Text>
                  <TouchableOpacity
                    onPress={handleCloseShare}
                    style={shareStyles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

                {/* 分享预览文本 */}
                {currentSharePostId && (
                  <View>
                    <Text style={shareStyles.sharePreviewTitle}>
                      分享内容预览：
                    </Text>
                    <Text
                      style={shareStyles.sharePreviewText}
                      numberOfLines={3}
                    >
                      {posts.find((p) => p.id === currentSharePostId)?.caption}
                    </Text>
                  </View>
                )}

                {/* 横向排列的分享选项 */}
                <View style={shareStyles.shareOptionsHorizontal}>
                  {[
                    {
                      platform: "Instagram",
                      icon: require("assets/images/instagram.png"),
                    },
                    {
                      platform: "Facebook",
                      icon: require("assets/images/facebook.png"),
                    },
                    {
                      platform: "WhatsApp",
                      icon: require("assets/images/whatsapp.png"),
                    },
                    {
                      platform: "WeChat",
                      icon: require("assets/images/wechat.png"),
                    },
                    {
                      platform: "链接",
                      icon: require("assets/images/link.png"),
                    },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.platform}
                      style={shareStyles.shareOptionHorizontal}
                      onPress={() => handleShareToPlatform(item.platform)}
                    >
                      <Image
                        source={item.icon}
                        style={shareStyles.shareOptionIcon}
                      />
                      <Text style={shareStyles.shareOptionText}>
                        {item.platform}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 取消按钮 */}
                <TouchableOpacity
                  style={shareStyles.cancelButton}
                  onPress={handleCloseShare}
                >
                  <Text style={shareStyles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {showShareSuccess && (
        <TouchableWithoutFeedback onPress={() => setShowShareSuccess(false)}>
          <View style={buttonStyles.overlay}>
            <TouchableWithoutFeedback>
              <View style={shareStyles.shareSuccessModal}>
                <Text style={shareStyles.shareSuccessText}>
                  快把 {sharePlatform} 专属内容分享出去吧！
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Feed */}
      {activeTab === "posts" ? (
        <ScrollView
          style={styles.feedContainer}
          showsVerticalScrollIndicator={false}
        >
          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              {/* Post Header */}
              <View style={styles.postHeader}>
                <View style={styles.postUserInfo}>
                  <View style={styles.postAvatar}>
                    <Text style={styles.avatarEmoji}>{post.avatar}</Text>
                  </View>
                  <View>
                    <Text style={styles.username}>{post.username}</Text>
                    <Text style={styles.timeAgo}>{post.timeAgo}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={(e) => handleMore(post.id, e)}
                >
                  <Text style={styles.moreIcon}>⋯</Text>
                </TouchableOpacity>
              </View>

              {/* Post Image */}
              <Image
                source={post.image}
                style={[
                  styles.postImage,
                  { width: screenWidth, height: screenWidth },
                ]}
                resizeMode="cover"
              />

              {/* Post Caption */}
              <View style={styles.postContent}>
                <Text style={styles.caption}>{post.caption}</Text>
              </View>

              {/* Post Actions */}
              <View style={styles.postActions}>
                <View style={styles.leftActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleLike(post.id)}
                  >
                    <Image
                      source={
                        post.isLiked
                          ? require("assets/icons/lovered.png")
                          : require("assets/icons/loveblack.png")
                      }
                      style={styles.actionButtonIcons}
                    />
                    <Text style={styles.actionCount}>{post.likes}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleComment(post.id)}
                  >
                    <Image
                      source={require("assets/icons/comment.png")}
                      style={styles.actionButtonIcons}
                    />
                    <Text style={styles.actionCount}>{post.comments}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleShare(post.id)}
                  >
                    <Image
                      source={require("assets/icons/share.png")}
                      style={styles.actionButtonIcons}
                    />
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSave(post.id)}
                >
                  <Image
                    source={
                      savedPosts.has(post.id)
                        ? require("assets/icons/savefilled.png") // 已收藏图标
                        : require("assets/icons/saveoutline.png") // 未收藏图标
                    }
                    style={styles.actionButtonIcons}
                  />
                </TouchableOpacity>
              </View>

              {/* Comment Section */}
              {activeCommentPostId === post.id && (
                <View style={styles.commentSection}>
                  {/* 评论列表 */}
                  {post.commentsList.length > 0 ? (
                    renderComments(post.commentsList)
                  ) : (
                    <Text style={styles.noCommentText}>
                      还没有评论，快来抢沙发吧~ 🛋️
                    </Text>
                  )}

                  {/* 回复提示 */}
                  {replyingTo && (
                    <View style={styles.replyIndicator}>
                      <Text style={styles.replyIndicatorText}>
                        回复 @{replyingTo.username}
                      </Text>
                      <TouchableOpacity onPress={handleCancelReply}>
                        <Text style={styles.cancelReplyText}>取消</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* 评论输入框 */}
                  {renderCommentInput(post.id)}
                </View>
              )}
            </View>
          ))}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      ) : (
        // 话题讨论区 - 话题列表
        <ScrollView
          style={styles.feedContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={topicStyles.topicsContainer}>
            <Text style={topicStyles.sectionTitle}>🔥 热门话题</Text>
            {mockTopics
              .filter((t) => t.isHot)
              .map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={topicStyles.hotTopicCard}
                  onPress={() => handleTopicSelect(topic.id)}
                  activeOpacity={0.9}
                >
                  {/* 参与度指示器 */}
                  <View style={topicStyles.participationIndicator} />

                  <View style={topicStyles.topicHeader}>
                    <Text style={topicStyles.topicTitle}>{topic.title}</Text>
                    <View style={topicStyles.hotBadge}>
                      <Text style={topicStyles.hotBadgeText}>热门</Text>
                    </View>
                  </View>

                  <Text style={topicStyles.topicDescription}>
                    {topic.description}
                  </Text>

                  {/* 活跃度指示器 */}
                  <View style={topicStyles.activityIndicator}>
                    <View
                      style={[
                        topicStyles.activityDot,
                        topicStyles.activityHigh,
                      ]}
                    />
                    <View
                      style={[
                        topicStyles.activityDot,
                        topicStyles.activityHigh,
                      ]}
                    />
                    <View
                      style={[
                        topicStyles.activityDot,
                        topicStyles.activityMedium,
                      ]}
                    />
                    <Text style={topicStyles.activityText}>活跃度很高</Text>
                  </View>

                  <View style={topicStyles.topicStats}>
                    <View style={topicStyles.statContainer}>
                      <Text style={topicStyles.statIcon}>💬</Text>
                      <Text style={topicStyles.statText}>
                        {topic.posts} 帖子
                      </Text>
                    </View>
                    <View style={topicStyles.statContainer}>
                      <Text style={topicStyles.statIcon}>👥</Text>
                      <Text style={topicStyles.statText}>
                        {topic.participants} 参与者
                      </Text>
                    </View>
                    <View style={topicStyles.trendingIndicator}>
                      <Text style={topicStyles.statIcon}>📈</Text>
                      <Text style={topicStyles.trendingText}>趋势上升</Text>
                    </View>
                  </View>

                  {/* 互动预览 */}
                  <View style={topicStyles.interactionPreview}>
                    <View style={topicStyles.previewAvatar} />
                    <View style={topicStyles.previewAvatar} />
                    <View style={topicStyles.previewAvatar} />
                    <Text style={topicStyles.moreParticipants}>
                      +{topic.participants - 3} 位用户正在讨论
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

            <Text style={topicStyles.sectionTitle}>📝 全部话题</Text>
            {mockTopics
              .filter((t) => !t.isHot)
              .map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={topicStyles.topicCard}
                  onPress={() => handleTopicSelect(topic.id)}
                  activeOpacity={0.9}
                >
                  <View style={topicStyles.topicHeader}>
                    <Text style={topicStyles.topicTitle}>{topic.title}</Text>
                  </View>

                  <Text style={topicStyles.topicDescription}>
                    {topic.description}
                  </Text>

                  {/* 活跃度指示器 */}
                  <View style={topicStyles.activityIndicator}>
                    <View
                      style={[
                        topicStyles.activityDot,
                        topicStyles.activityMedium,
                      ]}
                    />
                    <View
                      style={[topicStyles.activityDot, topicStyles.activityLow]}
                    />
                    <View
                      style={[topicStyles.activityDot, topicStyles.activityLow]}
                    />
                    <Text style={topicStyles.activityText}>活跃度中等</Text>
                  </View>

                  <View style={topicStyles.topicStats}>
                    <View style={topicStyles.statContainer}>
                      <Text style={topicStyles.statIcon}>💬</Text>
                      <Text style={topicStyles.statText}>
                        {topic.posts} 帖子
                      </Text>
                    </View>
                    <View style={topicStyles.statContainer}>
                      <Text style={topicStyles.statIcon}>👥</Text>
                      <Text style={topicStyles.statText}>
                        {topic.participants} 参与者
                      </Text>
                    </View>
                  </View>

                  {/* 互动预览 */}
                  <View style={topicStyles.interactionPreview}>
                    <View style={topicStyles.previewAvatar} />
                    <View style={topicStyles.previewAvatar} />
                    <Text style={topicStyles.moreParticipants}>
                      +{topic.participants - 2} 位用户参与
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}

      {/* Editing Post*/}
      {editingPostId && (
        <TouchableWithoutFeedback onPress={cancelEdit}>
          <View style={buttonStyles.overlay}>
            <TouchableWithoutFeedback>
              <View style={buttonStyles.editModal}>
                <Text style={buttonStyles.modalTitle}>编辑帖子</Text>
                <TextInput
                  style={buttonStyles.editInput}
                  multiline
                  value={editPostText}
                  onChangeText={setEditPostText}
                />
                <View style={buttonStyles.buttonsAll}>
                  <TouchableOpacity
                    style={buttonStyles.buttonLeft}
                    onPress={cancelEdit}
                  >
                    <Text style={buttonStyles.buttonText}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      buttonStyles.buttonRight,
                      editPostText.trim() ? buttonStyles.buttonRight : null,
                    ]}
                    onPress={confirmEdit}
                  >
                    <Text
                      style={[
                        buttonStyles.buttonText,
                        editPostText.trim() ? buttonStyles.buttonText : null,
                      ]}
                    >
                      确认
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={buttonStyles.dropdownOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  newStylesdropdown.dropdownMenu,
                  { top: dropdownPosition.y, left: dropdownPosition.x },
                ]}
              >
                <TouchableOpacity
                  style={newStylesdropdown.dropdownItem}
                  onPress={handleEdit}
                >
                  <Text style={newStylesdropdown.dropdownItemText}>
                    编辑帖子
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={newStylesdropdown.dropdownItem}
                  onPress={handleDelete}
                >
                  <Text
                    style={[
                      newStylesdropdown.dropdownItemText,
                      newStylesdropdown.dropdownItemDelete,
                    ]}
                  >
                    删除
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {showDeleteDropdown && (
        <TouchableWithoutFeedback onPress={cancelDelete}>
          <View style={buttonStyles.overlay}>
            <TouchableWithoutFeedback>
              <View style={buttonStyles.deleteModal}>
                <Text style={buttonStyles.modalTitle}>确认删除</Text>
                <Text style={buttonStyles.buttonMessage}>
                  确定要删除这条帖子吗？
                </Text>
                <View style={buttonStyles.buttonsAll}>
                  <TouchableOpacity
                    style={buttonStyles.buttonLeft}
                    onPress={confirmDelete}
                  >
                    <Text style={buttonStyles.buttonText}>删除</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={buttonStyles.buttonRight}
                    onPress={cancelDelete}
                  >
                    <Text style={buttonStyles.buttonText}>取消</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}
