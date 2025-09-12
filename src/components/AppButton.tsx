// src/components/ButtonAnimation.tsx
import React, { useRef, useEffect } from "react";
import { TouchableOpacity, Animated, Image, StyleSheet } from "react-native";

export default function ButtonAnimation() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2, // 背景放大一点
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <TouchableOpacity activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.giftButton,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require("assets/icons/login-checklist.png")}
          style={styles.giftIcon}
          resizeMode="contain"
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  giftButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "#E1C16E",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  giftIcon: {
    width: 35,
    height: 35,
    tintColor: "#000000",
  },
});
