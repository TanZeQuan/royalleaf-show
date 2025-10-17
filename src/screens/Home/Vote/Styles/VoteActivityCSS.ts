// screens/VoteActivity/VoteActivityScreen.styles.ts
import { Dimensions, StyleSheet } from "react-native";
import { colors } from "styles";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const scale = (size: number) => (screenWidth / 375) * size;
const verticalScale = (size: number) => (screenHeight / 812) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary_bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.gold_light,
    backgroundColor: colors.gold_light,
    position: "relative",
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.gray_text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: moderateScale(19),
    fontWeight: "bold",
    color: colors.black,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: 1,
    pointerEvents: "none",
  },
  placeholder: {
    width: scale(35),
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(20),
    paddingBottom: verticalScale(40),
    flexGrow: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray_deep,
    marginBottom: verticalScale(24),
    textAlign: "center",
    lineHeight: moderateScale(22),
    paddingHorizontal: scale(20),
  },
  activitiesContainer: {
    flex: 1,
  },
  activityWrapper: {
    borderRadius: scale(12),
    overflow: "hidden",
    elevation: 3,
    shadowColor: colors.gray_nav,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  activityCard: {
    backgroundColor: colors.white,
    padding: scale(20),
    borderRadius: scale(12),
    borderLeftWidth: 4,
    borderLeftColor: colors.gold_deep,
  },
  activityHeader: {
    marginBottom: verticalScale(12),
  },
  activityTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  activityName: {
    flex: 1,
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: colors.black,
    marginRight: scale(8),
    lineHeight: moderateScale(24),
  },
  statusBadge: {
    backgroundColor: colors.green_deep,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
  },
  statusText: {
    fontSize: moderateScale(12),
    color: colors.white,
    fontWeight: "600",
  },
  activityDescription: {
    fontSize: moderateScale(14),
    color: colors.gray_text,
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  activityFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  dateSection: {
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(6),
  },
  dateIcon: {
    color: colors.gray_text,
  },
  dateLabel: {
    fontSize: moderateScale(13),
    color: colors.gray_text,
    marginLeft: scale(4),
  },
  dateText: {
    fontSize: moderateScale(13),
    color: colors.black,
    fontWeight: "500",
  },
  remainingDays: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.yellow,
    borderWidth: 1,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(8),
    alignSelf: "flex-start",
    marginTop: 10,
  },
  remainingIcon: {
      color: colors.gold_deep,
  },
  remainingText: {
    fontSize: moderateScale(12),
    color: colors.gold_deep,
    fontWeight: "600",
    marginLeft: scale(4),
  },
  arrowContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: colors.gold_light,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowIcon: {
      color: colors.gold_deep,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(40),
  },
  loadingIndicator: {
      color: colors.gold_deep,
  },
  centerText: {
    marginTop: verticalScale(16),
    fontSize: moderateScale(16),
    color: colors.gray_text,
    textAlign: "center",
    lineHeight: moderateScale(22),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(80),
  },
  emptyIcon: {
      color: colors.gray_text,
  },
  emptyTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: colors.gray_deep,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    color: colors.gray_text,
    textAlign: "center",
    lineHeight: moderateScale(20),
  },
});