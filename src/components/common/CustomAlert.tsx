import colors from '@styles/colors';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  message: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, onClose, message }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.message}>{message}</Text>

          {/* 按钮区域 */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.85}
              style={styles.buttonWrapper}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>确定</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  message: {
    fontSize: 18,
    color: '#2c2c2c',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center', // ✨ 居中
    alignItems: 'center',
  },
  buttonWrapper: {
    width: 90,
    borderRadius: 18,
    shadowColor: colors.gold_deep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    borderRadius: 18,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gold_deep,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default CustomAlert;
