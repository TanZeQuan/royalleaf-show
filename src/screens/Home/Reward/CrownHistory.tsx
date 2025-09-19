import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../Home/Reward/RewardStyle";
import { Ionicons } from "@expo/vector-icons";

const CrownHistory = () => {
  const navigation = useNavigation();

  const crownHistory = [
    {
      id: 1,
      action: "参与投票",
      date: "13/07/2025",
      points: "+50",
      balance: 30,
    },
    {
      id: 2,
      action: "分享内容",
      date: "12/07/2025",
      points: "+20",
      balance: 80,
    },
    {
      id: 3,
      action: "每日签到",
      date: "11/07/2025",
      points: "+10",
      balance: 60,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>皇冠历史</Text>
      </View>

      <ScrollView style={styles.tabContent}>
        <Text style={styles.sectionTitle}>皇冠获取记录</Text>

        {crownHistory.length > 0 ? (
          crownHistory.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyContent}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyAction}>{item.action}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={[styles.historyPoints, { color: "#4CAF50" }]}>
                    {item.points}
                  </Text>
                  <Text style={styles.historyBalance}>
                    余额: {item.balance}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noRecords}>暂无皇冠历史记录</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default CrownHistory;

