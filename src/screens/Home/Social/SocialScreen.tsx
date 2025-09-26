import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useLayoutEffect, useState } from "react"; // 添加 useEffect
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
import { getAllPostsWithComments, getCommentReplies, postCommentReply } from "../../../services/SocialService/SocialScreenApi"; // 新增导入
import {
  newStyles,
  newStylesdropdown,
  shareStyles,
  styles,
  topicStyles,
} from "../Social/SocialStyles";
import { Comment } from "./TopicSlice";

const { width: screenWidth } = Dimensions.get("window");

type SocialScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "Social"
>;

const mockTopics = [
  {
    id: "t1",
    title: "#你最爱的共创饮品理由",
    description: "分享你对创意茶饮的独特见解",
    posts: 42,
    participants: 28,
    isHot: true,
    color: "#FF6B6B", // 热门话题特有颜色
    icon: "🧋",
    trending: true,
  },
  {
    id: "t2",
    title: "#双文化元素怎么融合才好看",
    description: "探讨传统与现代的完美结合",
    posts: 38,
    participants: 22,
    isHot: true,
    color: "#4ECDC4",
    icon: "🎨",
    trending: true,
  },
  {
    id: "t3",
    title: "#茶艺美学分享",
    description: "展示茶文化的艺术之美",
    posts: 24,
    participants: 16,
    isHot: false,
    color: "#45B7D1",
    icon: "🍵",
    trending: false,
  },
  {
    id: "t4",
    title: "#创意包装设计",
    description: "分享包装设计的创新想法",
    posts: 31,
    participants: 19,
    isHot: false,
    color: "#F9A826",
    icon: "📦",
    trending: true,
  },
  {
    id: "t5",
    title: "#茶饮DIY创意",
    description: "分享自制茶饮的创意配方",
    posts: 19,
    participants: 12,
    isHot: false,
    color: "#6C5CE7",
    icon: "✨",
    trending: false,
  },
];

const mockPosts = [
  {
    id: "1",
    username: "Coffee_Lover_88",
    avatar: "👩‍💼",
    image: require("assets/images/mock.jpg"),
    caption:
      "Just tried the new Royal Leaf bubble tea! Amazing flavor combination 🧋✨ #RoyalLeaf #BubbleTea",
    likes: 42,
    comments: 2,
    timeAgo: "2h ago",
    isLiked: false,
    isSaved: false,
    commentsList: [
      {
        id: "c1",
        user: "TeaFan",
        text: "我也超爱这款！😍",
        isDesigner: false,
        replyTo: null,
      },
      {
        id: "c2",
        user: "BobaKing",
        text: "下次一起去喝！🧋",
        isDesigner: false,
        replyTo: null,
      },
      {
        id: "c4",
        user: "RoyalLeaf_Designer",
        text: "谢谢大家的支持！这款的灵感来自传统茶艺与现代包装的融合 🍃",
        isDesigner: true,
        replyTo: null,
      },
    ],
  },
  {
    id: "2",
    username: "TeaEnthusiast",
    avatar: "👨‍🎓",
    image: require("assets/images/mock.jpg"),
    caption:
      "Afternoon tea break with friends! Royal Leaf never disappoints 🍃💚",
    likes: 28,
    comments: 1,
    timeAgo: "4h ago",
    isLiked: true,
    isSaved: false,
    commentsList: [
      {
        id: "c3",
        user: "FriendA",
        text: "好羡慕！🥹",
        isDesigner: false,
        replyTo: null,
      },
    ],
  },
  {
    id: "3",
    username: "FoodieBlogger",
    avatar: "👩‍🍳",
    image: require("assets/images/mock.jpg"),
    caption:
      "Reviewing the top 5 bubble tea spots in town. Royal Leaf definitely makes the list! 📱🎬",
    likes: 156,
    comments: 0,
    timeAgo: "1d ago",
    isLiked: false,
    isSaved: false,
    commentsList: [
      {
        id: "c1",
        user: "TeaFan",
        text: "我也超爱这款！😍",
        isDesigner: false,
        replyTo: null,
      },
      {
        id: "c2",
        user: "BobaKing",
        text: "下次一起去喝！🧋",
        isDesigner: false,
        replyTo: null,
      },
      {
        id: "c4",
        user: "RoyalLeaf_Designer",
        text: "谢谢大家的支持！这款的灵感来自传统茶艺与现代包装的融合 🍃",
        isDesigner: true,
        replyTo: null,
      },
    ],
  },
];

