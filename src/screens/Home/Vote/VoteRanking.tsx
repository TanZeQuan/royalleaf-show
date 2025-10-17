// screens/VoteRanking/VoteRankingScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHideTabBar } from "hooks/useHideTabBar";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./Styles/VoteRankingCSS";

type RankingNavigationProp = NativeStackNavigationProp<any>;

const VoteRankingScreen = () => {
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
    { id: "1", user: "用户A", votes: 120, avatar: require("assets/icons/ranking-i.png") },
    { id: "2", user: "用户B", votes: 110, avatar: require("assets/icons/ranking-i.png") },
    { id: "3", user: "用户C", votes: 100, avatar: require("assets/icons/ranking-i.png") },
    { id: "4", user: "用户D", votes: 95, avatar: require("assets/icons/ranking-i.png") },
    { id: "5", user: "用户E", votes: 90, avatar: require("assets/icons/ranking-i.png") },
  ];

  const handleGoBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>专场排行</Text>
        <View style={styles.placeholder} />
      </View>

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
              {idx < tabs.length - 1 && <Text style={styles.divider}>|</Text>}
            </React.Fragment>
          ))}
        </View>
      </View>

      <ScrollView style={styles.listContainer}>
        {rankingData.map((item, index) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.rankWrapper}>
              <Text
                style={[
                  styles.rank,
                  index === 0 && styles.rankGold,
                  index === 1 && styles.rankSilver,
                  index === 2 && styles.rankBronze,
                ]}
              >
                #{index + 1}
              </Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Image source={item.avatar} style={styles.avatar} />
              <Text style={styles.user}>{item.user}</Text>
            </View>
            <View style={styles.middleCell}>
              <Text style={styles.votes}>{item.votes} 票</Text>
            </View>
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

export default VoteRankingScreen;