// screens/Home/Social/SocialScreen.tsx - 更新版本
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
} from "../../../services/SocialService/CreatepostsApi";
import { styles, commentModalStyles, newStyles } from "./SocialStyles";
import { getUserData } from "../../../utils/storage";
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
        if (isMountedRef.current) {
          setUser(userData);
        }
      } catch (err) {
        console.error(err);
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
    try {
      const isLiked = postLikeStatus[postId];

      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }

      // 更新本地状态
      setPostLikeStatus((prev) => ({
        ...prev,
        [postId]: !isLiked,
      }));

      // 更新帖子列表中的点赞数
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likes: isLiked ? Math.max(0, post.likes - 1) : post.likes + 1,
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("点赞失败:", error);
      Alert.alert("错误", "操作失败，请稍后重试");
    }
  };

  const handleCreatePost = async () => {
    if (!newPostText.trim() && !newPostImage) {
      setShowCreatePost(false);
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

      const response = await getLatestPosts();
      // console.log("📦 后端帖子返回结果:", response);

      const apiPosts = Array.isArray(response?.data) ? response.data : [];


      if (isMountedRef.current) {
        // 立即加载新帖子的评论
        const comments = await getCommentsByPostId(response.id);

        const newPost = {
          ...response,
          commentsList: comments || [],
        };

        setPosts((prev) => [newPost, ...prev]);

        setNewPostText("");
        setNewPostImage(null);
        setShowCreatePost(false);
        setShowPhotoRequired(false);

        Alert.alert("成功", "帖子发布成功！");
      }
    } catch (error: any) {
      console.error("发布帖子失败:", error);
      Alert.alert("错误", error.message || "发布失败，请稍后再试");
    } finally {
      setIsPosting(false);
    }
  };

  const handleOpenCommentModal = async (id: any) => {
    try {
      // 重新加载最新评论
      const comments = await getCommentsByPostId(id);
      const updatedPost = {
        commentsList: comments || [],
      };
      setSelectedPostForComments(updatedPost);
      openCommentModal(updatedPost);
    } catch (error) {
      console.error("加载评论失败:", error);
      openCommentModal(id);
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
        <TouchableOpacity onPress={() => setShowCreatePost(true)}>
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
                    <Text style={styles.avatarEmoji}>{post.avatar || "👨🏾"}</Text>
                  </View>
                  <View>
                    <Text style={styles.username}>{post.author || "用户"}</Text>
                    <Text style={styles.timeAgo}>{post.createdAt || "刚刚"}</Text>
                  </View>
                </View>
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
                    <Image
                      source={require("assets/icons/loveblack.png")}
                      style={[
                        styles.actionButtonIcons,
                        postLikeStatus[post.id] && { opacity: 0.6 },
                      ]}
                    />
                    <Text style={styles.actionCount}>{post.likes || 0}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenCommentModal(post.id)}
                  >
                    <Image
                      source={require("assets/icons/comment.png")}
                      style={styles.actionButtonIcons}
                    />
                    <Text style={styles.actionCount}>
                      {post.total || 0}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
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
                  onPress={() => {
                    setShowCreatePost(false);
                    setNewPostText("");
                    setNewPostImage(null);
                  }}
                  style={styles.closeButtonAbsolute}
                  disabled={isPosting}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>

                <View style={styles.userAvatar}>
                  <Text style={styles.avatarEmoji}>{user?.avatar || "👨🏾"}</Text>
                </View>
                <View style={styles.createPostContainer}>
                  <TextInput
                    style={styles.createPostInput}
                    placeholder="分享您的感想..."
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
                        const { status } =
                          await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (status !== "granted") {
                          Alert.alert(
                            "权限不足",
                            "需要访问相册权限才能选择照片"
                          );
                          return;
                        }

                        let result =
                          await ImagePicker.launchImageLibraryAsync({
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
                          发布
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
                    {selectedPostForComments.commentsList &&
                      selectedPostForComments.commentsList.length > 0 ? (
                      selectedPostForComments.commentsList.map(
                        (comment: any) => (
                          <CommentItem
                            key={comment.id}
                            comment={comment}
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
                        )
                      )
                    ) : (
                      <EmptyComments />
                    )}
                  </ScrollView>

                  <CommentInputSection
                    postId={selectedPostForComments.id} // 当前帖子ID
                    userId={user?.user_id || user?.id || "anonymous"}
                    commentText={commentText}
                    onTextChange={setCommentText}
                    onCommentCreated={(newComment) => {
                      setSelectedPostForComments((prev: any) => ({
                        ...prev,
                        commentsList: [newComment, ...(prev.commentsList || [])],
                      }));
                      setCommentText(""); // 清空输入框
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