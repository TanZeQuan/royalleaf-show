import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { colors } from "styles";
import { styles } from "../../Home/Reward/RewardStyle";
import { Voucher } from "../../Home/Reward/RewardSlice";
import { HomeStackParamList } from "../../../navigation/stacks/HomeStack";

type RewardScreenNavProp = NativeStackNavigationProp<HomeStackParamList, "Reward">;

export default function RewardScreen() {
  const navigation = useNavigation<RewardScreenNavProp>();

  // State
  const [activeTab, setActiveTab] = useState<"redeem" | "myVouchers" | "expired">("redeem");
  const [voucherCode, setVoucherCode] = useState("");
  const [crownPoints, setCrownPoints] = useState(30);
  const [voucherToUse, setVoucherToUse] = useState<Voucher | null>(null);

  const [myVouchers, setMyVouchers] = useState<Voucher[]>([
    { id: 1, code: "折扣券", value: "RM 5", amount: "5", date: "13/07/2025", expired: false, status: "active" },
    { id: 2, code: "折扣券", value: "RM 10", amount: "10", date: "13/07/2025", expired: false, status: "active" },
  ]);

  const [expiredVouchers, setExpiredVouchers] = useState<Voucher[]>([
    { id: 3, code: "过期券", value: "RM 10", amount: "5", date: "01/01/2024", expired: true, status: "expired" },
  ]);

  // Notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  // Helpers
  const showCustomNotification = (title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleRedeem = () => {
    if (!voucherCode) {
      showCustomNotification("错误", "请输入优惠券代码");
      return;
    }

    showCustomNotification("兑换成功", `您已成功兑换优惠券: ${voucherCode}`);
    setMyVouchers([
      ...myVouchers,
      {
        id: Date.now(),
        code: voucherCode,
        value: `${voucherCode}折扣券`,
        amount: voucherCode.replace("RM", ""),
        date: new Date().toLocaleString(),
        expired: false,
        status: "active",
      },
    ]);
    setVoucherCode("");
  };

  const handleExchange = (points: number, voucherCode: string, voucherValue: string, amount: string) => {
    if (crownPoints < points) {
      showCustomNotification("错误", "皇冠积分不足");
      return;
    }

    Alert.alert("确认兑换", `您想要兑换 ${voucherValue} 吗？`, [
      { text: "取消", style: "cancel" },
      {
        text: "确认",
        onPress: () => {
          setCrownPoints(crownPoints - points);
          setMyVouchers([
            ...myVouchers,
            { id: Date.now(), code: voucherCode, value: voucherValue, amount, date: new Date().toLocaleString(), expired: false, status: "active" },
          ]);
          showCustomNotification("兑换成功", `您已成功兑换 ${voucherValue}`);
        },
      },
    ]);
  };

  const handleVoucherCardPress = (voucherCode: string, voucherValue: string, amount: string) => {
    const pointsNeeded = voucherCode === "RM 5" ? 100 : voucherCode === "RM 10" ? 180 : 50;
    handleExchange(pointsNeeded, voucherCode, voucherValue, amount);
  };

  const renderVoucherAmount = (amount: string, expired: boolean = false) => (
    <ImageBackground
      source={require("assets/images/voucher.png")}
      style={styles.amountContainer}
      imageStyle={{ borderRadius: 8 }}
      resizeMode="contain"
    >
      <Text style={styles.currencySymbol}>RM {amount}</Text>
    </ImageBackground>
  );

  // Tabs
  const renderRedeemTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>兑换优惠券</Text>
      <TextInput
        style={styles.input}
        placeholder="请输入您的优惠券代码"
        placeholderTextColor={colors.gray_text}
        value={voucherCode}
        onChangeText={setVoucherCode}
      />
      <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
        <Text style={styles.redeemButtonText}>兑换</Text>
      </TouchableOpacity>

      <View style={styles.voucherContainer}>
        <Text style={styles.voucherTitle}>可用优惠券</Text>
        <TouchableOpacity style={styles.voucherCard} onPress={() => handleVoucherCardPress("RM 5", "RM 5 折扣券", "5")}>
          <View style={styles.voucherCardContent}>
            {renderVoucherAmount("5")}
            <View style={styles.divider} />
            <View style={styles.voucherDetails}>
              <Text style={styles.voucherCode}>折扣券</Text>
              <Text style={styles.voucherValue}>RM 5</Text>
              <Text style={styles.pointsNeeded}>100 皇冠兑换</Text>
              <Text style={styles.terms}>*条款与条件适用</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.voucherCard} onPress={() => handleVoucherCardPress("RM 10", "RM 10 折扣券", "10")}>
          <View style={styles.voucherCardContent}>
            {renderVoucherAmount("10")}
            <View style={styles.divider} />
            <View style={styles.voucherDetails}>
              <Text style={styles.voucherCode}>折扣券</Text>
              <Text style={styles.voucherValue}>RM 10</Text>
              <Text style={styles.pointsNeeded}>180 皇冠兑换</Text>
              <Text style={styles.terms}>*条款与条件适用</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderMyVouchersTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.voucherContainer}>
        <Text style={styles.voucherTitle}>我的优惠券</Text>
        {myVouchers.length > 0 ? (
          myVouchers.map((voucher) => (
            <View key={voucher.id} style={styles.voucherCard}>
              <TouchableOpacity style={styles.voucherCardContent} onPress={() => setVoucherToUse(voucher)}>
                {renderVoucherAmount(voucher.amount, voucher.expired)}
                <View style={styles.divider} />
                <View style={styles.voucherDetails}>
                  <Text style={styles.voucherCode}>{voucher.code}</Text>
                  <Text style={styles.voucherValue}>{voucher.value}</Text>
                  <Text style={styles.voucherDate}>{voucher.date}</Text>
                  <View style={styles.useButton}>
                    <Text style={styles.useButtonText}>立即使用</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noRecords}>没有优惠券</Text>
        )}
      </View>
    </ScrollView>
  );

  const renderExpiredVouchersTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>过期优惠券</Text>
      {expiredVouchers.length > 0 ? (
        expiredVouchers.map((voucher) => (
          <View key={voucher.id} style={styles.voucherCard}>
            {voucher.expired && <View style={styles.overlay} />}
            <View style={styles.voucherCardContent}>
              {renderVoucherAmount(voucher.amount, true)}
              <View style={[styles.divider, styles.expiredDivider]} />
              <View style={styles.voucherDetails}>
                <Text style={styles.voucherCode}>{voucher.code}</Text>
                <Text style={styles.voucherValue}>{voucher.value}</Text>
                <Text style={styles.voucherDate}>{voucher.date}</Text>
                <Text style={styles.expiredText}>{voucher.status === "used" ? "已使用" : "已过期"}</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noRecords}>没有过期优惠券</Text>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>奖励</Text>
      </View>

      {/* Notifications */}
      <Modal visible={showNotification} transparent animationType="fade">
        <View style={styles.notificationOverlay}>
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationTitle}>{notificationTitle}</Text>
            <Text style={styles.notificationMessage}>{notificationMessage}</Text>
          </View>
        </View>
      </Modal>

      {/* Voucher Confirm */}
      <Modal visible={!!voucherToUse} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVoucherToUse(null)}>
          <View style={styles.confirmOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.confirmContainer}>
                <Text style={styles.confirmTitle}>确认使用优惠券</Text>
                <Text style={styles.confirmMessage}>
                  您确定要使用 {voucherToUse?.code} ({voucherToUse?.value}) 吗？
                </Text>
                <View style={styles.confirmButtons}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setVoucherToUse(null)}>
                    <Text style={styles.cancelButtonText}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => {
                      if (voucherToUse) {
                        setMyVouchers(myVouchers.filter((v) => v.id !== voucherToUse.id));
                        setExpiredVouchers([...expiredVouchers, { ...voucherToUse, expired: true, status: "used" }]);
                        showCustomNotification("提示", `${voucherToUse.code} 已使用`);
                        setVoucherToUse(null);
                      }
                    }}
                  >
                    <Text style={styles.confirmButtonText}>确认</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {["redeem", "myVouchers", "expired"].map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab as any)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === "redeem" ? "兑换" : tab === "myVouchers" ? "我的优惠券" : "过期优惠券"}
            </Text>
            {activeTab === tab && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === "redeem" && renderRedeemTab()}
      {activeTab === "myVouchers" && renderMyVouchersTab()}
      {activeTab === "expired" && renderExpiredVouchersTab()}
    </View>
  );
}
