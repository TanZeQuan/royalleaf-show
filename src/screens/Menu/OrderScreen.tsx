import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchProductOptions, IceLevel, SizeOption, SugarLevel } from "services/MenuService/orderApi";
import { theme } from "styles";
import { MenuStackParamList } from "../../navigation/stacks/MenuNav/MenuStack";
import { styles } from "./OrderCSS";

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