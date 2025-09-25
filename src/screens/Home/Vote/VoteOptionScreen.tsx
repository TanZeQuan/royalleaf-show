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
import { VoteActivity, voteActivityService, VoteProduct } from "../../../services/VoteService/voteOptionsApi"; // 调整路径根据您的项目结构

const { width } = Dimensions.get("window");
const imageSize = (width - 70) / 2; // 2 images per row with margins

type VoteImagesNavigationProp = NativeStackNavigationProp<any>;

interface RouteParams {
  category: string;
  categoryName: string;
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
  const { category, categoryName } = route.params as RouteParams;

  const [showFilter, setShowFilter] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterOptions>({
    sortBy: "votes",
    order: "desc",
  });

  // 新增状态
  const [voteActivities, setVoteActivities] = useState<VoteActivity[]>([]);
  const [voteProducts, setVoteProducts] = useState<VoteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<VoteActivity | null>(
    null
  );
  const [productsLoading, setProductsLoading] = useState(false);

  // 获取投票活动数据
  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        setLoading(true);

        // 使用 API 服务获取进行中的投票活动
        const activities = await voteActivityService.getVotingActivities();

        // 过滤当前分类的活动
        const filteredActivities = activities.filter(
          (activity) => activity.category === category
        );
        setVoteActivities(filteredActivities);

        // 如果有活动，默认选择第一个并获取对应的产品
        if (filteredActivities.length > 0) {
          setSelectedActivity(filteredActivities[0]);
          await fetchVoteProducts(filteredActivities[0].votesId);
        } else {
          setVoteProducts([]);
          setLoading(false);
        }
      } catch (error) {
        console.error("获取投票数据出错:", error);
        setLoading(false);
      }
    };

    fetchVoteData();
  }, [category]);

  // 获取特定投票活动的产品数据
  const fetchVoteProducts = async (votesId: string) => {
    try {
      setProductsLoading(true);

      // 使用 API 服务获取产品数据
      const products = await voteActivityService.getVoteProducts(votesId);
      setVoteProducts(products);
    } catch (error) {
      console.error("获取投票产品出错:", error);
      setVoteProducts([]);
    } finally {
      setLoading(false);
      setProductsLoading(false);
    }
  };

  // 处理活动选择
  const handleActivityPress = async (activity: VoteActivity) => {
    setSelectedActivity(activity);
    await fetchVoteProducts(activity.votesId);
  };

  // 获取筛选后的产品
  const getFilteredProducts = () => {
    if (!voteProducts.length) return [];

    let filteredProducts = [...voteProducts];

    // 应用排序
    switch (currentFilter.sortBy) {
      case "votes":
        filteredProducts.sort((a, b) => {
          return currentFilter.order === "desc"
            ? b.voted - a.voted
            : a.voted - b.voted;
        });
        break;

      case "name":
        filteredProducts.sort((a, b) => {
          return currentFilter.order === "desc"
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        });
        break;

      case "latest":
        filteredProducts.sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return currentFilter.order === "desc" ? timeB - timeA : timeA - timeB;
        });
        break;

      case "likes":
        // 如果没有likes字段，可以用voted代替或默认排序
        filteredProducts.sort((a, b) => {
          return currentFilter.order === "desc"
            ? b.voted - a.voted
            : a.voted - b.voted;
        });
        break;
    }

    return filteredProducts;
  };

  // 应用筛选
  const handleFilterApply = (filterOptions: FilterOptions) => {
    setCurrentFilter(filterOptions);
    setShowFilter(false);
  };

  const filteredProducts = getFilteredProducts();

  const handleImagePress = (product: VoteProduct) => {
    navigation.navigate("VoteDetail", {
      productId: product.subId,
      product,
      activity: selectedActivity,
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
        {/* 投票活动选择区域 */}
        {voteActivities.length > 0 && (
          <View style={styles.activitiesSection}>
            <Text style={styles.sectionTitle}>进行中的投票活动</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.activitiesScroll}
            >
              {voteActivities.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  style={[
                    styles.activityCard,
                    selectedActivity?.id === activity.id &&
                      styles.activityCardSelected,
                  ]}
                  onPress={() => handleActivityPress(activity)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.activityName}>{activity.name}</Text>
                  <Text style={styles.activityPeriod}>
                    {new Date(activity.votedAt).toLocaleDateString()} -{" "}
                    {new Date(activity.votedStop).toLocaleDateString()}
                  </Text>
                  {/* {selectedActivity?.id === activity.id && (
                    <View style={styles.selectedIndicator} />
                  )} */}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 产品加载状态 */}
        {productsLoading && (
          <View style={styles.centerContainer}>
            <Text style={styles.centerText}>加载产品中...</Text>
          </View>
        )}

        {!productsLoading && (
          <>
            <Text style={styles.subtitle}>选择您想投票的选项</Text>

            <View style={styles.imagesGrid}>
              {filteredProducts.map((product, index) => (
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
                          name="trophy"
                          size={14}
                          color={colors.yellow}
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
              ))}
            </View>

            {filteredProducts.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>暂无投票产品</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};


// ... 样式部分保持不变 ...
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
  // 新增的活动选择区域样式
  activitiesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    // fontWeight: "bold",
    color: colors.gray_deep,
    marginBottom: 16,
    textAlign: "center", // ✅ 加这个
  },
  activitiesScroll: {
    flexGrow: 0,
  },
  activityCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 150,
    shadowColor: colors.gold_deep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: "relative",
  },
  activityCardSelected: {
    backgroundColor: colors.gold_light,
    borderWidth: 2,
    borderColor: colors.gold_deep,
  },
  activityName: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 4,
  },
  activityPeriod: {
    fontSize: 12,
    color: colors.gray_text,
  },
  // selectedIndicator: {
  //   position: "absolute",
  //   top: 8,
  //   right: 8,
  //   width: 8,
  //   height: 8,
  //   borderRadius: 4,
  //   backgroundColor: colors.gold_deep,
  // },
  subtitle: {
    fontSize: 16,
    color: colors.gray_deep,
    marginBottom: 24,
    textAlign: "center",
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
