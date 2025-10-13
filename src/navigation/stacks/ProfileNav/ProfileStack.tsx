import SettingStack from "@navigation/stacks/ProfileNav/SettingStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BenefitScreen from "screens/Profile/Benefit/BenefitScreen";
import VoteStack from "@navigation/stacks/HomeNav/VoteStack";
import ProfileScreen from "screens/Profile/ProfileScreen";
import WalletStack from "@navigation/stacks/HomeNav/WalletStack";
import ScanScreen from "screens/Profile/QRScan/ScanScreen";
import CreatorStack from "@navigation/stacks/HomeNav/CreatorStack";
import SocialScreen from "screens/Home/Social/SocialScreen";
import RankingScreen from "screens/Profile/Benefit/RankingScreen"

export type ProfileStackParamList = {
  Profile: undefined;
  SettingStack: undefined;
  Scan: undefined;
  Social: undefined;
  CreatorStack: undefined;
  Benefit: undefined;
  VoteStack: undefined;
  RankingScreen: undefined;
  WalletStack: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

interface ProfileStackProps {
  onLogout: () => void;
}

export default function ProfileStack({ onLogout }: ProfileStackProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="SettingStack">
        {props => <SettingStack {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="Social" component={SocialScreen} />
      <Stack.Screen name="Benefit" component={BenefitScreen} />
      <Stack.Screen name="VoteStack" component={VoteStack} />
      <Stack.Screen name="CreatorStack" component={CreatorStack} />
      <Stack.Screen name="WalletStack" component={WalletStack} />
      <Stack.Screen name="RankingScreen" component={RankingScreen} />
    </Stack.Navigator>
  );
}
