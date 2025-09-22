import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import {
  Category,
  fetchCategories,
  fetchProductsByCategory,
  ProductWithLists,
} from "services/MenuService/menuApi";
import { RootState } from "store";
import { theme } from "styles";
import { MenuStackParamList } from "../../navigation/stacks/MenuNav/MenuStack";
import { styles } from "./MenuCSS";

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