import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "styles";
import { MenuStackParamList } from "../../navigation/stacks/MenuNav/MenuStack";
import { fetchProductOptions, IceLevel, SizeOption, SugarLevel } from "services/MenuService/orderApi";

type OrderRouteProp = RouteProp<MenuStackParamList, "Order">;

export default function OrderScreen() {
  const route = useRoute<OrderRouteProp>();
  const navigation = useNavigation();
  const { item } = route.params; // 👈 从 MenuScreen 传过来的参数（含 productId / price / name）

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedIceLevel, setSelectedIceLevel] = useState<string>("");
  const [selectedSugarLevel, setSelectedSugarLevel] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<{
    sizes: SizeOption[];
    iceLevels: IceLevel[];
    sugarLevels: SugarLevel[];
  }>({
    sizes: [],
    iceLevels: [],
    sugarLevels: [],
  });

   useEffect(() => {
    const loadProductOptions = async () => {
      try {
        setLoading(true);
        // 使用 productId 而不是 category
        const productOptions = await fetchProductOptions(item.productId);

        setOptions(productOptions);

        // 设置默认选择
        if (productOptions.sizes.length > 0) {
          setSelectedSize(productOptions.sizes[0].name);
        }
        if (productOptions.iceLevels.length > 0) {
          setSelectedIceLevel(productOptions.iceLevels[0].name);
        }
        if (productOptions.sugarLevels.length > 0) {
          setSelectedSugarLevel(productOptions.sugarLevels[0].name);
        }

      } catch (error) {
        console.error("Failed to load product options:", error);
        Alert.alert("错误", "无法加载产品选项");
        setOptions({
          sizes: [],
          iceLevels: [],
          sugarLevels: [],
        });
      } finally {
        setLoading(false);
      }
    };

    if (item && item.productId) {
      loadProductOptions();
    } else {
      setLoading(false);
      Alert.alert("错误", "缺少产品信息");
    }
  }, [item]);

  const calculateTotalPrice = () => {
    const selectedSizeObj = options.sizes.find(
      (size) => size.name === selectedSize
    );
    const sizePrice = selectedSizeObj ? selectedSizeObj.price : 0;
    const basePrice = item?.price || 0;
    return (basePrice + sizePrice) * quantity;
  };

  const handleAddToCart = () => {
    console.log("添加到购物车:", {
      item: item.name,
      size: selectedSize,
      iceLevel: selectedIceLevel,
      sugarLevel: selectedSugarLevel,
      quantity,
      totalPrice: calculateTotalPrice(),
    });
    // 这里可以添加Redux action来添加到购物车
  };

  const handleClose = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.gold_deep} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
     <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>x</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="always"
        keyboardShouldPersistTaps="handled"
      >
        {/* 商品图片 */}
        <Image source={{ uri: item.image }} style={styles.productImage} />

        {/* 商品名称 */}
        <View style={styles.nameSection}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>

        {/* Promotion 促销信息 */}
        <View style={styles.promotionSection}>
          <Text style={styles.promotionText}>🔥 今日特价 - 第二杯半价</Text>
          <Text style={styles.promotionSubText}>购买任意两杯享受优惠</Text>
        </View>

        {/* 商品描述 */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>商品描述</Text>
          <Text style={styles.descriptionText}>
            {item.description ||
              "香浓的OREO饼干与丝滑奶油的完美结合，带来极致的口感体验。每一口都能感受到饼干的酥脆和奶油的绵密。"}
          </Text>
        </View>

        {/* 尺寸选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择尺寸</Text>
          {options.sizes.length > 0 ? (
            <>
              <Text style={styles.sectionSubtitle}>Select 1</Text>
              <View style={styles.sizeOptions}>
                {options.sizes.map((size) => (
                  <TouchableOpacity
                    key={size.id}
                    style={[
                      styles.sizeButton,
                      selectedSize === size.name && styles.selectedSizeButton,
                    ]}
                    onPress={() => setSelectedSize(size.name)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === size.name && styles.selectedSizeText,
                      ]}
                    >
                      {size.volume || size.name}
                    </Text>
                    <Text
                      style={[
                        styles.sizePrice,
                        selectedSize === size.name && styles.selectedSizeText,
                      ]}
                    >
                      +RM{size.price.toFixed(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.noOptionsText}>暂无尺寸选项</Text>
          )}
        </View>

        {/* 冰量选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择冰量</Text>
          {options.iceLevels.length > 0 ? (
            <View style={styles.iceOptions}>
              {options.iceLevels.map((ice) => (
                <TouchableOpacity
                  key={ice.id}
                  style={[
                    styles.iceButton,
                    selectedIceLevel === ice.name && styles.selectedIceButton,
                  ]}
                  onPress={() => setSelectedIceLevel(ice.name)}
                >
                  <Text
                    style={[
                      styles.iceText,
                      selectedIceLevel === ice.name && styles.selectedIceText,
                    ]}
                  >
                    {ice.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noOptionsText}>无法调整冰量</Text>
          )}
        </View>

        {/* 甜度选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择甜度</Text>
          {options.sugarLevels.length > 0 ? (
            <View style={styles.sugarOptions}>
              {options.sugarLevels.map((sugar) => (
                <TouchableOpacity
                  key={sugar.id}
                  style={[
                    styles.sugarButton,
                    selectedSugarLevel === sugar.name && styles.selectedSugarButton,
                  ]}
                  onPress={() => setSelectedSugarLevel(sugar.name)}
                >
                  <Text
                    style={[
                      styles.sugarText,
                      selectedSugarLevel === sugar.name && styles.selectedSugarText,
                    ]}
                  >
                    {sugar.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noOptionsText}>无法调整甜度</Text>
          )}
        </View>

        {/* 数量选择 */}
        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>数量:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 总价 */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>总计:</Text>
          <Text style={styles.totalPrice}>
            RM{calculateTotalPrice().toFixed(2)}
          </Text>
        </View>

        {/* 订单摘要 */}
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>订单摘要</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>尺寸:</Text>
            <Text style={styles.summaryValue}>{selectedSize || "无"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>冰量:</Text>
            <Text style={styles.summaryValue}>{selectedIceLevel || "无"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>甜度:</Text>
            <Text style={styles.summaryValue}>{selectedSugarLevel || "无"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>数量:</Text>
            <Text style={styles.summaryValue}>{quantity}杯</Text>
          </View>
        </View>

        {/* 添加到购物车按钮 */}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>添加到购物车</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary_bg,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "FuturaPT-Medium",
    color: theme.colors.gray_text,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary_bg,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: theme.colors.gold_deep,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: theme.colors.white,
    fontWeight: "bold",
    lineHeight: 24,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  productImage: {
    width: "100%",
    height: 310,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 20,
    resizeMode: "cover",
  },
  nameSection: {
    marginBottom: 15,
    alignItems: "center",
  },
  itemName: {
    fontSize: 24,
    fontFamily: "FuturaPT-Bold",
    color: theme.colors.black,
    textAlign: "center",
  },
  promotionSection: {
    backgroundColor: theme.colors.gold_light,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.gold_deep,
  },
  promotionText: {
    fontSize: 16,
    fontFamily: "FuturaPT-Demi",
    color: theme.colors.gold_deep,
    marginBottom: 5,
  },
  promotionSubText: {
    fontSize: 14,
    fontFamily: "FuturaPT-Light",
    lineHeight: 20,
    color: theme.colors.gray_text,
  },
  descriptionSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray_text,
  },
  descriptionTitle: {
    fontSize: 16,
    fontFamily: "FuturaPT-Demi",
    color: theme.colors.black,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: "FuturaPT-Light",
    color: theme.colors.gray_text,
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray_text,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "FuturaPT-Demi",
    color: theme.colors.black,
    marginBottom: 10,
    lineHeight: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "FuturaPT-Light",
    color: theme.colors.gray_text,
    marginBottom: 15,
  },
  noOptionsText: {
    fontSize: 14,
    fontFamily: "FuturaPT-Light",
    color: theme.colors.gray_text,
    textAlign: "center",
    padding: 10,
  },
  sizeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  sizeButton: {
    flex: 1,
    padding: 15,
    borderWidth: 2,
    borderColor: theme.colors.gray_text,
    borderRadius: 10,
    alignItems: "center",
  },
  selectedSizeButton: {
    borderColor: theme.colors.gold_deep,
    backgroundColor: theme.colors.gold_light,
  },
  sizeText: {
    fontSize: 16,
    fontFamily: "FuturaPT-Medium",
    color: theme.colors.black,
  },
  sizePrice: {
    fontSize: 14,
    fontFamily: "FuturaPT-Light",
    color: theme.colors.gray_text,
    marginTop: 5,
  },
  selectedSizeText: {
    color: theme.colors.black,
  },
  iceOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  iceButton: {
    width: "48%",
    padding: 12,
    borderWidth: 2,
    borderColor: theme.colors.gray_text,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  selectedIceButton: {
    borderColor: theme.colors.gold_deep,
    backgroundColor: theme.colors.gold_light,
  },
  iceText: {
    fontSize: 14,
    fontFamily: "FuturaPT-Medium",
    color: theme.colors.black,
  },
  selectedIceText: {
    color: theme.colors.black,
  },
  sugarOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  sugarButton: {
    width: "48%",
    padding: 12,
    borderWidth: 2,
    borderColor: theme.colors.gray_text,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  selectedSugarButton: {
    borderColor: theme.colors.gold_deep,
    backgroundColor: theme.colors.gold_light,
  },
  sugarText: {
    fontSize: 14,
    fontFamily: "FuturaPT-Medium",
    color: theme.colors.black,
  },
  selectedSugarText: {
    color: theme.colors.black,
  },
  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 15,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray_text,
  },
  quantityLabel: {
    fontSize: 16,
    fontFamily: "FuturaPT-Demi",
    color: theme.colors.black,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gold_deep,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 20,
    color: theme.colors.white,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    fontFamily: "FuturaPT-Demi",
    color: theme.colors.black,
    marginHorizontal: 15,
    minWidth: 30,
    textAlign: "center",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray_text,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: "FuturaPT-Demi",
    color: theme.colors.black,
  },
  totalPrice: {
    fontSize: 20,
    fontFamily: "FuturaPT-Bold",
    color: theme.colors.gold_deep,
  },
  orderSummary: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray_text,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: "FuturaPT-Demi",
    color: theme.colors.black,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray_text,
    paddingBottom: 10,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "FuturaPT-Medium",
    color: theme.colors.gray_text,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: "FuturaPT-Demi",
    color: theme.colors.black,
  },
  addToCartButton: {
    backgroundColor: theme.colors.gold_deep,
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  addToCartText: {
    fontSize: 18,
    fontFamily: "FuturaPT-Demi",
    color: theme.colors.white,
  },
});