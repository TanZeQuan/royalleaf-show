import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { Platform } from "react-native";

import CustomAlert from "../components/common/CustomAlert";
import HomeStack from "./stacks/HomeNav/HomeStack";
import MenuStack from "./stacks/MenuNav/MenuStack";
import ProfileStack from "./stacks/ProfileNav/ProfileStack";

const Tab = createBottomTabNavigator();

interface RootNavigatorProps {
  onLogout: () => void;
}

export default function RootNavigator({ onLogout }: RootNavigatorProps) {
  const [isAlertVisible, setAlertVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#000000ff",
          tabBarInactiveTintColor: "#999",
          tabBarStyle: {
            backgroundColor: "#F9F5EC",
            height: 80,
            paddingTop: 2,
            paddingBottom: Platform.OS === "ios" ? 10 : 8, // 调小底部间距
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            marginTop: 3,
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home";

            switch (route.name) {
              case "HomeStack":
                iconName = focused ? "home" : "home-outline";
                break;
              case "MenuStack":
                iconName = focused ? "cafe" : "cafe-outline";
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
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setAlertVisible(true);
            },
          }}
        />
        <Tab.Screen
          name="ProfileStack"
          options={{ title: "我的" }}
        >
          {() => <ProfileStack onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
      <CustomAlert
        visible={isAlertVisible}
        onClose={() => setAlertVisible(false)}
        message="功能暂未开放，请敬请期待！"
      />
    </>
  );
}
