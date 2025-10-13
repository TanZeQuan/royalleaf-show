// RewardScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { colors } from "styles";
import { HomeStackParamList } from "../../../navigation/stacks/HomeNav/HomeStack";
import { convertToVoucher, fetchAllCoupons } from "../../../services/RewardService/RewardApi";
import { Voucher, HistoryItem } from "../../Home/Reward/RewardSlice";
import { styles } from "../../Home/Reward/RewardStyle";

type RewardScreenNavProp = NativeStackNavigationProp<HomeStackParamList, "Reward">;

export default function RewardScreen() {
  const navigation = useNavigation<RewardScreenNavProp>();

   // State Management
  const [activeTab, setActiveTab] = useState("redeem");
  const [voucherCode, setVoucherCode] = useState("");
  const [crownPoints, setCrownPoints] = useState(30);
  const [voucherToUse, setVoucherToUse] = useState<Voucher | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [myVouchers, setMyVouchers] = useState<Voucher[]>([]);
  const [expiredVouchers, setExpiredVouchers] = useState<Voucher[]>([]);
  const [crownHistory, setCrownHistory] = useState<HistoryItem[]>([]);
  const [exchangeHistory, setExchangeHistory] = useState<HistoryItem[]>([]);
  const [showExchangeConfirm, setShowExchangeConfirm] = useState(false);
  const [pendingExchange, setPendingExchange] = useState<{
    points: number;
    voucherCode: string;
    voucherValue: string;
    amount: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // 新增：获取可用优惠券
  useEffect(() => {
    if (activeTab === "redeem") {
      loadAvailableCoupons();
    }
  }, [activeTab]);

  const loadAvailableCoupons = async () => {
    try {
      setLoading(true);
      const coupons = await fetchAllCoupons();
      const convertedVouchers = coupons.map(convertToVoucher);
      setAvailableVouchers(convertedVouchers);
    } catch (error) {
      console.error('Failed to load coupons:', error);
      showCustomNotification("错误", "获取优惠券失败");
    } finally {
      setLoading(false);
    }
  };

  // 原有的 useLayoutEffect 保持不变
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

   const handleExchange = (
    points: number,
    voucherCode: string,
    voucherValue: string,
    amount: string
  ) => {
    if (crownPoints < points) {
      showCustomNotification("错误", "皇冠积分不足");
      return;
    }

    setPendingExchange({ points, voucherCode, voucherValue, amount });
    setShowExchangeConfirm(true);
  };

  const confirmExchange = () => {
    if (pendingExchange) {
      const { points, voucherCode, voucherValue, amount } = pendingExchange;

      setCrownPoints(crownPoints - points);
      setExchangeHistory([
        ...exchangeHistory,
        {
          id: Date.now(),
          item: voucherValue,
          date: new Date().toLocaleString(),
          points: `-${points}`,
          balance: crownPoints - points,
        },
      ]);
      setMyVouchers([
        ...myVouchers,
        {
          id: Date.now(),
          code: voucherCode,
          value: voucherValue,
          amount: amount,
          date: new Date().toLocaleString(),
          expired: false,
          status: "active",
        },
      ]);
      showCustomNotification("兑换成功", `您已成功兑换 ${voucherValue}`);
    }

    setShowExchangeConfirm(false);
    setPendingExchange(null);
  };

  const handleVoucherCardPress = (
    voucherCode: string,
    voucherValue: string,
    amount: string,
    pointsNeeded: number
  ) => {
    handleExchange(pointsNeeded, voucherCode, voucherValue, amount);
  };

  // 渲染优惠券左侧金额区域
  const renderVoucherAmount = (amount: string, expired: boolean = false) => (
    <ImageBackground
      source={require("assets/images/voucher.png")}
      style={[styles.amountContainer]}
      imageStyle={{ borderRadius: 8 }}
      resizeMode="contain"
    >
      <Text style={styles.currencySymbol}>RM {amount}</Text>
    </ImageBackground>
  );

   const renderRedeemTab = () => (
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

      <Text style={styles.sectionTitle}>兑换优惠券</Text>
      <TextInput
        style={styles.input}
        placeholder="请输入您的优惠券代码"
        placeholderTextColor={colors.gray_text}
        value={voucherCode}
        onChangeText={setVoucherCode}
        onBlur={() => {
          if (!voucherCode) {
            setVoucherCode("");
          }
        }}
      />
      <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
        <Text style={styles.redeemButtonText}>兑换</Text>
      </TouchableOpacity>

      <View style={styles.voucherContainer}>
        <Text style={styles.voucherTitle}>可用优惠券</Text>
        
        {loading ? (
          <Text style={styles.loadingText}>加载中...</Text>
        ) : availableVouchers.length > 0 ? (
          availableVouchers.map((voucher) => (
            <TouchableOpacity
              key={voucher.id}
              style={styles.voucherCard}
              onPress={() => handleVoucherCardPress(
                voucher.code, 
                voucher.value, 
                voucher.amount,
                voucher.pointsNeeded ?? 0
              )}
            >
              <View style={styles.voucherCardContent}>
                {renderVoucherAmount(voucher.amount)}
                <View style={styles.divider} />
                <View style={styles.voucherDetails}>
                  <Text style={styles.voucherCode}>{voucher.code}</Text>
                  <Text style={styles.voucherValue}>{voucher.value}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.pointsNeeded}>
                      {voucher.pointsNeeded ?? 0}{" "}
                    </Text>
                    <Image
                      source={require("assets/images/crown.png")}
                      style={styles.crown}
                    />
                  </View>
                  <Text style={styles.terms}>*条款与条件适用</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noRecords}>暂无可用优惠券</Text>
        )}
      </View>
    </ScrollView>
  );

   const renderMyVouchersTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.voucherContainer}>
        <Text style={styles.sectionTitle}>兑换优惠券</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入您的优惠券代码"
          placeholderTextColor={colors.gray_text}
          value={voucherCode}
          onChangeText={setVoucherCode}
          onBlur={() => {
            if (!voucherCode) {
              setVoucherCode("");
            }
          }}
        />
        <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
          <Text style={styles.redeemButtonText}>兑换</Text>
        </TouchableOpacity>
        <Text style={styles.voucherTitle}>我的优惠券</Text>
        {myVouchers.length > 0 ? (
          myVouchers.map((voucher) => (
            <View key={voucher.id} style={styles.voucherCard}>
              <TouchableOpacity
                style={styles.voucherCardContent}
                onPress={() => setVoucherToUse(voucher)}
              >
                {renderVoucherAmount(voucher.amount, voucher.expired)}
                <View style={styles.divider} />
                <View style={styles.voucherDetails}>
                  <Text style={styles.voucherCode}>{voucher.code}</Text>
                  <Text style={styles.voucherValue}>{voucher.value}</Text>
                  <Text style={styles.voucherDate}>*条款与条件适用</Text>
                  <View style={styles.useButton}>
                    <Text style={styles.useButtonText}>
                      {voucher.date}
                      {"\n"}立即使用
                    </Text>
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
          <View key={voucher.id} style={[styles.voucherCard]}>
            {voucher.expired && <View style={styles.overlay} />}
            <View style={styles.voucherCardContent}>
              {renderVoucherAmount(voucher.amount, true)}
              <View style={[styles.divider, styles.expiredDivider]} />
              <View style={styles.voucherDetails}>
                <Text style={styles.voucherCode}>{voucher.code}</Text>
                <Text style={styles.voucherValue}>{voucher.value}</Text>
                <Text style={styles.voucherDate}>{voucher.date}</Text>
                <Text style={styles.expiredText}>
                  {voucher.status === "used" ? "已使用" : "已过期"}
                </Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noRecords}>没有过期优惠券</Text>
      )}
    </ScrollView>
  );

   const [showNotification, setShowNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const showCustomNotification = (title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };


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

      <Modal
        visible={showNotification}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotification(false)}
      >
        <View style={styles.notificationOverlay}>
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationTitle}>{notificationTitle}</Text>
            <Text style={styles.notificationMessage}>
              {notificationMessage}
            </Text>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!voucherToUse}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVoucherToUse(null)}
      >
        <TouchableWithoutFeedback onPress={() => setVoucherToUse(null)}>
          <View style={styles.confirmOverlay}>
            <TouchableWithoutFeedback>
              {/* 阻止点击事件穿透到外层 */}
              <View style={styles.confirmContainer}>
                <Text style={styles.confirmTitle}>确认使用优惠券</Text>
                <Text style={styles.confirmMessage}>
                  您确定要使用 {voucherToUse?.code} ({voucherToUse?.value}) 吗？
                </Text>
                <View style={styles.confirmButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setVoucherToUse(null)}
                  >
                    <Text style={styles.cancelButtonText}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => {
                      if (voucherToUse) {
                        setMyVouchers(
                          myVouchers.filter((v) => v.id !== voucherToUse.id)
                        );
                        setExpiredVouchers([
                          ...expiredVouchers,
                          { ...voucherToUse, expired: true, status: "used" },
                        ]);
                        showCustomNotification(
                          "提示",
                          `${voucherToUse.code} 已使用`
                        );
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

      <Modal
        visible={showExchangeConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExchangeConfirm(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowExchangeConfirm(false)}>
          <View style={styles.confirmOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.confirmContainer}>
                <Text style={styles.confirmTitle}>确认兑换</Text>
                <Text style={styles.confirmMessage}>
                  你好，你想要兑换这个优惠券吗？
                </Text>
                {pendingExchange && (
                  <Text style={styles.confirmNote}>
                    {pendingExchange.voucherValue} - {pendingExchange.points}{" "}
                    皇冠积分
                  </Text>
                )}
                <View style={styles.confirmButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowExchangeConfirm(false)}
                  >
                    <Text style={styles.cancelButtonText}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmExchange}
                  >
                    <Text style={styles.confirmButtonText}>确认</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

       <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "redeem" && styles.activeTab]}
          onPress={() => setActiveTab("redeem")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "redeem" && styles.activeTabText,
            ]}
          >
            兑换
          </Text>
          {activeTab === "redeem" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "myVouchers" && styles.activeTab]}
          onPress={() => setActiveTab("myVouchers")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "myVouchers" && styles.activeTabText,
            ]}
          >
            我的优惠券
          </Text>
          {activeTab === "myVouchers" && (
            <View style={styles.activeIndicator} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "expired" && styles.activeTab]}
          onPress={() => setActiveTab("expired")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "expired" && styles.activeTabText,
            ]}
          >
            过期优惠券
          </Text>
          {activeTab === "expired" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      {activeTab === "redeem" && renderRedeemTab()}
      {activeTab === "myVouchers" && renderMyVouchersTab()}
      {activeTab === "expired" && renderExpiredVouchersTab()}
    </View>
  );
}
