import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Home 主页面
import HomeScreen from "screens/Home/HomeScreen";

// 子页面
import RewardScreen from "screens/Home/Reward/RewardScreen";
import CreatorScreen from "screens/Home/Creator/CreatorScreen";
import SocialScreen from "screens/Home/Social/SocialScreen";
import VoteStack from "navigation/stacks/VoteStack"; // <- your nested vote stack

export type HomeStackParamList = {
  Home: undefined;
  Reward: undefined;
  Creator: undefined;
  Social: undefined;
  VoteStack: undefined; 
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 主页面 */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* 子页面 */}
      <Stack.Screen name="Reward" component={RewardScreen} />
      <Stack.Screen name="Creator" component={CreatorScreen} />
      <Stack.Screen name="Social" component={SocialScreen} />

      {/* 投票流程 Stack */}
      <Stack.Screen name="VoteStack" component={VoteStack} />
    </Stack.Navigator>
  );
}
