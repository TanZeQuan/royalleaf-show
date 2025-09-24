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
  sortBy: "votes" | "name" | "latest";
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
          name: "投票数: 100",
          votes: 100,
          createdAt: new Date(2024, 0, 1), // 添加创建日期用于最新排序
        },
        {
          id: 2,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 120",
          votes: 120,
          createdAt: new Date(2024, 0, 2),
        },
        {
          id: 3,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
          votes: 100,
          createdAt: new Date(2024, 0, 3),
        },
        {
          id: 4,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 50",
          votes: 50,
          createdAt: new Date(2024, 0, 4),
        },
        {
          id: 5,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 130",
          votes: 130,
          createdAt: new Date(2024, 0, 5),
        },
        {
          id: 6,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 70",
          votes: 70,
          createdAt: new Date(2024, 0, 6),
        },
      ],
      packaging: [
        {
          id: 7,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
          votes: 100,
          createdAt: new Date(2024, 0, 7),
        },
        {
          id: 8,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 90",
          votes: 90,
          createdAt: new Date(2024, 0, 8),
        },
        {
          id: 9,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 110",
          votes: 110,
          createdAt: new Date(2024, 0, 9),
        },
        {
          id: 10,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 80",
          votes: 80,
          createdAt: new Date(2024, 0, 10),
        },
      ],
      logo: [
        {
          id: 11,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
          votes: 100,
          createdAt: new Date(2024, 0, 11),
        },
        {
          id: 12,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 120",
          votes: 120,
          createdAt: new Date(2024, 0, 12),
        },
        {
          id: 13,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 95",
          votes: 95,
          createdAt: new Date(2024, 0, 13),
        },
        {
          id: 14,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 105",
          votes: 105,
          createdAt: new Date(2024, 0, 14),
        },
      ],
      decoration: [
        {
          id: 15,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
          votes: 100,
          createdAt: new Date(2024, 0, 15),
        },
        {
          id: 16,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 85",
          votes: 85,
          createdAt: new Date(2024, 0, 16),
        },
        {
          id: 17,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 115",
          votes: 115,
          createdAt: new Date(2024, 0, 17),
        },
        {
          id: 18,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 125",
          votes: 125,
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
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>选择您想投票的选项</Text>

        <View style={styles.imagesGrid}>
          {filteredImages.map((item, index) => (
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
            </TouchableOpacity>
          ))}
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
    borderBottomColor: "rgba(215, 167, 64, 0.1)",
    position: "relative",
  },
  headerCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
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
    width: 35, // 与左边按钮相同的宽度
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
    color: colors.gray_deep,
    fontWeight: "600",
  },
  applyButton: {
    padding: 12,
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.gold_deep,
    borderRadius: 6,
  },
  applyText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default VoteImagesScreen;
