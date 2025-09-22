import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Platform } from "react-native";

export function useHideTabBar(hide: boolean) {
  const navigation = useNavigation();

  const RESTORE_TAB_STYLE = {
    headerShown: false,
    tabBarActiveTintColor: "#000000ff",
    tabBarInactiveTintColor: "#999",
    tabBarStyle: {
      backgroundColor: "#F9F5EC",
      height: 80,
      paddingTop: 2,
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
  };

  useLayoutEffect(() => {
    // 🔥 向上两级获取 Tab Navigator
    const parentNav = navigation.getParent()?.getParent?.();
    if (!parentNav) return;

    if (hide) {
      parentNav.setOptions({ tabBarStyle: { ...RESTORE_TAB_STYLE.tabBarStyle, height: 0, opacity: 0 } });
    }

    // 🔄 卸载或依赖变化时恢复 TabBar样式
    return () => {
      parentNav.setOptions(RESTORE_TAB_STYLE);
    };
  }, [hide, navigation]);
}
