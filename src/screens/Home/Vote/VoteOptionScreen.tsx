import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { typography, colors } from "styles";

const { width } = Dimensions.get("window");
const imageSize = (width - 70) / 2; // 2 images per row with margins

type VoteImagesNavigationProp = NativeStackNavigationProp<any>;

interface RouteParams {
  category: string;
}

const VoteImagesScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<VoteImagesNavigationProp>();
  const route = useRoute();
  const { category } = route.params as RouteParams;

  // Mock data for different categories
  const getImagesForCategory = (categoryId: string) => {
    const mockImages = {
      drinks: [
        {
          id: 1,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
        },
        {
          id: 2,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 120",
        },
        {
          id: 3,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
        },
        {
          id: 4,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 50",
        },
        {
          id: 5,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 130",
        },
        {
          id: 6,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 70",
        },
      ],
      packaging: [
        {
          id: 7,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
        },
        {
          id: 8,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
        },
        {
          id: 9,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
        },
        {
          id: 10,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
        },
      ],
      logo: [
        {
          id: 11,
          image: require("assets/images/mock.jpg"),
          name: "投票数:100",
        },
        {
          id: 12,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
        },
        {
          id: 13,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
        },
        {
          id: 14,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
        },
      ],
      decoration: [
        {
          id: 15,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
        },
        {
          id: 16,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
        },
        {
          id: 17,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
        },
        {
          id: 18,
          image: require("assets/images/mock.jpg"),
          name: "投票数: 100",
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

  const images = getImagesForCategory(category);
  const categoryTitle = getCategoryTitle(category);

  const handleImagePress = (imageId: number) => {
    navigation.navigate("VoteDetail", { imageId, category });
  };

  const handleGoBack = () => navigation.goBack();

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
        <Text style={styles.headerTitle}>{categoryTitle}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>选择您想投票的选项</Text>

        <View style={styles.imagesGrid}>
          {images.map((item, index) => (
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
  backIcon: {
    fontSize: 20,
    color: colors.black,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
  },
  placeholder: {
    width: 32,
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
    fontWeight: "semibold",
    color: colors.black,
    textAlign: "center",
  },
});

export default VoteImagesScreen;
