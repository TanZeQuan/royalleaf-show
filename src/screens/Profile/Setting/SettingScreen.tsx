// screens/Profile/SettingScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { removeItem } from "../../../utils/storage"; // 你的 storage 工具

interface SettingScreenProps {
  onLogout: () => void;
}

export default function SettingScreen({ onLogout }: SettingScreenProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleLogoutPress = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            // 清除本地存储
            await removeItem("user"); 
            // 调用父组件传入的登出函数
            onLogout();
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Go Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutPress}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
  },
  backText: { color: "#fff", fontWeight: "bold" },
  title: { fontSize: 24, marginBottom: 20 },
  logoutBtn: { backgroundColor: "#f44336", padding: 15, borderRadius: 8 },
  logoutText: { color: "#fff", fontWeight: "bold" },
});
