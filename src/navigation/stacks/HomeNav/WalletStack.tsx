import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import WalletScreen from "../../../screens/Home/Wallet/WalletScreen";

export type WalletStackParamList = {
    WalletScreen: undefined;
    TransactionHistory: undefined;
    TopUp: undefined;
    Withdraw: undefined;
};

const Stack = createNativeStackNavigator<WalletStackParamList>();

export default function WalletStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
    </Stack.Navigator>
  );
}