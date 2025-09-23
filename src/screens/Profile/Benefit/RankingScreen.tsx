// RankingScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type Props = NativeStackScreenProps<any, any>;

type Leader = {
  id: string;
  name: string;
  crown: string;
  avatar?: any; // require(...) or {uri: ...}
};

// TopCard component for top 3
type TopCardProps = {
  leader: Leader;
  rank: number;
};

const TopCard = ({ leader, rank }: TopCardProps) => {
  const isCenter = rank === 1;
  const trophyIcons: Record<number, any> = {
    1: require("assets/icons/top1.png"), // gold
    2: require("assets/icons/top2.png"), // silver
    3: require("assets/icons/top3.png"), // bronze
  };

  const trophySize = isCenter ? 36 : 28;

  return (
    <View style={isCenter ? styles.centerAvatarWrap : styles.smallAvatarWrap}>
      <Image
        source={leader.avatar}
        style={isCenter ? styles.centerAvatar : styles.smallAvatar}
      />
      <View
        style={[
          isCenter ? styles.centerBadge : styles.smallBadge,
          { width: trophySize, height: trophySize, borderRadius: trophySize / 2 },
        ]}
      >
        <Image
          source={trophyIcons[rank]}
          style={{ width: trophySize, height: trophySize, resizeMode: "contain" }}
        />
      </View>
      <Text style={isCenter ? styles.centerName : styles.smallName}>{leader.name}</Text>
      <Text style={isCenter ? styles.centerCrown : styles.smallCrown}>{leader.crown}</Text>
    </View>
  );
};

const topThreeSample: Leader[] = [
  { id: "1", name: "TopOne", crown: "9999", avatar: require("assets/icons/crown.png") },
  { id: "2", name: "TopTwo", crown: "8888", avatar: require("assets/icons/crown.png") },
  { id: "3", name: "TopThree", crown: "7777", avatar: require("assets/icons/crown.png") },
];

const rowsSample: Leader[] = new Array(8).fill(null).map((_, i) => ({
  id: String(i + 10),
  name: `xxxxx ${i + 1}`,
  crown: `${1000 - i * 10}`,
  avatar: require("assets/icons/crown.png"),
}));

const SEGMENTS = ["Weekly", "Monthly", "Total"];

export default function RankingScreen({ navigation }: Props) {
  const [active, setActive] = useState<number>(0);

  const topThree = topThreeSample;
  const rows = rowsSample;

  const renderRow = ({ item }: { item: Leader }) => {
    return (
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Image source={item.avatar} style={styles.rowAvatar} />
          <Text style={styles.rowName}>{item.name}</Text>
        </View>
        <Text style={styles.rowCrown}>{item.crown}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ranking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Segmented control */}
        <View style={styles.segmentWrapper}>
          <View style={styles.segmentPill}>
            {SEGMENTS.map((s, i) => (
              <TouchableOpacity
                key={s}
                onPress={() => setActive(i)}
                style={[styles.segmentItem, active === i && styles.segmentActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.segmentText, active === i && styles.segmentTextActive]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Top 3 */}
        <View style={styles.topThreeContainer}>
          <TopCard leader={topThree[1]} rank={2} />
          <TopCard leader={topThree[0]} rank={1} />
          <TopCard leader={topThree[2]} rank={3} />
        </View>

        {/* Leaderboard card */}
        <View style={styles.listCard}>
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>Name</Text>
            <Text style={styles.listHeaderText}>Crown</Text>
          </View>

          <FlatList
            data={rows}
            keyExtractor={(r) => r.id}
            renderItem={renderRow}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const palette = {
  bg: "#F5F5F2",
  cardBg: "#FFFDF7",
  green: "#28bd9d",
  accent: "#D4AF37",
  border: "#E6EDE6",
  text: "#333333",
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "transparent",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: Platform.OS === "ios" ? 18 : 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  headerTitle: { fontSize: 16, color: palette.text, fontWeight: "600" },

  container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },

  segmentWrapper: { alignItems: "center", marginBottom: 18 },
  segmentPill: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: palette.cardBg,
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6F1E8",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  segmentItem: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 8 },
  segmentText: { color: "#7a7a7a", fontSize: 14 },
  segmentActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentTextActive: { color: palette.green, fontWeight: "600" },

  /* Top 3 layout */
  topThreeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginVertical: 10,
    paddingHorizontal: 6,
  },
  smallAvatarWrap: { alignItems: "center", width: (width - 40) / 3 },
  smallAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#fff" },
  smallBadge: {
    position: "absolute",
    top: -10,
    alignSelf: "center",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  smallName: { marginTop: 6, fontSize: 12, color: "#999" },
  smallCrown: { fontSize: 12, color: "#999" },

  centerAvatarWrap: { alignItems: "center", width: (width - 40) / 3 },
  centerAvatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: "#fff" },
  centerBadge: {
    position: "absolute",
    top: -14,
    alignSelf: "center",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  centerName: { marginTop: 8, fontSize: 13, fontWeight: "700" },
  centerCrown: { fontSize: 12, color: "#999" },

  listCard: {
    marginTop: 18,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6F1E8",
    overflow: "hidden",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#EEF7EE",
    backgroundColor: "#FEFFFE",
  },
  listHeaderText: { color: palette.green, fontWeight: "600", fontSize: 13 },
  listContent: { paddingVertical: 6 },

  row: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rowAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12, backgroundColor: "#fff" },
  rowName: { color: palette.text, fontSize: 14 },
  rowCrown: { color: "#777", fontSize: 14 },
  rowSeparator: { height: 1, backgroundColor: "#F4F8F4", marginLeft: 12 },
});
