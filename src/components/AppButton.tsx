import React, { useState, useRef, useEffect } from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  View,
  Text,
  FlatList,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppButton() {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const insets = useSafeAreaInsets();

  // Heartbeat animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Modal fade+scale animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (showTaskModal) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [showTaskModal]);

  const tasks = [
    { id: "1", title: "日常登录", reward: "10" },
    { id: "2", title: "参与投票（完成评论）", reward: "50" },
    { id: "3", title: "投稿作品（审核通过）", reward: "200" },
    { id: "4", title: "作品获票（每10票）", reward: "10" },
    { id: "5", title: "分享作品至社交平台", reward: "10" },
  ];

  return (
    <>
      {/* Floating Button */}
      <SafeAreaView pointerEvents="box-none" style={{ flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowTaskModal(true)}
          style={[
            styles.giftButton,
            {
              bottom: 60 + insets.bottom,
              right: 20 + insets.right,
              zIndex: 9999,
            },
          ]}
        >
          <Animated.View
            style={{ transform: [{ scale: pulseAnim }], pointerEvents: "auto" }}
          >
            <Image
              source={require("assets/icons/login-checklist.png")}
              style={styles.giftIcon}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>
      </SafeAreaView>


      {/* Modal */}
      <Modal
        transparent
        visible={showTaskModal}
        animationType="none"
        onRequestClose={() => setShowTaskModal(false)}
      >
        <View
          style={styles.modalOverlay}
          pointerEvents={showTaskModal ? "auto" : "none"}
        >
          <Animated.View
            style={[
              styles.modalCard,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.modalTitle}>日常任务</Text>

            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.taskRow}>
                  <Text style={styles.taskText}>{item.title}</Text>
                  <View style={styles.rewardBox}>
                    <Text style={styles.rewardText}>{item.reward}</Text>
                    <Image
                      source={require("assets/icons/crown.png")}
                      style={styles.crownIcon}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTaskModal(false)}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  giftButton: {
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: "#E1C16E",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  giftIcon: { width: 35, height: 35, tintColor: "#000" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff8e7",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    maxHeight: "70%",
    elevation: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 15, color: "#333" },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskText: { fontSize: 15, color: "#444" },
  rewardBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  rewardText: { fontSize: 14, fontWeight: "bold", marginRight: 5, color: "#333" },
  crownIcon: { width: 18, height: 18, tintColor: "#E1C16E" },
  closeButton: {
    alignSelf: "center",
    marginTop: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  closeText: { fontSize: 22, color: "#444" },
});
