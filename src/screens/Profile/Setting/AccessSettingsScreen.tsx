import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingStackParamList } from "../../../navigation/stacks/SettingStack";

type AccessSettingsRouteProp = RouteProp<SettingStackParamList, "SettingAccess">;

interface AccessSetting {
  id: string;
  title: string;
  description: string;
  isEnabled: boolean;
  hasToggle: boolean;
}

export default function AccessSettingsScreen() {
  const route = useRoute<AccessSettingsRouteProp>();
  const navigation = useNavigation();
  const { imageId, category } = route.params;

  const [settings, setSettings] = useState<AccessSetting[]>([
    {
      id: "location",
      title: "地点",
      description:
        "关于您所在地区的位置以及周边信息等，以便我们为您匹配的商品",
      isEnabled: true,
      hasToggle: true,
    },
    {
      id: "camera",
      title: "相机",
      description:
        "我们会从设备中获取照片来显示在文档中运行服务器，并传一些对应功能",
      isEnabled: true,
      hasToggle: true,
    },
    {
      id: "period",
      title: "时间",
      description: "请确保您之间的使用的隐私，确保上千万的隐私。",
      isEnabled: true,
      hasToggle: true,
    },
    {
      id: "notification",
      title: "通知",
      description:
        "允许您收到提升和产品有关的其他信息，当我们拥有您的网络信息每次都会都会隐私",
      isEnabled: false,
      hasToggle: false,
    },
  ]);

  const SettingItem = ({ setting }: { setting: AccessSetting }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <View style={styles.settingHeader}>
          <Text style={styles.settingTitle}>{setting.title}</Text>
          {setting.hasToggle ? (
            <View style={styles.toggleContainer}>
              <Text style={styles.statusText}>
                {setting.isEnabled ? "已启用" : "已关闭"}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </View>
          ) : (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>进入设置</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.settingDescription}>{setting.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F5EC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#2C2C2C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>访问设置</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Settings List */}
        <View style={styles.settingsList}>
          {settings.map((setting) => (
            <SettingItem key={setting.id} setting={setting} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F5EC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
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
    fontSize: 18,
    fontWeight: "600",
    color: "#2C2C2C",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 34,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 30,
  },
  settingsList: {
    paddingHorizontal: 20,
  },
  settingItem: {
    backgroundColor: "#fff",
    marginBottom: 16, // 间距更宽松
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 12, // 卡片圆角
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // Android 阴影
  },
  settingContent: {
    flex: 1,
  },
  settingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C2C2C",
    flex: 1,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    color: "#999",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    color: "#999",
  },
  settingDescription: {
    fontSize: 13,
    color: "#999",
    lineHeight: 18,
    marginTop: 4,
  },
});
