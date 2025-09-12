import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonAnimation from "../../components/AppButton";
import { typography, colors } from "styles"; // ✅ 用统一字体 & 颜色

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Settings Button */}
        <View style={styles.settingContainer}>
          <TouchableOpacity style={styles.settingsButton}>
            <Image
              source={require("../../assets/icons/profile-setting.png")}
              style={styles.settingsIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require("../../assets/icons/profile-avatar.png")}
                style={styles.profileImage}
              />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.username}>XXXXX</Text>
              <Text style={styles.userId}>0000000000</Text>
            </View>

            <TouchableOpacity style={styles.scanButton}>
              <Image
                source={require("../../assets/icons/profile-scan.png")}
                style={styles.scanIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0.00</Text>
              <Text style={styles.statLabel}>余额情况</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>30</Text>
              <Text style={styles.statLabel}>积分</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Image
                source={require("../../assets/icons/profile-setting.png")}
                style={styles.walletIcon}
              />
              <Text style={styles.statLabel}>钱包</Text>
            </View>
          </View>
        </View>

        {/* Feature Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.card}>
              <ImageBackground
                source={require("../../assets/images/profile-card-bg.png")}
                style={styles.cardBackground}
                imageStyle={{ borderRadius: 8 }}
              >
                <Image
                  source={require("assets/icons/home-story.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>OUR STORY</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <ImageBackground
                source={require("../../assets/images/profile-card-bg.png")}
                style={styles.cardBackground}
                imageStyle={{ borderRadius: 8 }}
              >
                <Image
                  source={require("../../assets/icons/home-location.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>STORE LOCATION</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.card}>
              <ImageBackground
                source={require("../../assets/images/profile-card-bg.png")}
                style={styles.cardBackground}
                imageStyle={{ borderRadius: 8 }}
              >
                <Image
                  source={require("../../assets/icons/home-crown.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>CROWN</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <ImageBackground
                source={require("../../assets/images/profile-card-bg.png")}
                style={styles.cardBackground}
                imageStyle={{ borderRadius: 8 }}
              >
                <Image
                  source={require("../../assets/icons/home-refferal.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>REFER A FRIEND</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Gift Button */}
      <ButtonAnimation />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F6F4" },

  settingContainer: { alignItems: "flex-end", padding: 18 },
  settingsButton: { width: 36, height: 36 },
  settingsIcon: { width: 28, height: 28, resizeMode: "contain" },

  profileSection: { paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10 },
  profileRow: { flexDirection: "row", alignItems: "center" },
  profileImageContainer: { marginRight: 15 },
  profileImage: { width: 100, height: 100, borderRadius: 30, resizeMode: "cover" },
  profileInfo: { flex: 1 },
  username: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 3 },
  userId: { fontSize: 14, color: "#888" },
  scanButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  scanIcon: { width: 35, height: 35, resizeMode: "contain" },

  statsContainer: { paddingHorizontal: 20, marginBottom: 20 },
  statsSection: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 6,
    paddingVertical: 20,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 4 },
  statLabel: { fontSize: 12, color: "#999" },
  statDivider: { width: 1, backgroundColor: "#E5E5E5", marginVertical: 8 },
  walletIcon: { width: 24, height: 24, resizeMode: "contain", marginBottom: 4 },

  cardsContainer: { width: screenWidth, paddingHorizontal: 15 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },
  card: { flex: 0.69, overflow: "hidden", height: 180 },
  cardBackground: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 20 },
  cardIcon: { width: 60, height: 60, resizeMode: "contain", marginBottom: 15 },
  cardTitle: { ...typography.caption, textAlign: "center" },
  cardGreen: { backgroundColor: colors.green },
});
