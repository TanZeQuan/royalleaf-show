import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
    FlatList,
    ActivityIndicator,
    Modal,
    TextInput,
    Switch,
    Alert,
    ScrollView,
    Platform,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { typography, colors } from "styles";
import styles from "../../Home/Creator/CreatorStyles";
import { ContestEntry, RouteParams } from "../Creator/CreatorSlice";
import { CreatorStackParamList } from "../../../navigation/stacks/CreatorStack";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

type MySubmissionsNavigationProp =
    NativeStackNavigationProp<CreatorStackParamList>;

const MySubmissionsScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<MySubmissionsNavigationProp>();
    const route = useRoute();
    const params = route.params as RouteParams;

    const [entries, setEntries] = useState<ContestEntry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<ContestEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // 上传相关状态
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [imageSourceModalVisible, setImageSourceModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [entryTitle, setEntryTitle] = useState("");
    const [entryDescription, setEntryDescription] = useState("");
    const [isPublicEntry, setIsPublicEntry] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");

    const statusOptions = [
        { value: "all", label: "全部" },
        { value: "pending", label: "待审核" },
        { value: "approved", label: "通过" },
        { value: "rejected", label: "拒绝" },
    ];

    // Request permissions when component mounts
    useEffect(() => {
        requestPermissions();
        loadEntries();
    }, []);

    useEffect(() => {
        filterEntries();
    }, [entries, filterStatus, params?.selectedCategory]);

    // Request camera and media library permissions
    const requestPermissions = async () => {
        try {
            // Request camera permissions
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            
            // Request media library permissions
            const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (cameraPermission.status !== 'granted') {
                console.warn('Camera permission not granted');
            }
            
            if (mediaLibraryPermission.status !== 'granted') {
                console.warn('Media library permission not granted');
            }
        } catch (error) {
            console.error('Error requesting permissions:', error);
        }
    };

    const loadEntries = async () => {
        setIsLoading(true);
        try {
            let allEntries: ContestEntry[] = [];

            if (params?.entries) {
                allEntries = params.entries.map((entry: any) => ({
                    ...entry,
                    submittedAt: new Date(entry.submittedAt),
                    reviewedAt: entry.reviewedAt ? new Date(entry.reviewedAt) : undefined,
                }));
            } else {
                const storedEntries = await AsyncStorage.getItem("contestEntries");
                if (storedEntries) {
                    allEntries = JSON.parse(storedEntries).map((entry: any) => ({
                        ...entry,
                        submittedAt: new Date(entry.submittedAt),
                        reviewedAt: entry.reviewedAt
                            ? new Date(entry.reviewedAt)
                            : undefined,
                    }));
                }
            }

            // 添加一些示例数据供演示
            if (allEntries.length === 0) {
                const mockEntries: ContestEntry[] = [
                    {
                        id: "1",
                        category: "product_innovation",
                        categoryName: "产品创新",
                        image: "https://picsum.photos/400/300?random=1",
                        title: "智能垃圾分类系统",
                        description: "基于AI识别的智能垃圾分类解决方案",
                        status: "approved",
                        submittedAt: new Date("2024-01-15"),
                        feedback: "创意很好，符合要求！",
                        likes: 128,
                        views: 567,
                        isPublic: true,
                        authorName: "当前用户",
                    },
                    {
                        id: "2",
                        category: "service_optimization",
                        categoryName: "服务优化",
                        image: "https://picsum.photos/400/300?random=2",
                        title: "外卖配送路径优化",
                        description: "通过算法优化外卖配送路径，提高效率",
                        status: "rejected",
                        submittedAt: new Date("2024-01-10"),
                        feedback: "方案不够具体，缺少技术实现细节，请重新完善后再次提交。",
                        likes: 45,
                        views: 234,
                        isPublic: false,
                        authorName: "当前用户",
                    },
                    {
                        id: "3",
                        category: "marketing_strategy",
                        categoryName: "营销策略",
                        image: "https://picsum.photos/400/300?random=3",
                        title: "社交媒体营销策略",
                        description: "基于数据分析的精准营销方案",
                        status: "pending",
                        submittedAt: new Date("2024-01-20"),
                        likes: 0,
                        views: 89,
                        isPublic: true,
                        authorName: "当前用户",
                    },
                ];
                allEntries = mockEntries;
                await AsyncStorage.setItem(
                    "contestEntries",
                    JSON.stringify(mockEntries)
                );
            }

            setEntries(allEntries);
        } catch (error) {
            console.error("Error loading entries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterEntries = () => {
        let filtered = [...entries];

        // 如果指定了分类，先按分类筛选
        if (params?.selectedCategory) {
            filtered = filtered.filter(
                (entry) => entry.category === params.selectedCategory
            );
        }

        // 再按状态筛选
        if (filterStatus !== "all") {
            filtered = filtered.filter((entry) => entry.status === filterStatus);
        }

        setFilteredEntries(filtered);
    };

    const handleGoBack = () => navigation.goBack();

    const showUploadModal = () => {
        setUploadModalVisible(true);
    };

    const selectImageSource = () => {
        setUploadModalVisible(false);
        setImageSourceModalVisible(true);
    };

    const selectImageFromLibrary = async () => {
        setImageSourceModalVisible(false);

        try {
            // Check permission first
            const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
            
            if (permission.status !== 'granted') {
                const requestPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                
                if (requestPermission.status !== 'granted') {
                    Alert.alert(
                        "权限需要",
                        "请在设置中允许访问相册权限以选择图片",
                        [
                            { text: "取消", style: "cancel" },
                            { 
                                text: "去设置", 
                                onPress: () => {
                                    if (Platform.OS === 'ios') {
                                        // For iOS, we can't directly open settings, but we can show instructions
                                        Alert.alert(
                                            "开启相册权限",
                                            "请前往 设置 > 隐私与安全性 > 照片 > 找到此应用并开启权限",
                                            [{ text: "知道了" }]
                                        );
                                    }
                                }
                            }
                        ]
                    );
                    return;
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
                allowsMultipleSelection: false,
                selectionLimit: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImage(result.assets[0].uri);
                setUploadModalVisible(true);
            }
        } catch (error) {
            console.error("打开相册失败:", error);
            Alert.alert("错误", "无法打开相册，请稍后再试");
        }
    };

    const selectImageFromCamera = async () => {
        setImageSourceModalVisible(false);

        try {
            // Check permission first
            const permission = await ImagePicker.getCameraPermissionsAsync();
            
            if (permission.status !== 'granted') {
                const requestPermission = await ImagePicker.requestCameraPermissionsAsync();
                
                if (requestPermission.status !== 'granted') {
                    Alert.alert(
                        "权限需要",
                        "请在设置中允许相机权限以拍照",
                        [
                            { text: "取消", style: "cancel" },
                            { 
                                text: "去设置", 
                                onPress: () => {
                                    if (Platform.OS === 'ios') {
                                        Alert.alert(
                                            "开启相机权限",
                                            "请前往 设置 > 隐私与安全性 > 相机 > 找到此应用并开启权限",
                                            [{ text: "知道了" }]
                                        );
                                    }
                                }
                            }
                        ]
                    );
                    return;
                }
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImage(result.assets[0].uri);
                setUploadModalVisible(true);
            }
        } catch (error) {
            console.error("打开相机失败:", error);
            Alert.alert("错误", "无法打开相机，请稍后再试");
        }
    };

    const handleConfirmSubmission = () => {
        if (!entryTitle.trim()) {
            showCustomNotification("提示", "请输入创意标题");
            return;
        }
        if (!entryDescription.trim()) {
            showCustomNotification("提示", "请输入创意描述");
            return;
        }
        if (!selectedImage) {
            showCustomNotification("提示", "请选择一张图片");
            return;
        }
        setUploadModalVisible(false);
        setConfirmModalVisible(true);
    };

    const showCustomNotification = (title: string, message: string) => {
        setNotificationTitle(title);
        setNotificationMessage(message);
        setShowNotification(true);

        // 3秒后自动关闭
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };

    const resetEntryForm = () => {
        setEntryTitle("");
        setEntryDescription("");
        setIsPublicEntry(true);
        setSelectedImage(null);
    };

    const handleSubmitEntry = async () => {
        setConfirmModalVisible(false);
        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const newEntry: ContestEntry = {
                id: Date.now().toString(),
                category: params?.selectedCategory || "general",
                categoryName: params?.categoryName || "通用",
                image: selectedImage!,
                title: entryTitle,
                description: entryDescription,
                status: "pending",
                submittedAt: new Date(),
                likes: 0,
                views: 0,
                isPublic: isPublicEntry,
                authorName: "当前用户",
            };

            const updatedEntries = [...entries, newEntry];
            setEntries(updatedEntries);
            await AsyncStorage.setItem(
                "contestEntries",
                JSON.stringify(updatedEntries)
            );

            setSuccessModalVisible(true);
            resetEntryForm();
        } catch (error) {
            Alert.alert("错误", "创意提交失败，请稍后重试");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusText = (status: ContestEntry["status"]) => {
        switch (status) {
            case "approved":
                return "已通过";
            case "rejected":
                return "已拒绝";
            case "pending":
                return "审核中";
            default:
                return status;
        }
    };

    const getStatusColor = (status: ContestEntry["status"]) => {
        switch (status) {
            case "approved":
                return colors.success;
            case "rejected":
                return colors.error;
            case "pending":
                return colors.pending;
            default:
                return colors.gray_text;
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const renderEntry = ({ item }: { item: ContestEntry }) => (
        <View style={styles.entryCard}>
            <Image source={{ uri: String(item.image) }} style={styles.entryImage} />
            <View style={styles.entryContent}>
                <Text style={styles.entryTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.entryCategory}>{item.categoryName}</Text>

                <View style={styles.statusRow}>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(item.status) },
                        ]}
                    >
                        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                    </View>
                    <Text style={styles.dateText}>{formatDate(item.submittedAt)}</Text>
                </View>

                {item.status === "rejected" && item.feedback && (
                    <View style={styles.rejectionReasonContainer}>
                        <Text style={styles.rejectionReasonText}>
                            拒绝原因: {item.feedback}
                        </Text>
                    </View>
                )}

                <View style={styles.statsRow}>
                    <Text style={styles.statText}>👁 {item.views}</Text>
                    <Text style={styles.statText}>❤️ {item.likes}</Text>
                </View>
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.gold_deep} />
                    <Text style={styles.loadingText}>加载中...</Text>
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
                <Text style={styles.headerTitle}>
                    {params?.categoryName
                        ? `${params.categoryName} - 我的创意`
                        : "我的创意"}
                </Text>
                <TouchableOpacity style={styles.uploadButton} onPress={showUploadModal}>
                    <Text style={styles.uploadButtonText}>上传</Text>
                </TouchableOpacity>
            </View>

            {/* 状态筛选 */}
            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterRow}
                >
                    {statusOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.filterButton,
                                filterStatus === option.value && styles.activeFilterButton,
                            ]}
                            onPress={() => setFilterStatus(option.value)}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    filterStatus === option.value &&
                                    styles.activeFilterButtonText,
                                ]}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <Text style={styles.countText}>{filteredEntries.length}份</Text>
            </View>

            {/* 投稿列表 */}
            <FlatList
                data={filteredEntries}
                renderItem={renderEntry}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📝</Text>
                        <Text style={styles.emptyTitle}>暂无创意投稿</Text>
                        <Text style={styles.emptyMessage}>
                            {params?.selectedCategory
                                ? `您在"${params.categoryName}"分类下还没有作品`
                                : "您还没有投稿作品"}
                            {"\n"}点击右上角"上传"按钮开始创作！
                        </Text>
                    </View>
                }
            />

            {/* 上传作品弹窗 */}
            <Modal
                visible={uploadModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setUploadModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        {/* 点击外部关闭 Modal */}
                        <TouchableOpacity
                            style={StyleSheet.absoluteFill} // 占满整个屏幕
                            activeOpacity={1}
                            onPress={() => {
                                setUploadModalVisible(false);
                                resetEntryForm();
                            }}
                        />

                        {/* Modal 内部内容，点击不会关闭 */}
                        <ScrollView style={styles.formModalScroll}>
                            <View style={styles.formModalContent}>
                                <Text style={styles.modalTitle}>
                                    上传创意作品 - {params?.categoryName || "通用"}
                                </Text>

                                {selectedImage ? (
                                    <Image
                                        source={{ uri: selectedImage }}
                                        style={styles.previewImage}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <TouchableOpacity
                                        style={styles.imagePlaceholder}
                                        onPress={selectImageSource}
                                    >
                                        <Text style={styles.imagePlaceholderText}>
                                            点击选择图片
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <View style={styles.formSection}>
                                    <Text style={styles.formLabel}>创意标题 *</Text>
                                    <TextInput
                                        style={styles.formInput}
                                        value={entryTitle}
                                        onChangeText={setEntryTitle}
                                        placeholder="请输入您的创意标题"
                                        maxLength={50}
                                    />
                                </View>

                                <View style={styles.formSection}>
                                    <Text style={styles.formLabel}>创意描述 *</Text>
                                    <TextInput
                                        style={[styles.formInput, styles.formTextArea]}
                                        value={entryDescription}
                                        onChangeText={setEntryDescription}
                                        placeholder="请详细描述您的创意想法、实施方案等"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={50}
                                    />
                                    <Text style={styles.charCount}>
                                        {entryDescription.length}/50
                                    </Text>
                                </View>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.cancelButton]}
                                        onPress={() => {
                                            setUploadModalVisible(false);
                                            resetEntryForm();
                                        }}
                                    >
                                        <Text style={styles.cancelButtonText}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.confirmButton]}
                                        onPress={handleConfirmSubmission}
                                    >
                                        <Text style={styles.confirmButtonText}>确认提交</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* 图片来源选择弹窗 */}
            <Modal
                visible={imageSourceModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setImageSourceModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    {/* 点击外部关闭 Modal */}
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => setImageSourceModalVisible(false)}
                    />

                    {/* Modal 内部内容 */}
                    <View style={styles.sourceModalContent}>
                        <Text style={styles.modalTitle}>选择图片来源</Text>
                        <TouchableOpacity
                            style={styles.sourceButton}
                            onPress={selectImageFromCamera}
                        >
                            <Text style={styles.sourceButtonText}>拍照</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.sourceButton}
                            onPress={selectImageFromLibrary}
                        >
                            <Text style={styles.sourceButtonText}>从相册选择</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.sourceButton, styles.cancelSourceButton]}
                            onPress={() => setImageSourceModalVisible(false)}
                        >
                            <Text style={styles.cancelSourceButtonText}>取消</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* 确认提交弹窗 */}
            <Modal
                visible={confirmModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setConfirmModalVisible(false)}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalOverlay}>
                        {/* 点击外部关闭 Modal */}
                        <TouchableOpacity
                            style={StyleSheet.absoluteFill} // 占满整个屏幕
                            activeOpacity={1}
                            onPress={() => setConfirmModalVisible(false)}
                        />

                        {/* Modal 内部内容，点击不会关闭 */}
                        <View style={styles.confirmModalContent}>
                            <Text style={styles.confirmTitle}>确认提交</Text>
                            <Text style={styles.confirmNote}>
                                提交后将进入审核流程，请耐心等待结果。通过审核后，其他会员就能浏览、投票和评论你的创意！
                            </Text>
                            <View style={styles.confirmButtons}>
                                <TouchableOpacity
                                    style={[styles.confirmButton, styles.cancelConfirmButton]}
                                    onPress={() => setConfirmModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.confirmButton, styles.submitButton]}
                                    onPress={handleSubmitEntry}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={styles.submitButtonText}>确认</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* 提交成功弹窗 */}
            <Modal
                visible={successModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setSuccessModalVisible(false)}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalOverlay}>
                        {/* 点击外部关闭 Modal */}
                        <TouchableOpacity
                            style={StyleSheet.absoluteFill} // 占满整个屏幕
                            activeOpacity={1}
                            onPress={() => setSuccessModalVisible(false)}
                        />

                        {/* Modal 内部内容，点击不会关闭 */}
                        <View style={styles.successModalContent}>
                            <Text style={styles.successIcon}>🎉</Text>
                            <Text style={styles.successTitle}>提交成功！</Text>
                            <Text style={styles.successMessage}>
                                您的创意已提交，请耐心等待审核结果！{"\n"}
                                你的创意很快就能被大家看见！
                            </Text>
                            <TouchableOpacity
                                style={styles.successButton}
                                onPress={() => setSuccessModalVisible(false)}
                            >
                                <Text style={styles.successButtonText}>知道了</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal
                visible={showNotification}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowNotification(false)}
            >
                <View style={styles.notificationOverlay}>
                    <View style={styles.notificationContainer}>
                        <Text style={styles.notificationTitle}>
                            {notificationTitle}
                        </Text>
                        <Text style={styles.notificationMessage}>
                            {notificationMessage}
                        </Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default MySubmissionsScreen;