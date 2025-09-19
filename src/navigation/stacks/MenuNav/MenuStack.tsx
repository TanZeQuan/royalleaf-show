import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import MenuScreen from "screens/Menu/MenuScreen";
import ConfirmPaymentScreen from "../../../screens/Menu/ConfirmPaymentScreen";
import OrderScreen from "../../../screens/Menu/OrderScreen";
import PaymentScreen from "../../../screens/Menu/PaymentScreen";
import { Product } from "../../../services/MenuService/menuApi";

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
