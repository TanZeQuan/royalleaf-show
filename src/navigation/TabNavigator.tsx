import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import HomeStack from "./stacks/HomeStack";
import MenuStack from "./stacks/MenuStack";
import ProfileStack from "./stacks/ProfileStack";
import { Ionicons } from "@expo/vector-icons";

export type TabParamList = {
  HomeStack: undefined;
  MenuStack: undefined;
  ProfileStack: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// 所有需要隐藏 Tab 的页面名称
const HIDE_TAB_ROUTES = [
  // HomeStack
  "VoteDetail",
  "Comment",
  "VoteSubmit",
  // MenuStack
  "Payment",
  "ConfirmPayment",
  // ProfileStack
  "Wallet",
  "VipLevel",
  "OurStory",
  "Points",
  "Voucher",
  "Settings",
];

export default function TabNavigator() {
  const getTabBarStyle = (route: any) => {
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
        options={({ route }) => ({ title: "首页", tabBarStyle: getTabBarStyle(route) as any })}
      />
      <Tab.Screen
        name="MenuStack"
        component={MenuStack}
        options={({ route }) => ({ title: "菜单", tabBarStyle: getTabBarStyle(route) as any })}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={({ route }) => ({ title: "个人中心", tabBarStyle: getTabBarStyle(route) as any })}
      />
    </Tab.Navigator>
  );
}
