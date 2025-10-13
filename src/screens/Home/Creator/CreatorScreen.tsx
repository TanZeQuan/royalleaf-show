import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHideTabBar } from "hooks/useHideTabBar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { colors } from "styles";

// 导入导航类型
import { CreatorStackParamList } from "@navigation/stacks/HomeNav/CreatorStack";
// 导入投票服务，复用相同的分类 API
import { Category, voteService } from "../../../services/VoteService/voteMainApi";

type CreatorNavigationProp = NativeStackNavigationProp<CreatorStackParamList>;

const CreatorStack = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CreatorNavigationProp>();
  // ✅ 自动隐藏底部导航栏
  useHideTabBar(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await voteService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleGoBack = () => navigation.goBack();

  const handleCategorySelect = (categoryId: string) => {
    // 找到选中的分类对象
    const category = categories.find(cat => cat.cateId === categoryId);

    navigation.navigate("CreatorSubmit", {
      entries: [], // 如果还没数据，先传空数组
      selectedCategory: categoryId,
      categoryName: category?.name || '通用',
    });
  };

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
        <Text style={styles.headerTitle}>创意竞赛</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.gold_deep} />
          <Text style={styles.loadingText}>加载分类中...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>选择一个领域提交您的创意想法</Text>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => handleCategorySelect(cat.cateId)}
            >
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{cat.name}</Text>
                <Text style={styles.categoryDescription}>{cat.desc}</Text>
              </View>
              <Text style={styles.arrowIcon}>→</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold_light,
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
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray_text,
    marginBottom: 25,
    textAlign: "center",
    fontWeight: "semibold",
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.gold_deep,
    shadowColor: colors.gold_light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.gray_text,
  },
  arrowIcon: {
    fontSize: 20,
    color: colors.gold_deep,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray_text,
    textAlign: "center",
  },
});

export default CreatorStack;