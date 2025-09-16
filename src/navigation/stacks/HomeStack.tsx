import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Home 主页面
import HomeScreen from "screens/Home/HomeScreen";

// 子页面
import RewardScreen from "screens/Home/Reward/RewardScreen";
import SocialScreen from "screens/Home/Social/SocialScreen";
import VoteStack from "navigation/stacks/VoteStack"; 
import CreatorStack from "navigation/stacks/CreatorStack";

export type HomeStackParamList = {
  Home: undefined;
  Reward: undefined;
  CreatorStack: undefined;
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
      <Stack.Screen name="CreatorStack" component={CreatorStack} />
      <Stack.Screen name="Social" component={SocialScreen} />

      {/* 投票流程 Stack */}
      <Stack.Screen name="VoteStack" component={VoteStack} />
    </Stack.Navigator>
  );
}
