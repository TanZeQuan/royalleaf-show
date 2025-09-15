import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, Text, Platform, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import HomeStack from "./stacks/HomeStack";
import MenuStack from "./stacks/MenuStack";
import ProfileStack from "./stacks/ProfileStack";

const Tab = createBottomTabNavigator();
interface RootNavigatorProps {
  onLogout: () => void;
}

export default function RootNavigator({ onLogout }: RootNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#000000ff",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#F9F5EC",
          height: 80, // 从 70 ➝ 90 或更大
          paddingBottom: Platform.OS === "ios" ? 25 : 15, // 底部留白
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          marginTop: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          switch (route.name) {
            case "HomeStack":
              iconName = focused ? "home" : "home-outline";
              break;
            case "MenuStack":
              iconName = focused ? "fast-food" : "fast-food-outline";
              break;
            case "ProfileStack":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return <Ionicons name={iconName} size={30} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ title: "首页" }}
      />
      <Tab.Screen
        name="MenuStack"
        component={MenuStack}
        options={{ title: "菜单" }}
      />
      <Tab.Screen
        name="ProfileStack"
        options={{ title: "我的" }}
      >
        {props => <ProfileStack {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
