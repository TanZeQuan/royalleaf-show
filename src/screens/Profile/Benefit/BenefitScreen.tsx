// RewardScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useLayoutEffect, useState, useRef } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileStackParamList } from "../../../navigation/stacks/ProfileNav/ProfileStack"; // adjust path if needed

const { width, height } = Dimensions.get("window");

interface Level {
  id: number;
  title: string;
  subtitle: string;
  backgroundImage: any;
  icon: any;
  cardBackgroundImage: any;
  rewards: string[];
}

const levels: Level[] = [
  {
    id: 1,
    title: "Leaf Guest",
    subtitle: "9 Cups away from Leaf Knight",
    backgroundImage: require("assets/images/banner1.png"),
    icon: require("assets/icons/profile-leaf-logo.png"),
    cardBackgroundImage: require("assets/images/level1.png"),
    rewards: ["Welcome bonus: 50 Crown Points", "Basic member privileges", "Monthly newsletter"],
  },
  {
    id: 2,
    title: "Leaf Page",
    subtitle: "2 Cups away from Leaf Knight",
    backgroundImage: require("assets/images/banner2.png"),
    icon: require("assets/icons/profile-leaf-logo.png"),
    cardBackgroundImage: require("assets/images/level2.png"),
    rewards: ["100 Crown Points bonus", "5% discount on orders", "Priority customer service"],
  },
  {
    id: 3,
    title: "Leaf Page",
    subtitle: "2 Cups away from Leaf Knight",
    backgroundImage: require("assets/images/banner3.png"),
    icon: require("assets/icons/profile-leaf-logo.png"),
    cardBackgroundImage: require("assets/images/level3.png"),
    rewards: ["100 Crown Points bonus", "5% discount on orders", "Priority customer service"],
  },
  {
    id: 4,
    title: "Leaf Page",
    subtitle: "2 Cups away from Leaf Knight",
    backgroundImage: require("assets/images/banner4.png"),
    icon: require("assets/icons/profile-leaf-logo.png"),
    cardBackgroundImage: require("assets/images/level4.png"),
    rewards: ["100 Crown Points bonus", "5% discount on orders", "Priority customer service"],
  },
  {
    id: 5,
    title: "Leaf Page",
    subtitle: "2 Cups away from Leaf Knight",
    backgroundImage: require("assets/images/banner5.png"),
    icon: require("assets/icons/profile-leaf-logo.png"),
    cardBackgroundImage: require("assets/images/level5.png"),
    rewards: ["100 Crown Points bonus", "5% discount on orders", "Priority customer service"],
  },
  {
    id: 6,
    title: "Leaf Page",
    subtitle: "2 Cups away from Leaf Knight",
    backgroundImage: require("assets/images/banner6.png"),
    icon: require("assets/icons/profile-leaf-logo.png"),
    cardBackgroundImage: require("assets/images/level6.png"),
    rewards: ["100 Crown Points bonus", "5% discount on orders", "Priority customer service"],
  },
  {
    id: 7,
    title: "Leaf Page",
    subtitle: "2 Cups away from Leaf Knight",
    backgroundImage: require("assets/images/banner7.png"),
    icon: require("assets/icons/profile-leaf-logo.png"),
    cardBackgroundImage: require("assets/images/level7.png"),
    rewards: ["100 Crown Points bonus", "5% discount on orders", "Priority customer service"],
  },
  {
    id: 8,
    title: "Leaf Page",
    subtitle: "2 Cups away from Leaf Knight",
    backgroundImage: require("assets/images/banner8.png"),
    icon: require("assets/icons/profile-leaf-logo.png"),
    cardBackgroundImage: require("assets/images/level8.png"),
    rewards: ["100 Crown Points bonus", "5% discount on orders", "Priority customer service"],
  },
  {
    id: 9,
    title: "Leaf Page",
    subtitle: "2 Cups away from Leaf Knight",
    backgroundImage: require("assets/images/banner9.png"),
    icon: require("assets/icons/profile-leaf-logo.png"),
    cardBackgroundImage: require("assets/images/level9.png"),
    rewards: ["100 Crown Points bonus", "5% discount on orders", "Priority customer service"],
  },
];

const TAB_BAR_CONFIG = {
  backgroundColor: "#F9F5EC",
  height: 80,
  paddingTop: 2,
  paddingBottom: Platform.OS === "ios" ? 10 : 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -1 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 5,
};

export default function RewardScreen() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const handleMomentumScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentLevel(index + 1);
  };

  const renderLevelCard = ({ item }: { item: Level }) => (
    <View style={[styles.levelContainer, { width }]}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Image source={item.backgroundImage} style={styles.backgroundImage} resizeMode="cover" />
        <SafeAreaView style={styles.safeAreaHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <ImageBackground source={item.cardBackgroundImage} style={styles.levelCard} imageStyle={styles.cardImage}>
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.levelTitle}>{item.title}</Text>
                <Text style={styles.levelSubtitle}>{item.subtitle}</Text>
              </View>
              <Image source={item.icon} style={styles.levelIcon} resizeMode="contain" />
            </View>
          </ImageBackground>
        </SafeAreaView>
      </View>

      {/* Benefits Section */}
      <View style={styles.benefitsSection}>
        <SafeAreaView style={styles.safeAreaContent} edges={["left", "right", "bottom"]}>
          <View style={styles.contentContainer}>
            <View style={styles.spacer} />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.viewRankingButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("RankingScreen")}
              >
                <Text style={styles.viewRankingText}>View Ranking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={levels}
        renderItem={renderLevelCard}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  levelContainer: { flex: 1 },

  // Header
  headerSection: {
    position: "relative",
    height: height * 0.4,
    paddingBottom: 20,
  },
  backgroundImage: { ...StyleSheet.absoluteFillObject },
  safeAreaHeader: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: "flex-start",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 3,
    padding: 8,
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
  // Level Card with background
  levelCard: {
    width: width * 0.88, // 105% of screen width
    padding: 18,
    margin: 5,
    marginTop: 60,
  },
  cardImage: {
    resizeMode: "cover",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLeft: { flex: 1 },
  levelIcon: { width: 80, height: 80 },
  levelTitle: { fontSize: 22, fontWeight: "700", color: "#333", marginBottom: 5 },
  levelSubtitle: { fontSize: 14, color: "#777" },

  // Benefits
  benefitsSection: { flex: 1, backgroundColor: "#F5F5F0" },
  safeAreaContent: { flex: 1, paddingHorizontal: 20 },
  contentContainer: { flex: 1, justifyContent: "flex-end", paddingBottom: 30 },
  spacer: { flex: 1 },

  // Button
  buttonContainer: { alignItems: "center" },
  viewRankingButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    minWidth: 200,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },

  viewRankingText: { textAlign: "center", color: "#232323", fontFamily: "Inter-Medium", fontSize: 16, },
});
