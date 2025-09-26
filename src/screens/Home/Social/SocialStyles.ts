import { StyleSheet } from "react-native";
import { colors } from "styles";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary_bg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold_light,
    backgroundColor: colors.gold_light,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "center",
    flex: 1,
  },
  postIcon: {
    width: 40,
    height: 40,
    backgroundColor: colors.gold_deep,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: { fontSize: 24, color: colors.black },
  floatingPostButton: {
    position: "absolute",
    bottom: 50,
    right: 25,
    zIndex: 25,
  },
  cameraIcon: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.green_deep,
    borderRadius: 28,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  cameraIconImage: { width: 28, height: 28, resizeMode: "contain" },

  createPostSection: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    paddingBottom: 25,
    paddingTop: 40,
    flexDirection: "row",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: colors.gold_light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarEmoji: { fontSize: 24 },
  createPostContainer: { flex: 1 },
  createPostInput: {
    minHeight: 150,
    fontSize: 15,
    color: colors.black,
    textAlignVertical: "top",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.gold_deep,
    borderRadius: 10,
    padding: 15,
  },
  closeButtonAbsolute: {
    position: "absolute",
    top: 5,
    right: 10,
    zIndex: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.gray_deep,
  },
  createPostActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.gray_button,
    borderRadius: 20,
  },
  actionIcon: { fontSize: 18, marginRight: 4 },
  actionText: {
    fontSize: 14,
    color: colors.gray_deep,
    fontWeight: "500",
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#e2e8f0",
    borderRadius: 20,
  },
  postButtonActive: {
    backgroundColor: colors.gold_deep,
  },
  postButtonText: {
    fontSize: 14,
    color: colors.gray_text,
    fontWeight: "600",
  },
  postButtonTextActive: { color: colors.white },

  feedContainer: { flex: 1 },
  postCard: { backgroundColor: colors.white, marginBottom: 8 },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postUserInfo: { flexDirection: "row", alignItems: "center" },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray_light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  username: { fontSize: 14, fontWeight: "600", color: colors.black },
  timeAgo: { fontSize: 12, color: colors.gray_text, marginTop: 2 },
  moreButton: { padding: 5 },
  moreIcon: { fontSize: 18, color: colors.gray_deep },
  postImage: {
    width: "100%", // 占满父容器
    aspectRatio: 1, // 高度 = 宽度
    resizeMode: "cover", // 图片超出部分裁切，保证正方形不拉伸
  },

  postContent: { paddingHorizontal: 16, paddingVertical: 12 },
  caption: { fontSize: 14, color: colors.black, lineHeight: 20 },

  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  leftActions: { flexDirection: "row", alignItems: "center", flex: 1 },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    paddingVertical: 5,
  },
  actionButtonIcons: {
    width: 24,
    height: 24,
  },
  saveButton: {
    position: "absolute",
    top: 2,
    right: 20,

    padding: 5,
  },
  actionCount: {
    fontSize: 14,
    color: "#4a5568",
    fontWeight: "500",
    marginLeft: 4,
  },

  commentBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 16,
    marginRight: 8,
    color: colors.black,
    backgroundColor: '#ffffff',
    maxHeight: 80,
    minHeight: 40,
  },
  commentPostButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.gray_light,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  commentPostButtonActive: {
    backgroundColor: colors.gold_deep,
  },
  commentPostButtonText: {
    fontSize: 14,
    color: colors.gray_text,
    fontWeight: "600",
  },
  commentPostButtonTextActive: { color: colors.white },

  bottomSpacing: { height: 20 },

  // 评论区域整体包装器
  commentSectionWrapper: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    maxHeight: '70%', // 保留最大高度限制以防内容过多
  },

  // 评论列表滚动视图
  commentsScrollView: {
    maxHeight: 450, // 限制滚动区域最大高度
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // 评论滚动内容容器
  commentsScrollContent: {
    paddingBottom: 20,
  },

  // 空评论容器
  emptyCommentsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },

  emptyCommentsText: {
    fontSize: 15,
    color: '#6c757d',
    fontStyle: 'italic',
  },

  // 固定在底部的输入框包装器
  commentInputWrapper: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  commentSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    maxHeight: 400, // 限制评论区域最大高度，使其可滚动
  },
  commentRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  commentUser: {
    fontWeight: "600",
    color: colors.gray_deep,
    marginRight: 4,
  },
  commentText: {
    color: colors.gray_deep,
    flexShrink: 1,
  },
  noCommentText: {
    color: colors.gray_text,
    fontStyle: "italic",
    marginBottom: 8,
  },
  // 评论容器
  commentContainer: {
    marginBottom: 12,
    paddingLeft: 8,
  },

  // 评论卡片 - 优化设计
  commentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  // 评论头部区域
  commentHeader: {
    marginBottom: 12,
  },

  // 回复区域
  repliesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },

  // 回复滚动容器
  repliesScrollView: {
    maxHeight: 200,
    marginBottom: 8,
  },

  // 展开回复按钮 - 优化样式
  expandReplyButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.gold_deep,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  expandReplyButtonText: {
    fontSize: 13,
    color: colors.gold_deep,
    fontWeight: '600',
  },

  // 加载回复按钮
  loadRepliesButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  loadRepliesButtonText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },

  // 加载中状态
  loadingReplies: {
    paddingVertical: 8,
    alignItems: 'center',
  },

  loadingRepliesText: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },

  // 回复按钮
  replyButton: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  replyButtonText: {
    color: "#6c757d",
    fontSize: 12,
    fontWeight: "500",
  },

  // 回复容器
  repliesContainer: {
    marginTop: 8,
    paddingLeft: 8,
  },

  // 回复行
  replyRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#e9ecef",
  },

  replyUser: {
    fontWeight: "600",
    fontSize: 13,
    color: "#495057",
    marginRight: 4,
  },

  replyText: {
    fontSize: 13,
    color: "#6c757d",
    flex: 1,
  },

  // 回复输入区域
  replyInputContainer: {
    marginTop: 8,
  },

  startReplyButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginBottom: 8,
  },

  startReplyButtonText: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
  },

  replyInputBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  replyInput: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 8,
    minHeight: 60,
    textAlignVertical: "top",
  },

  replyActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },

  cancelReplyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },

  cancelReplyButtonText: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },

  sendReplyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e9ecef",
  },

  sendReplyButtonActive: {
    backgroundColor: colors.gold_deep,
  },

  sendReplyButtonText: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "600",
  },

  sendReplyButtonTextActive: {
    color: colors.white,
  },

  // 展开更多按钮样式
  loadMoreButton: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  loadMoreButtonText: {
    fontSize: 13,
    color: "#6c757d",
    fontWeight: "500",
  },

  // 更好看的展开按钮样式
  loadMoreCommentsButton: {
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.gold_deep,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  loadMoreCommentsButtonText: {
    fontSize: 14,
    color: colors.gold_deep,
    fontWeight: "600",
    textAlign: 'center',
  },
  previewContainer: {
    marginTop: 10,
    marginBottom: 20,
    position: "relative",
    alignItems: "flex-start",
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    
  },
  removeImageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F9F5EC',
},
emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 100,
},
emptyText: {
  fontSize: 16,
  color: '#666',
  textAlign: 'center',
},
});

