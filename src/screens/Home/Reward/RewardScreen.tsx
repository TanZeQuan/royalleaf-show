// RewardScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useLayoutEffect, useState } from "react";
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
import { Voucher } from "../../Home/Reward/RewardSlice";
import { styles } from "../../Home/Reward/RewardStyle";

type RewardScreenNavProp = NativeStackNavigationProp<HomeStackParamList, "Reward">;
export default function RewardScreen() {
  const navigation = useNavigation<RewardScreenNavProp>();

  // State Management
  const [activeTab, setActiveTab] = useState("redeem");
  const [voucherCode, setVoucherCode] = useState("");
  const [crownPoints, setCrownPoints] = useState(30);
  const [voucherToUse, setVoucherToUse] = useState<Voucher | null>(null);
  const [myVouchers, setMyVouchers] = useState([
    {
      id: 1,
      code: "折扣券",
      value: "RM 5",
      amount: "5",
      date: "13/07/2025",
      expired: false,
      status: "active",
    },
    {
      id: 2,
      code: "折扣券",
      value: "RM 10",
      amount: "10",
      date: "13/07/2025",
      expired: false,
      status: "active",
    },
  ]);
  const [expiredVouchers, setExpiredVouchers] = useState<Voucher[]>([
    {
      id: 3,
      code: "过期券",
      value: "RM 10",
      amount: "5",
      date: "01/01/2024",
      expired: true,
      status: "expired",
    },
  ]);
  const [crownHistory, setCrownHistory] = useState([
    {
      id: 1,
      action: "参与投票",
      date: "13/07/2025",
      points: "+50",
      balance: 30,
    },
  ]);
  const [exchangeHistory, setExchangeHistory] = useState([
    {
      id: 1,
      item: "RM 5折扣券",
      date: "13/07/2025",
      points: "-100",
      balance: 30,
    },
  ]);
  const [showExchangeConfirm, setShowExchangeConfirm] = useState(false);
  const [pendingExchange, setPendingExchange] = useState<{
    points: number;
    voucherCode: string;
    voucherValue: string;
    amount: string;
  } | null>(null);

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          backgroundColor: "#F9F5EC",
          height: 80,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 10 : 8, // 调小底部间距
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

    // 设置待兑换的信息并显示确认弹窗
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

    // 重置状态
    setShowExchangeConfirm(false);
    setPendingExchange(null);
  };

  const handleVoucherCardPress = (
    voucherCode: string,
    voucherValue: string,
    amount: string
  ) => {
    // 根据优惠券代码确定需要的积分
    let pointsNeeded = 0;
    if (voucherCode === "RM 5") {
      pointsNeeded = 100;
    } else if (voucherCode === "RM 10") {
      pointsNeeded = 180;
    } else {
      pointsNeeded = 50; // 默认值
    }

    handleExchange(pointsNeeded, voucherCode, voucherValue, amount);
  };

  // 渲染优惠券左侧金额区域
  const renderVoucherAmount = (amount: string, expired: boolean = false) => (
    <ImageBackground
      source={require("assets/images/voucher.png")}
      style={[styles.amountContainer]}
      // style={[styles.amountContainer, expired && styles.expiredAmountContainer]}
      imageStyle={{ borderRadius: 8 }}
      resizeMode="contain" // 保持比例缩小
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
            setVoucherCode(""); // 确保 placeholder 回来
          }
        }}
      />
      <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
        <Text style={styles.redeemButtonText}>兑换</Text>
      </TouchableOpacity>

      <View style={styles.voucherContainer}>
        <Text style={styles.voucherTitle}>可用优惠券</Text>
        <TouchableOpacity
          style={styles.voucherCard}
          onPress={() => handleVoucherCardPress("RM 5", "RM 5 折扣券", "5")}
        >
          <View style={styles.voucherCardContent}>
            {renderVoucherAmount("5")}
            <View style={styles.divider} />
            <View style={styles.voucherDetails}>
              <Text style={styles.voucherCode}>折扣券</Text>
              <Text style={styles.voucherValue}>RM 5</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.pointsNeeded}>100 </Text>
                <Image
                  source={require("assets/images/crown.png")}
                  style={styles.crown}
                />
              </View>
              <Text style={styles.terms}>*条款与条件适用</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.voucherCard}
          onPress={() => handleVoucherCardPress("RM10", "RM10 折扣券", "10")}
        >
          <View style={styles.voucherCardContent}>
            {renderVoucherAmount("10")}
            <View style={styles.divider} />
            <View style={styles.voucherDetails}>
              <Text style={styles.voucherCode}>折扣券</Text>
              <Text style={styles.voucherValue}>RM 10</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.pointsNeeded}>100 </Text>
                <Image
                  source={require("assets/images/crown.png")}
                  style={styles.crown}
                />
              </View>
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
        <Text style={styles.sectionTitle}>兑换优惠券</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入您的优惠券代码"
          placeholderTextColor={colors.gray_text}
          value={voucherCode}
          onChangeText={setVoucherCode}
          onBlur={() => {
            if (!voucherCode) {
              setVoucherCode(""); // 确保 placeholder 回来
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
                {/* <View style={styles.voucherCardContent}> */}
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
            {/* 遮罩层 */}
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

    // 3秒后自动关闭
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
};
