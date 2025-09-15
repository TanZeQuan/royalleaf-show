import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../navigation/stacks/HomeStack";
import {
  styles,
  shareStyles,
  newStyles,
  newStylesdropdown,
} from "../Social/SocialStyles";
import * as ImagePicker from "expo-image-picker";

const { width: screenWidth } = Dimensions.get("window");

type SocialScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "Social"
>;

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
    commentsList: [
      { id: "c1", user: "TeaFan", text: "我也超爱这款！😍" },
      { id: "c2", user: "BobaKing", text: "下次一起去喝！🧋" },
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
    commentsList: [{ id: "c3", user: "FriendA", text: "好羡慕！🥹" }],
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
    commentsList: [],
  },
];

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

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({ tabBarStyle: { display: "none" } });
    }

    return () => {
      if (parent) {
        parent.setOptions({ tabBarStyle: { display: "flex" } });
      }
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
              { id: Date.now().toString(), user: "Me", text: commentText },
            ],
          }
          : p
      )
    );

    setCommentText("");
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
      console.log(`Shared to ${platform} (post ${currentSharePostId})`);
      // 移除原有的 Alert.alert，改为使用自定义模态框
      setShowShareSuccess(true);
      setSharePlatform(platform);
      setTimeout(() => {
        setShowShareSuccess(false);
        setSharePlatform("");
        handleCloseShare();
      }, 1500);
    }
  };

  // More Menu - Fixed the event handling
  const handleMore = (postId: string, event: any) => {
    // Use nativeEvent to get the touch coordinates
    const { locationX, locationY, pageX, pageY } = event.nativeEvent;

    // Set position for dropdown - adjust as needed for your UI
    setDropdownPosition({
      x: Math.max(10, pageX - 100), // Ensure it doesn't go off screen
      y: pageY + 20
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

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7fafc" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
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
        <TouchableWithoutFeedback onPress={handleCloseCreatePost}>
          <View style={newStyles.overlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.createPostSection}>
                {/* 只在原有结构上添加关闭按钮的绝对定位 */}
                <TouchableOpacity
                  onPress={handleCloseCreatePost}
                  style={styles.closeButtonAbsolute}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>

                {/* 保持原有的布局结构不变 */}
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

                  {/* 红色提示文字 */}
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Share Overlay */}
      {showShareOverlay && (
        <TouchableWithoutFeedback onPress={handleCloseShare}>
          <View style={shareStyles.overlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
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
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={shareStyles.shareSuccessModal}>
                <Text style={shareStyles.shareSuccessText}>
                  分享成功到 {sharePlatform}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Feed */}
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
            </View>

            {/* Comment Section */}
            {activeCommentPostId === post.id && (
              <View style={styles.commentSection}>
                {/* 评论列表 */}
                {post.commentsList.length > 0 ? (
                  post.commentsList.map((c) => (
                    <View key={c.id} style={styles.commentRow}>
                      <Text style={styles.commentUser}>{c.user}：</Text>
                      <Text style={styles.commentText}>{c.text}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noCommentText}>
                    还没有评论，快来抢沙发吧~ 🛋️
                  </Text>
                )}

                {/* 评论输入框 */}
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
        ))}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Editing Post*/}
      {editingPostId && (
        <TouchableWithoutFeedback onPress={cancelEdit}>
          <View style={newStyles.overlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
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
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View
                style={[
                  newStylesdropdown.dropdownMenu,
                  {
                    top: dropdownPosition.y,
                    left: dropdownPosition.x,
                    position: 'absolute'
                  },
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
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={newStyles.deleteModal}>
                <Text style={newStyles.modalTitle}>确认删除</Text>
                <Text style={newStyles.buttonMessage}>
                  确定要删除这条帖子吗？
                </Text>
                <View style={newStyles.buttonsAll}>
                  <TouchableOpacity
                    style={[newStyles.buttonLeft]}
                    onPress={confirmDelete}
                  >
                    <Text style={[newStyles.buttonText]}>删除</Text>
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