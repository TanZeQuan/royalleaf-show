import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
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

const { width } = Dimensions.get("window");
const imageSize = (width - 70) / 2; // 2 images per row with margins

type VoteImagesNavigationProp = NativeStackNavigationProp<any>;

interface RouteParams {
  category: string;
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
  const { category } = route.params as RouteParams;
  const [showFilter, setShowFilter] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterOptions>({
    sortBy: "votes",
    order: "desc",
  });

  // Mock data for different categories
  const getImagesForCategory = (categoryId: string) => {
    const mockImages = {
      drinks: [
        {
          id: 1,
          image: require("assets/images/mock.jpg"),
          name: "夏日清凉特饮",
          votes: 100,
          likes: 45,
          designer: "设计师小A",
          createdAt: new Date(2024, 0, 1),
        },
        {
          id: 2,
          image: require("assets/images/mock.jpg"),
          name: "经典奶茶系列",
          votes: 120,
          likes: 67,
          designer: "创意达人B",
          createdAt: new Date(2024, 0, 2),
        },
        {
          id: 3,
          image: require("assets/images/mock.jpg"),
          name: "果茶新品",
          votes: 100,
          likes: 52,
          designer: "设计大师C",
          createdAt: new Date(2024, 0, 3),
        },
        {
          id: 4,
          image: require("assets/images/mock.jpg"),
          name: "咖啡艺术",
          votes: 50,
          likes: 23,
          designer: "艺术之家",
          createdAt: new Date(2024, 0, 4),
        },
        {
          id: 5,
          image: require("assets/images/mock.jpg"),
          name: "特色调酒",
          votes: 130,
          likes: 89,
          designer: "调酒师D",
          createdAt: new Date(2024, 0, 5),
        },
        {
          id: 6,
          image: require("assets/images/mock.jpg"),
          name: "健康果汁",
          votes: 70,
          likes: 34,
          designer: "营养专家E",
          createdAt: new Date(2024, 0, 6),
        },
      ],
      packaging: [
        {
          id: 7,
          image: require("assets/images/mock.jpg"),
          name: "环保包装",
          votes: 100,
          likes: 56,
          designer: "环保先锋",
          createdAt: new Date(2024, 0, 7),
        },
        {
          id: 8,
          image: require("assets/images/mock.jpg"),
          name: "礼盒设计",
          votes: 90,
          likes: 42,
          designer: "礼盒专家",
          createdAt: new Date(2024, 0, 8),
        },
        {
          id: 9,
          image: require("assets/images/mock.jpg"),
          name: "简约风格",
          votes: 110,
          likes: 61,
          designer: "简约大师",
          createdAt: new Date(2024, 0, 9),
        },
        {
          id: 10,
          image: require("assets/images/mock.jpg"),
          name: "复古包装",
          votes: 80,
          likes: 38,
          designer: "复古爱好者",
          createdAt: new Date(2024, 0, 10),
        },
      ],
      logo: [
        {
          id: 11,
          image: require("assets/images/mock.jpg"),
          name: "品牌标志",
          votes: 100,
          likes: 55,
          designer: "品牌设计师",
          createdAt: new Date(2024, 0, 11),
        },
        {
          id: 12,
          image: require("assets/images/mock.jpg"),
          name: "企业标识",
          votes: 120,
          likes: 68,
          designer: "企业形象专家",
          createdAt: new Date(2024, 0, 12),
        },
        {
          id: 13,
          image: require("assets/images/mock.jpg"),
          name: "创意Logo",
          votes: 95,
          likes: 47,
          designer: "创意无限",
          createdAt: new Date(2024, 0, 13),
        },
        {
          id: 14,
          image: require("assets/images/mock.jpg"),
          name: "简约标志",
          votes: 105,
          likes: 59,
          designer: "简约派",
          createdAt: new Date(2024, 0, 14),
        },
      ],
      decoration: [
        {
          id: 15,
          image: require("assets/images/mock.jpg"),
          name: "现代装修",
          votes: 100,
          likes: 53,
          designer: "室内设计师",
          createdAt: new Date(2024, 0, 15),
        },
        {
          id: 16,
          image: require("assets/images/mock.jpg"),
          name: "古典风格",
          votes: 85,
          likes: 41,
          designer: "古典艺术",
          createdAt: new Date(2024, 0, 16),
        },
        {
          id: 17,
          image: require("assets/images/mock.jpg"),
          name: "工业风设计",
          votes: 115,
          likes: 72,
          designer: "工业风格师",
          createdAt: new Date(2024, 0, 17),
        },
        {
          id: 18,
          image: require("assets/images/mock.jpg"),
          name: "简约装修",
          votes: 125,
          likes: 81,
          designer: "简约生活",
          createdAt: new Date(2024, 0, 18),
        },
      ],
    };
    return mockImages[categoryId as keyof typeof mockImages] || [];
  };

  const getCategoryTitle = (categoryId: string) => {
    const titles = {
      drinks: "饮料专场",
      packaging: "包装专场",
      logo: "Logo专场",
      decoration: "装修专场",
    };
    return titles[categoryId as keyof typeof titles] || "投票";
  };

  // 筛选图片的函数
  const getFilteredImages = (images: any[], filter: FilterOptions) => {
    const sortedImages = [...images];

    switch (filter.sortBy) {
      case "votes":
        sortedImages.sort((a, b) => {
          return filter.order === "desc"
            ? b.votes - a.votes
            : a.votes - b.votes;
        });
        break;

      case "name":
        sortedImages.sort((a, b) => {
          return filter.order === "desc"
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        });
        break;

      case "latest":
        sortedImages.sort((a, b) => {
          const timeA = a.createdAt.getTime();
          const timeB = b.createdAt.getTime();
          return filter.order === "desc" ? timeB - timeA : timeA - timeB;
        });
        break;

      case "likes":
        sortedImages.sort((a, b) => {
          return filter.order === "desc"
            ? b.likes - a.likes
            : a.likes - b.likes;
        });
        break;
    }

    return sortedImages;
  };

  // 应用筛选
  const handleFilterApply = (filterOptions: FilterOptions) => {
    setCurrentFilter(filterOptions);
    setShowFilter(false);
  };

  const images = getImagesForCategory(category);
  const filteredImages = getFilteredImages(images, currentFilter);
  const categoryTitle = getCategoryTitle(category);

  const handleImagePress = (imageId: number) => {
    navigation.navigate("VoteDetail", { imageId, category });
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        {/* 左边按钮 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* 中间标题区域 - 使用绝对定位居中 */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{categoryTitle}</Text>
          {/* <Text style={styles.filterIndicator}>{getFilterIndicatorText()}</Text> */}
        </View>

        {/* 右边按钮 */}
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

        <View style={styles.imagesGrid}>
          {filteredImages.map((item, index) => {
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.imageCard,
                  index % 2 === 0 ? styles.leftCard : styles.rightCard,
                ]}
                onPress={() => handleImagePress(item.id)}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={item.image}
                    style={styles.voteImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    <Text style={styles.imageName}>{item.name}</Text>
                  </View>
                </View>

                {/* 设计师信息和互动区域 */}
                <View style={styles.infoContainer}>
                  <Text style={styles.designerName}>{item.designer}</Text>
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Ionicons name="heart" size={14} color={colors.like} />
                      <Text style={styles.statText}>{item.likes}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="trophy" size={14} color={colors.yellow} />
                      <Text style={styles.statText}>{item.votes}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.voteButton}
                      onPress={() => handleImagePress(item.id)}
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
          })}
        </View>
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
    // zIndex: -1,
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
  // 新增的信息容器样式
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
