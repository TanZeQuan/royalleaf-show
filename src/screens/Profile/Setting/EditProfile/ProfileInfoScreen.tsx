// ProfileInfoScreen.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { editProfile, uploadFile } from "@services/UserService/userApi";
import * as ImagePicker from "expo-image-picker";
import { SettingStackParamList } from "navigation/stacks/ProfileNav/SettingStack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormData {
  username: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  gender: number;
}

type RNFile = {
  uri: string;
  type: string;
  name: string;
};

export default function ProfileInfoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SettingStackParamList>>();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    gender: 0,
  });

  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<RNFile | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [locations] = useState([
    "北京", "上海", "广州", "深圳", "香港", "马来西亚", "新加坡"
  ]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const stored = await AsyncStorage.getItem("userData");
      if (stored) {
        const userData = JSON.parse(stored);
        setCurrentUserId(userData.user_id || "");

        setFormData({
          username: userData.username || "",
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          gender: userData.gender || 0,
          dob: userData.dob || "",
        });

        if (userData.dob) {
          const dobDate = new Date(userData.dob);
          if (!isNaN(dobDate.getTime())) setSelectedDate(dobDate);
        }

        if (userData.image) setAvatar(userData.image);
      }
    } catch (error) {
      console.error("加载用户数据失败:", error);
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("需要访问相册权限！");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setAvatar(uri);

        const filename = uri.split('/').pop() || 'avatar.jpg';
        const fileType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';

        setAvatarFile({ uri, type: fileType, name: filename });
      }
    } catch (error) {
      console.error("选择图片失败:", error);
      alert("选择图片失败");
    }
  };

  const handleSave = async () => {
    if (!currentUserId) {
      Alert.alert("错误", "未找到用户信息，请重新登录");
      return;
    }

    setIsLoading(true);
    try {
      // 上传头像
      let imageUrl = avatar;
      if (avatarFile) {
        const uploadResult = await uploadFile(currentUserId, avatarFile);
        if (uploadResult.success && uploadResult.data?.url) {
          imageUrl = uploadResult.data.url;  //  修改了这里 ← 修改为 url，backend返回字段一致
        }
      }

      // ✅ 这里改了：后端要求 name 必填，我们自动传一个默认值（例如用户名或 "User"）
      const payload: any = {
        user_id: currentUserId,
        username: formData.username?.trim() || "",
        name: formData.username?.trim() || "User", // 👈 自动填充
        image: imageUrl || avatar || "",
        address: formData.address?.trim() || "",
        gender: [0, 1, 2].includes(formData.gender) ? formData.gender : 0,
        dob: selectedDate ? formatDate(selectedDate) : formData.dob || "1900-01-01",
      };

      console.log("🔹 发送的数据:", payload);

      const response = await editProfile(payload);

      if (response.success) {
        // 更新本地缓存
        const stored = await AsyncStorage.getItem("userData");
        if (stored) {
          const userData = JSON.parse(stored);
          await AsyncStorage.setItem("userData", JSON.stringify({ ...userData, ...payload }));
        }

        Alert.alert("成功", "资料已更新 ✅");
        navigation.goBack();
      } else {
        Alert.alert("保存失败", response.message || "请检查数据");
      }
    } catch (err: any) {
      console.error("💥 保存资料失败:", err.response?.data || err.message);
      Alert.alert("错误", "保存资料失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const getGenderText = (gender: number) => {
    switch (gender) {
      case 1: return "男";
      case 2: return "女";
      default: return "未选择";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F5EC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#2C2C2C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>编辑个人信息</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.placeholderAvatar}>
                    <Ionicons name="person" size={45} color="#D7A740" />
                  </View>
                )}
              </View>
              <View style={styles.cameraIconWrapper}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>点击更换头像</Text>
        </View>

        {/* Fields */}
        <View style={styles.formSection}>
          <InputField
            value={formData.username}
            onChangeText={(text: string) => setFormData({ ...formData, username: text })}
            placeholder="输入用户名"
            label="用户名"
            iconName="person-outline"
          />
          <InputField
            value={formData.email}
            onChangeText={(text: string) => setFormData({ ...formData, email: text })}
            placeholder="输入您的邮箱地址"
            label="邮箱"
            iconName="mail-outline"
            keyboardType="email-address"
          />
          <InputField
            value={formData.phone}
            onChangeText={(text: string) => setFormData({ ...formData, phone: text })}
            placeholder="输入您的手机号码"
            label="手机号"
            iconName="call-outline"
            keyboardType="phone-pad"
          />

          {/* 生日选择 */}
          <InputField
            value={selectedDate ? formatDate(selectedDate) : ""}
            placeholder="选择您的生日"
            label="生日"
            iconName="calendar-outline"
            showArrow
            onPress={() => setShowDatePicker(true)}
          />

          {/* 性别选择 */}
          <InputField
            value={getGenderText(formData.gender)}
            placeholder="选择性别"
            label="性别"
            iconName="male-female-outline"
            showArrow
            onPress={() => setGenderModalVisible(true)}
          />

          {/* 地区选择 */}
          <InputField
            value={formData.address}
            placeholder="选择您的地区"
            label="地区"
            iconName="location-outline"
            showArrow
            onPress={() => setLocationModalVisible(true)}
          />
        </View>

        {/* Actions */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.passwordButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("SettingResetPassword")}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#666" />
            <Text style={styles.passwordButtonText}>更改密码</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#3B4650" /> : <Text style={styles.saveButtonText}>保存更改</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 日期选择器 */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {/* 性别选择 Modal */}
      <Modal visible={genderModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.locationSheet}>
            <Text style={styles.sheetTitle}>选择性别</Text>
            {[{ label: "男", value: 1 }, { label: "女", value: 2 }, { label: "未选择", value: 0 }].map(item => (
              <TouchableOpacity
                key={item.value}
                style={styles.locationItem}
                onPress={() => {
                  setFormData({ ...formData, gender: item.value });
                  setGenderModalVisible(false);
                }}
              >
                <Text style={styles.locationText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setGenderModalVisible(false)}>
              <Text style={styles.closeText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 地区选择 Modal */}
      <Modal visible={locationModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.locationSheet}>
            <Text style={styles.sheetTitle}>选择地区</Text>
            <FlatList
              data={locations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.locationItem} onPress={() => { setFormData({ ...formData, address: item }); setLocationModalVisible(false); }}>
                  <Text style={styles.locationText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setLocationModalVisible(false)}>
              <Text style={styles.closeText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const InputField = ({ value, onChangeText, placeholder, label, iconName, showArrow = false, onPress, keyboardType = "default", editable = true }: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TouchableOpacity style={[styles.inputWrapper, onPress && styles.inputWrapperTouchable]} activeOpacity={onPress ? 0.7 : 1} onPress={onPress} disabled={!onPress && !editable}>
      <View style={styles.inputIconContainer}>
        <Ionicons name={iconName as any} size={18} color="#D7A740" />
      </View>
      <TextInput
        style={[styles.textInput, !editable && styles.disabledInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        editable={!onPress && editable}
        keyboardType={keyboardType}
      />
      {showArrow && <Ionicons name="chevron-forward" size={18} color="#999" />}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F5EC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9F5EC",
  },
  backButton: {
    padding: 5,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C2C2C",
  },
  headerSpacer: {
    width: 24,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  placeholderAvatar: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8E8E8",
    borderRadius: 50,
  },
  cameraIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#D7A740",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F9F5EC",
  },
  avatarHint: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2C2C2C",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  inputWrapperTouchable: {
    backgroundColor: "#f8f8f8",
  },
  inputIconContainer: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#2C2C2C",
  },
  disabledInput: {
    color: "#999",
  },
  buttonSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  passwordButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  passwordButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#666",
  },
  saveButton: {
    backgroundColor: "#D7A740",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B4650",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  locationSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  locationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  locationText: {
    fontSize: 16,
    color: "#2C2C2C",
  },
  closeButton: {
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  closeText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});

function updateLocalUserData(arg0: any) {
  throw new Error("Function not implemented.");
}
