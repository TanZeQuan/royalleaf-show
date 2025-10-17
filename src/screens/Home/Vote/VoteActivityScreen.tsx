// screens/VoteActivity/VoteActivityScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  VoteActivity,
  voteActivityService,
} from "../../../services/VoteService/voteOptionsApi";
import { styles } from "./Styles/VoteActivityCSS";

type VoteActivityNavigationProp = NativeStackNavigationProp<any>;

interface RouteParams {
  category: string;
  categoryName: string;
}

const VoteActivityScreen = () => {
  const navigation = useNavigation<VoteActivityNavigationProp>();
  const route = useRoute();
  const { category, categoryName } = route.params as RouteParams;

  const [voteActivities, setVoteActivities] = useState<VoteActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoteActivities = async () => {
      try {
        setLoading(true);
        const activities = await voteActivityService.getVotingActivities();
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

  const handleActivityPress = (activity: VoteActivity) => {
    navigation.navigate("VoteOption", {
      category: category,
      categoryName: categoryName,
      activity: activity,
      votesId: activity.votesId,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

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
          <ActivityIndicator size="large" color={styles.loadingIndicator.color} />
          <Text style={styles.centerText}>加载中...</Text>
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
                    { marginBottom: index === voteActivities.length - 1 ? 0 : 16 },
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
                            color={styles.dateIcon.color}
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
                              color={styles.remainingIcon.color}
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
                          color={styles.arrowIcon.color}
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
              color={styles.emptyIcon.color}
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

export default VoteActivityScreen;