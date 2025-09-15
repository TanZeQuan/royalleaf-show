import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "screens/Profile/ProfileScreen";
import SettingScreen from "screens/Profile/Setting/SettingScreen";
import ScanScreen from "screens/Profile/QRScan/ScanScreen";
import BenefitScreen from "screens/Profile/Benefit/BenefitScreen";

export type ProfileStackParamList = {
  Profile: undefined;
  Setting: undefined;
  Scan: undefined;
  Benefit: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

interface ProfileStackProps {
  onLogout: () => void;
}

export default function ProfileStack({ onLogout }: ProfileStackProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Setting">
        {props => <SettingScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="Benefit" component={BenefitScreen} />
    </Stack.Navigator>
  );
}
