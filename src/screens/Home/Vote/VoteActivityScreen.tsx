import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { colors } from "styles";
import {
  VoteActivity,
  voteActivityService,
} from "../../../services/VoteService/voteOptionsApi";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Responsive scaling functions
const scale = (size: number) => (screenWidth / 375) * size;
const verticalScale = (size: number) => (screenHeight / 812) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

type VoteActivityNavigationProp = NativeStackNavigationProp<any>;

interface RouteParams {
  category: string;
  categoryName: string;
}

const VoteActivityScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<VoteActivityNavigationProp>();
  const route = useRoute();
  const { category, categoryName } = route.params as RouteParams;

  const [voteActivities, setVoteActivities] = useState<VoteActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取投票活动数据
  useEffect(() => {
    const fetchVoteActivities = async () => {
      try {
        setLoading(true);
        // 获取所有进行中的投票活动
        const activities = await voteActivityService.getVotingActivities();

        // 过滤当前分类的活动
        const filteredActivities = activities.filter(
          (activity) => activity.category === category
        );

        setVoteActivities(filteredActivities);
      } catch (error) {
        console.error("获取投票活动出错:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVoteActivities();
  }, [category]);

  // 处理活动选择
  const handleActivityPress = (activity: VoteActivity) => {
    navigation.navigate("VoteOption", {
      category: category,
      categoryName: categoryName,
      activity: activity,
      votesId: activity.votesId,
    });
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 计算活动剩余天数
  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
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
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.gold_deep} />
          <Text style={styles.centerText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.subtitle}>选择您想参与的投票活动</Text>

        {voteActivities.length > 0 ? (
          <View style={styles.activitiesContainer}>
            {voteActivities.map((activity, index) => {
              const daysRemaining = getDaysRemaining(activity.votedStop);

              return (
                <TouchableOpacity
                  key={activity.id}
                  style={[
                    styles.activityWrapper,
                    {
                      marginBottom:
                        index === voteActivities.length - 1
                          ? 0
                          : verticalScale(16),
                    },
                  ]}
                  onPress={() => handleActivityPress(activity)}
                  activeOpacity={0.8}
                >
                  <View style={styles.activityCard}>
                    <View style={styles.activityHeader}>
                      <View style={styles.activityTitleRow}>
                        <Text style={styles.activityName} numberOfLines={2}>
                          {activity.name}
                        </Text>
                        {activity.votingOpen && (
                          <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>进行中</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <Text style={styles.activityDescription} numberOfLines={3}>
                      {activity.desc}
                    </Text>

                    <View style={styles.activityFooter}>
                      <View style={styles.dateSection}>
                        <View style={styles.dateRow}>
                          <Ionicons
                            name="calendar-outline"
                            size={16}
                            color={colors.gray_text}
                          />
                          <Text style={styles.dateLabel}>投票时间：</Text>
                          <Text style={styles.dateText}>
                            {formatDate(activity.votedAt)} -{" "}
                            {formatDate(activity.votedStop)}
                          </Text>
                        </View>
                        {daysRemaining > 0 && (
                          <View style={styles.remainingDays}>
                            <Ionicons
                              name="time-outline"
                              size={14}
                              color={colors.gold_deep}
                            />
                            <Text style={styles.remainingText}>
                              剩余 {daysRemaining} 天
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.arrowContainer}>
                        <Ionicons
                          name="chevron-forward"
                          size={24}
                          color={colors.gold_deep}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={colors.gray_text}
            />
            <Text style={styles.emptyTitle}>暂无进行中的投票活动</Text>
            <Text style={styles.emptySubtitle}>
              当前分类下没有可参与的投票活动
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    borderWidth:1,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(8),
    alignSelf: "flex-start",
    marginTop:10,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(80),
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

export default VoteActivityScreen;
