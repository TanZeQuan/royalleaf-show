import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHideTabBar } from "hooks/useHideTabBar";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "styles";

type RankingNavigationProp = NativeStackNavigationProp<any>;

const VoteRanking = () => {
  const navigation = useNavigation<RankingNavigationProp>();
  useHideTabBar(true);

  const [activeTab, setActiveTab] = useState("drinks");

  const tabs = [
    { id: "drinks", label: "饮料" },
    { id: "packaging", label: "包装" },
    { id: "logo", label: "Logo" },
    { id: "decoration", label: "装修" },
  ];

  const rankingData = [
    {
      id: "1",
      user: "用户A",
      votes: 120,
      avatar: require("assets/icons/ranking-i.png"),
    },
    {
      id: "2",
      user: "用户B",
      votes: 110,
      avatar: require("assets/icons/ranking-i.png"),
    },
    {
      id: "3",
      user: "用户C",
      votes: 100,
      avatar: require("assets/icons/ranking-i.png"),
    },
    {
      id: "4",
      user: "用户D",
      votes: 95,
      avatar: require("assets/icons/ranking-i.png"),
    },
    {
      id: "5",
      user: "用户E",
      votes: 90,
      avatar: require("assets/icons/ranking-i.png"),
    },
  ];

  const handleGoBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>专场排行</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabWrapper}>
        <View style={styles.tabContainer}>
          {tabs.map((tab, idx) => (
            <React.Fragment key={tab.id}>
              <TouchableOpacity
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.id && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>

              {/* 加分隔符，最后一个不要 */}
              {idx < tabs.length - 1 && <Text style={styles.divider}>|</Text>}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Ranking Cards */}
      <ScrollView style={styles.listContainer}>
        {rankingData.map((item, index) => (
          <View key={item.id} style={styles.card}>
            {/* 排名号 */}
            <View style={styles.rankWrapper}>
              <Text
                style={[
                  styles.rank,
                  index === 0 && { color: "#FFD700" }, // 金色
                  index === 1 && { color: "#C0C0C0" }, // 银色
                  index === 2 && { color: "#CD7F32" }, // 铜色
                ]}
              >
                #{index + 1}
              </Text>
            </View>

            {/* 头像 + 名字 */}
            <View style={styles.avatarWrapper}>
              <Image source={item.avatar} style={styles.avatar} />
              <Text style={styles.user}>{item.user}</Text>
            </View>

            {/* 票数 */}
            <View style={styles.middleCell}>
              <Text style={styles.votes}>{item.votes} 票</Text>
            </View>

            {/* 按钮 */}
            <View style={styles.rightCell}>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>查看</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary_bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(215, 167, 64, 0.1)",
    backgroundColor:colors.gold_light,
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: colors.black },
  placeholder: { width: 35 },
  tabWrapper: { alignItems: "center", marginVertical: 12 },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 25,
    alignItems: "center",
    padding: 5,
    shadowColor: colors.green_deep,
    elevation: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  divider: {
    fontSize: 25,
    color: colors.gray_light,
    fontWeight: "200",
    marginHorizontal: 3,
  },

  tabText: { fontSize: 15, color: colors.gray_text },
  activeTab: { backgroundColor: colors.gold_deep },
  activeTabText: { color: colors.white, fontWeight: "bold" },
  listContainer: { flex: 1, paddingHorizontal: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    marginBottom: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: colors.gold_deep,
  },
  rankWrapper: {
    flex: 1,
    alignItems: "flex-start",
  },
  rank: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.green_deep,
  },
  avatarWrapper: {
    // flex: 2,
    alignItems: "center",
    marginRight: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: colors.gold_deep,
  },
  user: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.black,
  },
  middleCell: {
    // flex: 2,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  votes: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.green_deep,
  },
  rightCell: {
    flex: 1.5,
    alignItems: "flex-end",
  },
  viewButton: {
    backgroundColor: colors.gold_deep,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});

export default VoteRanking;
