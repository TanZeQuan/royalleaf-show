// RewardScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useLayoutEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { HomeStackParamList } from "../../../navigation/stacks/HomeNav/HomeStack";
import { styles } from "../../Home/Reward/RewardStyle";

type RewardScreenNavProp = NativeStackNavigationProp<HomeStackParamList, "Reward">;

export default function RewardScreen() {
  const navigation = useNavigation<RewardScreenNavProp>();

  // State Management - only crown points related
  const [crownPoints, setCrownPoints] = useState(30);

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          backgroundColor: "#F9F5EC",
          height: 80,
          paddingTop: 2,
          paddingBottom: Platform.OS === "ios" ? 10 : 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          marginTop: 5,
        },
      });
    };
  }, [navigation]);

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
        <Text style={styles.headerTitle}>奖励</Text>
      </View>

      <ScrollView style={styles.tabContent}>
        <View style={styles.crownSection}>
          <View style={styles.crownContainer}>
            <View style={styles.crownLeft}>
              <Image
                source={require("assets/images/crown.png")}
                style={styles.crownMainIcon}
              />
            </View>
            <View style={styles.crownRight}>
              <Text style={styles.crownTitle}>皇冠积分</Text>
              <Text style={styles.crownPoints}>{crownPoints} 皇冠</Text>
            </View>
          </View>
          <View style={styles.crownButtons}>
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => navigation.navigate("CrownHistory" as never)}
            >
              <Text style={styles.historyButtonText}>皇冠历史</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => navigation.navigate("ExchangeHistory" as never)}
            >
              <Text style={styles.historyButtonText}>兑换记录</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};