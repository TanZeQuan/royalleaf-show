// TopicDetailCSS.ts
import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";

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
    borderColor: colors.gray_light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  joinInputActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
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

  // Comments
  commentSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    // borderTopWidth: 1,
    // borderTopColor: colors.gray_light,
  },
  commentRow: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  commentUser: {
    fontWeight: "600",
    color: colors.gray_deep,
    marginRight: 4,
  },
  designerUser: {
    color: colors.green_deep,
  },
  commentText: {
    color: colors.gray_deep,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  noCommentText: {
    color: colors.gray_text,
    marginVertical: 12,
    textAlign: "center",
    fontSize: 14,
  },
  commentBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 12,
    // borderTopWidth: 1,
    // borderTopColor: colors.gray_light,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.gold_light,
    borderRadius: 18,
    marginRight: 10,
    color: colors.black,
    backgroundColor: colors.white,
  },
  commentPostButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.gray_light,
  },
  commentPostButtonActive: {
    backgroundColor: colors.gold_deep,
  },
  commentPostButtonText: {
    fontSize: 14,
    color: colors.gray_text,
    fontWeight: "500",
  },
  commentPostButtonTextActive: {
    color: colors.white,
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
