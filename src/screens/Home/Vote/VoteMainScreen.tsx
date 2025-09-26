// 首页分类页面

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHideTabBar } from "hooks/useHideTabBar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
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
import {
  Category,
  voteService,
} from "../../../services/VoteService/voteMainApi";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Responsive scaling functions
const scale = (size: number) => (screenWidth / 375) * size;
const verticalScale = (size: number) => (screenHeight / 812) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

type VoteNavigationProp = NativeStackNavigationProp<any>;

const VoteMainScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<VoteNavigationProp>();
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

  const handleCategoryPress = (category: Category) => {
    navigation.navigate("VoteOption", {
      category: category.cateId,
      categoryName: category.name,
    });
  };

  // 加载状态
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
          <Text style={styles.headerTitle}>投票</Text>
          <View style={styles.placeholder} />
          <TouchableOpacity style={styles.rankBtn} activeOpacity={0.7}>
            <Image
              source={require("assets/icons/ranking-i.png")}
              style={{ width: 20, height: 20, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary_bg} />
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
        <Text style={styles.headerTitle}>投票</Text>
        <View style={styles.placeholder} />
        <TouchableOpacity
          style={styles.rankBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Ranking")}
        >
          <Image
            source={require("assets/icons/ranking-i.png")}
            style={{ width: 20, height: 20, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.subtitle}>选择您想参与的投票类别</Text>

        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryWrapper,
                {
                  marginBottom:
                    index === categories.length - 1 ? 0 : verticalScale(16),
                },
              ]}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.8}
            >
              <ImageBackground
                source={{ uri: category.image }}
                style={styles.categoryCard}
                imageStyle={styles.cardBackground}
                resizeMode="cover"
              >
                <View style={styles.categoryContentRow}>
                  <View style={styles.categoryContent}>
                    <Text style={styles.categoryTitle} numberOfLines={1}>
                      {category.name}
                    </Text>
                    <Text style={styles.categoryDescription} numberOfLines={2}>
                      {category.desc}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
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
    // minHeight: verticalScale(60),
    borderBottomColor: colors.gold_light,
    backgroundColor: colors.gold_light,
    fontSize:20,
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
  },
  rankBtn: {
    width: 35,
    height: 35,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.gray_text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: moderateScale(19),
    fontWeight: "bold",
    color: colors.black,
    marginLeft: 80,
  },
  placeholder: {
    width: scale(32),
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
    fontSize: moderateScale(16),
    color: colors.gray_text,
    fontWeight: "semibold",
    marginBottom: verticalScale(24),
    textAlign: "center",
    lineHeight: moderateScale(22),
    paddingHorizontal: scale(20),
  },
  categoriesContainer: {
    flex: 1,
  },
  categoryWrapper: {
    borderRadius: scale(12),
    overflow: "hidden",
    elevation: 3,
    shadowColor: colors.gray_nav,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(25),
    height: verticalScale(120),
    minHeight: verticalScale(100),
  },
  cardBackground: {
    borderRadius: scale(12),
  },
  categoryContentRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    zIndex: 1,
  },
  categoryContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: colors.black,
    marginBottom: verticalScale(4),
    textAlign: "center",
    textShadowRadius: 2,
  },
  categoryDescription: {
    fontSize: moderateScale(14),
    color: colors.gray_text,
    textAlign: "center",
    lineHeight: moderateScale(18),
    textShadowRadius: 2,
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
});

export default VoteMainScreen;
