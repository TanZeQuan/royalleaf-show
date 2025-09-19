import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "screens/Home/HomeScreen";
import RewardScreen from "screens/Home/Reward/RewardScreen";
import SocialScreen from "screens/Home/Social/SocialScreen";
import CreatorStack from "navigation/stacks/CreatorStack";
import WalletStack from "navigation/stacks/WalletStack";
import VoteStack from "navigation/stacks/VoteStack";
import ExchangeHistory from "screens/Home/Reward/ExchangeHistory";
import CrownHistory from "screens/Home/Reward/CrownHistory";

export type HomeStackParamList = {
  Home: undefined;
  Reward: undefined;
  Social: undefined;
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
      <Stack.Screen name="CreatorStack" component={CreatorStack} />
      <Stack.Screen name="WalletStack" component={WalletStack} />
      <Stack.Screen name="VoteStack" component={VoteStack} />
      <Stack.Screen name="CrownHistory" component={CrownHistory} />
      <Stack.Screen name="ExchangeHistory" component={ExchangeHistory} />
    </Stack.Navigator>
  );
}
