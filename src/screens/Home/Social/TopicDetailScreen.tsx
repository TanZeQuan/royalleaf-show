import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
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
import { topicDetailStyles } from "./TopicDetailCSS";
import { Topic, TopicDetailRouteParams } from "./TopicSlice";

const { width: screenWidth } = Dimensions.get("window");

type TopicDetailScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "TopicDetail"
>;

const mockTopicData: Record<string, Topic> = {
  t1: {
    id: "t1",
    title: "#你最爱的共创饮品理由",
    description: "分享你对创意茶饮的独特见解",
    posts: 42,
    participants: 28,
    isHot: true,
    posts_list: [
      {
        id: "p1",
        username: "TeaMaster_Lin",
        avatar: "👩‍🍳",
        image: require("assets/images/mock.jpg"),
        caption:
          "我最爱的是抹茶奶盖！传统抹茶的苦涩和现代奶盖的甜腻完美融合，每一口都是东西方文化的碰撞 🍵✨ #共创饮品 #抹茶控",
        likes: 15,
        comments: 3,
        timeAgo: "30分钟前",
        isLiked: false,
        isSaved: false,
        topicTag: "#你最爱的共创饮品理由",
        commentsList: [
          {
            id: "c1",
            user: "MatcharLover",
            text: "同款！抹茶奶盖真的绝了！",
            isDesigner: false,
            replyTo: null,
          },
          {
            id: "c2",
            user: "CreativeTea",
            text: "这个搭配确实很有创意",
            isDesigner: false,
            replyTo: null,
          },
        ],
      },
      {
        id: "p2",
        username: "BubbleFan_88",
        avatar: "🧑‍💼",
        image: require("assets/images/mock.jpg"),
        caption:
          "芋泥波波茶是我的心头好！紫色的颜值加上Q弹的口感，还有浓郁的芋香，简直是视觉和味觉的双重享受 🟣🧋 #共创饮品",
        likes: 23,
        comments: 5,
        timeAgo: "1小时前",
        isLiked: true,
        isSaved: false,
        topicTag: "#你最爱的共创饮品理由",
        commentsList: [
          {
            id: "c3",
            user: "PurpleLover",
            text: "芋泥控举手！💜",
            isDesigner: false,
            replyTo: null,
          },
          {
            id: "c4",
            user: "RoyalLeaf_Designer",
            text: "感谢分享！我们会考虑推出更多芋泥系列",
            isDesigner: true,
            replyTo: null,
          },
        ],
      },
    ],
  },
  t2: {
    id: "t2",
    title: "#双文化元素怎么融合才好看",
    description: "探讨传统与现代的完美结合",
    posts: 38,
    participants: 22,
    isHot: true,
    posts_list: [
      {
        id: "p3",
        username: "DesignGuru",
        avatar: "🎨",
        image: require("assets/images/mock.jpg"),
        caption:
          "中式花纹 + 现代极简包装 = 完美！看看这个设计，既保留了传统美学又符合现代审美 🎋🎯 #文化融合",
        likes: 31,
        comments: 8,
        timeAgo: "2小时前",
        isLiked: false,
        isSaved: true,
        topicTag: "#双文化元素怎么融合才好看",
        commentsList: [],
      },
    ],
  },
};

