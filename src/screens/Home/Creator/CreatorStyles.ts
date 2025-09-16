import { StyleSheet } from "react-native";
import { typography, colors } from "styles";

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
    marginTop: 16,
    fontSize: 16,
    color: colors.gray_text,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: colors.gold_light,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 20,
    color: colors.black,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  uploadButton: {
    backgroundColor: colors.gold_deep,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  uploadButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.gray_light,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: colors.gold_deep,
  },
  filterButtonText: {
    fontSize: 12,
    color: colors.gray_text,
    fontWeight: "500",
  },
  activeFilterButtonText: {
    color: colors.white,
  },
  countText: {
    fontSize: 14,
    color: colors.gold_deep,
    fontWeight: "bold",
    marginLeft: 12,
  },
  listContainer: {
    padding: 16,
  },
  entryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
  },
  entryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.gray_light,
    marginRight: 12,
  },
  entryContent: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 4,
  },
  entryCategory: {
    fontSize: 12,
    color: colors.gold_deep,
    marginBottom: 8,
    fontWeight: "500",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
    color: colors.gray_text,
  },
  rejectionReasonContainer: {
    backgroundColor: "#ffebee",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  rejectionReasonText: {
    fontSize: 11,
    color: colors.error,
    lineHeight: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statText: {
    fontSize: 12,
    color: colors.gray_text,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: colors.gray_text,
    textAlign: "center",
    lineHeight: 20,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.black,
    textAlign: "center",
  },

  // Source modal
  sourceModalContent: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    width: "80%",
    maxWidth: 300,
  },
  sourceButton: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.gold_light,
    marginBottom: 12,
    alignItems: "center",
  },
  sourceButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
  },
  cancelSourceButton: {
    backgroundColor: colors.gray_light,
  },
  cancelSourceButtonText: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: 16,
  },

  // Form modal
  formModalScroll: {
    maxHeight: "90%",
    width: "100%",
  },
  formModalContent: {
    backgroundColor: colors.white,
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  previewImage: {
    width: 280,
    height: 280,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: colors.gray_light,
  },
  imagePlaceholder: {
    width: 280,
    height: 280,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: colors.gray_light,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.gold_deep,
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: colors.gold_deep,
    fontWeight: "bold",
  },
  formSection: {
    width: "100%",
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: colors.gold_deep,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.black,
    backgroundColor: colors.white,
  },
  formTextArea: {
    height: 80,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: colors.gray_text,
    textAlign: "right",
    marginTop: 4,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 12,
    color: colors.gray_text,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.gray_light,
  },
  confirmButton: {
    backgroundColor: colors.gold_deep,
  },
  cancelButtonText: {
    fontSize: 15,
    color: colors.black,
    fontWeight: "bold",
  },
  confirmButtonText: {
    fontSize: 15,
    color: colors.black,
    fontWeight: "bold",
  },

  // Confirm modal
  confirmModalContent: {
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
  },
  confirmMessage: {
    fontSize: 15,
    fontWeight: "semibold",
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
  cancelConfirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 53,
    borderRadius: 10,
    backgroundColor: colors.gray_light,
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 53,
    borderRadius: 10,
    backgroundColor: colors.gold_deep,
  },
  submitButtonText: {
    fontSize: 15,
    color: colors.black,
    fontWeight: "bold",
  },

  // Success modal
  successModalContent: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    width: "85%",
    maxWidth: 400,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 25,
  },
  successMessage: {
    fontSize: 15,
    color: colors.gray_text,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  successButton: {
    backgroundColor: colors.gold_deep,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  successButtonText: {
    fontSize: 15,
    color: colors.black,
    fontWeight: "bold",
  },

  // Notification
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
});

export default styles;
