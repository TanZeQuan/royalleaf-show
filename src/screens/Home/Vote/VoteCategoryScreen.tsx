// screens/VoteMain/VoteMainScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHideTabBar } from "hooks/useHideTabBar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Category,
  voteService,
} from "../../../services/VoteService/voteCategoryApi";
import { styles } from "./Styles/VoteCategoryScreen";

type VoteNavigationProp = NativeStackNavigationProp<any>;

const VoteMainScreen = () => {
  const navigation = useNavigation<VoteNavigationProp>();
  useHideTabBar(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await voteService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryPress = (category: Category) => {
    navigation.navigate("VoteActivity", {
      category: category.cateId,
      categoryName: category.name,
    });
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
          <Text style={styles.headerTitle}>投票</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={styles.loadingIndicator.color} />
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
        <Text style={styles.headerTitle}>投票</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.subtitle}>选择您想参与的投票类别</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category.cateId ?? index}
              style={[
                styles.categoryWrapper,
                { marginBottom: index === categories.length - 1 ? 0 : 16 },
              ]}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.8}
            >
              <ImageBackground
                source={{ uri: category.image }}
                style={styles.categoryCard}
                imageStyle={styles.cardBackground}
                resizeMode="cover"
              >
                <View style={styles.categoryContentRow}>
                  <View style={styles.categoryContent}>
                    <Text style={styles.categoryTitle} numberOfLines={1}>
                      {category.name}
                    </Text>
                    <Text style={styles.categoryDescription} numberOfLines={2}>
                      {category.desc}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VoteMainScreen;