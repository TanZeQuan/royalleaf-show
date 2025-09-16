import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingStackParamList } from "../../../navigation/stacks/SettingStack";

type DeleteAccRouteProp = RouteProp<SettingStackParamList, "SettingDelete">;

export default function DeleteAccScreen() {
  const route = useRoute<DeleteAccRouteProp>();
  const navigation = useNavigation();
  const { voteId } = route.params;

  const handleDelete = () => {
    Alert.alert("删除账号", `账号 ID ${voteId} 将被删除！`);
    // TODO: 调用删除 API
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
        <Text style={styles.headerTitle}>删除账号</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Content */}
      <View style={styles.card}>
        <Text style={styles.infoText}>
          当您删除与 xxxxxxx 关联的帐户时，以下信息将被永久删除且无法恢复。
        </Text>

        <View style={styles.list}>
          {[
            "个人信息",
            "订单信息",
            "订单记录",
            "发票信息",
            "所有未用的优惠券",
            "优惠码信息",
            "天分聊伴数据",
            "会员权益",
            "所有未用星冠",
          ].map((item, index) => (
            <Text key={index} style={styles.listItem}>
              {item}
            </Text>
          ))}
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>删除</Text>
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
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C2C2C",
  },
  card: {
    margin: 20,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50", // 绿色边框
    backgroundColor: "#fff",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
    lineHeight: 20,
  },
  list: {
    marginBottom: 20,
  },
  listItem: {
    fontSize: 14,
    color: "#4CAF50", // 绿色文字
    textAlign: "center",
    marginVertical: 2,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
  },
});