export default function TopicDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<TopicDetailScreenNavigationProp>();
  const route = useRoute();
  const { topicId, topicTitle, topicDescription } =
    route.params as TopicDetailRouteParams;

  const [topicData, setTopicData] = useState<Topic | null>(
    mockTopicData[topicId] || null
  );
  const [posts, setPosts] = useState(topicData?.posts_list || []);
  const [newPostText, setNewPostText] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(
    null
  );
  const [commentText, setCommentText] = useState("");
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

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

  const handleComment = async (postId: string) => {
    const isOpening = activeCommentPostId !== postId;
    setActiveCommentPostId(isOpening ? postId : null);
    setCommentText("");

    if (isOpening) {
      try {
        setCommentsLoading(true);
        
        // First, get the list of comments (which are missing content)
        const { comments: commentsWithIds } = await getCommentsByPostId(postId);

        // Second, fetch the details for each comment individually
        const commentsWithDetails = await Promise.all(
          commentsWithIds.map(async (comment: any) => {
            const details = await getCommentDetails(comment.id); // 'comment.id' might need to be 'comment.commentId'
            return { ...comment, ...details }; // Merge the original data with the fetched content
          })
        );

        // Finally, update the state with the complete comment data
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  commentsList: commentsWithDetails.map((c: any) => ({
                    id: c.id,
                    user: c.username,
                    text: c.content, // This content comes from the second API call
                    isDesigner: false,
                    replyTo: null,
                  })),
                }
              : p
          )
        );
      } catch (error) {
        console.error("Failed to fetch comments", error);
      } finally {
        setCommentsLoading(false);
      }
    }
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
                  user: "我",
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

  const handleJoinDiscussion = () => {
    if (!newPostText.trim()) return;

    const newPost = {
      id: Date.now().toString(),
      username: "我",
      avatar: "🧑🏻",
      image: require("assets/images/mock.jpg"),
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
    setShowJoinInput(false);

    // Update topic data
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

      {/* Header - 保持不变 */}
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

      {/* 主 ScrollView - 包含所有内容 */}
      <ScrollView
        style={topicDetailStyles.feedContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Topic Info Banner - 移动到 ScrollView 内部 */}
        <View style={topicDetailStyles.topicBanner}>
          <View style={topicDetailStyles.topicBannerContent}>
            <Text style={topicDetailStyles.topicTitle}>{topicData.title}</Text>
            <Text style={topicDetailStyles.topicDescription}>
              {topicData.description}
            </Text>

            {/* Topic Stats */}
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

            {/* Trending Indicator */}
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
            <TextInput
              style={topicDetailStyles.joinInput}
              placeholder={`分享你对 ${topicData.title} 的看法...`}
              multiline
              value={newPostText}
              onChangeText={setNewPostText}
              maxLength={300}
            />
            <View style={topicDetailStyles.joinInputActions}>
              <TouchableOpacity
                style={topicDetailStyles.cancelButton}
                onPress={() => {
                  setShowJoinInput(false);
                  setNewPostText("");
                }}
              >
                <Text style={topicDetailStyles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  topicDetailStyles.publishButton,
                  newPostText.trim()
                    ? topicDetailStyles.publishButtonActive
                    : null,
                ]}
                onPress={handleJoinDiscussion}
                disabled={!newPostText.trim()}
              >
                <Text
                  style={[
                    topicDetailStyles.publishButtonText,
                    newPostText.trim()
                      ? topicDetailStyles.publishButtonTextActive
                      : null,
                  ]}
                >
                  发布
                </Text>
              </TouchableOpacity>
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
                {/* Topic Tag */}
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

              {/* Comment Section */}
              {activeCommentPostId === post.id && (
                <View style={topicDetailStyles.commentSection}>
                  {commentsLoading ? (
                    <ActivityIndicator style={{ marginVertical: 20 }} />
                  ) : post.commentsList.length > 0 ? (
                    post.commentsList.map((comment) => (
                      <View
                        key={comment.id}
                        style={topicDetailStyles.commentRow}
                      >
                        <Text
                          style={[
                            topicDetailStyles.commentUser,
                            comment.isDesigner &&
                              topicDetailStyles.designerUser,
                          ]}
                        >
                          {comment.user}
                          {comment.isDesigner && " 🎨"}：
                        </Text>
                        <Text style={topicDetailStyles.commentText}>
                          {comment.text}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={topicDetailStyles.noCommentText}>
                      还没有评论，快来抢沙发吧~ 🛋️
                    </Text>
                  )}

                  {/* Comment Input */}
                  <View style={topicDetailStyles.commentBox}>
                    <TextInput
                      style={topicDetailStyles.commentInput}
                      placeholder="写下你的评论..."
                      value={commentText}
                      onChangeText={setCommentText}
                    />
                    <TouchableOpacity
                      style={[
                        topicDetailStyles.commentPostButton,
                        commentText.trim()
                          ? topicDetailStyles.commentPostButtonActive
                          : null,
                      ]}
                      onPress={() => handleAddComment(post.id)}
                    >
                      <Text
                        style={[
                          topicDetailStyles.commentPostButtonText,
                          commentText.trim()
                            ? topicDetailStyles.commentPostButtonTextActive
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