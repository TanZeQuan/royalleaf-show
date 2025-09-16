import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ImageBackground,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "styles";

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
      image: require("assets/images/votebg.png"), // 本地图片
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
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>投票</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>选择您想参与的投票类别</Text>

        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryWrapper}
              onPress={() => handleCategoryPress(category.id)}
            >
              <ImageBackground
                source={category.image}
                style={styles.categoryCard}
                imageStyle={styles.cardBackground}
              > 
                <View style={styles.categoryContentRow}>
                  {/* <View style={styles.categoryIcon}>
                    <Text style={styles.iconText}>{category.icon}</Text>
                  </View> */}
                  <View style={styles.categoryContent}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <Text style={styles.categoryDescription}>
                      {category.description}
                    </Text>
                  </View>
                  {/* <View style={styles.arrowIcon}>
                    <Text style={styles.arrowText}>→</Text>
                  </View> */}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary_bg,
    backgroundColor: colors.gold_light,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
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
    color: "#666666",
    marginBottom: 24,
    textAlign: "center",
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 50,
    height: 130,
  },
  cardBackground: {
    borderRadius: 12,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)", // 黑色半透明遮罩
  },
  categoryContentRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // backgroundColor: colors.primary_bg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  iconText: {
    fontSize: 30,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 4,
    textAlign:"center"
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.gray_text,
    textAlign:"center"
  },
  // arrowIcon: {
  //   width: 30,
  //   height: 30,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  arrowText: {
    fontSize: 30,
    color: colors.green_deep,
    fontWeight: "bold",
    lineHeight: 30,
  },
});

export default VoteMainScreen;
