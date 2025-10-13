import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import CreatorStack from "@navigation/stacks/HomeNav/CreatorStack";
import VoteStack from "@navigation/stacks/HomeNav/VoteStack";
import WalletStack from "@navigation/stacks/HomeNav/WalletStack";
import HomeScreen from "screens/Home/HomeScreen";
import CrownHistory from "screens/Home/Reward/CrownHistory";
import ExchangeHistory from "screens/Home/Reward/ExchangeHistory";
import ScanScreen from "screens/Profile/QRScan/ScanScreen";
import RewardScreen from "screens/Home/Reward/RewardScreen";
import SocialScreen from "screens/Home/Social/SocialScreen";
import TopicDetailScreen from "screens/Home/Social/TopicDetailScreen";

export type HomeStackParamList = {
  Home: undefined;
  Reward: undefined;
  Social: undefined;
  Scan: undefined;
  TopicDetail: {
    topicId: string;
    topicTitle: string;
    topicDescription: string;
  };
  CreatorStack: undefined;
  WalletStack: undefined;
  VoteStack: undefined;
  CrownHistory: undefined;
  ExchangeHistory: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Reward" component={RewardScreen} />
      <Stack.Screen name="Social" component={SocialScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="TopicDetail" component={TopicDetailScreen} />
      <Stack.Screen name="CreatorStack" component={CreatorStack} />
      <Stack.Screen name="WalletStack" component={WalletStack} />
      <Stack.Screen name="VoteStack" component={VoteStack} />
      <Stack.Screen name="CrownHistory" component={CrownHistory} />
      <Stack.Screen name="ExchangeHistory" component={ExchangeHistory} />
    </Stack.Navigator>
  );
}
