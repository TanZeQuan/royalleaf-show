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
import { getUserData } from "../../../utils/storage";
import { Activity, creatorApi } from "./creatorApi";
import CreatorSubmitModal from "./CreatorSubmitModal";
import styles from "./styles/CreatorStyles";
import { ContestEntry, RouteParams } from "./types";

type CreatorMainNavigationProp = NativeStackNavigationProp<CreatorStackParamList>;

const CreatorMainScreen = () => {
  const navigation = useNavigation<CreatorMainNavigationProp>();
  const route = useRoute();
  const params = route.params as RouteParams;

  const [entries, setEntries] = useState<ContestEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<ContestEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const statusOptions = [
    { value: "all", label: "全部" },
    { value: "pending", label: "待审核" },
    { value: "approved", label: "通过" },
    { value: "rejected", label: "拒绝" },
  ];

  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      // fetchActivities sets availableActivities, which loadEntries depends on.
      // We pass the fresh activities list to loadEntries to ensure it's not stale.
      const activities = await fetchActivities();
      await loadEntries(activities);
      setIsLoading(false);
    };
    initialLoad();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, filterStatus, params?.selectedCategory]);

  const fetchActivities = async (): Promise<Activity[]> => {
    try {
      const result = await creatorApi.getSubmissionOpenActivities();
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
        return activities;
      } else {
        console.error("获取活动失败:", result.error);
        setAvailableActivities([]);
        return [];
      }
    } catch (error) {
      console.error("获取活动失败:", error);
      setAvailableActivities([]);
      return [];
    }
  };

  const loadEntries = async (activities: Activity[]) => {
    // No need to set loading here, it's handled by the calling function
    try {
      let allEntries: ContestEntry[] = [];
      const userData = await getUserData();

      if (userData && userData.user_id) {
        const result = await creatorApi.getUserEntries(userData.user_id);

        if (result.success && result.data && Array.isArray(result.data)) {
          allEntries = result.data
            .filter((item: any) => item.createdAt)
            .map((item: any) => {
              const activity = activities.find(
                (a) => a.votesId === item.votesId
              );
              return {
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
                reviewedAt: item.modifyAt
                  ? new Date(item.modifyAt)
                  : undefined,
                likes: item.voted || 0,
                views: 0,
                isPublic: true,
                authorName: userData.username || "当前用户",
                authorId: userData.user_id,
                activityId: item.votesId,
                activityName: activity ? activity.name : "", // Set the activity name here
              };
            });
        } else {
          if (!result.success) {
            console.log("❌ Error fetching entries:", result.error);
          }
        }
      }
      setEntries(allEntries);
    } catch (error) {
      console.error("❌ Error loading entries:", error);
      setEntries([]); // Clear entries on error
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
    // availableActivities should be up-to-date in state
    loadEntries(availableActivities);
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
    return (
      <View style={styles.entryCard}>
        <Image source={{ uri: String(item.image) }} style={styles.entryImage} />
        <View style={styles.entryContent}>
          <Text style={styles.entryTitle} numberOfLines={2}>
            {item.title}
          </Text>

          {item.activityName && (
            <Text style={styles.entryCategory}>{item.activityName}</Text>
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

{/* 还没做 */}
          {item.status === "rejected" && item.feedback && (
            <View style={styles.rejectionReasonContainer}>
              <Text style={styles.rejectionReasonText}>
                拒绝原因: {item.feedback}
              </Text>
            </View>
          )}

          {/* <View style={styles.statsRow}>
            <Text style={styles.statText}>👁 {item.views}</Text>
            <Text style={styles.statText}>❤️ {item.likes}</Text>
          </View> */}
        </View>
      </View>
    );
  };

    const getEmptyStateContent = () => {

      const categoryName = params?.categoryName ? `“${params.categoryName}”分类下` : "";

      switch (filterStatus) {

        case "pending":

          return {

            title: "暂无待审核作品",

            message: `您在${categoryName}还没有待审核的作品。`,

          };

        case "approved":

          return {

            title: "暂无已通过作品",

            message: `您在${categoryName}还没有已通过的作品。`,

          };

        case "rejected":

          return {

            title: "暂无未通过作品",

            message: `您在${categoryName}还没有未通过的作品。`,

          };

        case "all":

        default:

          return {

            title: "暂无创意投稿",

            message: `您在${categoryName}还没有作品，点击右上角“上传”按钮开始创作！`,

          };

      }

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

              <Text style={styles.emptyTitle}>{getEmptyStateContent().title}</Text>

              <Text style={styles.emptyMessage}>{getEmptyStateContent().message}</Text>

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