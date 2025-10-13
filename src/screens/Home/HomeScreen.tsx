import { Ionicons } from "@expo/vector-icons";
import { HomeStackParamList } from "@navigation/stacks/HomeNav/HomeStack";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ButtonAnimation from "components/AppButton";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, typography } from "styles"; // ✅ 用统一字体 & 颜色
import Carousel from "react-native-reanimated-carousel";
import VotePopup from "../../components/VotePopup";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function BubbleTeaHomepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showVotePopup, setShowVotePopup] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [showTaskModal, setShowTaskModal] = useState(false);

  const heroImages = [
    require("assets/images/home-bg1.jpg"),
    require("assets/images/home-bg2.jpg"),
    require("assets/images/home-bg3.jpg"),
  ];

  // 模拟登录成功后显示投票弹窗
  useEffect(() => {
    // 延迟1秒显示弹窗，模拟登录成功进入主页的效果
    const timer = setTimeout(() => {
      setShowVotePopup(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseVotePopup = () => {
    setShowVotePopup(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.gold_deep} />

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Carousel
          width={screenWidth}
          height={screenHeight * 0.4}
          loop
          autoPlay
          autoPlayInterval={3000}
          scrollAnimationDuration={1000} // smooth duration
          data={heroImages}
          renderItem={({ item }) => (
            <Image
              source={item}
              style={{ width: screenWidth, height: screenHeight * 0.4 }}
              resizeMode="cover"
            />
          )}
        />

        {/* Wallet Section */}
        <View style={styles.walletSection}>
          <View style={styles.walletHeader}>
            <Text style={styles.welcomeTitle}>
              <Text style={styles.welcomeText}>欢迎来到 </Text>
              <Text style={styles.brandText}>天方御叶</Text>
            </Text>
            <View style={styles.logoCircle}>
              <Image
                source={require("assets/icons/login-logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.dividerLine} />

          <View style={styles.walletStats}>
            <TouchableOpacity
              style={styles.walletItem}
              onPress={() => navigation.navigate("WalletStack" as never)}
            >
              <Text style={styles.walletAmount}>0.00</Text>
              <Text style={styles.walletLabel}>钱包(RM)</Text>
            </TouchableOpacity>

            <View style={styles.walletDivider} />

            <View style={styles.walletItem}>
              <Text style={styles.walletAmount}>30</Text>
              <Text style={styles.walletLabel}>皇冠</Text>
            </View>

            <View style={styles.walletDivider} />

            <TouchableOpacity style={styles.qrIcon} onPress={() => navigation.navigate("Scan" as never)}>
              <Ionicons name="qr-code-outline" size={32} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommendation Section */}
        <View style={styles.recommendationSection}>
          <Text style={styles.sectionTitle}>推荐</Text>
          <View style={styles.recommendationRow}>
            <TouchableOpacity
              style={styles.recommendationItem}
              onPress={() => navigation.navigate("Reward" as never)}
            >
              <View style={styles.recommendationIcon}>
                <Ionicons name="gift-outline" size={28} color={colors.black} />
              </View>
              <Text style={styles.recommendationText}>奖励</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.recommendationItem}
              onPress={() => navigation.navigate("Social" as never)}
            >
              <View style={styles.recommendationIcon}>
                <Ionicons name="leaf" size={28} color={colors.black} />
              </View>
              <Text style={styles.recommendationText}>茶会</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.recommendationItem}
              onPress={() => navigation.navigate("CreatorStack")}
            >
              <View style={styles.recommendationIcon}>
                <Ionicons name="create-outline" size={28} color={colors.black} />
              </View>
              <Text style={styles.recommendationText}>创造者</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.recommendationItem}
              onPress={() => navigation.navigate("VoteStack" as never)}
            >
              <View style={styles.recommendationIcon}>
                <Image
                  source={require("assets/icons/login-vote.png")}
                  style={{ width: 28, height: 28, tintColor: colors.black }}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.recommendationText}>投票</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationSection}>
          <TouchableOpacity style={styles.navCard}>
            <Image
              source={require("assets/icons/home-pickup.png")}
              style={styles.navIcon}
            />
            <Text style={styles.navCardText}>自取</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCard}>
            <Image
              source={require("assets/icons/home-delivery.png")}
              style={styles.navIcon}
            />
            <Text style={styles.navCardText}>外送</Text>
          </TouchableOpacity>
        </View>

        {/* Sales Banner */}
        <View style={styles.salesSection}>
          <ImageBackground
            source={require("assets/images/home-sales.png")}
            style={styles.banner}
            resizeMode="cover"
          >
            <Text style={styles.salesTitle}>Sales</Text>
          </ImageBackground>
        </View>

      </ScrollView>

      {/* Floating Gift Button */}
      <ButtonAnimation />

      {/* Vote Popup */}
      <VotePopup visible={showVotePopup} onClose={handleCloseVotePopup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary_bg },
  scrollContent: { paddingBottom: 20 },

  heroBackground: { width: "100%", height: screenHeight * 0.4 },

  walletSection: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeTitle: typography.body, // ✅ 用 typography
  welcomeText: { ...typography.body, fontFamily: "semiFuturaPT-Bold", color: colors.black },
  brandText: { ...typography.h2, fontFamily: "FuturaPT-Bold", color: colors.black },
  dividerLine: { height: 1, backgroundColor: colors.gray_nav, marginVertical: 5 },
  logoCircle: { width: 50, height: 50, justifyContent: "center", alignItems: "center" },
  logoImage: { width: 110, height: 110 },

  walletStats: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  walletItem: { alignItems: "center", flex: 1 },
  walletAmount: { fontSize: 18, fontFamily: "inter-medium", color: colors.black, marginBottom: 4 },
  walletLabel: { fontSize: 11, fontFamily: "inter-medium", color: colors.gray_text, textTransform: "uppercase" },
  walletDivider: { width: 1, height: 40, backgroundColor: colors.gray_nav, marginHorizontal: 16 },
  qrIcon: { marginLeft: 15, marginRight: 6 },

  recommendationSection: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  sectionTitle: { ...typography.caption, fontFamily: "inter-medium", marginBottom: 15 },
  recommendationRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  recommendationItem: { flex: 1, alignItems: "center" },
  recommendationIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: colors.primary_bg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  recommendationText: { ...typography.body, fontFamily: "inter-medium", fontSize: 14, color: colors.black },

  giftButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: colors.gold_deep,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },

  navigationSection: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 15, paddingVertical: 18 },
  navCard: {
    flex: 1,
    backgroundColor: colors.gold_light,
    height: 120,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: { elevation: 5 },
    }),
  },
  navIcon: { width: 50, height: 50, resizeMode: "contain", marginBottom: 5 },
  navCardText: { ...typography.caption, color: colors.black, marginTop: 8, fontFamily: "FuturaPT-Bold" },

  salesSection: { width: "100%", alignItems: "center", marginVertical: 10 },
  banner: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.35,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    overflow: "hidden",
    borderRadius: 5,
  },
  salesTitle: { ...typography.h2, textAlign: "center" },
});
