import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { colors } from "styles";
import { creatorApi, Activity, SubmissionRequest } from "./creatorApi";
import styles from "./styles/CreatorStyles";

interface CreatorSubmitModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedCategory?: string;
  categoryName?: string;
}

const CreatorSubmitModal: React.FC<CreatorSubmitModalProps> = ({
  visible,
  onClose,
  onSuccess,
  selectedCategory,
  categoryName,
}) => {
  const [imageSourceModalVisible, setImageSourceModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [entryTitle, setEntryTitle] = useState("");
  const [entryDescription, setEntryDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      requestPermissions();
      fetchActivities();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      fetchActivities();
    }
  }, [selectedCategory, visible]);

  const requestPermissions = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.status !== "granted") {
        console.warn("Camera permission not granted");
      }

      if (mediaLibraryPermission.status !== "granted") {
        console.warn("Media library permission not granted");
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }
  };

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    try {
      const result = await creatorApi.getSubmissionOpenActivities();

      console.log("Selected category:", selectedCategory);
      console.log("Category name:", categoryName);

      if (result.success && result.data) {
        let activities = result.data;

        if (selectedCategory) {
          activities = activities.filter((activity: any) => {
            return (
              activity.category === selectedCategory ||
              activity.categoryId === selectedCategory ||
              activity.cateId === selectedCategory
            );
          });
          console.log("Filtered activities:", activities);
        }

        setAvailableActivities(activities);
        if (activities.length > 0) {
          setSelectedActivity(activities[0].id.toString());
        } else {
          setSelectedActivity("");
        }
      } else {
        console.error("No available activities");
        setAvailableActivities([]);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setAvailableActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const selectImageFromLibrary = async () => {
    setImageSourceModalVisible(false);

    try {
      const permission = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (permission.status !== "granted") {
        const requestPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (requestPermission.status !== "granted") {
          Alert.alert("权限需要", "请在设置中允许访问相册权限以选择图片", [
            { text: "取消", style: "cancel" },
            {
              text: "去设置",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Alert.alert(
                    "开启相册权限",
                    "请前往 设置 > 隐私与安全性 > 照片 > 找到此应用并开启权限",
                    [{ text: "知道了" }]
                  );
                }
              },
            },
          ]);
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
        selectionLimit: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("打开相册失败:", error);
      Alert.alert("错误", "无法打开相册，请稍后再试");
    }
  };

  const selectImageFromCamera = async () => {
    setImageSourceModalVisible(false);

    try {
      const permission = await ImagePicker.getCameraPermissionsAsync();

      if (permission.status !== "granted") {
        const requestPermission = await ImagePicker.requestCameraPermissionsAsync();

        if (requestPermission.status !== "granted") {
          Alert.alert("权限需要", "请在设置中允许相机权限以拍照", [
            { text: "取消", style: "cancel" },
            {
              text: "去设置",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Alert.alert(
                    "开启相机权限",
                    "请前往 设置 > 隐私与安全性 > 相机 > 找到此应用并开启权限",
                    [{ text: "知道了" }]
                  );
                }
              },
            },
          ]);
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("打开相机失败:", error);
      Alert.alert("错误", "无法打开相机，请稍后再试");
    }
  };

  const handleConfirmSubmission = () => {
    if (!entryTitle.trim()) {
      showCustomNotification("提示", "请输入创意标题");
      return;
    }
    if (!entryDescription.trim()) {
      showCustomNotification("提示", "请输入创意描述");
      return;
    }
    if (!selectedImage) {
      showCustomNotification("提示", "请选择一张图片");
      return;
    }
    if (availableActivities.length === 0) {
      showCustomNotification("提示", "当前没有可用的投稿活动");
      return;
    }
    if (!selectedActivity) {
      showCustomNotification("提示", "请选择投稿活动");
      return;
    }
    setConfirmModalVisible(true);
  };

  const showCustomNotification = (title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const resetEntryForm = () => {
    setEntryTitle("");
    setEntryDescription("");
    setSelectedImage(null);
    if (availableActivities.length > 0) {
      setSelectedActivity(availableActivities[0].id.toString());
    }
  };

  const handleSubmitEntry = async () => {
    setConfirmModalVisible(false);
    setIsSubmitting(true);

    try {
      const selectedActivityObj = availableActivities.find(
        (activity) => activity.id.toString() === selectedActivity
      );

      if (!selectedActivityObj) {
        Alert.alert("错误", "请选择一个活动");
        setIsSubmitting(false);
        return;
      }

      const submissionData: SubmissionRequest = {
        votesId: selectedActivityObj.votesId,
        name: entryTitle,
        desc: entryDescription,
        image: selectedImage!,
      };

      console.log("Submitting to votesId:", submissionData.votesId);

      const result = await creatorApi.submitEntry(submissionData);

      console.log("API Result:", result);

      if (result.success && result.data) {
        setSuccessModalVisible(true);
        resetEntryForm();
      } else {
        Alert.alert("提交失败", result.error || "创意提交失败,请稍后重试");
      }
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("错误", "创意提交失败，请稍后再试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    onSuccess();
    onClose();
  };

  const handleClose = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    } else {
      resetEntryForm();
      onClose();
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleClose}
          />

          <TouchableWithoutFeedback onPress={() => {}}>
            <ScrollView style={styles.formModalScroll}>
              <View style={styles.formModalContent}>
                <Text style={styles.modalTitle}>
                  上传创意作品 - {categoryName || "通用"}
                </Text>

                {selectedImage ? (
                  <TouchableOpacity onPress={() => setImageSourceModalVisible(true)}>
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.previewImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.imagePlaceholder}
                    onPress={() => setImageSourceModalVisible(true)}
                  >
                    <Text style={styles.imagePlaceholderText}>点击选择图片</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>选择投稿活动 *</Text>
                  {activitiesLoading ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 12,
                      }}
                    >
                      <ActivityIndicator size="small" color={colors.gold_deep} />
                      <Text style={{ marginLeft: 8, color: colors.gray_text }}>
                        加载活动中...
                      </Text>
                    </View>
                  ) : availableActivities.length > 0 ? (
                    <View style={{ position: "relative" }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: colors.white,
                          borderWidth: 1,
                          borderColor: colors.gold_deep,
                          borderRadius: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 12,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        onPress={() => setDropdownVisible(!dropdownVisible)}
                      >
                        <Text style={{ fontSize: 16, color: colors.black }}>
                          {availableActivities.find(
                            (a) => a.id.toString() === selectedActivity
                          )?.name || "请选择活动"}
                        </Text>
                        <Ionicons
                          name={dropdownVisible ? "chevron-up" : "chevron-down"}
                          size={20}
                          color={colors.gray_text}
                        />
                      </TouchableOpacity>

                      {dropdownVisible && (
                        <View
                          style={{
                            position: "absolute",
                            top: 50,
                            left: 0,
                            right: 0,
                            backgroundColor: colors.white,
                            borderWidth: 1,
                            borderColor: colors.gold_deep,
                            borderRadius: 8,
                            maxHeight: 180,
                            zIndex: 999999,
                            elevation: 999,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                          }}
                        >
                          <ScrollView
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                          >
                            {availableActivities.map((activity) => (
                              <TouchableOpacity
                                key={activity.id}
                                style={{
                                  paddingHorizontal: 16,
                                  paddingVertical: 14,
                                  borderBottomWidth:
                                    activity.id ===
                                    availableActivities[
                                      availableActivities.length - 1
                                    ].id
                                      ? 0
                                      : 1,
                                  borderBottomColor: colors.gold_light + "50",
                                  backgroundColor:
                                    selectedActivity === activity.id.toString()
                                      ? colors.gold_light + "40"
                                      : colors.white,
                                }}
                                onPress={() => {
                                  setSelectedActivity(activity.id.toString());
                                  setDropdownVisible(false);
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 15,
                                    fontWeight:
                                      selectedActivity === activity.id.toString()
                                        ? "600"
                                        : "400",
                                    color: colors.black,
                                    marginBottom: 4,
                                  }}
                                >
                                  {activity.name}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: colors.gray_text,
                                    marginBottom: 2,
                                  }}
                                >
                                  {activity.desc}
                                </Text>
                                {activity.submitStop && (
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      color: colors.gray_text,
                                      fontStyle: "italic",
                                    }}
                                  >
                                    截止:{" "}
                                    {new Date(
                                      activity.submitStop
                                    ).toLocaleDateString("zh-CN")}
                                  </Text>
                                )}
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}

                      {selectedActivity && (
                        <View
                          style={{
                            backgroundColor: colors.gold_light + "20",
                            borderRadius: 8,
                            padding: 12,
                            marginTop: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: colors.black,
                              marginBottom: 4,
                            }}
                          >
                            {
                              availableActivities.find(
                                (a) => a.id.toString() === selectedActivity
                              )?.name
                            }
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: colors.gray_text,
                              marginBottom: 4,
                            }}
                          >
                            {
                              availableActivities.find(
                                (a) => a.id.toString() === selectedActivity
                              )?.desc
                            }
                          </Text>
                          {(() => {
                            const stopDate = availableActivities.find(
                              (a) => a.id.toString() === selectedActivity
                            )?.submitStop;
                            return stopDate ? (
                              <Text
                                style={{
                                  fontSize: 11,
                                  color: colors.gray_text,
                                  fontStyle: "italic",
                                }}
                              >
                                投稿截止:{" "}
                                {new Date(stopDate).toLocaleDateString("zh-CN")}
                              </Text>
                            ) : null;
                          })()}
                        </View>
                      )}
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: colors.gold_light + "20",
                        borderRadius: 8,
                        padding: 16,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.gray_text,
                          textAlign: "center",
                        }}
                      >
                        暂无 "{categoryName}" 分类的投稿活动
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.gray_text,
                          textAlign: "center",
                          marginTop: 4,
                        }}
                      >
                        当前没有该分类的开放投稿活动，请稍后再试
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>创意标题 *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={entryTitle}
                    onChangeText={setEntryTitle}
                    placeholder="请输入您的创意标题"
                    maxLength={50}
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>创意描述 *</Text>
                  <TextInput
                    style={[styles.formInput, styles.formTextArea]}
                    value={entryDescription}
                    onChangeText={setEntryDescription}
                    placeholder="请详细描述您的创意想法、实施方案等"
                    multiline
                    numberOfLines={4}
                    maxLength={50}
                  />
                  <Text style={styles.charCount}>
                    {entryDescription.length}/50
                  </Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={handleClose}
                  >
                    <Text style={styles.cancelButtonText}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleConfirmSubmission}
                  >
                    <Text style={styles.confirmButtonText}>确认提交</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </View>
      </Modal>

      <Modal
        visible={imageSourceModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setImageSourceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setImageSourceModalVisible(false)}
          />

          <View style={styles.sourceModalContent}>
            <Text style={styles.modalTitle}>选择图片来源</Text>
            <TouchableOpacity
              style={styles.sourceButton}
              onPress={selectImageFromCamera}
            >
              <Text style={styles.sourceButtonText}>拍照</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sourceButton}
              onPress={selectImageFromLibrary}
            >
              <Text style={styles.sourceButtonText}>从相册选择</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sourceButton, styles.cancelSourceButton]}
              onPress={() => setImageSourceModalVisible(false)}
            >
              <Text style={styles.cancelSourceButtonText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => setConfirmModalVisible(false)}
            />

            <View style={styles.confirmModalContent}>
              <Text style={styles.confirmTitle}>确认提交</Text>
              <Text style={styles.confirmNote}>
                提交后将进入审核流程，请耐心等待。通过审核后，其他会员就能浏览、投票和评论你的创意！
              </Text>
              <View style={styles.confirmButtons}>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.cancelConfirmButton]}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.submitButton]}
                  onPress={handleSubmitEntry}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>确认</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={handleSuccessClose}
            />

            <View style={styles.successModalContent}>
              <Text style={styles.successTitle}>提交成功！</Text>
              <Text style={styles.successMessage}>
                您的创意已提交，请耐心等待审核！{"\n"}
                你的创意很快就能被大家看见！
              </Text>
              <TouchableOpacity
                style={styles.successButton}
                onPress={handleSuccessClose}
              >
                <Text style={styles.successButtonText}>知道了</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={showNotification}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotification(false)}
      >
        <View style={styles.notificationOverlay}>
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationTitle}>{notificationTitle}</Text>
            <Text style={styles.notificationMessage}>
              {notificationMessage}
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CreatorSubmitModal;