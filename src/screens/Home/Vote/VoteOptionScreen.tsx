// screens/VoteOption/VoteOptionScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  VoteActivity,
  voteActivityService,
  VoteProduct,
} from "../../../services/VoteService/voteOptionsApi";
import { filterStyles, styles } from "./Styles/VoteOptionCSS";

type VoteImagesNavigationProp = NativeStackNavigationProp<any>;

interface RouteParams {
  category: string;
  categoryName: string;
  activity: VoteActivity;
  votesId: string;
}

interface FilterOptions {
  sortBy: "votes" | "name" | "latest";
  order: "asc" | "desc";
}

const FilterPopout: React.FC<{
  visible: boolean;
  onClose: () => void;
  onFilterApply: (filter: FilterOptions) => void;
  currentFilter?: FilterOptions;
}> = ({
  visible,
  onClose,
  onFilterApply,
  currentFilter = { sortBy: "votes", order: "desc" },
}) => {
  const [localFilter, setLocalFilter] = useState<FilterOptions>(currentFilter);

  const handleApply = () => {
    onFilterApply(localFilter);
  };

  const getSortByLabel = (value: string) => {
    switch (value) {
      case "votes": return "投票数";
      case "latest": return "最新";
      default: return value;
    }
  };

  const getOrderLabel = (value: string) => {
    return value === "desc" ? "降序" : "升序";
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={filterStyles.overlay} onPress={onClose}>
        <View
          style={filterStyles.container}
          onStartShouldSetResponder={() => true}
        >
          <Text style={filterStyles.title}>筛选选项</Text>
          <View style={filterStyles.optionGroup}>
            <Text style={filterStyles.optionLabel}>排序方式</Text>
            {["votes", "latest"].map((option) => (
              <TouchableOpacity
                key={option}
                style={filterStyles.option}
                onPress={() =>
                  setLocalFilter({ ...localFilter, sortBy: option as any })
                }
              >
                <Text style={filterStyles.optionText}>
                  {getSortByLabel(option)}
                </Text>
                <View
                  style={[
                    filterStyles.radio,
                    localFilter.sortBy === option && filterStyles.radioSelected,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={filterStyles.optionGroup}>
            <Text style={filterStyles.optionLabel}>排序顺序</Text>
            {["desc", "asc"].map((option) => (
              <TouchableOpacity
                key={option}
                style={filterStyles.option}
                onPress={() =>
                  setLocalFilter({ ...localFilter, order: option as any })
                }
              >
                <Text style={filterStyles.optionText}>
                  {getOrderLabel(option)}
                </Text>
                <View
                  style={[
                    filterStyles.radio,
                    localFilter.order === option && filterStyles.radioSelected,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={filterStyles.buttons}>
            <TouchableOpacity
              style={filterStyles.cancelButton}
              onPress={onClose}
            >
              <Text style={filterStyles.cancelText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={filterStyles.applyButton}
              onPress={handleApply}
            >
              <Text style={filterStyles.applyText}>应用</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const VoteImagesScreen = () => {
  const navigation = useNavigation<VoteImagesNavigationProp>();
  const route = useRoute();
  const { category, categoryName, activity, votesId } =
    route.params as RouteParams;

  const [showFilter, setShowFilter] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterOptions>({
    sortBy: "votes",
    order: "desc",
  });
  const [voteProducts, setVoteProducts] = useState<VoteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity] = useState<VoteActivity | null>(activity || null);
  const [randomProducts, setRandomProducts] = useState<VoteProduct[]>([]);

  useEffect(() => {
    const fetchVoteProducts = async () => {
      try {
        setLoading(true);
        const products = await voteActivityService.getVoteProducts(votesId);
        setVoteProducts(products);
        const otherProducts = getOtherProducts(products);
        setRandomProducts(shuffleArray([...otherProducts]));
      } catch (error) {
        console.error("获取投票数据出错:", error);
        setVoteProducts([]);
        setRandomProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVoteProducts();
  }, [votesId]);

  const getTopFiveProducts = (): VoteProduct[] => {
    if (!voteProducts.length) return [];
    const sortedByVotes = [...voteProducts].sort((a, b) => b.voted - a.voted);
    return sortedByVotes.slice(0, 5);
  };

  const getOtherProducts = (products: VoteProduct[] = voteProducts): VoteProduct[] => {
    if (!products.length) return [];
    const topFiveIds = new Set(getTopFiveProducts().map((p) => p.subId));
    return products.filter((product) => !topFiveIds.has(product.subId));
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const refreshRandomOrder = () => {
    const otherProducts = getOtherProducts();
    setRandomProducts(shuffleArray([...otherProducts]));
  };

  const getProductRank = (product: VoteProduct): number => {
    const sortedByVotes = [...voteProducts].sort((a, b) => b.voted - a.voted);
    return sortedByVotes.findIndex((p) => p.subId === product.subId) + 1;
  };

  const getFilteredTopFive = () => {
    let topFive = getTopFiveProducts();
    switch (currentFilter.sortBy) {
      case "votes":
        topFive.sort((a, b) =>
          currentFilter.order === "desc" ? b.voted - a.voted : a.voted - b.voted
        );
        break;
      case "name":
        topFive.sort((a, b) =>
          currentFilter.order === "desc"
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name)
        );
        break;
      case "latest":
        topFive.sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return currentFilter.order === "desc" ? timeB - timeA : timeA - timeB;
        });
        break;
    }
    return topFive;
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return "#FFD700";
      case 2: return "#C0C0C0";
      case 3: return "#CD7F32";
      case 4:
      case 5: return styles.rankBadgeOther.backgroundColor;
      default: return "transparent";
    }
  };

  const getRankText = (rank: number): string => {
    const rankTexts = ["第一名", "第二名", "第三名", "第四名", "第五名"];
    return rank >= 1 && rank <= 5 ? rankTexts[rank - 1] : "";
  };

  const handleFilterApply = (filterOptions: FilterOptions) => {
    setCurrentFilter(filterOptions);
    setShowFilter(false);
  };

  const handleImagePress = (product: VoteProduct) => {
    navigation.navigate("VoteDetail", {
      productId: product.subId,
      product: product,
      activity: selectedActivity,
      category: category,
    });
  };

  const topFiveProducts = getFilteredTopFive();

  const renderProductCard = (
    product: VoteProduct,
    index: number,
    isTopFive: boolean = false
  ) => {
    const rank = getProductRank(product);
    return (
      <TouchableOpacity
        key={product.subId}
        style={[
          styles.imageCard,
          index % 2 === 0 ? styles.leftCard : styles.rightCard,
        ]}
        onPress={() => handleImagePress(product)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.voteImage}
            resizeMode="cover"
          />
          {isTopFive && (
            <View
              style={[
                styles.rankBadge,
                { backgroundColor: getRankBadgeColor(rank) },
              ]}
            >
              <Text style={styles.rankText}>{getRankText(rank)}</Text>
            </View>
          )}
          <View style={styles.imageOverlay}>
            <Text style={styles.imageName}>{product.name}</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.designerName}>设计师: {product.userId}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons
                name="ticket"
                size={14}
                color={styles.ticketIcon.color}
              />
              <Text style={styles.statText}>{product.voted}</Text>
            </View>
            <TouchableOpacity
              style={styles.voteButton}
              onPress={() => handleImagePress(product)}
            >
              <Ionicons name="checkmark-circle" size={16} color="white" />
              <Text style={styles.voteButtonText}>投票</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{categoryName}</Text>
          </View>
          <TouchableOpacity style={styles.rankBtn} activeOpacity={0.7}>
            <Image
              source={require("assets/icons/filter-i.png")}
              style={{ width: 20, height: 20, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.centerText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{categoryName}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowFilter(true)}
          activeOpacity={0.7}
          style={styles.rankBtn}
        >
          <Image
            source={require("assets/icons/filter-i.png")}
            style={{ width: 20, height: 20, resizeMode: "contain" }}
          />
        </TouchableOpacity>
        <FilterPopout
          visible={showFilter}
          onClose={() => setShowFilter(false)}
          onFilterApply={handleFilterApply}
          currentFilter={currentFilter}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>选择您想投票的选项</Text>
        {topFiveProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏆 排行榜前五名</Text>
            </View>
            <View style={styles.imagesGrid}>
              {topFiveProducts.map((product, index) =>
                renderProductCard(product, index, true)
              )}
            </View>
          </View>
        )}
        {randomProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎲 其他参赛作品</Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={refreshRandomOrder}
              >
                <Ionicons name="refresh" size={16} color="white" />
                <Text style={styles.refreshText}>换一批</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imagesGrid}>
              {randomProducts.map((product, index) =>
                renderProductCard(product, index, false)
              )}
            </View>
          </View>
        )}
        {voteProducts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无投票产品</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VoteImagesScreen;