import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHideTabBar } from "hooks/useHideTabBar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
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
import styles from "./styles/CreatorCategoryScreenStyles";

type CreatorNavigationProp = NativeStackNavigationProp<CreatorStackParamList>;

const CreatorCategoryScreen = () => {
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

    navigation.navigate("CreatorMain", {
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
          <Text style={styles.subtitle}>一个领域提交您的创意想法</Text>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.cateId} 
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

export default CreatorCategoryScreen;