import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WalletScreen from "../../screens/Home/Wallet/WalletScreen";

export type WalletStackParamList = {
    WalletMain: undefined;
    TransactionHistory: undefined;
    TopUp: undefined;
    Withdraw: undefined;
};

const Stack = createNativeStackNavigator<WalletStackParamList>();

export default function WalletStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WalletMain" component={WalletScreen} />
    </Stack.Navigator>
  );
}