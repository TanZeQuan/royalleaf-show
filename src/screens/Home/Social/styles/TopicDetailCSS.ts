// TopicDetailCSS.ts
import { StyleSheet } from "react-native";
import colors from "../../../../styles/colors";

export const topicDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary_bg,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray_light,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.gray_text,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.gold_deep,
  },
  joinButtonText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "500",
  },

  // Topic Banner
  topicBanner: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  topicBannerContent: {
    alignItems: "center",
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 8,
    textAlign: "center",
  },
  topicDescription: {
    fontSize: 14,
    color: colors.gray_deep,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  topicStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.green_deep,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray_text,
    marginTop: 4,
  },
  trendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold_light,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  trendingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  trendingText: {
    fontSize: 12,
    color: colors.gold_deep,
    fontWeight: "bold",
  },

  // Join Input
  joinInputContainer: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  joinInput: {
    minHeight: 100,
    fontSize: 15,
    color: colors.black,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  joinInputActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  joinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray_button,
  },
  joinTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.gray_button,
  },
  cancelButtonText: {
    fontSize: 14,
    color: colors.gray_text,
    fontWeight: "500",
  },
   publishButtonHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.gray_light,
  },
  publishButtonHeaderActive: {
    backgroundColor: colors.green_deep,
  },
  publishButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.gray_light,
  },
  publishButtonActive: {
    backgroundColor: colors.green_deep,
  },
  publishButtonText: {
    fontSize: 14,
    color: colors.gray_text,
    fontWeight: "500",
  },
  publishButtonTextActive: {
    color: colors.white,
  },

  // Feed
  feedContainer: {
    flex: 1,
  },
  postCard: {
    backgroundColor: colors.white,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray_button,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  username: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.black,
  },
  timeAgo: {
    fontSize: 13,
    color: colors.gray_text,
    marginTop: 2,
  },
  topicTag: {
    backgroundColor: colors.gray_button,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topicTagText: {
    fontSize: 12,
    color: colors.green_deep,
    fontWeight: "500",
  },

  // Post Content
  postImage: {
    width: "100%",
    resizeMode: "cover",
  },
  postContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  caption: {
    fontSize: 15,
    color: colors.black,
    lineHeight: 20,
  },
  imageUploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageUploadContainer: {
    marginBottom: 12,
  },
  imageUploadLabel: {
    fontSize: 14,
    color: colors.gray_deep,
    marginBottom: 8,
    fontWeight: '500',
  },
  imageUploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray_button,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  uploadButtonText: {
    fontSize: 14,
    color: colors.green_deep,
    fontWeight: '500',
  },
  selectedImageContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray_light,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
   publishButtonRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.gray_light,
    marginLeft: 12,
  },
  publishButtonRowActive: {
    backgroundColor: colors.green_deep,
  },

  // Post Actions
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    // borderTopWidth: 1,
    // borderTopColor: colors.gray_light,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionButtonIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
  },
  actionCount: {
    fontSize: 14,
    color: colors.black,
    fontWeight: "500",
  },
  saveButton: {
    padding: 4,
  },

    // comment
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: colors.white,
  },
  commentTextInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    marginRight: 8,
    color: colors.black,
    maxHeight: 80,
  },
  commentSection: {
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  commentRow: {
    flexDirection: "row",
    marginBottom: 20,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gold_light,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: "600",
  },
  commentContent: {
    flex: 1,
    backgroundColor: colors.primary_bg,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  commentUser: {
    fontWeight: "600",
    color: colors.gray_deep,
    fontSize: 13,
    marginRight: 6,
  },
  commentTime: {
    fontSize: 11,
    color: colors.gray_text,
    marginLeft: 8,
  },
  commentText: {
    color: colors.black,
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  commentLikeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 10,
  },
  commentLikeIcon: {
    fontSize: 15,
    marginRight: 4,
    color: colors.gray_deep,
  },
  commentLikeCount: {
    fontSize: 11,
    color: colors.gray_text,
  },
  noCommentText: {
    color: colors.gray_text,
    fontStyle: "italic",
    marginBottom: 8,
    textAlign: "center",
    paddingVertical: 20,
  },

  // reply
  replyIndicator: {
    flexDirection: "row",
    // justifyContent: 'space-between',
    alignItems: "center",
    backgroundColor: "#f7fafc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  replyIndicatorText: {
    fontSize: 12,
    color: "#4a5568",
    fontWeight: "500",
  },
  cancelReplyText: {
    fontSize: 12,
    color: "#e53e3e",
    fontWeight: "light",
  },
  repliesContainer: {
    marginLeft: 10,
    marginTop: 0,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.gold_deep,
    marginBottom: 15,
  },
  replyRow: {
    flexDirection: "row",
    marginBottom: 6,
    flexWrap: "wrap",
    marginLeft: 0,
  },
  replyUser: {
    fontWeight: "600",
    color: colors.gold_deep,
    marginRight: 4,
    fontSize: 13,
  },
  replyText: {
    color: colors.black,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  replyTo: {
    color: colors.gold_deep,
    fontWeight: "600",
  },
  sendButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: colors.gold_deep,
  },
  sendButtonText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "600",
  },

  // 设计师标识
  designerBadge: {
    backgroundColor: colors.green_deep,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 104,
    marginLeft: 3,
  },
  designerBadgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: "bold",
  },

  // 评论点赞高亮
  likedComment: {
    color: "#ff2442", // 小红书红
  },
  likedCommentText: {
    color: "#ff2442",
    fontWeight: "600",
  },
  
  // Empty State
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray_deep,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  startDiscussionButton: {
    backgroundColor: colors.green_deep,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 18,
  },
  startDiscussionButtonText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "500",
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: colors.gray_deep,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.green_deep,
    fontWeight: "500",
  },

  // Spacing
  bottomSpacing: {
    height: 20,
  },
});
