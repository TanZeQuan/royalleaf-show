import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingStackParamList } from "navigation/stacks/ProfileNav/SettingStack";

type TermAgreeRouteProp = RouteProp<SettingStackParamList, "SettingTerm">;

export default function TermAgreeScreen() {
  const route = useRoute<TermAgreeRouteProp>();
  const navigation = useNavigation();
  const { voteId } = route.params;

  const handlePress = (type: string) => {
    // TODO: 导航到详情页面
    console.log(`进入 ${type} 页面, VoteId: ${voteId}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#2C2C2C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>协议条款</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => handlePress("隐私协议")}
        >
          <Text style={styles.cardText}>隐私协议</Text>
          <Ionicons name="chevron-forward" size={18} color="#2C2C2C" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => handlePress("用户协议")}
        >
          <Text style={styles.cardText}>用户协议</Text>
          <Ionicons name="chevron-forward" size={18} color="#2C2C2C" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F5EC", // 背景米色
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9F5EC",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(215, 167, 64, 0.1)",
  },
  backButton: {
    width: 35,
    height: 35,
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
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C2C2C",
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(76,175,80,0.3)", // 淡绿色描边
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 15,
    color: "#2C2C2C",
  },
});
