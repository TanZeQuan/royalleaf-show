import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { ViewStyle } from "react-native";

import HomeStack from "./stacks/HomeNav/HomeStack";
import MenuStack from "./stacks/MenuNav/MenuStack";
import ProfileStack from "./stacks/ProfileNav/ProfileStack";

export type TabParamList = {
  HomeStack: undefined;
  MenuStack: undefined;
  ProfileStack: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function AppTabs() {
  const handleLogout = () => {
    console.log("User logged out");
  };

  const BASE_TAB_STYLE: ViewStyle = {
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    height: 60,
  };

  // 需要隐藏 Tab Bar 的路由名
  const HIDE_TAB_ROUTES = [
    "Reward",
    "Social",
    "CreatorStack",
    "WalletStack",
    "VoteStack",
    "CrownHistory",
    "ExchangeHistory",
  ];

  // 🔥 递归获取最深层路由名
  const getDeepestRouteName = (route: any): string => {
    if (!route) return "";
    if (route.state && route.state.routes && route.state.index != null) {
      return getDeepestRouteName(route.state.routes[route.state.index]);
    }
    return route.name ?? "";
  };

  const getTabBarStyle = (route: any): ViewStyle => {
    const routeName = getDeepestRouteName(route);
    if (HIDE_TAB_ROUTES.includes(routeName)) {
      return { height: 0, opacity: 0 }; // 隐藏 Tab Bar
    }
    return BASE_TAB_STYLE;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: BASE_TAB_STYLE,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "HomeStack") iconName = "home";
          if (route.name === "MenuStack") iconName = "fast-food";
          if (route.name === "ProfileStack") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={({ route }) => ({
          title: "首页",
          tabBarStyle: getTabBarStyle(route),
        })}
      />
      <Tab.Screen
        name="MenuStack"
        component={MenuStack}
        options={({ route }) => ({
          title: "菜单",
          tabBarStyle: getTabBarStyle(route),
        })}
      />
      <Tab.Screen name="ProfileStack">
        {() => <ProfileStack onLogout={handleLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
