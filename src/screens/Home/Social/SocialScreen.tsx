import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
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
import {
  getAllPostsWithComments,
  getCommentReplies,
  getPostCommentReplies,
  likeComment,
  unlikePost,
  likePost,
  createPost,
  deletePost,
  updateWrappedPost,
  updatePost,
  postComment,
} from "../../../services/SocialService/SocialScreenApi";
import {
  commentModalStyles,
  newStyles,
  newStylesdropdown,
  shareStyles,
  styles,
  topicStyles,
} from "../Social/SocialStyles";
import { getUserData } from "../../../utils/storage";
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
    color: "#FF6B6B",
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

export default function SocialScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SocialScreenNavigationProp>();

  // Use ref to track if component mounted to prevent unnecessary re-fetches
  const isMountedRef = useRef(true);
  const hasInitialFetchRef = useRef(false);

  const [posts, setPosts] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [showShareOverlay, setShowShareOverlay] = useState(false);
  const [currentSharePostId, setCurrentSharePostId] = useState<string | null>(null);
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
  const [isLoading, setIsLoading] = useState(true);

  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [commentReplies, setCommentReplies] = useState<Record<string, any[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());
  const [visibleRepliesCount, setVisibleRepliesCount] = useState<Record<string, number>>({});

  // Load user data once
  useEffect(() => {
    (async () => {
      try {
        const userData = await getUserData();
        console.log("Loaded user:", userData);
        if (isMountedRef.current) {
          setUser(userData);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Fetch posts only once on mount
  useEffect(() => {
    if (hasInitialFetchRef.current) return;

    const fetchPostsData = async () => {
      try {
        setIsLoading(true);
        const apiPosts = await getAllPostsWithComments();
        if (isMountedRef.current) {
          setPosts(apiPosts || []);
          hasInitialFetchRef.current = true;
        }
      } catch (error) {
        console.error("获取帖子数据失败:", error);
        if (isMountedRef.current) {
          setPosts([]);
          Alert.alert("错误", "获取帖子数据失败，请稍后重试");
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchPostsData();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
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

  const handleLike = async (postId: string) => {
    const originalPosts = [...posts];
    const post = posts.find(p => p.id === postId);

    if (!post) return;

    try {
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

      if (post.isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (error: any) {
      console.error('点赞失败:', error);
      setPosts(originalPosts);

      if (!error.message?.includes('Network request failed')) {
        Alert.alert('错误', '点赞失败，请稍后重试');
      }
    }
  };

  const handleCommentLike = async (commentId: string) => {
    try {
      await likeComment(commentId);
    } catch (error) {
      console.error('评论点赞失败:', error);
      Alert.alert('错误', '评论点赞失败，请稍后重试');
    }
  };

  const handleComment = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPostForComments(post);
      setShowCommentModal(true);
      setCommentText("");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedPostForComments) return;

    const postId = selectedPostForComments.id;
    const content = commentText;
    const author = user?.username || user?.user_id || "匿名用户";

    try {
      const apiResponse = await postComment(postId, content, author);
      console.log("📥 API Response:", apiResponse);

      // 🚫 不格式化，直接保留后端原始返回结构
      const data = apiResponse?.data;
      const comment = data?.comment || {};
      const log = Array.isArray(data?.logs) ? data.logs[0] : data?.log || {};

      const newComment = {
        id: comment.commentId || Date.now().toString(),
        user: comment.userId || log.userId || author,
        text: log?.desc ?? content, // ✅ 优先 desc，没有就显示用户输入
        raw: data, // 🧩 保留后端原始对象（方便调试或后续兼容）
      };

      const updatedPost = {
        ...selectedPostForComments,
        comments: (selectedPostForComments.comments || 0) + 1,
        commentsList: [...(selectedPostForComments.commentsList || []), newComment],
      };

      setSelectedPostForComments(updatedPost);
      setPosts(prev => prev.map(p => (p.id === postId ? updatedPost : p)));

      setCommentText("");
      Alert.alert("成功", "评论已发布");
    } catch (error) {
      console.error("❌ Failed to post comment:", error);
      Alert.alert("错误", "评论发送失败，请稍后重试");
    }
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPostForComments(null);
    setCommentText("");
    Keyboard.dismiss();
  };

  const showMoreReplies = (commentId: string) => {
    setVisibleRepliesCount(prev => {
      const currentCount = prev[commentId] || 3;
      const totalReplies = commentReplies[commentId]?.length || 0;
      const newCount = Math.min(currentCount + 10, totalReplies);
      return {
        ...prev,
        [commentId]: newCount
      };
    });
  };

  const handleReply = (commentId: string) => {
    setActiveReplyCommentId(prev => prev === commentId ? null : commentId);
    setReplyText("");
  };

  const loadCommentReplies = async (commentId: string) => {
    if (loadingReplies.has(commentId) || commentReplies[commentId]) return;

    setLoadingReplies(prev => new Set(prev).add(commentId));

    try {
      const repliesData = await getCommentReplies(commentId, 20, 0);
      console.log("📥 加载到的回复数据:", repliesData);

      const formattedReplies = (repliesData?.replies || []).map((reply: any) => ({
        id: reply.id || reply.commentId || Math.random().toString(36).slice(2),
        userId: reply.userId || reply.user_id || "未知用户",
        desc: reply.desc || reply.comment || reply.content || "(无内容)",
        createdAt: reply.createdAt || reply.created_at || "",
      }));

      if (isMountedRef.current) {
        setCommentReplies(prev => ({
          ...prev,
          [commentId]: formattedReplies
        }));

        setVisibleRepliesCount(prev => ({
          ...prev,
          [commentId]: Math.min(3, formattedReplies.length)
        }));
      }
    } catch (error) {
      console.error("❌ 获取回复失败:", error);
    } finally {
      setLoadingReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleSendReply = async (commentId: string) => {
    if (!replyText.trim()) return;

    const userId = localStorage.getItem("userId") || "Me";
    const username = localStorage.getItem("username") || "我";

    console.log("📨 Sending reply for commentId:", commentId, "replyText:", replyText);

    try {
      const newReply = await postComment(
        selectedPostForComments.id,
        replyText,
        userId,
        commentId
      );

      const newReplyObj = {
        id: Date.now().toString(),
        userId,
        username,
        desc: replyText.trim(),
        createdAt: new Date().toISOString(),
        parentCommentId: commentId
      };

      setCommentReplies(prev => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), newReplyObj]
      }));

      setVisibleRepliesCount(prev => ({
        ...prev,
        [commentId]: (prev[commentId] || 3) + 1
      }));

      if (selectedPostForComments) {
        const updatedPost = {
          ...selectedPostForComments,
          commentsList: selectedPostForComments.commentsList.map((comment: Comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReplyObj]
              };
            }
            return comment;
          })
        };

        setSelectedPostForComments(updatedPost);
        setPosts(prev => prev.map(p =>
          p.id === selectedPostForComments.id ? updatedPost : p
        ));
      }

      setReplyText("");
      setActiveReplyCommentId(null);
      Keyboard.dismiss();
    } catch (error) {
      console.error("❌ 发送回复失败:", error);
      Alert.alert("错误", "发送回复失败，请稍后重试");
    }
  };

  const handleCreatePost = async () => {
    if (!newPostText.trim() && !newPostImage) {
      setShowCreatePost(false);
      setShowPhotoRequired(false);
      setNewPostText("");
      setNewPostImage(null);
      return;
    }

    try {
      const postData: any = {
        title: newPostText.trim() || "无标题",
        content: newPostText.trim(),
        author: user?.user_id || "unknown",
      };

      if (newPostImage) {
        postData.file = {
          uri: newPostImage,
          name: "photo.jpg",
          type: "image/jpeg",
        };
      }

      console.log("📦 Sending postData to API:", postData);

      const response = await createPost(postData);
      console.log("✅ Post created:", response);

      const newPost = {
        id: response.id || Date.now().toString(),
        user_id: user.user_id,
        username: user.username,
        avatar: user.image ? { uri: user.image } : null,
        image: newPostImage ? { uri: newPostImage } : null,
        caption: newPostText.trim(),
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

      Alert.alert("成功", "帖子发布成功！");
    } catch (error: any) {
      console.error("❌ Failed to create post:", error);
      Alert.alert("错误", error.message || "发布失败，请稍后再试");
    }
  };

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
      setShowPhotoRequired(false);
    }
  };

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
      setShowPhotoRequired(false);
    }
  };

  const handleCameraClick = () => setShowCreatePost((prev) => !prev);

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

  const handleMore = (postId: string, event: any) => {
    const { pageX, pageY } = event.nativeEvent;

    setDropdownPosition({
      x: Math.max(10, pageX - 100),
      y: pageY + 20,
    });
    setSelectedPostId(postId);
    setShowDropdown(true);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
    setSelectedPostId(null);
  };

  const handleDelete = () => {
    if (selectedPostId) {
      setPostToDelete(selectedPostId);
      setShowDeleteDropdown(true);
      closeDropdown();
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      await deletePost(postToDelete);
      console.log(`✅ 已从后端删除帖子 ${postToDelete}`);

      setPosts((prev) => prev.filter((p) => p.id !== postToDelete));

      Alert.alert("成功", "帖子已删除！");
    } catch (err) {
      console.error("❌ 删除帖子失败:", err);
      Alert.alert("错误", "删除失败，请稍后再试");
    } finally {
      setShowDeleteDropdown(false);
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDropdown(false);
    setPostToDelete(null);
  };

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

  const confirmEdit = async () => {
    if (editingPostId && editPostText.trim()) {
      try {
        const postData = { content: editPostText.trim() };

        const res = await updatePost(editingPostId, postData);
        console.log("✅ 更新成功:", res);

        setPosts((prev) =>
          prev.map((p) =>
            p.id === editingPostId ? { ...p, caption: editPostText } : p
          )
        );

        Alert.alert("编辑成功", "帖子已更新");
      } catch (err) {
        console.error("❌ 更新帖子失败:", err);
        Alert.alert("错误", "更新帖子失败，请稍后再试");
      } finally {
        setEditingPostId(null);
        setEditPostText("");
      }
    }
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditPostText("");
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
                <TouchableOpacity
                  onPress={handleCreatePost}
                  style={styles.closeButtonAbsolute}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>

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
                <View style={shareStyles.shareHeader}>
                  <Text style={shareStyles.shareTitle}>分享至</Text>
                  <TouchableOpacity
                    onPress={handleCloseShare}
                    style={shareStyles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

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
              </View>
            ))
          )}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      ) : (
        // Topics Section
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

      {/* Editing Post Modal */}
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

      {/* Dropdown Menu */}
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

      {/* Delete Confirmation Modal */}
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

      {/* Comment Modal */}
      {showCommentModal && selectedPostForComments && (
        <TouchableWithoutFeedback onPress={handleCloseCommentModal}>
          <View style={commentModalStyles.overlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{ flex: 1, justifyContent: "flex-end" }}
            >
              <TouchableWithoutFeedback>
                <View style={commentModalStyles.commentModal}>
                  <View style={commentModalStyles.modalHandle} />

                  <View style={commentModalStyles.modalHeader}>
                    <Text style={commentModalStyles.modalTitle}>评论</Text>
                    <TouchableOpacity
                      style={commentModalStyles.closeButton}
                      onPress={handleCloseCommentModal}
                    >
                      <Text style={commentModalStyles.closeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    style={commentModalStyles.commentsList}
                    contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {selectedPostForComments.commentsList.length > 0 ? (
                      selectedPostForComments.commentsList.map((comment: Comment) => (
                        <TouchableWithoutFeedback key={comment.id}>
                          <View style={commentModalStyles.commentItem}>
                            <View style={commentModalStyles.commentAvatar}>
                              <Text style={commentModalStyles.commentAvatarText}>👤</Text>
                            </View>
                            <View style={commentModalStyles.commentContent}>
                              <Text style={commentModalStyles.commentUser}>{comment.user}</Text>
                              <Text style={commentModalStyles.commentText}>{comment.text}</Text>
                              <View style={commentModalStyles.commentMeta}>
                                <Text style={commentModalStyles.commentTime}>刚刚</Text>
                                <TouchableOpacity
                                  onPress={() => handleReply(comment.id)}
                                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                  <Text style={commentModalStyles.commentReplyButton}>回复</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleCommentLike(comment.id)}
                                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                  <Text style={commentModalStyles.commentLikeIcon}>
                                    {comment.isLiked ? '❤️' : '♡'}
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              {activeReplyCommentId === comment.id && (
                                <View style={commentModalStyles.replyInputContainer}>
                                  <View style={commentModalStyles.replyInputWrapper}>
                                    <TextInput
                                      style={commentModalStyles.replyInput}
                                      placeholder={`回复 ${comment.user}...`}
                                      value={replyText}
                                      onChangeText={setReplyText}
                                      multiline
                                      maxLength={500}
                                    />
                                    <View style={commentModalStyles.replyActions}>
                                      <TouchableOpacity
                                        style={commentModalStyles.replyActionButton}
                                        onPress={() => {
                                          setActiveReplyCommentId(null);
                                          setReplyText("");
                                        }}
                                      >
                                        <Text style={commentModalStyles.replyActionText}>取消</Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        style={[
                                          commentModalStyles.replyActionButton,
                                          commentModalStyles.replyActionButtonActive,
                                          !replyText.trim() && commentModalStyles.replyActionButtonDisabled
                                        ]}
                                        onPress={() => handleSendReply(comment.id)}
                                        disabled={!replyText.trim()}
                                      >
                                        <Text style={[
                                          commentModalStyles.replyActionText,
                                          commentModalStyles.replyActionTextActive,
                                          !replyText.trim() && commentModalStyles.replyActionTextDisabled
                                        ]}>发送</Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              )}

                              {commentReplies[comment.id] && commentReplies[comment.id].length > 0 && (
                                <View style={commentModalStyles.repliesContainer}>
                                  {commentReplies[comment.id].slice(0, visibleRepliesCount[comment.id] || 3).map((reply: any, index: number) => (
                                    <View key={reply.commentLogId || index} style={commentModalStyles.replyItem}>
                                      <View style={commentModalStyles.replyAvatar}>
                                        <Text style={commentModalStyles.replyAvatarText}>👤</Text>
                                      </View>
                                      <View style={commentModalStyles.replyContent}>
                                        <Text style={commentModalStyles.replyUser}>{reply.userId || 'User'}</Text>
                                        <Text style={commentModalStyles.replyText}>{reply.desc}</Text>
                                      </View>
                                    </View>
                                  ))}

                                  {commentReplies[comment.id].length > (visibleRepliesCount[comment.id] || 3) && (
                                    <TouchableOpacity
                                      style={commentModalStyles.loadMoreReplies}
                                      onPress={() => showMoreReplies(comment.id)}
                                    >
                                      <Text style={commentModalStyles.loadMoreRepliesText}>
                                        查看更多回复 ({commentReplies[comment.id].length - (visibleRepliesCount[comment.id] || 3)}条)
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              )}

                              {!commentReplies[comment.id] && !loadingReplies.has(comment.id) && (
                                <TouchableOpacity
                                  style={commentModalStyles.loadRepliesButton}
                                  onPress={() => loadCommentReplies(comment.id)}
                                >
                                  <Text style={commentModalStyles.loadRepliesButtonText}>查看回复</Text>
                                </TouchableOpacity>
                              )}

                              {loadingReplies.has(comment.id) && (
                                <View style={commentModalStyles.loadingReplies}>
                                  <Text style={commentModalStyles.loadingRepliesText}>加载回复中...</Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      ))
                    ) : (
                      <View style={commentModalStyles.emptyCommentsContainer}>
                        <Text style={commentModalStyles.emptyCommentsIcon}>💬</Text>
                        <Text style={commentModalStyles.emptyCommentsTitle}>还没有评论</Text>
                        <Text style={commentModalStyles.emptyCommentsText}>快来抢沙发吧！</Text>
                      </View>
                    )}
                  </ScrollView>

                  <View style={commentModalStyles.commentInputSection}>
                    <View style={commentModalStyles.commentInputAvatar}>
                      <Text style={commentModalStyles.commentAvatarText}>🧑🏻</Text>
                    </View>
                    <View style={commentModalStyles.commentInputWrapper}>
                      <TextInput
                        style={commentModalStyles.commentInput}
                        placeholder="添加评论..."
                        value={commentText}
                        onChangeText={setCommentText}
                        multiline
                        maxLength={500}
                      />
                      <TouchableOpacity
                        style={commentModalStyles.commentSendButton}
                        onPress={handleAddComment}
                        disabled={!commentText.trim()}
                      >
                        <Text
                          style={[
                            commentModalStyles.commentSendButtonText,
                            !commentText.trim() && commentModalStyles.commentSendButtonDisabled
                          ]}
                        >
                          发布
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}