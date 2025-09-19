import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreatorScreen from "screens/Home/Creator/CreatorScreen";
import CreatorSubmitScreen from "screens/Home/Creator/CreatorSubmitScreen";
import CreatorImproveScreen from "screens/Home/Creator/CreatorImproveScreen";
import { ContestEntry } from "screens/Home/Creator/CreatorSlice";

export type CreatorStackParamList = {
  Creator: undefined;
  CreatorSubmit: {
    entries: ContestEntry[];
    selectedCategory?: string; 
    categoryName?: string; 
  };
  CreatorImprove: undefined;
};

const Stack = createNativeStackNavigator<CreatorStackParamList>();

export default function CreatorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Creator" component={CreatorScreen} />
      <Stack.Screen name="CreatorSubmit" component={CreatorSubmitScreen} />
      <Stack.Screen name="CreatorImprove" component={CreatorImproveScreen} />
    </Stack.Navigator>
  );
}
