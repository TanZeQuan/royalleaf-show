import colors from "@styles/colors";
import { Dimensions, StyleSheet } from "react-native";
import theme from "../../../styles/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary_bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold_light,
    backgroundColor: colors.gold_light,
    fontSize: 20,
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: { fontSize: 20, color: theme.colors.black, fontWeight: "bold" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: theme.colors.black },
  placeholder: { width: 32 },
  content: { flex: 1 },
  mainImageContainer: { position: "relative", marginBottom: 24 },
  mainImage: { width: width, height: width * 0.8 },
  imageTitle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.gold_deep,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  itemName: {
    fontSize: 25,
    fontWeight: "bold",
    color: theme.colors.black,
    textAlign: "center",
  },
  voteSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.white,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  voteCountText: { fontSize: 16, color: colors.gray_text, marginBottom: 8 },
  voteCountNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.green_deep,
  },
  actionSection: { paddingHorizontal: 20, marginBottom: 24 },
  voteButton: {
    backgroundColor: theme.colors.gold_deep,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  votedButton: { backgroundColor: theme.colors.gray_light },
  voteButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.black,
  },
  votedButtonText: { color: theme.colors.gray_text },
  commentInputSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderTopWidth: 3,
    borderColor: theme.colors.gold_light,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: theme.colors.primary_bg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.black,
    marginBottom: 12,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 5,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.gold_deep,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 16,
    color: theme.colors.black,
    backgroundColor: theme.colors.white,
  },
  commentButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  commentButtonActive: { backgroundColor: theme.colors.gold_deep },
  commentButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.gray_text,
  },
  commentButtonTextActive: { color: theme.colors.black },
  charCount: {
    fontSize: 12,
    color: theme.colors.gray_text,
    textAlign: "right",
    marginBottom: 10,
  },
  commentsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.green_deep,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  refreshText: {
    fontSize: 12,
    color: colors.green_deep,
    marginLeft: 4,
    fontWeight: "600",
  },

  commentItem: {
    backgroundColor: theme.colors.white,
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold_deep,
  },

  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  commentUser: {
    fontSize: 15,
    fontWeight: "bold",
    color: theme.colors.gold_deep,
    marginRight: 8,
  },

  commentTime: {
    fontSize: 12,
    color: theme.colors.gray_text,
  },

  commentText: {
    fontSize: 15,
    color: colors.black, // 黑色字体
    lineHeight: 24,
  },

  noCommentsText: {
    fontSize: 16,
    color: theme.colors.gray_text,
    textAlign: "center",
    paddingVertical: 40,
    fontStyle: "italic",
  },
  bottomSpacing: { height: 40 },
  // 模态框样式
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.black,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: theme.colors.black,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: theme.colors.gray_light,
  },
  confirmButton: {
    backgroundColor: theme.colors.gold_deep,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.gray_text,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.black,
  },
  // 通知样式
  notificationOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  notificationContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.black,
    marginBottom: 8,
  },
  notificationMessage: {
    fontSize: 16,
    color: theme.colors.black,
    textAlign: "center",
  },
  // 设计师信息样式
  designerSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },

  designerInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.green,
  },

  designerAvatar: {
    marginRight: 12,
  },

  designerDetails: {
    flex: 1,
  },

  designerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 4,
  },

  designerDesc: {
    fontSize: 14,
    color: colors.gray_text,
    lineHeight: 18,
  },

  loadMoreButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: colors.gold_light,
    borderRadius: 8,
    marginTop: 8,
  },

  loadMoreText: {
    fontSize: 14,
    color: colors.green_deep,
    marginRight: 4,
    fontWeight: "semibold",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    fontSize: 16,
    color: colors.gray_text,
  },
});