// 给 Button 用的
export const newStyles = StyleSheet.create({
  deleteModal: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
  },
  editModal: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 16,
    textAlign: "center",
  },
  buttonsAll: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttons: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonMessage: {
    fontSize: 16,
    color: colors.gray_deep,
    marginBottom: 40,
    textAlign: "center",
  },
  buttonLeft: {
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gray_light,
  },
  buttonRight: {
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gold_deep,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },
  editInput: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: colors.gray_light,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  // closeIcon: {
  //   fontSize: 24,
  //   color: colors.black,
  //   fontWeight: "bold",
  // },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  dropdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 60,
  },
});

// 给 Post Dropdown 用的
export const newStylesdropdown = StyleSheet.create({
  dropdownMenu: {
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 120,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 15,
    color: colors.black,
  },
  dropdownItemDelete: {
    color: "#e53e3e",
  },
});

// 给 Share 用的
export const shareStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 10,
  },
  shareSuccessModal: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  sharePreviewTitle: {
    fontSize: 15,
    color: colors.black,
    fontWeight: "semibold",
    marginBottom: 10,
  },
  sharePreviewText: {
    fontSize: 15,
    color: colors.black,
    fontWeight: "semibold",
    marginBottom: 10,
  },
  shareSuccessText: {
    fontSize: 16,
    color: colors.black,
    textAlign: "center",
  },
  shareContainer: {
    width: "100%",
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 15,
    paddingBottom: 30,
  },
  shareHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },
  closeButton: {
    padding: 5,
  },
  closeIcon: {
    fontSize: 24,
    color: colors.black,
    fontWeight: "bold",
  },
  shareOptionsHorizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  shareOptionHorizontal: {
    alignItems: "center",
    marginHorizontal: 0,
    marginBottom: 15,
    width: 60,
  },
  shareOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gray_light,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  shareOptionIconText: {
    fontSize: 20,
  },
  shareOptionText: {
    fontSize: 12,
    color: colors.black,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#2d3748",
    fontWeight: "600",
  },
});

