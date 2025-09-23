import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface FilterPopupProps {
  visible: boolean;
  onClose?: () => void;
  onFilterSelect?: (filter: FilterOption) => void;
}

const filterOptions: FilterOption[] = [
  { id: "latest", label: "最新", value: "latest" },
  { id: "popular", label: "最多点赞", value: "popular" },
  { id: "reviews", label: "最多评论", value: "reviews" },
];

const FilterPopup: React.FC<FilterPopupProps> = ({ visible, onClose, onFilterSelect }) => {
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 0, tension: 100, friction: 8, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleOptionPress = (option: FilterOption) => {
    onFilterSelect?.(option);
    onClose?.();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <StatusBar backgroundColor="rgba(0,0,0,0.3)" barStyle="light-content" />

      {/* Overlay */}
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View style={[styles.overlayBackground, { opacity: opacityAnim }]} />
      </TouchableOpacity>

      {/* Popup */}
      <View style={styles.popupContainer}>
        <Animated.View style={[styles.popup, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={22} color="#666" />
          </TouchableOpacity>

          {/* Filter Options */}
          <View style={styles.optionsContainer}>
            {filterOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.option, index !== filterOptions.length - 1 && styles.optionBorder]}
                onPress={() => handleOptionPress(option)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  popupContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "box-none",
  },
  popup: {
    backgroundColor: "#F9F5EC",
    borderRadius: 12,
    minWidth: width * 0.7,
    maxWidth: width * 0.85,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  optionsContainer: {
    width: "100%",
    marginTop: 8,
  },
  option: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});

export default FilterPopup;
