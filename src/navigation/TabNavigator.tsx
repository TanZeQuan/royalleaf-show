import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import HomeStack from "./stacks/HomeStack";
import MenuStack from "./stacks/MenuStack";
import ProfileStack from "./stacks/ProfileStack";

export type TabParamList = {
  HomeStack: undefined;
  MenuStack: undefined;
  ProfileStack: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function AppTabs() {
  const handleLogout = () => {
    console.log("User logged out");
    // 清除 token / 跳转登录页等
  };

  const HIDE_TAB_ROUTES = [
    "VoteDetail",
    "Comment",
    "VoteSubmit",
    "Payment",
    "ConfirmPayment",
    "Wallet",
    "VipLevel",
    "OurStory",
    "Points",
    "Voucher",
    "Settings",
  ];

  const getTabBarStyle = (route: any): ViewStyle => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName && HIDE_TAB_ROUTES.includes(routeName)) {
      return { display: "none" };
    }
    return {};
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
      <Tab.Screen
        name="ProfileStack"
        options={{ title: "我的" }}
      >
        {() => <ProfileStack onLogout={handleLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
