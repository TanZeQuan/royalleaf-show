import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VoteDetailScreen from "../../../screens/Home/Vote/VoteDetailScreen";
import VoteLiveScreen from "../../../screens/Home/Vote/VoteLiveScreen";
import VoteMainScreen from "../../../screens/Home/Vote/VoteMainScreen";
import VoteOptionScreen from "../../../screens/Home/Vote/VoteOptionScreen";

export type VoteStackParamList = {
  VoteMain: undefined;
  VoteOption: { category: string }
  VoteDetail: { imageId: number; category: string };
  VoteLive: { voteId: string };
};

const Stack = createNativeStackNavigator<VoteStackParamList>();

export default function VoteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VoteMain" component={VoteMainScreen} />
      <Stack.Screen name="VoteOption" component={VoteOptionScreen} />
      <Stack.Screen name="VoteDetail" component={VoteDetailScreen} />
      <Stack.Screen name="VoteLive" component={VoteLiveScreen} />
    </Stack.Navigator>
  );
}
