import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 🏠 主页面
import HomeScreen from "screens/Home/HomeScreen";

// 📌 子页面
import RewardScreen from "screens/Home/Reward/RewardScreen";
import CreatorScreen from "screens/Home/Creator/CreatorScreen";
import SocialScreen from "screens/Home/Social/SocialScreen";
import VoteScreen from "screens/Home/Vote/VoteScreen";

export type HomeStackParamList = {
  Home: undefined;
  Reward: undefined;
  Creator: undefined;
  Social: undefined;
  Vote: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 🏠 首页 */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* 子页面 */}
      <Stack.Screen name="Reward" component={RewardScreen} />
      <Stack.Screen name="Creator" component={CreatorScreen} />
      <Stack.Screen name="Social" component={SocialScreen} />
      <Stack.Screen name="Vote" component={VoteScreen} />
    </Stack.Navigator>
  );
}