export default function SocialScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SocialScreenNavigationProp>();
  const [posts, setPosts] = useState<any[]>([]); // 初始为空数组
  const [newPostText, setNewPostText] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(
    null
  );
  const [commentText, setCommentText] = useState("");
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
  const [isLoading, setIsLoading] = useState(true); // 新增加载状态

  // 回复相关状态
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentReplies, setCommentReplies] = useState<Record<string, any[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        setIsLoading(true);
        const apiPosts = await getAllPostsWithComments();
        setPosts(apiPosts || []); // 确保总是数组
      } catch (error) {
        console.error("获取帖子数据失败:", error);
        setPosts([]); // 出错时设为空数组
        Alert.alert("错误", "获取帖子数据失败，请稍后重试");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostsData();
  }, []);

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
          paddingBottom: Platform.OS === "ios" ? 10 : 8,
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

  const handleAddComment = (postId: string) => {
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
                },
              ],
            }
          : p
      )
    );

    setCommentText("");
  };

  // 处理回复
  const handleReply = (commentId: string) => {
    setActiveReplyCommentId(prev => prev === commentId ? null : commentId);
    setReplyText("");
  };

  // 加载评论的回复
  const loadCommentReplies = async (commentId: string) => {
    if (loadingReplies.has(commentId) || commentReplies[commentId]) return;

    setLoadingReplies(prev => new Set(prev).add(commentId));
    try {
      const repliesData = await getCommentReplies(commentId, 10, 0);
      setCommentReplies(prev => ({
        ...prev,
        [commentId]: repliesData.replies
      }));
    } catch (error) {
      console.error('获取回复失败:', error);
    } finally {
      setLoadingReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  // 发送回复
  const handleSendReply = async (commentId: string) => {
    if (!replyText.trim()) return;

    try {
      const newReply = await postCommentReply(commentId, replyText, "Me");

      // 更新本地回复列表
      setCommentReplies(prev => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), {
          ...newReply,
          userId: "Me",
          desc: replyText
        }]
      }));

      setReplyText("");
      setActiveReplyCommentId(null);
    } catch (error) {
      console.error('发送回复失败:', error);
      Alert.alert("错误", "发送回复失败，请稍后重试");
    }
  };

  // 切换评论展开状态
  const toggleCommentExpansion = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
        // 展开时加载回复
        loadCommentReplies(commentId);
      }
      return newSet;
    });
  };

  const handleCreatePost = () => {
    if (!newPostImage) {
      setShowPhotoRequired(true);
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
    setShowPhotoRequired(false);
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

      {/* Create Post Modal */}
      {showCreatePost && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={newStyles.overlay}>
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
          <View style={newStyles.overlay}>
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>加载中...</Text>
        </View>
      ) : activeTab === "posts" ? (
        <ScrollView
          style={styles.feedContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => {
            // 开始滚动时关闭回复输入框
            if (activeReplyCommentId) {
              setActiveReplyCommentId(null);
              setReplyText("");
              Keyboard.dismiss();
            }
          }}
        >
          {posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>暂无帖子</Text>
            </View>
          ) : (
            posts.map((post) => (
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
                          ? require("assets/icons/savefilled.png")
                          : require("assets/icons/saveoutline.png")
                      }
                      style={styles.actionButtonIcons}
                    />
                  </TouchableOpacity>
                </View>

                {/* Comment Section */}
                {activeCommentPostId === post.id && (
                  <View style={styles.commentSection}>
                    {post.commentsList.length > 0 ? (
                      <>
                        {/* 显示评论和回复 */}
                        {post.commentsList.slice(0, expandedComments.has(post.id) ? undefined : 5).map((comment: Comment) => (
                          <View key={comment.id} style={styles.commentContainer}>
                            <View style={styles.commentRow}>
                              <Text style={styles.commentUser}>{comment.user}：</Text>
                              <Text style={styles.commentText}>{comment.text}</Text>
                            </View>

                            {/* 回复按钮 */}
                            <TouchableOpacity
                              style={styles.replyButton}
                              onPress={() => handleReply(comment.id)}
                            >
                              <Text style={styles.replyButtonText}>回复</Text>
                            </TouchableOpacity>

                            {/* 显示回复列表 */}
                            {commentReplies[comment.id] && commentReplies[comment.id].length > 0 && (
                              <View style={styles.repliesContainer}>
                                {commentReplies[comment.id].slice(0, expandedComments.has(comment.id) ? undefined : 3).map((reply: any, index: number) => (
                                  <View key={reply.commentLogId || index} style={styles.replyRow}>
                                    <Text style={styles.replyUser}>{reply.userId || 'User'}：</Text>
                                    <Text style={styles.replyText}>{reply.desc}</Text>
                                  </View>
                                ))}

                                {/* 展开更多回复按钮 */}
                                {commentReplies[comment.id].length > 3 && !expandedComments.has(comment.id) && (
                                  <TouchableOpacity
                                    style={styles.loadMoreButton}
                                    onPress={() => toggleCommentExpansion(comment.id)}
                                  >
                                    <Text style={styles.loadMoreButtonText}>
                                      展开更多回复 ({commentReplies[comment.id].length - 3}条)
                                    </Text>
                                  </TouchableOpacity>
                                )}

                                {expandedComments.has(comment.id) && commentReplies[comment.id].length > 3 && (
                                  <TouchableOpacity
                                    style={styles.loadMoreButton}
                                    onPress={() => toggleCommentExpansion(comment.id)}
                                  >
                                    <Text style={styles.loadMoreButtonText}>收起回复</Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            )}

                            {/* 回复输入框 */}
                            {activeReplyCommentId === comment.id && (
                              <View style={styles.replyInputContainer}>
                                <KeyboardAvoidingView
                                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                                  keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
                                >
                                  <View style={styles.replyInputBox}>
                                    <TextInput
                                      style={styles.replyInput}
                                      placeholder={`回复 ${comment.user}...`}
                                      value={replyText}
                                      onChangeText={setReplyText}
                                      multiline
                                      autoFocus={false}
                                      onFocus={() => {
                                        // 防止自动滚动
                                      }}
                                    />
                                    <View style={styles.replyActions}>
                                      <TouchableOpacity
                                        style={styles.cancelReplyButton}
                                        onPress={() => {
                                          setActiveReplyCommentId(null);
                                          setReplyText("");
                                        }}
                                      >
                                        <Text style={styles.cancelReplyButtonText}>取消</Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        style={[
                                          styles.sendReplyButton,
                                          replyText.trim() ? styles.sendReplyButtonActive : null
                                        ]}
                                        onPress={() => handleSendReply(comment.id)}
                                      >
                                        <Text style={[
                                          styles.sendReplyButtonText,
                                          replyText.trim() ? styles.sendReplyButtonTextActive : null
                                        ]}>发送</Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </KeyboardAvoidingView>
                              </View>
                            )}

                            {/* 点击加载回复 */}
                            {!commentReplies[comment.id] && !loadingReplies.has(comment.id) && (
                              <TouchableOpacity
                                style={styles.startReplyButton}
                                onPress={() => loadCommentReplies(comment.id)}
                              >
                                <Text style={styles.startReplyButtonText}>查看回复</Text>
                              </TouchableOpacity>
                            )}

                            {loadingReplies.has(comment.id) && (
                              <Text style={styles.startReplyButtonText}>加载中...</Text>
                            )}
                          </View>
                        ))}

                        {/* 展开更多评论按钮 */}
                        {post.commentsList.length > 5 && !expandedComments.has(post.id) && (
                          <TouchableOpacity
                            style={styles.loadMoreCommentsButton}
                            onPress={() => {
                              setExpandedComments(prev => new Set(prev).add(post.id));
                            }}
                          >
                            <Text style={styles.loadMoreCommentsButtonText}>
                              展开更多评论 ({post.commentsList.length - 5}条)
                            </Text>
                          </TouchableOpacity>
                        )}

                        {expandedComments.has(post.id) && post.commentsList.length > 5 && (
                          <TouchableOpacity
                            style={styles.loadMoreCommentsButton}
                            onPress={() => {
                              setExpandedComments(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(post.id);
                                return newSet;
                              });
                            }}
                          >
                            <Text style={styles.loadMoreCommentsButtonText}>收起评论</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    ) : (
                      <Text style={styles.noCommentText}>
                        还没有评论，快来抢沙发吧~ 🛋️
                      </Text>
                    )}

                    <View style={styles.commentBox}>
                      <TextInput
                        style={styles.commentInput}
                        placeholder="写下你的评论..."
                        value={commentText}
                        onChangeText={setCommentText}
                      />
                      <TouchableOpacity
                        style={[
                          styles.commentPostButton,
                          commentText.trim()
                            ? styles.commentPostButtonActive
                            : null,
                        ]}
                        onPress={() => handleAddComment(post.id)}
                      >
                        <Text
                          style={[
                            styles.commentPostButtonText,
                            commentText.trim()
                              ? styles.commentPostButtonTextActive
                              : null,
                          ]}
                        >
                          发表
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
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
          <View style={newStyles.overlay}>
            <TouchableWithoutFeedback>
              <View style={newStyles.editModal}>
                <Text style={newStyles.modalTitle}>编辑帖子</Text>
                <TextInput
                  style={newStyles.editInput}
                  multiline
                  value={editPostText}
                  onChangeText={setEditPostText}
                />
                <View style={newStyles.buttonsAll}>
                  <TouchableOpacity
                    style={newStyles.buttonLeft}
                    onPress={cancelEdit}
                  >
                    <Text style={newStyles.buttonText}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      newStyles.buttonRight,
                      editPostText.trim() ? newStyles.buttonRight : null,
                    ]}
                    onPress={confirmEdit}
                  >
                    <Text
                      style={[
                        newStyles.buttonText,
                        editPostText.trim() ? newStyles.buttonText : null,
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
          <View style={newStyles.dropdownOverlay}>
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
          <View style={newStyles.overlay}>
            <TouchableWithoutFeedback>
              <View style={newStyles.deleteModal}>
                <Text style={newStyles.modalTitle}>确认删除</Text>
                <Text style={newStyles.buttonMessage}>
                  确定要删除这条帖子吗？
                </Text>
                <View style={newStyles.buttonsAll}>
                  <TouchableOpacity
                    style={newStyles.buttonLeft}
                    onPress={confirmDelete}
                  >
                    <Text style={newStyles.buttonText}>删除</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={newStyles.buttonRight}
                    onPress={cancelDelete}
                  >
                    <Text style={newStyles.buttonText}>取消</Text>
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
