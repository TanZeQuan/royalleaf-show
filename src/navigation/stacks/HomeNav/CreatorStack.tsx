import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CreatorScreen from "screens/Home/Creator/CreatorCategoryScreen";
import CreatorMainScreen from "screens/Home/Creator/CreatorMainScreen";
import { ContestEntry } from "screens/Home/Creator/CreatorSlice";

export type CreatorStackParamList = {
  Creator: undefined;
  CreatorMain: {
    entries?: ContestEntry[];
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
      <Stack.Screen name="CreatorMain" component={CreatorMainScreen} />
      {/* <Stack.Screen name="CreatorImprove" component={CreatorImproveScreen} /> */}
    </Stack.Navigator>
  );
}
