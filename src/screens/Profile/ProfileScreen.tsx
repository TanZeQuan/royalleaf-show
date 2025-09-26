import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";

import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { typography, colors } from "styles";
import { ProfileStackParamList } from "../../navigation/stacks/ProfileNav/ProfileStack";
import { viewProfile } from "services/UserService/userApi";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// ---------- Safe Parse ----------
const safeParse = (value: string | null) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return { username: value };
  }
};

// ---------- Responsive scaling ----------
const scale = (size: number) => (screenWidth / 375) * size;
const verticalScale = (size: number) => (screenHeight / 812) * size;
const getFullImageUrl = (img: string | undefined) => {
  if (!img) return undefined;
  // 如果 img 以 http/https 开头就直接用，否则拼接 BASE_URL
  return img.startsWith("http") ? img : `http://192.168.0.241:8080/royal/${img.replace(/^\/+/, '')}`;
};

// ---------- Types ----------
type ProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  "Profile"
>;

interface UserProfile {
  image?: string;
  user_id: string;
  username: string;
  wallet_balance: number;
  crown: number;
}

type ParsedUser = UserProfile | { username: string } | null;

// ---------- Component ----------
export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------- Load profile ----------
  const loadProfile = async () => {
    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (!storedUser) {
        Alert.alert("提示", "请先登录");
        setUser(null);
        return;
      }

      const parsed = safeParse(storedUser) as ParsedUser;
      const userId = (parsed as any)?.user_id;

      if (!userId) {
        // 仅有用户名
        setUser({
          user_id: "----",
          username: (parsed as any)?.username || "未登录",
          wallet_balance: 0,
          crown: 0,
        });
        return;
      }

      const res = await viewProfile(userId);
      if (res.success) {
        setUser(res.data);
      } else {
        Alert.alert("获取资料失败", res.message || "请重新登录");
      }
    } catch (err: any) {
      console.error("Profile Error:", err);
      Alert.alert("错误", err.message || "无法加载资料");
    } finally {
      setLoading(false);
    }
  };

  // ---------- 页面加载和返回刷新 ----------
  useEffect(() => {
    loadProfile(); // 首次加载
    const unsubscribe = navigation.addListener("focus", loadProfile); // 每次返回刷新
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#E1C16E"
          style={{ marginTop: 50 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Settings */}
        <View style={styles.settingContainer}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate("SettingStack")}
            activeOpacity={0.7}
          >
            <Image
              source={require("assets/icons/profile-setting.png")}
              style={styles.settingsIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <View style={styles.profileImageContainer}>
              <Image
                source={
                  user?.image
                    ? { uri: getFullImageUrl(user.image) }
                    : require("assets/icons/profile-avatar.png")
                }
                style={styles.profileImage}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.username} numberOfLines={1}>
                {user?.username || "未登录"}
              </Text>
              <Text style={styles.userId} numberOfLines={1}>
                ID: {user?.user_id || "----"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => navigation.navigate("Scan")}
              activeOpacity={0.7}
            >
              <Image
                source={require("assets/icons/profile-scan.png")}
                style={styles.scanIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber} numberOfLines={1}>
                {user?.wallet_balance?.toFixed(2) ?? "0.00"}
              </Text>

              <Text
                style={styles.statLabel}
                numberOfLines={1}
                onPress={() => navigation.navigate("WalletStack" as never)}
              >
                钱包(RM)
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber} numberOfLines={1}>
                {user?.crown ?? 0}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1}>
                皇冠
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Image
                source={require("assets/icons/profile-delivery.png")}
                style={styles.walletIcon}
              />
              <Text style={styles.statLabel} numberOfLines={1}>
                物流
              </Text>
            </View>
          </View>
        </View>

        {/* Leaf Guest Section */}
        <View style={styles.leafSection}>
          <ImageBackground
            source={require("assets/images/profile-leaf-bg.png")}
            style={styles.leafBackground}
            imageStyle={styles.leafBackgroundImage}
            resizeMode="cover"
          >
            <View style={styles.leafContent}>
              <View style={styles.leafTextContainer}>
                <Text style={styles.leafTitle} numberOfLines={1}>
                  Leaf Guest
                </Text>
                <Text style={styles.leafSubtitle} numberOfLines={2}>
                  9 Cups away from Leaf Knight
                </Text>
              </View>
              <View style={styles.leafRightSection}>
                <Image
                  source={require("assets/icons/profile-leaf-logo.png")}
                  style={styles.leafLogo}
                />
                <TouchableOpacity
                  style={styles.benefitsButton}
                  onPress={() => navigation.navigate("Benefit")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.benefitsText}>View My Benefits</Text>
                  <Text style={styles.benefitsArrow}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Feature Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
              <ImageBackground
                source={require("assets/images/profile-card-bg.png")}
                style={styles.cardBackground}
                imageStyle={styles.cardBackgroundImage}
                resizeMode="cover"
              >
                <Image
                  source={require("assets/icons/home-story.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle} numberOfLines={2}>
                  我们的故事
                </Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
              <ImageBackground
                source={require("assets/images/profile-card-bg.png")}
                style={styles.cardBackground}
                imageStyle={styles.cardBackgroundImage}
                resizeMode="cover"
              >
                <Image
                  source={require("assets/icons/login-vote.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle} numberOfLines={2}>
                  投票
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
              <ImageBackground
                source={require("assets/images/profile-card-bg.png")}
                style={styles.cardBackground}
                imageStyle={styles.cardBackgroundImage}
                resizeMode="cover"
              >
                <Image
                  source={require("assets/images/profile-creator.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle} numberOfLines={2}>
                  创造者
                </Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
              <ImageBackground
                source={require("assets/images/profile-card-bg.png")}
                style={styles.cardBackground}
                imageStyle={styles.cardBackgroundImage}
                resizeMode="cover"
              >
                <Image
                  source={require("assets/images/profile-leaf.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle} numberOfLines={2}>
                  茶会
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F4"
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },

  // Settings
  settingContainer: {
    alignItems: "flex-end",
    paddingHorizontal: scale(22),
    paddingVertical: verticalScale(18),
  },
  settingsButton: {
    width: scale(36),
    height: scale(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    width: scale(28),
    height: scale(28),
    resizeMode: "contain"
  },

  // Profile
  profileSection: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  profileImageContainer: {
    marginRight: scale(15)
  },
  profileImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(50),
    resizeMode: "cover",
  },
  profileInfo: {
    flex: 1,
    paddingRight: scale(10),
  },
  username: {
    fontSize: scale(18),
    fontWeight: "600",
    color: "#333",
    marginBottom: verticalScale(3),
  },
  userId: {
    fontSize: scale(14),
    color: "#888"
  },
  scanButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: "center",
    alignItems: "center",
  },
  scanIcon: {
    width: scale(35),
    height: scale(35),
    resizeMode: "contain"
  },

  // Stats
  statsContainer: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(20)
  },
  statsSection: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: scale(6),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(10),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center"
  },
  statNumber: {
    fontSize: scale(16),
    fontWeight: "600",
    color: "#333",
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: scale(11),
    color: "#999",
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: verticalScale(8)
  },
  walletIcon: {
    width: scale(24),
    height: scale(24),
    resizeMode: "contain",
    marginBottom: verticalScale(4),
  },

  // Leaf Section
  leafSection: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(20),
  },
  leafBackground: {
    width: "105%",
    paddingVertical: verticalScale(30),
    paddingHorizontal: scale(15),
    minHeight: verticalScale(120),
  },
  leafBackgroundImage: {
    borderRadius: scale(8),
  },
  leafContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  leafTextContainer: {
    flex: 1,
    paddingRight: scale(10),
  },
  leafTitle: {
    fontSize: scale(24),
    fontWeight: "700",
    color: "#1C1C1C",
    fontFamily: "futura-bold-32",
    marginBottom: verticalScale(2),
  },
  leafSubtitle: {
    fontSize: scale(11),
    color: "#626B73",
    fontWeight: "400",
    fontFamily: "futura-spacing",
    lineHeight: scale(14),
  },
  leafRightSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  leafLogo: {
    width: scale(80),
    height: scale(80),
    marginBottom: verticalScale(10),
    resizeMode: "contain",
  },
  benefitsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(10),
  },
  benefitsText: {
    fontSize: scale(13),
    color: "#626B73",
    fontFamily: "FuturaPT-Medium",
    marginBottom: -25,
  },
  benefitsArrow: {
    fontSize: scale(16),
    color: "#626B73",
    marginLeft: scale(4),
    marginBottom: -25,
  },

  // Feature Cards
  cardsContainer: {
    paddingHorizontal: scale(10),
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(scale(10)),
  },
  card: {
    flex: 0.58,
    overflow: "hidden",
    height: verticalScale(160),
    borderRadius: scale(8),
  },
  cardBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(10),
  },
  cardBackgroundImage: {
    borderRadius: scale(8),
  },
  cardIcon: {
    width: scale(60),
    height: scale(60),
    resizeMode: "contain",
    marginBottom: verticalScale(10),
  },
  cardTitle: {
    ...typography.caption,
    textAlign: "center",
    fontSize: scale(15),
    lineHeight: scale(25),
    fontFamily: "Inter-Bold",
  },
  cardGreen: {
    backgroundColor: colors.green
  },
});

function loadProfile() {
  throw new Error("Function not implemented.");
}
