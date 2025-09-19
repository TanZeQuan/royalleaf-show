import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { theme } from "styles";
import { MenuStackParamList } from "../../navigation/stacks/MenuNav/MenuStack";
import {
  Category,
  fetchCategories,
  fetchProductsByCategory,
  ProductWithLists,
} from "../../services/MenuService/menuApi";

type MenuScreenNavigationProp = NativeStackNavigationProp<
  MenuStackParamList,
  "Menu"
>;

interface MenuItem {
  id: string;
  name: string;
  price: number;
  priceori: number;
  description: string;
  image: string;
}

export default function MenuScreen() {
  const navigation = useNavigation<MenuScreenNavigationProp>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [productsWithLists, setProductsWithLists] = useState<ProductWithLists[]>(
    []
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const selected = useSelector((state: RootState) => state.menu.selectedItem);

  // 加载分类
  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategories();
      setCategories(data);
      if (data.length > 0) setActiveCategory(data[0].cateId);
    }
    loadCategories();
  }, []);

  // 当activeCategory变化时加载对应分类的产品
  useEffect(() => {
    async function loadProducts() {
      if (activeCategory) {
        setLoading(true);
        const data = await fetchProductsByCategory(activeCategory);
        setProductsWithLists(data);
        setLoading(false);
      }
    }
    loadProducts();
  }, [activeCategory]);

  const renderMenuItem = ({ item }: { item: ProductWithLists }) => {
    const firstList = item.productLists[0];
    const price = firstList?.amount || 0;
    const description = item.product.desc || firstList?.desc || "No description";

    const menuItem: MenuItem = {
      id: item.product.id.toString(),
      name: item.product.name,
      price: price,
      priceori: price,
      description: description,
      image: item.product.image,
    };

    return (
      <TouchableOpacity
        style={[
          styles.menuItem,
          selected?.id === menuItem.id && styles.selectedMenuItem,
        ]}
        onPress={() => {
          const product = {
            id: item.product.productId,
            productId: item.product.productId,
            name: item.product.name,
            desc: item.product.desc,
            image: item.product.image,
            category: item.product.category,
            price: item.productLists[0]?.amount || 0,
            description: item.product.desc || item.productLists[0]?.desc || "",
          };

          navigation.navigate("Order", { item: product });
        }}
      >
        <View style={styles.menuItemHeader}>
          <Image
            source={{ uri: menuItem.image }}
            style={styles.menuItemPic}
            resizeMode="contain"
          />

          <View style={styles.menuItemInfo}>
            <View>
              <Text style={styles.menuItemName}>{menuItem.name}</Text>
              <Text style={styles.menuItemDescription}>
                {menuItem.description}
              </Text>
            </View>

            <View style={styles.menuItemPrice}>
              <Text style={styles.menuItemPrice1}>RM</Text>
              <Text style={styles.menuItemPrice2}>
                {menuItem.price.toFixed(2)}
              </Text>
              <TouchableOpacity
                style={styles.menuItemPriceCircle}
                onPress={() => {
                  const firstList = item.productLists[0];
                  const price = firstList?.amount || 0;

                  navigation.navigate("Order", {
                    item: {
                      id: item.product.productId,
                      productId: item.product.productId,
                      name: item.product.name,
                      desc: item.product.desc,
                      image: item.product.image,
                      category: item.product.category,
                      price: price,
                      description:
                        item.product.desc || firstList?.desc || "",
                    },
                  });
                }}
              >
                <Text style={styles.menuItemPrice4}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.header1}>
        <Text style={styles.headerTitle}>PICK UP</Text>
        <Text style={styles.headerTitle}>DELIVERY</Text>
      </View>
      <View style={styles.header2}>
        <Text style={styles.headerdesc}>Place(to be connect)</Text>
        <Text style={styles.headerLine}>|</Text>
        <Text style={styles.headerdesc}>Distance(to be connect)</Text>
        <Text style={styles.headerArrow}>›</Text>
      </View>
      <View style={styles.header3}>
        <Text style={styles.headerdescbold}>
          Order now, made instantly.
        </Text>
      </View>

      {/* 内容区 */}
      <View style={styles.content}>
        {/* 左边分类 */}
        <View style={styles.sidebar}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.cateId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  activeCategory === item.cateId && styles.activeCategoryItem,
                ]}
                onPress={() => setActiveCategory(item.cateId)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === item.cateId && styles.activeCategoryText,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* 右边菜单 */}
        <View style={styles.menuContainer}>
          <Text style={styles.categoryTitle}>
            {categories.find((c) => c.cateId === activeCategory)?.name || ""}
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.gold_deep} />
          ) : (
            <FlatList
              data={productsWithLists}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderMenuItem}
              contentContainerStyle={styles.menuList}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary_bg, },
  header1: {
    backgroundColor: theme.colors.primary_bg,
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 5,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  header2: {
    backgroundColor: theme.colors.primary_bg,
    flexDirection: "row",
    paddingBottom: 0,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  header3: {
    backgroundColor: theme.colors.primary_bg,
    flexDirection: "row",
    paddingBottom: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  headerLine: {
    fontSize: 20,
    fontFamily: "FuturaPT-Bold",
    color: theme.colors.gold_deep,
    marginBottom: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "FuturaPT-Medium",
    color: theme.colors.black,
    marginBottom: 5,
    marginRight: 20,
  },
  headerArrow: {
    fontSize: 24,
    fontFamily: "FuturaPT-Medium",
    color: theme.colors.black,
    marginBottom: 5,
    marginRight: 20,
  },
  headerdesc: {
    fontSize: 15,
    fontFamily: "FuturaPT-Light",
    color: theme.colors.black,
    marginBottom: 5,
    marginRight: 10,
  },
  headerdescbold: {
    fontSize: 16,
    fontFamily: "FuturaPT-Bold",
    color: theme.colors.gold_deep,
    marginBottom: 5,
    marginRight: 10,
  },
  content: { flex: 1, flexDirection: "row" },
  sidebar: {
    width: 100,
    backgroundColor: theme.colors.primary_bg,
    borderRightWidth: 1,
    borderRightColor: theme.colors.gray_text,
  },
  categoryItem: {
    width: 100,
    height: 121,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  activeCategoryItem: { backgroundColor: theme.colors.gold_deep },
  categoryText: {
    fontSize: 15,
    textAlign: "center",
    color: theme.colors.black,
    fontWeight: "500",
  },
  activeCategoryText: { color: theme.colors.white, fontWeight: "600" },
  menuContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary_bg,
    paddingTop: 15,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  menuList: { paddingBottom: 20 },
  menuItem: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  selectedMenuItem: {
    borderColor: "#8B4513",
    borderWidth: 2,
    backgroundColor: "#fff8f0",
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  menuItemPic: {
    width: 94,
    height: 94,
    marginRight: 12,
    marginTop: 2,
    borderRadius: 8,
  },
  menuItemInfo: {
    flex: 1,
    height: 100,
  },
  menuItemName: {
    fontFamily: "FuturaPT-Demi",
    fontSize: 16,
    color: theme.colors.black,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    color: theme.colors.gray_text,
    lineHeight: 18,
  },
  menuItemPrice: {
    flexDirection: "row",
    marginTop: "auto",
    height: 30,
    justifyContent: "space-between",
  },
  menuItemPrice1: {
    fontSize: 16,
    fontFamily: "FuturaPT-Demi",
    color: theme.colors.black,
    marginTop: "auto",
    marginRight: 5,
  },
  menuItemPrice2: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.black,
    marginTop: "auto",
  },
  menuItemPrice3: {
    fontSize: 12,
    color: theme.colors.gray_text,
    lineHeight: 18,
    marginTop: "auto",
    marginLeft: 10,
  },
  menuItemPriceCircle: {
    width: 23,
    height: 23,
    borderRadius: 14,
    backgroundColor: theme.colors.gold_deep,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  menuItemPrice4: {
    fontSize: 20,
    lineHeight: 20,
    fontFamily: "Inter-ExtraBold",
    color: theme.colors.white,
  },
  menuItemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  addButton: {
    flex: 1,
    backgroundColor: "#8B4513",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  removeButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  removeButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  footer: {
    backgroundColor: "#8B4513",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});