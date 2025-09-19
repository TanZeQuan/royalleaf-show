import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../Reward/RewardStyle";
import { Ionicons } from "@expo/vector-icons";
const { width } = Dimensions.get("window"); // 屏幕宽度
const isSmallScreen = width < 360; // 小屏幕判断

const ExchangeHistory = () => {
  const navigation = useNavigation();

  const exchangeHistory = [
    {
      id: 1,
      item: "RM 5 折扣券",
      date: "13/07/2025",
      points: "-100",
      balance: 30,
    },
    {
      id: 2,
      item: "RM 10 折扣券",
      date: "10/07/2025",
      points: "-180",
      balance: 130,
    },
    {
      id: 3,
      item: "RM 5 折扣券",
      date: "08/07/2025",
      points: "-100",
      balance: 310,
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
        <Text style={styles.headerTitle}>兑换记录</Text>
      </View>

      <ScrollView style={styles.tabContent}>
        <Text style={styles.sectionTitle}>优惠券兑换记录</Text>

        {exchangeHistory.length > 0 ? (
          exchangeHistory.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyContent}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyAction}>{item.item}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={[styles.historyPoints, { color: '#f44336' }]}>
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
          <Text style={styles.noRecords}>暂无兑换记录</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ExchangeHistory;