import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "styles";
import { CreatorStackParamList } from "../../../navigation/stacks/HomeNav/CreatorStack";
import creatorAPI from "../../../services/CreatorService/CreatorAPI";
import { getUserData } from "../../../utils/storage";
import { ContestEntry, RouteParams } from "./CreatorSlice";
import styles from "./CreatorStyles";
import CreatorSubmitModal from "./CreatorSubmitModal";

type CreatorMainNavigationProp = NativeStackNavigationProp<CreatorStackParamList>;

const CreatorMainScreen = () => {
  const navigation = useNavigation<CreatorMainNavigationProp>();
  const route = useRoute();
  const params = route.params as RouteParams;

  const [entries, setEntries] = useState<ContestEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<ContestEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [availableActivities, setAvailableActivities] = useState<any[]>([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const statusOptions = [
    { value: "all", label: "全部" },
    { value: "pending", label: "待审核" },
    { value: "approved", label: "通过" },
    { value: "rejected", label: "拒绝" },
  ];

  useEffect(() => {
    loadEntries();
    fetchActivities();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, filterStatus, params?.selectedCategory]);

  const fetchActivities = async () => {
    try {
      const result = await creatorAPI.getSubmissionOpenActivities();

      if (result.success && result.data) {
        let activities = result.data;

        if (params?.selectedCategory) {
          activities = activities.filter((activity: any) => {
            return (
              activity.category === params.selectedCategory ||
              activity.categoryId === params.selectedCategory ||
              activity.cateId === params.selectedCategory
            );
          });
        }

        setAvailableActivities(activities);
      } else {
        console.error("获取活动失败:", result.error);
        setAvailableActivities([]);
      }
    } catch (error) {
      console.error("获取活动失败:", error);
      setAvailableActivities([]);
    }
  };

  const loadEntries = async () => {
    console.log("==========================================");
    console.log("🚀🚀🚀 loadEntries CALLED 🚀🚀🚀");
    console.log("==========================================");

    setIsLoading(true);
    try {
      let allEntries: ContestEntry[] = [];

      if (params?.entries && params.entries.length > 0) {
        console.log("📦 Loading entries from route params");
        allEntries = params.entries.map((entry: any) => ({
          ...entry,
          submittedAt: new Date(entry.submittedAt),
          reviewedAt: entry.reviewedAt ? new Date(entry.reviewedAt) : undefined,
        }));
      } else {
        console.log("🔍 Fetching user data from storage...");
        const userData = await getUserData();
        console.log("👤 User data:", userData);

        if (userData && userData.user_id) {
          console.log("✅ User ID found:", userData.user_id);
          console.log("📡 Calling API to get user entries...");

          const result = await creatorAPI.getUserEntries(userData.user_id);

          console.log("📥 API Response:", result);
          console.log(
            "📊 Data type:",
            typeof result.data,
            "Is array:",
            Array.isArray(result.data)
          );

          if (result.success && result.data && Array.isArray(result.data)) {
            console.log(
              "✅ Successfully received",
              result.data.length,
              "entries"
            );

            allEntries = result.data.map((item: any) => ({
              id: item.subId,
              category: params?.selectedCategory || "general",
              categoryName: params?.categoryName || "通用",
              image: item.image,
              title: item.name,
              description: item.desc,
              status:
                item.isStatus === 1
                  ? "pending"
                  : item.isStatus === 2
                  ? "approved"
                  : item.isStatus === 3
                  ? "rejected"
                  : "pending",
              submittedAt: new Date(item.createdAt),
              reviewedAt: item.modifyAt ? new Date(item.modifyAt) : undefined,
              likes: item.voted || 0,
              views: 0,
              isPublic: true,
              authorName: userData.username || "当前用户",
              authorId: userData.user_id,
              activityId: item.votesId,
              activityName: "",
            }));

            console.log("✅ Mapped entries:", allEntries);
          } else {
            console.log("❌ Failed to get entries or data is not an array");
            if (!result.success) {
              console.log("❌ Error:", result.error);
            }
          }
        } else {
          console.log("❌ No user data or user_id not found");
        }
      }

      console.log("📋 Final entries count:", allEntries.length);
      setEntries(allEntries);
    } catch (error) {
      console.error("❌ Error loading entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = [...entries];

    if (params?.selectedCategory) {
      filtered = filtered.filter(
        (entry) => entry.category === params.selectedCategory
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((entry) => entry.status === filterStatus);
    }

    setFilteredEntries(filtered);
  };

  const handleUpload = () => {
    setUploadModalVisible(true);
  };

  const handleUploadSuccess = () => {
    loadEntries();
  };

  const getStatusText = (status: ContestEntry["status"]) => {
    switch (status) {
      case "approved":
        return "已通过";
      case "rejected":
        return "已拒绝";
      case "pending":
        return "审核中";
      default:
        return status;
    }
  };

  const getStatusColor = (status: ContestEntry["status"]) => {
    switch (status) {
      case "approved":
        return colors.success;
      case "rejected":
        return colors.error;
      case "pending":
        return colors.pending;
      default:
        return colors.gray_text;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderEntry = ({ item }: { item: ContestEntry }) => {
    const activity = availableActivities.find(
      (a) => a.id.toString() === item.activityId
    );

    return (
      <View style={styles.entryCard}>
        <Image source={{ uri: String(item.image) }} style={styles.entryImage} />
        <View style={styles.entryContent}>
          <Text style={styles.entryTitle} numberOfLines={2}>
            {item.title}
          </Text>

          {activity && (
            <Text style={styles.entryCategory}>{activity.name}</Text>
          )}

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
            <Text style={styles.dateText}>{formatDate(item.submittedAt)}</Text>
          </View>

          {item.status === "rejected" && item.feedback && (
            <View style={styles.rejectionReasonContainer}>
              <Text style={styles.rejectionReasonText}>
                拒绝原因: {item.feedback}
              </Text>
            </View>
          )}

          <View style={styles.statsRow}>
            <Text style={styles.statText}>👁 {item.views}</Text>
            <Text style={styles.statText}>❤️ {item.likes}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.gold_deep} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {params?.categoryName
            ? `${params.categoryName} - 我的创意`
            : "我的创意"}
        </Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <Text style={styles.uploadButtonText}>上传</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterButton,
                filterStatus === option.value && styles.activeFilterButton,
              ]}
              onPress={() => setFilterStatus(option.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterStatus === option.value &&
                    styles.activeFilterButtonText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.countText}>{filteredEntries.length}份</Text>
      </View>

      <FlatList
        data={filteredEntries}
        renderItem={renderEntry}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>暂无创意投稿</Text>
            <Text style={styles.emptyMessage}>
              {params?.selectedCategory
                ? `您在"${params.categoryName}"分类下还没有作品`
                : "您还没有投稿作品"}
              {"\n"}点击右上角"上传"按钮开始创作！
            </Text>
          </View>
        }
      />

      <CreatorSubmitModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onSuccess={handleUploadSuccess}
        selectedCategory={params?.selectedCategory}
        categoryName={params?.categoryName}
      />
    </SafeAreaView>
  );
};

export default CreatorMainScreen;
