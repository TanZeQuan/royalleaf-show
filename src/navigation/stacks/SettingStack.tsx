import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileInfoScreen from "screens/Profile/Setting/ProfileInfoScreen";
import LanguageScreen from "screens/Profile/Setting/LanguageScreen";
import AccessSettingsScreen from "screens/Profile/Setting/AccessSettingsScreen";
import DeleteAccScreen from "screens/Profile/Setting/DeleteAccScreen";
import TermAgreeScreen from "screens/Profile/Setting/TermAgreeScreen";
import SettingScreen from "screens/Profile/Setting/SettingScreen";
import ResetPasswordScreen from "screens/Profile/Setting/ResetPassScreen"; // 👈 import

export type SettingStackParamList = {
  Setting: undefined; // 👈 add Setting here
  SettingInfo: undefined;
  SettingLanguage: { category: string };
  SettingAccess: { imageId: number; category: string };
  SettingDelete: { voteId: string };
  SettingTerm: { voteId: string };
  SettingResetPassword: undefined; // 👈 new reset password route
};

interface SettingStackProps {
  onLogout: () => void;
}

const Stack = createNativeStackNavigator<SettingStackParamList>();

export default function SettingStack({ onLogout }: SettingStackProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* ✅ Pass onLogout only to SettingScreen */}
      <Stack.Screen name="Setting">
        {props => <SettingScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="SettingInfo" component={ProfileInfoScreen} />
      <Stack.Screen name="SettingLanguage" component={LanguageScreen} />
      <Stack.Screen name="SettingAccess" component={AccessSettingsScreen} />
      <Stack.Screen name="SettingDelete" component={DeleteAccScreen} />
      <Stack.Screen name="SettingTerm" component={TermAgreeScreen} />
      <Stack.Screen name="SettingResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
