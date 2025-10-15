import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VoteLiveScreen from "../../../screens/Home/Vote/VoteCommentScreen";
import VoteDetailScreen from "../../../screens/Home/Vote/VoteDetailScreen";
import VoteMainScreen from "../../../screens/Home/Vote/VoteMainScreen";
import VoteActivityScreen from "../../../screens/Home/Vote/VoteActivityScreen";
import VoteOptionScreen from "../../../screens/Home/Vote/VoteOptionScreen";
// import VoteRanking from "../../../screens/Home/Vote/VoteRanking";

export type VoteStackParamList = {
  VoteMain: undefined;
  VoteActivity: { category: string; categoryName: string };
  VoteOption: { category: string; categoryName: string; activity: any; votesId: string };
  VoteDetail: { imageId: number; category: string };
  VoteLive: { voteId: string };
  // Ranking: undefined;
};

const Stack = createNativeStackNavigator<VoteStackParamList>();

export default function VoteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VoteMain" component={VoteMainScreen} />
      <Stack.Screen name="VoteActivity" component={VoteActivityScreen} />
      <Stack.Screen name="VoteOption" component={VoteOptionScreen} />
      <Stack.Screen name="VoteDetail" component={VoteDetailScreen} />
      <Stack.Screen name="VoteLive" component={VoteLiveScreen} />
      {/* <Stack.Screen name="Ranking" component={VoteRanking} /> */}
    </Stack.Navigator>
  );
}
