import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography, colors } from "styles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { WalletStackParamList } from "../../../navigation/stacks/WalletStack";
import { Platform, StatusBar } from "react-native";
import { useHideTabBar } from "hooks/useHideTabBar";


const { width } = Dimensions.get("window");
type WalletNavProp = NativeStackNavigationProp<
  WalletStackParamList,
  "WalletScreen"
>;

const WalletApp = () => {
  const navigation = useNavigation<WalletNavProp>();

  const [balance, setBalance] = useState(0.0);
  const [activeTab, setActiveTab] = useState("all");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showAmountError, setShowAmountError] = useState(false);
  const [showPaymentError, setShowPaymentError] = useState(false);

  // ✅ 自动隐藏底部导航栏
  useHideTabBar(true);
  // 模拟交易记录数据
  const transactions = [];

  // 日期选择器组件
  const renderDatePicker = () => {
    if (!showDatePicker) return null;

    const daysInMonth = new Date(2025, 8, 0).getDate(); // 2025年9月的天数
    const firstDayOfMonth = new Date(2025, 7, 1).getDay(); // 2025年9月1日是周几

    const days = [];
    // 添加空白占位符
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // 添加日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.calendarDay,
            i === selectedDate.getDate() && styles.selectedDay,
          ]}
          onPress={() => {
            setSelectedDate(new Date(2025, 7, i));
            setShowDatePicker(false);
          }}
        >
          <Text
            style={
              i === selectedDate.getDate()
                ? styles.selectedDayText
                : styles.dayText
            }
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <Modal visible={showDatePicker} animationType="none" transparent>
        <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>日期选择</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Ionicons name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>

                <View style={styles.calendarHeader}>
                  <Text style={styles.monthText}>2025年9月</Text>
                </View>

                <View style={styles.weekDays}>
                  <Text style={styles.weekDay}>日</Text>
                  <Text style={styles.weekDay}>一</Text>
                  <Text style={styles.weekDay}>二</Text>
                  <Text style={styles.weekDay}>三</Text>
                  <Text style={styles.weekDay}>四</Text>
                  <Text style={styles.weekDay}>五</Text>
                  <Text style={styles.weekDay}>六</Text>
                </View>

                <View style={styles.calendarGrid}>{days}</View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const closeRechargeModal = () => {
    setShowRecharge(false);
    setRechargeAmount(""); // 清空充值金额
    setShowAmountError(false); // 清空错误状态
    setShowPaymentError(false); // 清空支付方式错误状态
    setPaymentMethod(""); // 清空支付方式选择
  };

  // 充值模态框
  const renderRechargeModal = () => {
    if (!showRecharge) return null;

    return (
      <Modal visible={showRecharge} animationType="none" transparent>
        <TouchableWithoutFeedback onPress={closeRechargeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>充值</Text>
                  <TouchableOpacity onPress={closeRechargeModal}>
                    <Ionicons name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>

                <View style={styles.rechargeSection}>
                  <Text style={styles.rechargeLabel}>RM</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={rechargeAmount}
                    onChangeText={(text) => {
                      // 使用正则表达式验证：可选负号、数字、可选小数点后最多两位
                      if (/^-?\d*\.?\d{0,2}$/.test(text)) {
                        setRechargeAmount(text);
                      } else if (text === "") {
                        setRechargeAmount("");
                      }

                      if (showAmountError) setShowAmountError(false);
                    }}
                    keyboardType="decimal-pad"
                    placeholder="输入金额"
                    returnKeyType="done"
                  />
                </View>

                {showAmountError && (
                  <Text style={styles.errorText}>请输入充值金额</Text>
                )}

                <Text style={styles.rangeText}>充值范围: RM 1 - RM 30,000</Text>

                <View style={styles.paymentMethods}>
                  <TouchableOpacity
                    style={[
                      styles.paymentMethod,
                      paymentMethod === "card" && styles.selectedPayment,
                    ]}
                    onPress={() => {
                      setPaymentMethod("card");
                      if (showPaymentError) setShowPaymentError(false);
                    }}
                  >
                    <Text>Credit / debit card</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.paymentMethod,
                      paymentMethod === "tng" && styles.selectedPayment,
                    ]}
                    onPress={() => {
                      setPaymentMethod("tng");
                      if (showPaymentError) setShowPaymentError(false);
                    }}
                  >
                    <Text>Touch 'n Go</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.paymentMethod,
                      paymentMethod === "grab" && styles.selectedPayment,
                    ]}
                    onPress={() => {
                      setPaymentMethod("grab");
                      if (showPaymentError) setShowPaymentError(false);
                    }}
                  >
                    <Text>GrabPay</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.paymentMethod,
                      paymentMethod === "fpx" && styles.selectedPayment,
                    ]}
                    onPress={() => {
                      setPaymentMethod("fpx");
                      if (showPaymentError) setShowPaymentError(false);
                    }}
                  >
                    <Text>FPX</Text>
                  </TouchableOpacity>
                </View>

                {showPaymentError && (
                  <Text style={styles.errorText}>请选择支付方式</Text>
                )}

                <TouchableOpacity
                  style={styles.rechargeButton}
                  onPress={() => {
                    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
                      setShowAmountError(true);
                      return;
                    }

                    // 添加支付方式验证
                    if (!paymentMethod) {
                      setShowPaymentError(true);
                      return;
                    }

                    // 这里处理充值逻辑
                    // 充值成功后关闭模态框并清空数据
                    closeRechargeModal();
                  }}
                >
                  <Text style={styles.rechargeButtonText}>确认充值</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* 顶部装饰性图像 */}
      {/* 顶部装饰性图像 */}
      <View style={styles.topDecoration}>
        <Image
          source={require("assets/images/walletbg.png")}
          style={styles.bannerImage}
          resizeMode="cover"
        />

        {/* 返回按钮 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>


      {/* 余额显示 */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>钱包结余</Text>
        <Text style={styles.balanceAmount}>RM {balance.toFixed(2)}</Text>
        <View style={styles.balanceUnderline}></View>
      </View>

      {/* 交易记录标题和筛选 */}
      <View style={styles.transactionHeader}>
        <Text style={styles.sectionTitle}>转账记录</Text>
        <View style={styles.filterSection}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeTab === "all" && styles.activeFilterButton,
            ]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={
                activeTab === "all"
                  ? styles.activeFilterText
                  : styles.inactiveFilterText
              }
            >
              所有类型
            </Text>
          </TouchableOpacity>
          <View style={styles.filterSeparator}></View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inactiveFilterText}>所有日期</Text>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.black}
              style={styles.calendarIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 交易记录内容 */}
      <ScrollView style={styles.transactionContent}>
        {transactions.length === 0 ? (
          <View style={styles.noRecords}>
            <Ionicons
              name="receipt-outline"
              size={60}
              color={colors.gold_deep}
            />
            <Text style={styles.noRecordsText}>没有记录</Text>
            {balance === 0 && (
              <Text style={styles.insufficientText}>
                抱歉，您的钱包余额不足
              </Text>
            )}
          </View>
        ) : (
          // 这里渲染交易记录列表
          <Text>交易记录将在这里显示</Text>
        )}
      </ScrollView>

      {/* 底部操作按钮 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.payButton]}>
          <Ionicons
            name="qr-code-outline"
            size={20}
            color={colors.black}
          />
          <Text style={styles.payButtonText}>店内付款</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.rechargeBtn]}
          onPress={() => setShowRecharge(true)}
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color={colors.black}
          />
          <Text style={styles.rechargeBtnText}>充值</Text>
        </TouchableOpacity>
      </View>

      {/* 日期选择器模态框 */}
      {renderDatePicker()}

      {/* 充值模态框 */}
      {renderRechargeModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 0,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary_bg,
  },
  topDecoration: {
    height: 210,
    backgroundColor: colors.primary_bg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 20) + 10,
    left: 15,
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

  bannerImage: {
    width: "100%",
    height: "100%",
    // opacity: 0.3,
  },
  balanceSection: {
    backgroundColor: colors.white,
    marginHorizontal: 40,
    marginTop: -90,
    marginBottom: 10,
    borderRadius: 20,
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.green_deep,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 15,
    color: colors.gray_text,
    marginBottom: 10,
    fontWeight: "500",
  },
  balanceAmount: {
    marginBottom: 5,
    fontSize: 35,
    fontWeight: "bold",
    color: colors.black,
  },
  balanceUnderline: {
    width: 40,
    height: 3,
    backgroundColor: colors.gold_deep,
    borderRadius: 2,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },
  filterSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold_light,
    borderRadius: 20,
    padding: 4,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  activeFilterButton: {
    backgroundColor: colors.gold_deep,
    borderRadius: 20,
  },
  activeFilterText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: "500",
  },
  inactiveFilterText: {
    color: colors.black,
    fontSize: 12,
  },
  filterSeparator: {
    width: 1,
    height: 16,
    marginLeft: 5,
    backgroundColor: colors.gold_deep,
  },
  calendarIcon: {
    marginLeft: 4,
  },
  transactionContent: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 10,
  },
  noRecords: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: 50,
  },
  noRecordsText: {
    fontSize: 16,
    color: colors.gold_deep,
    marginTop: 10,
    marginBottom: 5,
  },
  insufficientText: {
    fontSize: 14,
    color: colors.gold_deep,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.primary_bg,
    borderTopWidth: 1,
    borderTopColor: colors.primary_bg,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  payButton: {
    backgroundColor: colors.gold_light,
    borderWidth: 1,
    borderColor: colors.gold_deep,
  },
  payButtonText: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  rechargeBtn: {
    backgroundColor: colors.gold_deep,
  },
  rechargeBtnText: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },
  calendarHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekDay: {
    width: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: colors.black,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  calendarDay: {
    width: "14.28%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 16,
    color: colors.black,
  },
  selectedDay: {
    backgroundColor: colors.gold_deep,
    borderRadius: 20,
  },
  selectedDayText: {
    color: "white",
    fontWeight: "bold",
  },
  rechargeSection: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.gold_deep,
    paddingBottom: 10,
    marginBottom: 15,
  },
  rechargeLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
    color: colors.black,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    color: colors.black,
  },
  rangeText: {
    color: colors.gold_deep,
    marginBottom: 20,
    fontSize: 12,
  },
  paymentMethods: {
    marginBottom: 5,
  },
  paymentMethod: {
    padding: 15,
    borderWidth: 1,
    borderColor: colors.gold_deep,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedPayment: {
    borderColor: colors.gold_deep,
    backgroundColor: colors.gold_light,
  },
  rechargeButton: {
    backgroundColor: colors.gold_deep,
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  rechargeButtonText: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default WalletApp;