// Instagram 风格评论弹窗样式
export const commentModalStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
    zIndex: 1000,
  },

  commentModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    maxHeight: "80%",
    display: "flex",
    flexDirection: "column",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    position: "relative",
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },

  closeButton: {
    position: "absolute",
    right: 20,
    padding: 8,
  },

  closeButtonText: {
    fontSize: 18,
    color: colors.gray_deep,
    fontWeight: "500",
  },

  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: "#d1d5db",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },

  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 200,
  },

  commentItem: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 4,
    alignItems: "flex-start",
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },

  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray_light,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  commentAvatarText: {
    fontSize: 14,
  },

  commentContent: {
    flex: 1,
  },

  commentUser: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 2,
  },

  commentText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 18,
    marginBottom: 4,
  },

  commentMeta: {
    flexDirection: "row",
    alignItems: "center",
  },

  commentTime: {
    fontSize: 12,
    color: colors.gray_text,
    marginRight: 16,
  },

  commentReplyButton: {
    fontSize: 12,
    color: colors.gray_text,
    fontWeight: "500",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  commentLikeButton: {
    marginLeft: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },

  commentLikeIcon: {
    fontSize: 12,
    color: colors.gray_text,
  },

  repliesContainer: {
    marginTop: 12,
    paddingLeft: 44,
    paddingTop: 8,
  },

  replyItem: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "flex-start",
    backgroundColor: "#fafafa",
    borderRadius: 8,
    marginBottom: 4,
  },

  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray_light,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  replyAvatarText: {
    fontSize: 10,
  },

  replyContent: {
    flex: 1,
  },

  replyUser: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.black,
  },

  replyText: {
    fontSize: 13,
    color: colors.black,
    lineHeight: 16,
    marginTop: 1,
  },

  loadMoreReplies: {
    paddingLeft: 52,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  loadMoreRepliesText: {
    fontSize: 13,
    color: colors.gold_deep,
    fontWeight: "600",
  },

  // 回复输入容器
  replyInputContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  replyInputWrapper: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
  },

  replyInput: {
    fontSize: 14,
    color: colors.black,
    paddingVertical: 8,
    paddingHorizontal: 4,
    maxHeight: 80,
    minHeight: 40,
    marginBottom: 8,
  },

  replyActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },

  replyActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e9ecef",
  },

  replyActionButtonActive: {
    backgroundColor: colors.gold_deep,
  },

  replyActionButtonDisabled: {
    backgroundColor: "#f0f0f0",
  },

  replyActionText: {
    fontSize: 14,
    color: colors.gray_text,
    fontWeight: "500",
  },

  replyActionTextActive: {
    color: colors.white,
  },

  replyActionTextDisabled: {
    color: "#ccc",
  },

  // 加载回复按钮
  loadRepliesButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  loadRepliesButtonText: {
    fontSize: 12,
    color: colors.gray_text,
    fontWeight: "500",
  },

  // 加载中状态
  loadingReplies: {
    paddingVertical: 8,
    alignItems: "center",
  },

  loadingRepliesText: {
    fontSize: 12,
    color: colors.gray_text,
    fontStyle: "italic",
  },

  commentInputSection: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: colors.white,
    minHeight: 60,
  },

  commentInputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray_light,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginBottom: 8,
  },

  commentInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
    minHeight: 44,
  },

  commentInput: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
    paddingVertical: 8,
    paddingHorizontal: 4,
    maxHeight: 80,
    lineHeight: 20,
  },

  commentSendButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },

  commentSendButtonText: {
    fontSize: 14,
    color: colors.gold_deep,
    fontWeight: "600",
  },

  commentSendButtonDisabled: {
    color: colors.gray_text,
  },

  emptyCommentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },

  emptyCommentsIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.6,
  },

  emptyCommentsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 8,
    textAlign: "center",
  },

  emptyCommentsText: {
    fontSize: 16,
    color: colors.gray_text,
    textAlign: "center",
    lineHeight: 24,
  },
});

// 给话题讨论用的
export const topicStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray_light,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.gold_deep,
  },
  tabText: {
    fontSize: 15,
    color: colors.gray_text,
    fontWeight: "500",
  },
  activeTabText: {
    color: colors.gold_deep,
    fontWeight: "600",
  },
  topicsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 16,
    marginTop: 8,
  },
  topicCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray_light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  hotTopicCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.gold_light,
    shadowColor: colors.gold_deep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  participationIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.gold_deep,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  topicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    flex: 1,
    marginRight: 8,
  },
  hotBadge: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  hotBadgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: "bold",
  },
  topicDescription: {
    fontSize: 14,
    color: colors.gray_text,
    marginBottom: 12,
    lineHeight: 20,
  },
  activityIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  activityHigh: {
    backgroundColor: "#10b981",
  },
  activityMedium: {
    backgroundColor: "#f59e0b",
  },
  activityLow: {
    backgroundColor: "#6b7280",
  },
  activityText: {
    fontSize: 12,
    color: colors.gray_text,
    marginLeft: 4,
  },
  topicStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.gray_text,
    fontWeight: "500",
  },
  trendingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendingText: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
  interactionPreview: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gold_light,
    marginRight: -4,
    borderWidth: 1,
    borderColor: colors.white,
  },
  moreParticipants: {
    fontSize: 11,
    color: colors.gray_text,
    marginLeft: 8,
  },
  selectedTopicHeader: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray_light,
  },
  backToTopics: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  selectedTopicTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 6,
  },
  selectedTopicDesc: {
    fontSize: 14,
    color: colors.gray_text,
    lineHeight: 20,
  },
  emptyTopic: {
    padding: 40,
    alignItems: "center",
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
  },
  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gray_light,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray_text,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  createTopicButton: {
    backgroundColor: colors.gold_deep,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  createTopicButtonText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "600",
  },
});
