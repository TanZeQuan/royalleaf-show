// screens/Home/Social/SocialScreen.tsx - 更新版本（带分享模态框）
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import {
  Alert,
  View,
  Text,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Modal,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  getCommentsByPostId,
  getAllPostsWithComments
} from "../../../services/SocialService/SocialScreenApi";
import {
  getLatestPosts,
  createPost,
  likePost,
  unlikePost,
  updatePost,
  deletePost,
} from "../../../services/SocialService/CreatepostsApi";
import { styles, commentModalStyles, newStyles } from "./SocialStyles";
import { getUserData, User } from "../../../utils/storage";
import * as ImagePicker from "expo-image-picker";

import { useCommentLogic } from "../Social/useCommentLogic";
import { CommentItem, EmptyComments } from "../Social/SocialComment";
import { CommentInputSection } from "../Social/CommentSectionInput";

const { width: screenWidth } = Dimensions.get("window");

export default function SocialScreen() {
  const navigation = useNavigation();
  const isMountedRef = useRef(true);
  const hasInitialFetchRef = useRef(false);

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [postLikeStatus, setPostLikeStatus] = useState<{ [key: string]: boolean }>({});

  // 创建帖子状态
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [showPhotoRequired, setShowPhotoRequired] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // 编辑/删除菜单状态
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState<string | null>(null);

  // 分享模态框状态
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedSharePost, setSelectedSharePost] = useState<any>(null);

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

  const handleShare = (platform: string) => {
    if (!selectedSharePost) return;

    const shareText = getShareText(platform, selectedSharePost);

    if (platform === "链接") {
      Share.share({
        message: shareText,
        title: "分享帖子",
      })
        .then(() => {
          setShowShareModal(false);
          Alert.alert("成功", "分享成功！");
        })
        .catch((error) => {
          console.error("分享失败:", error);
        });
    } else {
      // 对于其他平台，可以复制到剪贴板或显示提示
      Alert.alert(
        "分享到" + platform,
        "内容已准备好分享！\n\n" + shareText,
        [
          { text: "取消", style: "cancel" },
          {
            text: "复制",
            onPress: () => {
              // 在实际应用中，这里应该调用 Clipboard.setString(shareText)
              setShowShareModal(false);
              Alert.alert("成功", "内容已复制到剪贴板");
            },
          },
        ]
      );
    }
  };

  const openShareModal = (post: any) => {
    setSelectedSharePost(post);
    setShowShareModal(true);
  };

  const {
    showCommentModal,
    selectedPostForComments,
    commentText,
    activeReplyCommentId,
    replyText,
    commentReplies,
    loadingReplies,
    visibleRepliesCount,
    openCommentModal,
    closeCommentModal,
    setCommentText,
    handleAddComment,
    handleCommentLike,
    handleReply,
    setReplyText,
    handleSendReply,
    loadCommentReplies,
    showMoreReplies,
    setSelectedPostForComments,
  } = useCommentLogic(isMountedRef);

  // 加载用户数据
  useEffect(() => {
    (async () => {
      try {
        const userData = await getUserData();
        console.log("👤 User Data:", userData);
        console.log("🖼️ User Image:", userData?.image);
        console.log("📱 Image type:", typeof userData?.image);

        if (isMountedRef.current) {
          setUser(userData);
        }
      } catch (err) {
        console.error("Error loading user:", err);
      }
    })();
  }, []);

  // 加载帖子列表
  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        setIsLoading(true);
        const postsData = await getAllPostsWithComments();
        if (isMountedRef.current) setPosts(postsData);
      } catch (error) {
        console.error("获取帖子失败:", error);
        Alert.alert("错误", "无法加载帖子，请稍后再试");
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    };

    fetchPostsData();

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
      });
    };
  }, [navigation]);

  const handlePostLike = async (postId: string) => {
    // Optimistic UI update
    const isCurrentlyLiked = postLikeStatus[postId];

    // Update UI immediately
    setPostLikeStatus((prev) => ({
      ...prev,
      [postId]: !isCurrentlyLiked,
    }));

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isCurrentlyLiked
              ? Math.max(0, post.likes - 1)
              : post.likes + 1,
          };
        }
        return post;
      })
    );

    try {
      // Call API
      if (isCurrentlyLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (error: any) {
      console.error("点赞失败:", error);

      // Revert UI changes on error
      setPostLikeStatus((prev) => ({
        ...prev,
        [postId]: isCurrentlyLiked,
      }));

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likes: isCurrentlyLiked
                ? post.likes + 1
                : Math.max(0, post.likes - 1),
            };
          }
          return post;
        })
      );

      // Show user-friendly error message
      Alert.alert(
        "操作失败",
        error.message || "无法完成点赞操作，请检查网络连接后重试"
      );
    }
  };

  const handleOpenMenu = (post: any) => {
    setSelectedPost(post);
    setShowMenuModal(true);
  };

  const handleEditPost = () => {
    if (!selectedPost) return;

    setIsEditMode(true);
    setEditPostId(selectedPost.id);
    setNewPostText(selectedPost.caption || "");
    setNewPostImage(selectedPost.image || null);
    setShowCreatePost(true);
    setShowMenuModal(false);
  };

  const handleDeletePost = () => {
    if (!selectedPost) return;

    Alert.alert(
      "确认删除",
      "您确定要删除这条帖子吗？",
      [
        {
          text: "取消",
          style: "cancel",
        },
        {
          text: "删除",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePost(selectedPost.id);
              setPosts((prev) => prev.filter((p) => p.id !== selectedPost.id));
              setShowMenuModal(false);
              Alert.alert("成功", "帖子已删除");
            } catch (error) {
              console.error("删除失败:", error);
              Alert.alert("错误", "删除失败，请稍后重试");
            }
          },
        },
      ]
    );
  };

  const handleCreatePost = async () => {
    if (!newPostText.trim() && !newPostImage) {
      setShowCreatePost(false);
      setIsEditMode(false);
      setEditPostId(null);
      return;
    }

    try {
      setIsPosting(true);

      const postData = {
        title: newPostText.trim().substring(0, 50) || "无标题",
        content: newPostText.trim(),
        author: user?.user_id || user?.id || "anonymous",
        file: newPostImage
          ? {
            uri: newPostImage,
            name: "photo.jpg",
            type: "image/jpeg",
          }
          : undefined,
      };

      if (isEditMode && editPostId) {
        const updatedPost = await updatePost(editPostId, postData);
        console.log("✅ 帖子已更新:", updatedPost);

        if (isMountedRef.current) {
          setPosts((prev) =>
            prev.map((post) => {
              if (post.id === editPostId) {
                return {
                  ...post,
                  caption: newPostText.trim(),
                  content: newPostText.trim(),
                  image: newPostImage || post.image,
                  title: newPostText.trim().substring(0, 50) || post.title,
                  ...(updatedPost.data || updatedPost),
                };
              }
              return post;
            })
          );
          Alert.alert("成功", "帖子更新成功！");
        }
      } else {
        const newPostResponse = await createPost(postData);
        console.log("✅ 新帖子已创建:", newPostResponse);

        if (isMountedRef.current) {
          const newPost = {
            id: newPostResponse.id || newPostResponse.data?.id,
            caption: newPostText.trim(),
            content: newPostText.trim(),
            image: newPostImage,
            title: newPostText.trim().substring(0, 50) || "无标题",
            author: user?.user_id || user?.id || "anonymous",
            avatar: user?.avatar || "👨🏾",
            likes: 0,
            total: 0,
            createdAt: "刚刚",
            commentsList: [],
            ...(newPostResponse.data || newPostResponse),
          };

          setPosts((prev) => [newPost, ...prev]);
          Alert.alert("成功", "帖子发布成功！");
        }
      }

      if (isMountedRef.current) {
        setNewPostText("");
        setNewPostImage(null);
        setShowCreatePost(false);
        setShowPhotoRequired(false);
        setIsEditMode(false);
        setEditPostId(null);
      }
    } catch (error: any) {
      console.error("发布/更新帖子失败:", error);
      Alert.alert("错误", error.message || "操作失败，请稍后再试");
    } finally {
      setIsPosting(false);
    }
  };

  const handleOpenCommentModal = async (post: any) => {
    try {
      const { comments } = await getCommentsByPostId(post.id || post.postId);

      const updatedPost = {
        ...post,
        commentsList: comments,
      };

      setSelectedPostForComments(updatedPost);
      openCommentModal(updatedPost);
    } catch (error) {
      console.error("加载评论失败:", error);
      openCommentModal(post);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={{ marginTop: 10 }}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <TouchableOpacity onPress={() => {
          setIsEditMode(false);
          setEditPostId(null);
          setShowCreatePost(true);
        }}>
          <View style={styles.postIcon}>
            <Image
              source={require("assets/icons/postemoji.png")}
              style={{ width: 24, height: 24 }}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* 帖子列表 */}
      {posts.length > 0 ? (
        <ScrollView
          style={styles.feedContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              {/* Post Header */}
              <View style={styles.postHeader}>
                <View style={styles.postUserInfo}>
                  <View style={styles.postAvatar}>
                    {user?.image ? (
                      <Image
                        source={{ uri: user.image }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                        onError={(e) => console.log("❌ Image load error:", e.nativeEvent.error)}
                      />
                    ) : (
                      <Text style={styles.avatarEmoji}>{user?.avatar || "👨🏾"}</Text>
                    )}
                  </View>

                  <View>
                    <Text style={styles.username}>
                      {user?.username || "用户"}
                    </Text>
                    <Text style={styles.timeAgo}>{post.createdAt || "刚刚"}</Text>
                  </View>
                </View>

                {/* Three Dots Menu Button */}
                <TouchableOpacity
                  onPress={() => handleOpenMenu(post)}
                  style={{ padding: 8 }}
                >
                  <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Post Image */}
              {post.image && (
                <Image
                  source={{ uri: post.image }}
                  style={[
                    styles.postImage,
                    { width: screenWidth, height: screenWidth },
                  ]}
                  resizeMode="cover"
                />
              )}

              {/* Post Caption */}
              <View style={styles.postContent}>
                <Text style={styles.caption}>{post.caption}</Text>
              </View>

              {/* Post Actions */}
              <View style={styles.postActions}>
                <View style={styles.leftActions}>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handlePostLike(post.id)}
                  >
                    <Ionicons
                      name={postLikeStatus[post.id] ? "heart" : "heart-outline"}
                      size={24}
                      color={postLikeStatus[post.id] ? "red" : "#000"}
                    />
                    <Text style={styles.actionCount}>{post.likes || 0}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenCommentModal(post)}
                  >
                    <Image
                      source={require("assets/icons/comment.png")}
                      style={styles.actionButtonIcons}
                    />
                    <Text style={styles.actionCount}>
                      {post.total || 0}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openShareModal(post)}
                  >
                    <Image
                      source={require("assets/icons/share.png")}
                      style={styles.actionButtonIcons}
                    />
                    <Text style={styles.actionText}>分享</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无帖子</Text>
        </View>
      )}

      {/* Menu Modal for Edit/Delete */}
      <Modal
        visible={showMenuModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenuModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowMenuModal(false)}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <TouchableWithoutFeedback>
              <View style={{
                backgroundColor: 'white',
                borderRadius: 12,
                width: '80%',
                overflow: 'hidden',
              }}>
                <TouchableOpacity
                  onPress={handleEditPost}
                  style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e0e0e0',
                  }}
                >
                  <Text style={{ fontSize: 16, textAlign: 'center' }}>编辑</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDeletePost}
                  style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e0e0e0',
                  }}
                >
                  <Text style={{ fontSize: 16, textAlign: 'center', color: '#ff3b30' }}>删除</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowMenuModal(false)}
                  style={{ padding: 16 }}
                >
                  <Text style={{ fontSize: 16, textAlign: 'center', color: '#666' }}>取消</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowShareModal(false)}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}>
            <TouchableWithoutFeedback>
              <View style={{
                backgroundColor: 'white',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingBottom: Platform.OS === 'ios' ? 34 : 20,
              }}>
                <View style={{
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#e0e0e0',
                  alignItems: 'center',
                }}>
                  <View style={{
                    width: 40,
                    height: 4,
                    backgroundColor: '#ddd',
                    borderRadius: 2,
                    marginBottom: 12,
                  }} />
                  <Text style={{ fontSize: 18, fontWeight: '600' }}>分享到</Text>
                </View>

                <View style={{ padding: 20 }}>
                  {/* Share Options Grid */}
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    marginBottom: 20,
                  }}>
                    <TouchableOpacity
                      onPress={() => handleShare('Instagram')}
                      style={{
                        alignItems: 'center',
                        width: '25%',
                        marginBottom: 20,
                      }}
                    >
                      <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#E4405F',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}>
                        <Ionicons name="logo-instagram" size={32} color="white" />
                      </View>
                      <Text style={{ fontSize: 12, color: '#333' }}>Instagram</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleShare('Facebook')}
                      style={{
                        alignItems: 'center',
                        width: '25%',
                        marginBottom: 20,
                      }}
                    >
                      <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#1877F2',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}>
                        <Ionicons name="logo-facebook" size={32} color="white" />
                      </View>
                      <Text style={{ fontSize: 12, color: '#333' }}>Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleShare('WhatsApp')}
                      style={{
                        alignItems: 'center',
                        width: '25%',
                        marginBottom: 20,
                      }}
                    >
                      <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#25D366',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}>
                        <Ionicons name="logo-whatsapp" size={32} color="white" />
                      </View>
                      <Text style={{ fontSize: 12, color: '#333' }}>WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleShare('WeChat')}
                      style={{
                        alignItems: 'center',
                        width: '25%',
                        marginBottom: 20,
                      }}
                    >
                      <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#09B83E',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}>
                        <Ionicons name="chatbubbles" size={28} color="white" />
                      </View>
                      <Text style={{ fontSize: 12, color: '#333' }}>WeChat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleShare('链接')}
                      style={{
                        alignItems: 'center',
                        width: '25%',
                      }}
                    >
                      <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#666',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}>
                        <Ionicons name="link" size={28} color="white" />
                      </View>
                      <Text style={{ fontSize: 12, color: '#333' }}>复制链接</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => setShowShareModal(false)}
                    style={{
                      backgroundColor: '#f0f0f0',
                      padding: 16,
                      borderRadius: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 16, color: '#666' }}>取消</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Create/Edit Post Modal */}
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
                  onPress={() => {
                    setShowCreatePost(false);
                    setNewPostText("");
                    setNewPostImage(null);
                    setIsEditMode(false);
                    setEditPostId(null);
                  }}
                  style={styles.closeButtonAbsolute}
                  disabled={isPosting}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>

                <View style={styles.userAvatar}>
                  {user?.image ? (
                    <Image
                      source={{ uri: user.image }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                      onError={(e) => console.log("❌ User avatar image load error:", e.nativeEvent.error)}
                    />
                  ) : (
                    <Text style={styles.avatarEmoji}>{user?.avatar || "👨🏾"}</Text>
                  )}
                </View>
                <View style={styles.createPostContainer}>
                  <TextInput
                    style={[
                      styles.createPostInput,
                      { color: "#000", backgroundColor: "#fff" }
                    ]}
                    placeholder="分享您的感想..."
                    placeholderTextColor="#999"
                    multiline
                    value={newPostText}
                    onChangeText={setNewPostText}
                    editable={!isPosting}
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
                        disabled={isPosting}
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
                      onPress={async () => {
                        const { status } =
                          await ImagePicker.requestCameraPermissionsAsync();
                        if (status !== "granted") {
                          Alert.alert("权限不足", "需要相机权限才能拍照");
                          return;
                        }

                        let result =
                          await ImagePicker.launchCameraAsync({
                            mediaTypes:
                              ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 1,
                          });

                        if (!result.canceled) {
                          setNewPostImage(result.assets[0].uri);
                          setShowPhotoRequired(false);
                        }
                      }}
                      disabled={isPosting}
                    >
                      <Text style={styles.actionIcon}>📸</Text>
                      <Text style={styles.actionText}>拍照</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.photoButton}
                      onPress={async () => {
                        try {
                          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                          if (status !== "granted") {
                            Alert.alert("权限不足", "需要访问相册权限才能选择图片");
                            return;
                          }

                          const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.8,
                          });

                          if (!result.canceled && result.assets?.length > 0) {
                            setNewPostImage(result.assets[0].uri);
                          }
                        } catch (err) {
                          console.error("选择图片失败:", err);
                          Alert.alert("错误", "选择图片时出错");
                        }
                      }}
                      disabled={isPosting}
                    >
                      <Ionicons name="image-outline" size={22} color="#555" />
                      <Text style={{ marginLeft: 6, color: "#333" }}>图片</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.postButton,
                        newPostText.trim() || newPostImage
                          ? styles.postButtonActive
                          : null,
                      ]}
                      onPress={handleCreatePost}
                      disabled={isPosting}
                    >
                      {isPosting ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text
                          style={[
                            styles.postButtonText,
                            newPostText.trim() || newPostImage
                              ? styles.postButtonTextActive
                              : null,
                          ]}
                        >
                          {isEditMode ? "更新" : "发布"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* 评论 Modal */}
      {showCommentModal && selectedPostForComments && (
        <TouchableWithoutFeedback onPress={closeCommentModal}>
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
                  </View>

                  <ScrollView
                    style={commentModalStyles.commentsList}
                    contentContainerStyle={{
                      paddingBottom: 20,
                      flexGrow: 1,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {selectedPostForComments?.commentsList &&
                      selectedPostForComments.commentsList.length > 0 ? (
                      selectedPostForComments.commentsList.map((comment: any, index: number) => (
                        <CommentItem
                          key={comment.id || `comment-${index}`}
                          comment={{
                            ...comment,
                            user: comment.user?.username || comment.user?.name || "匿名用户",
                          }}
                          activeReplyCommentId={activeReplyCommentId}
                          replyText={replyText}
                          commentReplies={commentReplies}
                          loadingReplies={loadingReplies}
                          visibleRepliesCount={visibleRepliesCount}
                          onReply={handleReply}
                          onCommentLike={handleCommentLike}
                          onSendReply={handleSendReply}
                          onLoadReplies={loadCommentReplies}
                          onShowMoreReplies={showMoreReplies}
                          onReplyTextChange={setReplyText}
                        />
                      ))
                    ) : (
                      <EmptyComments />
                    )}
                  </ScrollView>

                  <CommentInputSection
                    postId={selectedPostForComments?.id || ""}
                    commentText={commentText}
                    onTextChange={setCommentText}
                    onCommentCreated={(newComment) => {
                      if (!selectedPostForComments) return;

                      setSelectedPostForComments((prev: any) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          commentsList: [newComment, ...(prev.commentsList || [])],
                          comments: (prev.comments || 0) + 1,
                        };
                      });

                      setCommentText("");
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}