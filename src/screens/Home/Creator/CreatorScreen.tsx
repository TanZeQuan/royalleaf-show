import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { typography, colors } from "styles";
import { useHideTabBar } from "hooks/useHideTabBar";

// 导入导航类型
import { CreatorStackParamList } from "navigation/stacks/CreatorStack";
import CreatorSubmitScreen from "../Creator/CreatorSubmitScreen";

type CreatorNavigationProp = NativeStackNavigationProp<CreatorStackParamList>;

interface CreatorCategory {
  id: string;
  title: string;
  description: string;
}

const CreatorStack = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CreatorNavigationProp>();
  // ✅ 自动隐藏底部导航栏
  useHideTabBar(true);

  const categories: CreatorCategory[] = [
    {
      id: "drinks",
      title: "饮料专场",
      description: "分享您的饮料创新想法",
    },
    {
      id: "packaging",
      title: "包装专场",
      description: "提出您心里最佳的包装设计",
    },
    {
      id: "logo",
      title: "Logo专场",
      description: "创新最佳Logo",
    },
    {
      id: "decoration",
      title: "装修专场",
      description: "创造您喜爱的装修风格",
    },
  ];

  const handleGoBack = () => navigation.goBack();

  const handleCategorySelect = (categoryId: string) => {
    // 找到选中的分类对象
    const category = categories.find(cat => cat.id === categoryId);

    navigation.navigate("CreatorSubmit", {
      entries: [], // 如果还没数据，先传空数组
      selectedCategory: categoryId,
      categoryName: category?.title || '通用',
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>选择一个领域提交您的创意想法</Text>

        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.categoryCard}
            onPress={() => handleCategorySelect(cat.id)}
          >
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>{cat.title}</Text>
              <Text style={styles.categoryDescription}>{cat.description}</Text>
            </View>
            <Text style={styles.arrowIcon}>→</Text>
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
});

export default CreatorStack;