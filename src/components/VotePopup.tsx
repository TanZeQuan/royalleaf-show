import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { HomeStackParamList } from "../navigation/stacks/HomeNav/HomeStack";
import { styles } from "./VotePopupStyle";

type VotePopupNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "Home"
>;

interface VotePopupProps {
  visible: boolean;
  onClose: () => void;
}

const VotePopup: React.FC<VotePopupProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<VotePopupNavigationProp>();

  const handleStartVote = () => {
    onClose(); // 先关闭弹窗
    navigation.navigate("VoteStack"); // 👈 跳转到 VoteScreen
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 关闭按钮 */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          {/* 标题 */}
          <View style={styles.header}>
            <Image
              source={require("@assets/images/crown.png")}
              style={styles.crownIcon}
            />
            <Text style={styles.title}>投票赢皇冠积分</Text>
          </View>

          <ScrollView style={styles.content}>
            {/* 投票详情 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 投票详情</Text>
              <Text style={styles.description}>
                参与每日投票活动，为你喜欢的内容投票，赢取丰厚的皇冠积分奖励！
              </Text>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>• 投票时间：</Text>
                <Text style={styles.detailText}>每日 9:00 - 21:00</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>• 投票奖励：</Text>
                <Text style={styles.detailText}>
                  每次投票可获得 50 皇冠积分
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>• 每日限制：</Text>
                <Text style={styles.detailText}>每人每日最多可投票 5 次</Text>
              </View>
            </View>

            {/* 投票规则 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📝 投票规则</Text>

              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>1.</Text>
                <Text style={styles.ruleText}>
                  用户需要登录账户才能参与投票活动
                </Text>
              </View>

              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>2.</Text>
                <Text style={styles.ruleText}>
                  每个投票主题只能投票一次，不可重复投票
                </Text>
              </View>

              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>3.</Text>
                <Text style={styles.ruleText}>
                  皇冠积分将在投票成功后立即发放到账户
                </Text>
              </View>

              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>4.</Text>
                <Text style={styles.ruleText}>
                  恶意刷票或作弊行为将导致积分被扣除并可能被禁止参与活动
                </Text>
              </View>

              <View style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>5.</Text>
                <Text style={styles.ruleText}>活动最终解释权归平台所有</Text>
              </View>
            </View>

            {/* 积分用途 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💎 积分用途</Text>
              <Text style={styles.description}>获得的皇冠积分可以用于：</Text>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>• 兑换优惠券：</Text>
                <Text style={styles.detailText}>100积分 = RM5优惠券</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>• 兑换优惠券：</Text>
                <Text style={styles.detailText}>180积分 = RM10优惠券</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>• 更多奖励：</Text>
                <Text style={styles.detailText}>敬请期待更多精彩奖励</Text>
              </View>
            </View>
          </ScrollView>

          {/* 底部按钮 */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartVote}
            >
              <Text style={styles.startButtonText}>开始投票</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VotePopup;
