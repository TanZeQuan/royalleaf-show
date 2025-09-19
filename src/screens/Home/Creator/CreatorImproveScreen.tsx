import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { typography, colors } from "styles";
import { ContestEntry } from "../Creator/CreatorSlice";
import { CreatorStackParamList } from "../../../navigation/stacks/CreatorStack";

type MySubmissionsNavigationProp = NativeStackNavigationProp<CreatorStackParamList>;

interface RouteParams {
  entries?: ContestEntry[];
}

const MySubmissionsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MySubmissionsNavigationProp>();
  const route = useRoute();
  const params = route.params as RouteParams;

  const [entries, setEntries] = useState<ContestEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      if (params?.entries) {
        const loadedEntries = params.entries.map((entry: any) => ({
          ...entry,
          submittedAt: new Date(entry.submittedAt),
          reviewedAt: entry.reviewedAt ? new Date(entry.reviewedAt) : undefined,
        }));
        setEntries(loadedEntries);
      } else {
        const storedEntries = await AsyncStorage.getItem('contestEntries');
        if (storedEntries) {
          const loadedEntries = JSON.parse(storedEntries).map((entry: any) => ({
            ...entry,
            submittedAt: new Date(entry.submittedAt),
            reviewedAt: entry.reviewedAt ? new Date(entry.reviewedAt) : undefined,
          }));
          setEntries(loadedEntries);
        }
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => navigation.goBack();

  const getStatusText = (status: ContestEntry['status']) => {
    switch (status) {
      case 'approved': return '已通过';
      case 'rejected': return '已拒绝';
      case 'pending': return '审核中';
      default: return status;
    }
  };

  const getStatusColor = (status: ContestEntry['status']) => {
    switch (status) {
      case 'approved': return colors.success;
      case 'rejected': return colors.error;
      case 'pending': return colors.pending;
      default: return colors.gray_text;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderEntry = ({ item }: { item: ContestEntry }) => (
    <View style={styles.entryCard}>
      <Image source={{ uri: String(item.image) }} style={styles.entryImage} />
      <View style={styles.entryContent}>
        <Text style={styles.entryTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.entryCategory}>{item.categoryName}</Text>

        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(item.submittedAt)}</Text>
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>👁 {item.views}</Text>
          <Text style={styles.statText}>❤️ {item.likes}</Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.gold_deep} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
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
        <Text style={styles.headerTitle}>我的创意</Text>
        <Text style={styles.countText}>{entries.length}份</Text>
      </View>

      {/* 投稿列表 */}
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>暂无创意投稿</Text>
            <Text style={styles.emptyMessage}>
              您还没有投稿作品{'\n'}快去参加创意竞赛吧！
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary_bg
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  backIcon: {
    fontSize: 20,
    color: colors.black,
    fontWeight: "bold"
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black
  },
  countText: {
    fontSize: 14,
    color: colors.gold_deep,
    fontWeight: 'bold',
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
    flexDirection: 'row',
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
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },
  entryCategory: {
    fontSize: 12,
    color: colors.gold_deep,
    marginBottom: 8,
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: colors.gray_text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statText: {
    fontSize: 12,
    color: colors.gray_text,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: colors.gray_text,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MySubmissionsScreen;