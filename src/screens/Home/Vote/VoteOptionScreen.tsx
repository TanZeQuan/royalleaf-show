import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { colors } from "styles";
import {
  VoteActivity,
  voteActivityService,
  VoteProduct,
} from "../../../services/VoteService/voteOptionsApi";

const { width } = Dimensions.get("window");
const imageSize = (width - 70) / 2; // 2 images per row with margins

type VoteImagesNavigationProp = NativeStackNavigationProp<any>;

interface RouteParams {
  category: string;
  categoryName: string;
  activity: VoteActivity;
  votesId: string;
}

interface FilterOptions {
  sortBy: "votes" | "name" | "latest" | "likes";
  order: "asc" | "desc";
}

// 简单的 FilterPopout 组件（内联定义）
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
      case "votes":
        return "投票数";
      case "latest":
        return "最新";
      case "likes":
        return "点赞数";
      default:
        return value;
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
            {["votes", "latest", "likes"].map((option) => (
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
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<VoteImagesNavigationProp>();
  const route = useRoute();
  const { category, categoryName, activity, votesId } = route.params as RouteParams;

  const [showFilter, setShowFilter] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterOptions>({
    sortBy: "votes",
    order: "desc",
  });

  // 新增状态
  const [voteProducts, setVoteProducts] = useState<VoteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<VoteActivity | null>(
    activity || null
  );
  const [randomProducts, setRandomProducts] = useState<VoteProduct[]>([]);

  // 获取指定活动的投票产品
  useEffect(() => {
    const fetchVoteProducts = async () => {
      try {
        setLoading(true);

        // 直接使用传入的 votesId 获取产品
        const products = await voteActivityService.getVoteProducts(votesId);
        setVoteProducts(products);
        
        // 初始化随机排序的其他产品
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

  // 获取前五名产品（按投票数从高到低）
  const getTopFiveProducts = (): VoteProduct[] => {
    if (!voteProducts.length) return [];
    
    const sortedByVotes = [...voteProducts].sort((a, b) => b.voted - a.voted);
    return sortedByVotes.slice(0, 5);
  };

  // 获取其他产品（除了前五名）
  const getOtherProducts = (products: VoteProduct[] = voteProducts): VoteProduct[] => {
    if (!products.length) return [];
    
    const topFiveIds = new Set(getTopFiveProducts().map(p => p.subId));
    return products.filter(product => !topFiveIds.has(product.subId));
  };

  // 数组随机排序函数
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // 刷新随机排序
  const refreshRandomOrder = () => {
    const otherProducts = getOtherProducts();
    setRandomProducts(shuffleArray([...otherProducts]));
  };

  // 获取产品排名（按投票数从高到低）
  const getProductRank = (product: VoteProduct): number => {
    const sortedByVotes = [...voteProducts].sort((a, b) => b.voted - a.voted);
    const rank = sortedByVotes.findIndex(p => p.subId === product.subId) + 1;
    return rank;
  };

  // 获取筛选后的产品（现在只应用于前五名）
  const getFilteredTopFive = () => {
    let topFive = getTopFiveProducts();

    // 对前五名应用排序
    switch (currentFilter.sortBy) {
      case "votes":
        topFive.sort((a, b) => {
          return currentFilter.order === "desc"
            ? b.voted - a.voted
            : a.voted - b.voted;
        });
        break;

      case "name":
        topFive.sort((a, b) => {
          return currentFilter.order === "desc"
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        });
        break;

      case "latest":
        topFive.sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return currentFilter.order === "desc" ? timeB - timeA : timeA - timeB;
        });
        break;

      case "likes":
        topFive.sort((a, b) => {
          return currentFilter.order === "desc"
            ? b.voted - a.voted
            : a.voted - b.voted;
        });
        break;
    }

    return topFive;
  };

  // 获取排名徽章颜色
  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700"; // 金色
      case 2:
        return "#C0C0C0"; // 银色
      case 3:
        return "#CD7F32"; // 铜色
      case 4:
      case 5:
        return colors.gold_deep; // 其他前5名用金黄色
      default:
        return "transparent";
    }
  };

  // 获取排名文字
  const getRankText = (rank: number): string => {
    const rankTexts = ["第一名", "第二名", "第三名", "第四名", "第五名"];
    return rank >= 1 && rank <= 5 ? rankTexts[rank - 1] : "";
  };

  // 应用筛选
  const handleFilterApply = (filterOptions: FilterOptions) => {
    setCurrentFilter(filterOptions);
    setShowFilter(false);
  };

  const topFiveProducts = getFilteredTopFive();
  const otherProductsCount = getOtherProducts().length;

  // 在 VoteOptionScreen.tsx 中更新 handleImagePress 函数
  const handleImagePress = (product: VoteProduct) => {
    console.log("点击产品，准备跳转到详情页面:", product);
    console.log("传递的参数:", {
      productId: product.subId,
      product: product,
      activity: selectedActivity,
      category: category,
    });

    navigation.navigate("VoteDetail", {
      productId: product.subId, // 传递产品ID用于获取详情
      product: product, // 传递基础产品信息（可选，用于快速显示）
      activity: selectedActivity,
      category: category,
    });
  };

  const getFilterIndicatorText = () => {
    const sortText =
      currentFilter.sortBy === "votes"
        ? "投票数"
        : currentFilter.sortBy === "name"
        ? "名称"
        : currentFilter.sortBy === "likes"
        ? "点赞数"
        : "最新";
    const orderText = currentFilter.order === "desc" ? "降序" : "升序";
    return `${sortText} ${orderText}`;
  };

  // 渲染产品卡片
  const renderProductCard = (product: VoteProduct, index: number, isTopFive: boolean = false) => {
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

          {/* 排名徽章 - 只显示前5名 */}
          {isTopFive && (
            <View style={[styles.rankBadge, { backgroundColor: getRankBadgeColor(rank) }]}>
              <Text style={styles.rankText}>{getRankText(rank)}</Text>
            </View>
          )}

          <View style={styles.imageOverlay}>
            <Text style={styles.imageName}>{product.name}</Text>
          </View>
        </View>

        {/* 设计师信息和互动区域 */}
        <View style={styles.infoContainer}>
          <Text style={styles.designerName}>
            设计师: {product.userId}
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons
                name="ticket"
                size={14}
                color={colors.gold_deep}
              />
              <Text style={styles.statText}>{product.voted}</Text>
            </View>
            <TouchableOpacity
              style={styles.voteButton}
              onPress={() => handleImagePress(product)}
            >
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={colors.white}
              />
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

      {/* Header */}
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

        {/* 前五名区域 */}
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

        {/* 其他产品区域 */}
        {randomProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎲 其他参赛作品</Text>
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={refreshRandomOrder}
              >
                <Ionicons name="refresh" size={16} color={colors.white} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary_bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold_light,
    backgroundColor: colors.gold_light,
    position: "relative",
  },
  headerCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
  },
  filterIndicator: {
    fontSize: 12,
    color: colors.gray_deep,
    marginTop: 4,
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankBtn: {
    width: 35,
    height: 35,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray_deep,
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold_deep,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  refreshText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: "600",
    marginLeft: 4,
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageCard: {
    marginBottom: 40,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  leftCard: {
    width: imageSize,
  },
  rightCard: {
    width: imageSize,
  },
  imageContainer: {
    position: "relative",
  },
  rankBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  rankText: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.white,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  voteImage: {
    width: "100%",
    height: imageSize,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.gold_deep,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  imageName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.black,
    textAlign: "center",
  },
  infoContainer: {
    padding: 12,
  },
  designerName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.gold_deep,
  },
  voteButtonText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: "600",
    marginLeft: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    fontSize: 16,
    color: colors.gray_text,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray_text,
  },
});

// FilterPopout 组件的样式
const filterStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.black,
  },
  optionGroup: {
    marginBottom: 20,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: colors.black,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 14,
    color: colors.black,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  radioSelected: {
    backgroundColor: colors.gold_deep,
    borderColor: colors.gold_deep,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    padding: 12,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelText: {
    color: colors.black,
    fontWeight: "bold",
  },
  applyButton: {
    padding: 12,
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.gold_deep,
    borderRadius: 6,
  },
  applyText: {
    color: colors.black,
    fontWeight: "bold",
  },
});

export default VoteImagesScreen;