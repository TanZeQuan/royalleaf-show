// screens/Profile/SettingScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { removeItem } from "../../../utils/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingStackParamList } from "../../../navigation/stacks/SettingStack"; 

const { height: screenHeight } = Dimensions.get('window');

interface SettingScreenProps {
  onLogout: () => void;
}

interface Language {
  id: string;
  name: string;
  code: string;
}

const languages: Language[] = [
  { id: '1', name: '英文', code: 'en' },
  { id: '2', name: '简体中文', code: 'zh-CN' },
  { id: '3', name: '马来文', code: 'ms' },
];

export default function SettingScreen({ onLogout }: SettingScreenProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingStackParamList>>();
  
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const handleLogoutPress = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await removeItem("user");
          onLogout();
        },
      },
    ]);
  };

  const openLanguageModal = () => {
    setLanguageModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeLanguageModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setLanguageModalVisible(false);
    });
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    closeLanguageModal();
    // Here you would typically save the language preference
    Alert.alert("语言已更改", `已切换至${language.name}`);
  };

  const MenuItem = ({
    title,
    onPress,
    showValue,
  }: {
    title: string;
    onPress?: () => void;
    showValue?: string;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.menuText}>{title}</Text>
      <View style={styles.menuRight}>
        {showValue && <Text style={styles.menuValue}>{showValue}</Text>}
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F3F0" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>设置</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              title="编辑个人信息"
              onPress={() => navigation.navigate("SettingInfo")}
            />
            <MenuItem
              title="语言"
              onPress={openLanguageModal}
              showValue={selectedLanguage.name}
            />
            <MenuItem
              title="访问设置"
              onPress={() =>
                navigation.navigate("SettingAccess", {
                  imageId: 1,
                  category: "default",
                })
              }
            />
            <MenuItem
              title="删除账号"
              onPress={() =>
                navigation.navigate("SettingDelete", { voteId: "delete123" })
              }
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>支持</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              title="协议条款"
              onPress={() =>
                navigation.navigate("SettingTerm", { voteId: "term456" })
              }
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogoutPress}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>

      {/* Language Selection Modal */}
      <Modal
        transparent
        visible={languageModalVisible}
        animationType="fade"
        onRequestClose={closeLanguageModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeLanguageModal}
        />
        <Animated.View
          style={[
            styles.languageModal,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeLanguageModal}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>语言</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          {/* Language Options */}
          <View style={styles.languageList}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.id}
                style={styles.languageOption}
                onPress={() => handleLanguageSelect(language)}
                activeOpacity={0.7}
              >
                <Text style={styles.languageText}>{language.name}</Text>
                <View style={styles.checkboxContainer}>
                  {selectedLanguage.id === language.id ? (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  ) : (
                    <View style={styles.uncheckedBox} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={closeLanguageModal}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>提交</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F3F0" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F5F3F0",
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
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#333" },
  headerRight: { width: 40 },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  section: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 12,
    marginLeft: 4,
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  menuText: { fontSize: 16, color: "#333", flex: 1 },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuValue: {
    fontSize: 14,
    color: "#999",
    marginRight: 8,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 40,
    alignItems: "center",
  },
  logoutText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  languageModal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  modalHeaderSpacer: {
    width: 32,
  },
  languageList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  languageText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  uncheckedBox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#D0D0D0",
    borderRadius: 3,
  },
  confirmButton: {
    backgroundColor: "#D7A740",
    borderRadius: 25,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});