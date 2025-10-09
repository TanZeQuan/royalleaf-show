import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Keyboard,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { colors } from "styles";
import { CreatorStackParamList } from "../../../navigation/stacks/HomeNav/CreatorStack";
import styles from "../../Home/Creator/CreatorStyles";
import { ContestEntry, RouteParams } from "../Creator/CreatorSlice";

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

    // 活动选择相关状态
    const [availableActivities, setAvailableActivities] = useState<any[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<string>("");
    const [activitiesLoading, setActivitiesLoading] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);

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
        fetchActivities();
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

    // 获取投稿开放的活动
    const fetchActivities = async () => {
        setActivitiesLoading(true);
        try {
            const response = await fetch('http://192.168.0.122:8080/royal/api/votes/submission-open', {
                method: 'GET',
                headers: {
                    'accept': '*/*'
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setAvailableActivities(result.data);
                    // 默认选择第一个活动
                    if (result.data.length > 0) {
                        setSelectedActivity(result.data[0].id.toString());
                    }
                } else {
                    console.error('No available activities');
                    setAvailableActivities([]);
                }
            } else {
                console.error('Failed to fetch activities:', response.status);
                setAvailableActivities([]);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            setAvailableActivities([]);
        } finally {
            setActivitiesLoading(false);
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
        if (availableActivities.length === 0) {
            showCustomNotification("提示", "当前没有可用的投稿活动");
            return;
        }
        if (!selectedActivity) {
            showCustomNotification("提示", "请选择投稿活动");
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
        // 重置为第一个活动（如果有）
        if (availableActivities.length > 0) {
            setSelectedActivity(availableActivities[0].id.toString());
        }
    };

    const handleSubmitEntry = async () => {
        setConfirmModalVisible(false);
        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const selectedActivityObj = availableActivities.find(
                activity => activity.id.toString() === selectedActivity
            );

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
                onRequestClose={() => {
                    setUploadModalVisible(false);
                    setDropdownVisible(false);
                }}
            >
                <View style={styles.modalOverlay}>
                    {/* 点击外部关闭 Modal */}
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => {
                            if (dropdownVisible) {
                                setDropdownVisible(false);
                            } else {
                                setUploadModalVisible(false);
                                resetEntryForm();
                            }
                        }}
                    />

                    {/* Modal 内部内容，点击不会关闭 */}
                    <TouchableWithoutFeedback onPress={() => {}}>
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

                                {/* 活动选择器 - Dropdown 方式 */}
                                <View style={styles.formSection}>
                                    <Text style={styles.formLabel}>选择投稿活动 *</Text>
                                    {activitiesLoading ? (
                                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 12}}>
                                            <ActivityIndicator size="small" color={colors.gold_deep} />
                                            <Text style={{marginLeft: 8, color: colors.gray_text}}>加载活动中...</Text>
                                        </View>
                                    ) : availableActivities.length > 0 ? (
                                        <View style={{position: 'relative'}}>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: colors.white,
                                                    borderWidth: 1,
                                                    borderColor: colors.gold_deep,
                                                    borderRadius: 8,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 12,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => setDropdownVisible(!dropdownVisible)}
                                            >
                                                <Text style={{fontSize: 16, color: colors.black}}>
                                                    {availableActivities.find(a => a.id.toString() === selectedActivity)?.name || '请选择活动'}
                                                </Text>
                                                <Ionicons
                                                    name={dropdownVisible ? "chevron-up" : "chevron-down"}
                                                    size={20}
                                                    color={colors.gray_text}
                                                />
                                            </TouchableOpacity>

                                            {/* 下拉菜单 - 直接在选择器下方 */}
                                            {dropdownVisible && (
                                                <View style={{
                                                    position: 'absolute',
                                                    top: 50,
                                                    left: 0,
                                                    right: 0,
                                                    backgroundColor: colors.white,
                                                    borderWidth: 1,
                                                    borderColor: colors.gold_deep,
                                                    borderRadius: 8,
                                                    maxHeight: 180,
                                                    zIndex: 999999,
                                                    elevation: 999,
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 4 },
                                                    shadowOpacity: 0.3,
                                                    shadowRadius: 8,
                                                }}>
                                                    <ScrollView
                                                        showsVerticalScrollIndicator={false}
                                                        nestedScrollEnabled={true}
                                                    >
                                                        {availableActivities.map((activity) => (
                                                            <TouchableOpacity
                                                                key={activity.id}
                                                                style={{
                                                                    paddingHorizontal: 16,
                                                                    paddingVertical: 14,
                                                                    borderBottomWidth: activity.id === availableActivities[availableActivities.length - 1].id ? 0 : 1,
                                                                    borderBottomColor: colors.gold_light + '50',
                                                                    backgroundColor: selectedActivity === activity.id.toString()
                                                                        ? colors.gold_light + '40'
                                                                        : colors.white,
                                                                }}
                                                                onPress={() => {
                                                                    setSelectedActivity(activity.id.toString());
                                                                    setDropdownVisible(false);
                                                                }}
                                                            >
                                                                <Text style={{
                                                                    fontSize: 15,
                                                                    fontWeight: selectedActivity === activity.id.toString() ? '600' : '400',
                                                                    color: colors.black,
                                                                    marginBottom: 4,
                                                                }}>
                                                                    {activity.name}
                                                                </Text>
                                                                <Text style={{
                                                                    fontSize: 12,
                                                                    color: colors.gray_text,
                                                                    marginBottom: 2,
                                                                }}>
                                                                    {activity.desc}
                                                                </Text>
                                                                <Text style={{
                                                                    fontSize: 10,
                                                                    color: colors.gray_text,
                                                                    fontStyle: 'italic',
                                                                }}>
                                                                    截止: {new Date(activity.submitStop).toLocaleDateString('zh-CN')}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>
                                                </View>
                                            )}

                                            {/* 显示选中活动的详细信息 - 始终显示 */}
                                            {selectedActivity && (
                                                <View style={{
                                                    backgroundColor: colors.gold_light + '20',
                                                    borderRadius: 8,
                                                    padding: 12,
                                                    marginTop: 8,
                                                }}>
                                                    <Text style={{fontSize: 14, fontWeight: '600', color: colors.black, marginBottom: 4}}>
                                                        {availableActivities.find(a => a.id.toString() === selectedActivity)?.name}
                                                    </Text>
                                                    <Text style={{fontSize: 12, color: colors.gray_text, marginBottom: 4}}>
                                                        {availableActivities.find(a => a.id.toString() === selectedActivity)?.desc}
                                                    </Text>
                                                    <Text style={{fontSize: 11, color: colors.gray_text, fontStyle: 'italic'}}>
                                                        投稿截止: {new Date(availableActivities.find(a => a.id.toString() === selectedActivity)?.submitStop).toLocaleDateString('zh-CN')}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    ) : (
                                        <View style={{
                                            backgroundColor: colors.gold_light + '20',
                                            borderRadius: 8,
                                            padding: 16,
                                            alignItems: 'center',
                                        }}>
                                            <Text style={{fontSize: 14, color: colors.gray_text, textAlign: 'center'}}>暂无可用投稿活动</Text>
                                            <Text style={{fontSize: 12, color: colors.gray_text, textAlign: 'center', marginTop: 4}}>当前没有开放的投稿活动，请稍后再试</Text>
                                        </View>
                                    )}
                                </View>

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
                                            setDropdownVisible(false);
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
                    </TouchableWithoutFeedback>
                </View>
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