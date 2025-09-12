import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MenuScreen from "screens/Menu/MenuScreen";
import OrderScreen from "../../screens/Menu/OrderScreen";
import { Product } from "../../services/menuApi";
import PaymentScreen from "../../screens/Menu/PaymentScreen";
import ConfirmPaymentScreen from "../../screens/Menu/ConfirmPaymentScreen";

export type MenuStackParamList = {
  Menu: undefined;
  Order: { item: Product };
  Payment: { orderId: string };
  ConfirmPayment: { paymentId: string };
};

const Stack = createNativeStackNavigator<MenuStackParamList>();

export default function MenuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Order" component={OrderScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="ConfirmPayment" component={ConfirmPaymentScreen} />
    </Stack.Navigator>
  );
}
