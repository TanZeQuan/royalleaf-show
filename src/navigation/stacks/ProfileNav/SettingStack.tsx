import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DeleteAccScreen from "screens/Profile/Setting/DeleteProfile/DeleteAccScreen";
import AccessSettingsScreen from "screens/Profile/Setting/EditAccess/AccessSettingsScreen";
import LanguageScreen from "screens/Profile/Setting/EditLanguage/LanguageScreen";
import ProfileInfoScreen from "screens/Profile/Setting/EditProfile/ProfileInfoScreen";
import ResetPasswordScreen from "screens/Profile/Setting/EditProfile/ResetPassScreen"; // 👈 import
import SettingScreen from "screens/Profile/Setting/SettingScreen";
import TermAgreeScreen from "screens/Profile/Setting/Term/TermAgreeScreen";

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
