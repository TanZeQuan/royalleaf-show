import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ImageBackground,
  Dimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "styles";

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

  const categories = [
    {
      id: "drinks",
      title: "饮料专场",
      description: "为您最爱的饮料投票",
      icon: "🧋",
      image: require("assets/images/votebg.png"),
    },
    {
      id: "packaging",
      title: "包装专场",
      description: "选出最佳包装设计",
      icon: "📦",
      image: require("assets/images/votebg.png"),
    },
    {
      id: "logo",
      title: "Logo专场",
      description: "投票选择最佳Logo",
      icon: "🎨",
      image: require("assets/images/votebg.png"),
    },
    {
      id: "decoration",
      title: "装修专场",
      description: "选择您喜爱的装修风格",
      icon: "🏪",
      image: require("assets/images/votebg.png"),
    },
  ];

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate("VoteOption", { category: categoryId });
  };

  const handleGoBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>投票</Text>
        <View style={styles.placeholder} />
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
                  marginBottom: index === categories.length - 1 ? 0 : verticalScale(16) 
                }
              ]}
              onPress={() => handleCategoryPress(category.id)}
              activeOpacity={0.8}
            >
              <ImageBackground
                source={category.image}
                style={styles.categoryCard}
                imageStyle={styles.cardBackground}
                resizeMode="cover"
              >
                <View style={styles.categoryContentRow}>
                  <View style={styles.categoryContent}>
                    <Text style={styles.categoryTitle} numberOfLines={1}>
                      {category.title}
                    </Text>
                    <Text style={styles.categoryDescription} numberOfLines={2}>
                      {category.description}
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
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    minHeight: verticalScale(60),
    borderBottomColor: "rgba(215, 167, 64, 0.1)",
  },
  backButton: {
    width: scale(32),
    height: scale(32),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(16),
  },
  backIcon: {
    fontSize: moderateScale(20),
    color: colors.black,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: colors.black,
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
    color: "#666666",
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
    shadowColor: "#000",
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
    color: "#000000ff",
    marginBottom: verticalScale(4),
    textAlign: "center",
    textShadowRadius: 2,
  },
  categoryDescription: {
    fontSize: moderateScale(14),
    color: "#969696ff",
    textAlign: "center",
    lineHeight: moderateScale(18),
    textShadowRadius: 2,
  },
});

export default VoteMainScreen;