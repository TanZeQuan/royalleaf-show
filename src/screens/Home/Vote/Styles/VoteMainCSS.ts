// screens/VoteMain/VoteMainScreen.styles.ts
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
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: moderateScale(19),
    fontWeight: "bold",
    color: colors.black,
  },
  placeholder: {
    width: scale(32),
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
    fontSize: moderateScale(16),
    color: colors.gray_text,
    fontWeight: "600",
    marginBottom: verticalScale(24),
    textAlign: "center",
    lineHeight: moderateScale(22),
    paddingHorizontal: scale(20),
  },
  categoriesContainer: {
    flex: 1,
  },
  categoryWrapper: {
    borderRadius: scale(12),
    overflow: "hidden",
    elevation: 3,
    shadowColor: colors.gray_nav,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(25),
    height: verticalScale(120),
    minHeight: verticalScale(100),
  },
  cardBackground: {
    borderRadius: scale(12),
  },
  categoryContentRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    zIndex: 1,
  },
  categoryContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: colors.black,
    marginBottom: verticalScale(4),
    textAlign: "center",
    textShadowRadius: 2,
  },
  categoryDescription: {
    fontSize: moderateScale(14),
    color: colors.gray_text,
    textAlign: "center",
    lineHeight: moderateScale(18),
    textShadowRadius: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(40),
  },
  centerText: {
    marginTop: verticalScale(16),
    fontSize: moderateScale(16),
    color: colors.gray_text,
    textAlign: "center",
    lineHeight: moderateScale(22),
  },
  loadingIndicator: {
    color: colors.primary_bg,
  }
});