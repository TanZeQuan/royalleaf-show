import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';

const DrinkVotingApp = () => {
  const [activeTab, setActiveTab] = useState('drinks');
  const [voteCounts, setVoteCounts] = useState({
    drink1: 100,
    drink2: 100,
    drink3: 100,
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    '这个饮料真好喝！',
    '包装设计很漂亮',
    '希望有更多口味选择',
    '价格有点贵',
    '会推荐给朋友',
    '口感很独特'
  ]);

  // 处理投票
  const handleVote = () => {
    if (selectedOption) {
      setVoteCounts(prev => ({
        ...prev,
        [selectedOption]: prev[selectedOption as keyof typeof prev] + 1
      }));
      setShowConfirmModal(false);
      setSelectedOption(null);
      alert('投票成功，感谢您的投票！');
    }
  };

  // 添加评论
  const handleAddComment = () => {
    if (comment.trim()) {
      setComments(prev => [comment, ...prev]);
      setComment('');
      alert('评论发表成功');
    }
  };

  // 渲染选项卡内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'drinks':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>饮料专场</Text>
            {['drink1', 'drink2', 'drink3'].map((drink, idx) => (
              <View key={idx} style={styles.votingOption}>
                <Text style={styles.voteCount}>目前投票数：{voteCounts[drink as keyof typeof voteCounts]}</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => {
                    setSelectedOption(drink);
                    setShowConfirmModal(true);
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>选择</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        );
      default:
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>功能开发中...</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>投票</Text>
      </View>

      {/* tab 切换 */}
      <View style={styles.tabContainer}>
        {['drinks', 'packaging', 'logo', 'decoration'].map((tab, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'drinks' ? '饮料专场' : tab === 'packaging' ? '包装专场' : tab === 'logo' ? 'Logo专场' : '装修专场'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {renderTabContent()}

        {/* 评论输入区 */}
        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>发表评论</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="请输入您的评论（最多100字）"
            value={comment}
            onChangeText={setComment}
            maxLength={100}
            multiline
          />
          <Text style={styles.charCount}>{comment.length}/100</Text>
          <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>发表评论</Text>
          </TouchableOpacity>
        </View>

        {/* 评论区 */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>评论区</Text>
          {comments.map((item, index) => (
            <View key={index} style={styles.commentItem}>
              <Text style={styles.commentText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 投票确认 Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>确认投票？</Text>
            <Text style={styles.modalText}>您确定要投这个选项吗？</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#e0e0e0' }]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={{ color: '#333' }}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ff6b6b' }]}
                onPress={handleVote}
              >
                <Text style={{ color: '#fff' }}>确认投票</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DrinkVotingApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ff6b6b',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#ff6b6b',
  },
  activeTabText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  votingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 12,
  },
  voteCount: {
    fontSize: 16,
    color: '#333',
  },
  selectButton: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  commentSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
  },
  charCount: {
    textAlign: 'right',
    color: '#999',
    marginBottom: 12,
    fontSize: 14,
  },
  commentButton: {
    backgroundColor: '#ff6b6b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  commentsSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  commentItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    marginBottom: 20,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
});
