import { Dimensions, StyleSheet } from "react-native";
import { colors } from "styles";

// Get device dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive functions
const wp = (percentage: number) => {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
};

const hp = (percentage: number) => {
  const value = (percentage * screenHeight) / 100;
  return Math.round(value);
};

// Scale font based on screen width
const scaleFontSize = (size: number) => {
  const scale = screenWidth / 375; // iPhone X width as base
  const newSize = size * scale;
  return Math.max(12, Math.min(newSize, size * 1.3)); // Min 12, max 130% of original
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary_bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: scaleFontSize(16),
    color: colors.gray_text,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.gold_light,
    backgroundColor: colors.gold_light,
  },
  backButton: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: scaleFontSize(20),
    color: colors.black,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: scaleFontSize(18),
    fontWeight: "bold",
    color: colors.black,
    flex: 1,
    textAlign: "center",
    marginHorizontal: wp(2),
  },
  uploadButton: {
    backgroundColor: colors.gold_deep,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(4),
  },
  uploadButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: scaleFontSize(14),
  },
  filterContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterRow: {
    flexDirection: "row",
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    backgroundColor: colors.gray_light,
    borderRadius: wp(4),
    marginRight: wp(2),
  },
  activeFilterButton: {
    backgroundColor: colors.gold_deep,
  },
  filterButtonText: {
    fontSize: scaleFontSize(12),
    color: colors.gray_text,
    fontWeight: "500",
  },
  activeFilterButtonText: {
    color: colors.white,
  },
  countText: {
    fontSize: scaleFontSize(14),
    color: colors.gold_deep,
    fontWeight: "bold",
    marginLeft: wp(3),
  },
  listContainer: {
    padding: wp(4),
  },
  entryCard: {
    backgroundColor: colors.white,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
  },
  entryImage: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(2),
    backgroundColor: colors.gray_light,
    marginRight: wp(3),
  },
  entryContent: {
    flex: 1,
  },
  entryTitle: {
    fontSize: scaleFontSize(16),
    fontWeight: "bold",
    color: colors.black,
    marginBottom: hp(0.5),
  },
  entryCategory: {
    fontSize: scaleFontSize(13),
    color: colors.gold_deep,
    marginBottom: hp(1),
    fontWeight: "bold",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1),
  },
  statusBadge: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(3),
  },
  statusText: {
    fontSize: scaleFontSize(12),
    color: colors.white,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: scaleFontSize(12),
    color: colors.gray_text,
  },
  rejectionReasonContainer: {
    backgroundColor: "#ffebee",
    padding: wp(2),
    borderRadius: wp(1.5),
    marginBottom: hp(1),
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  rejectionReasonText: {
    fontSize: scaleFontSize(11),
    color: colors.error,
    lineHeight: scaleFontSize(14),
  },
  statsRow: {
    flexDirection: "row",
    gap: wp(3),
  },
  statText: {
    fontSize: scaleFontSize(12),
    color: colors.gray_text,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: hp(8),
  },
  emptyIcon: {
    fontSize: scaleFontSize(48),
    marginBottom: hp(2),
  },
  emptyTitle: {
    fontSize: scaleFontSize(18),
    fontWeight: "bold",
    color: colors.black,
    marginBottom: hp(1),
  },
  emptyMessage: {
    fontSize: scaleFontSize(14),
    color: colors.gray_text,
    textAlign: "center",
    lineHeight: scaleFontSize(20),
    paddingHorizontal: wp(8),
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalTitle: {
    fontSize: scaleFontSize(18),
    fontWeight: "bold",
    marginBottom: hp(2),
    color: colors.black,
    textAlign: "center",
  },

  // Source modal
  sourceModalContent: {
    backgroundColor: colors.white,
    padding: wp(6),
    borderRadius: wp(4),
    alignItems: "center",
    width: wp(80),
    maxWidth: wp(85),
    marginHorizontal: wp(10),
  },
  sourceButton: {
    width: "100%",
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    borderRadius: wp(2),
    backgroundColor: colors.gold_light,
    marginBottom: hp(1.5),
    alignItems: "center",
  },
  sourceButtonText: {
    fontSize: scaleFontSize(16),
    fontWeight: "bold",
    color: colors.black,
  },
  cancelSourceButton: {
    backgroundColor: colors.gray_light,
  },
  cancelSourceButtonText: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: scaleFontSize(16),
  },

  // Form modal
  formModalScroll: {
    maxHeight: hp(90),
    width: "100%",
  },
  formModalContent: {
    backgroundColor: colors.white,
    margin: wp(5),
    padding: wp(6),
    borderRadius: wp(4),
    alignItems: "center",
    maxWidth: wp(90),
  },
  previewImage: {
    width: wp(70),
    height: wp(70),
    borderRadius: wp(3),
    marginBottom: hp(2.5),
    backgroundColor: colors.gray_light,
  },
  imagePlaceholder: {
    width: wp(70),
    height: wp(70),
    borderRadius: wp(3),
    marginBottom: hp(2.5),
    backgroundColor: colors.gray_light,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.gold_deep,
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    fontSize: scaleFontSize(16),
    color: colors.gold_deep,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: wp(4),
  },
  formSection: {
    width: "100%",
    marginBottom: hp(2),
  },
  formLabel: {
    fontSize: scaleFontSize(14),
    fontWeight: "bold",
    color: colors.black,
    marginBottom: hp(1),
  },
  formInput: {
    borderWidth: 1,
    borderColor: colors.gold_deep,
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    fontSize: scaleFontSize(14),
    color: colors.black,
    backgroundColor: colors.white,
  },
  formTextArea: {
    height: hp(10),
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: scaleFontSize(12),
    color: colors.gray_text,
    textAlign: "right",
    marginTop: hp(0.5),
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(0.5),
  },
  switchDescription: {
    fontSize: scaleFontSize(12),
    color: colors.gray_text,
    flex: 1,
    marginRight: wp(2),
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: wp(3),
    marginTop: hp(1),
  },
  modalButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.gray_light,
  },
  confirmButton: {
    backgroundColor: colors.gold_deep,
  },
  cancelButtonText: {
    fontSize: scaleFontSize(15),
    color: colors.black,
    fontWeight: "bold",
  },
  confirmButtonText: {
    fontSize: scaleFontSize(15),
    color: colors.black,
    fontWeight: "bold",
  },

  // Confirm modal
  confirmModalContent: {
    backgroundColor: colors.white,
    padding: wp(8),
    borderRadius: wp(4),
    alignItems: "center",
    width: wp(85),
    maxWidth: wp(90),
    marginHorizontal: wp(7.5),
  },
  confirmTitle: {
    fontSize: scaleFontSize(20),
    fontWeight: "bold",
    color: colors.black,
    marginBottom: hp(3),
    textAlign: "center",
  },
  confirmMessage: {
    fontSize: scaleFontSize(15),
    fontWeight: "500",
    color: colors.gray_deep,
    textAlign: "center",
    marginBottom: hp(4),
    lineHeight: scaleFontSize(20),
  },
  confirmNote: {
    fontSize: scaleFontSize(15),
    color: colors.gray_text,
    textAlign: "center",
    marginBottom: hp(5),
    borderRadius: wp(2.5),
    lineHeight: scaleFontSize(20),
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: wp(3),
  },
  cancelConfirmButton: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(12),
    borderRadius: wp(2.5),
    backgroundColor: colors.gray_light,
  },
  submitButton: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(12),
    borderRadius: wp(2.5),
    backgroundColor: colors.gold_deep,
  },
  submitButtonText: {
    fontSize: scaleFontSize(15),
    color: colors.black,
    fontWeight: "bold",
  },

  // Success modal
  successModalContent: {
    backgroundColor: colors.white,
    padding: wp(6),
    borderRadius: wp(4),
    alignItems: "center",
    width: wp(85),
    maxWidth: wp(90),
    marginHorizontal: wp(7.5),
  },
  successIcon: {
    fontSize: scaleFontSize(48),
    marginBottom: hp(2),
  },
  successTitle: {
    fontSize: scaleFontSize(20),
    fontWeight: "bold",
    color: colors.black,
    marginBottom: hp(3),
    textAlign: "center",
  },
  successMessage: {
    fontSize: scaleFontSize(15),
    color: colors.gray_text,
    textAlign: "center",
    marginBottom: hp(5),
    lineHeight: scaleFontSize(20),
  },
  successButton: {
    backgroundColor: colors.gold_deep,
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    alignItems: "center",
  },
  successButtonText: {
    fontSize: scaleFontSize(15),
    color: colors.black,
    fontWeight: "bold",
  },

  // Notification
  notificationOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: hp(6),
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: wp(5),
  },
  notificationContainer: {
    backgroundColor: "white",
    borderRadius: wp(3),
    padding: wp(5),
    width: wp(80),
    maxWidth: wp(85),
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
    fontSize: scaleFontSize(18),
    fontWeight: "bold",
    color: colors.black,
    marginBottom: hp(1),
    textAlign: "center",
  },
  notificationMessage: {
    fontSize: scaleFontSize(16),
    color: colors.black,
    textAlign: "center",
    lineHeight: scaleFontSize(22),
  },
  // 活动信息容器
activityInfoContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
  backgroundColor: colors.gold_light + '20',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
  alignSelf: 'flex-start',
},
activityLabel: {
  fontSize: 12,
  color: colors.gray_text,
  marginRight: 4,
  fontWeight: '500',
},
activityName: {
  fontSize: 12,
  color: colors.gold_deep,
  fontWeight: '600',
  flex: 1,
},
});

export default styles;