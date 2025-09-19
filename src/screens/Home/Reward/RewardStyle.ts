import { StyleSheet } from "react-native";
import { colors } from "styles";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary_bg,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: colors.gold_light,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.gold_light,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 50, // 跟 header paddingTop 对齐
    padding: 3,
    zIndex: 2,
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
  backButtonText: {
    fontSize: 20,
    color: colors.black,
    fontWeight: "bold",
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: colors.black,
  },

  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.primary_bg,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    position: "relative",
  },
  activeTab: {
    borderBottomWidth: 0,
  },
  tabText: {
    color: colors.black,
    fontSize: 14,
  },
  activeTabText: {
    color: colors.black,
    fontWeight: "bold",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: 3,
    backgroundColor: colors.gold_deep,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  tabContent: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.gold_light,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: colors.black,
  },
  input: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.gray_light,
    color: colors.black,
  },
  redeemButton: {
    backgroundColor: colors.gold_deep,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  redeemButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  voucherContainer: {
    marginBottom: 20,
  },
  voucherTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.black,
  },
  voucherCard: {
    backgroundColor: colors.primary_bg,
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
  },
  voucherCardContent: {
    flexDirection: "row",
    minHeight: 160,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  amountContainer: {
    width: 180,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  // expiredAmountContainer: {
  //   backgroundColor: colors.gray_text,
  // },
  currencySymbol: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.white,
    marginTop: 48,
    marginLeft: 18,
  },
  divider: {
    width: 1,
    backgroundColor: colors.gold_deep,
    marginHorizontal: 5,
    alignSelf: "center", // 在父容器垂直居中
    height: "80%", // 给个相对高度
  },
  expiredDivider: {
    backgroundColor: colors.gray_text,
  },
  voucherDetails: {
    flex: 1,
    padding: 25,
    justifyContent: "space-between",
  },
  expiredVoucher: {
    opacity: 0.7,
  },
  voucherCode: {
    fontSize: 20,
    fontWeight: "semibold",
    marginBottom: 5,
    color: colors.black,
  },
  voucherValue: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.black,
  },
  voucherPoints: {
    fontSize: 12,
    color: colors.gold_deep,
    marginBottom: 5,
    fontWeight: "500",
  },
  pointsNeeded: {
    fontSize: 14,
    color: colors.gold_deep, // 金色，突出皇冠
    fontWeight: "600",
  },
  voucherDate: {
    fontSize: 10,
    color: colors.gray_text,
    marginBottom: 10,
  },
  terms: {
    fontSize: 10,
    color: colors.gray_text,
    marginTop: 5,
  },
  expiredText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "gray",
    opacity: 0.3,
    borderRadius: 12,
    zIndex: 1,
  },

  crownSection: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  crownContainer: {
    flexDirection: "row",
    height: 60,
    marginBottom: 15,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  crownLeft: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 60,
  },
  crownRight: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 0,
    marginRight: 30,
  },
  crownMainIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  crownTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#232323",
    textAlign: "center",
  },
  crownPoints: {
    fontSize: 14,
    color: "#4a5568",
    textAlign: "center",
  },
  crownIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginLeft: 8,
  },
  crownButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  crown: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  crownInline: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    marginLeft: 2,
  },
  historyButton: {
    backgroundColor: colors.gray_button,
    padding: 12,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  historyButtonText: {
    color: colors.gray_deep,
    fontWeight: "500",
  },
  voucherList: {
    padding: 15,
    borderRadius: 12,
  },
  noRecords: {
    textAlign: "center",
    color: colors.gray_text,
    padding: 20,
    fontSize: 14,
  },
  useButton: {
    backgroundColor: colors.gold_light,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.gold_deep,
  },
  useButtonText: {
    color: colors.gold_deep,
    fontSize: 10,
    fontWeight: "bold",
  },

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
    color: colors.black,
    marginBottom: 8,
  },
  notificationMessage: {
    fontSize: 16,
    color: colors.black,
    textAlign: "center",
  },

  //   确认是否使用
  confirmOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  confirmContainer: {
    backgroundColor: colors.white,
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    width: "85%",
    maxWidth: 400,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 25,
    textAlign: "center",
  },
  confirmMessage: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray_deep,
    textAlign: "center",
    marginBottom: 30,
  },
  confirmNote: {
    fontSize: 15,
    color: colors.gray_text,
    textAlign: "center",
    marginBottom: 40,
    borderRadius: 10,
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 53,
    borderRadius: 10,
    backgroundColor: colors.gray_light,
    alignItems: "center",
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 53,
    borderRadius: 10,
    backgroundColor: colors.gold_deep,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.black,
  },
  confirmButtonText: {
    fontSize: 15,
    color: colors.black,
    fontWeight: "bold",
  },

  // 历史记录相关样式
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  historyLeft: {
    flex: 1,
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyAction: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 5,
  },
  historyDate: {
    fontSize: 12,
    color: colors.gray_text,
  },
  historyPoints: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  historyBalance: {
    fontSize: 12,
    color: colors.gray_text,
  },
});
