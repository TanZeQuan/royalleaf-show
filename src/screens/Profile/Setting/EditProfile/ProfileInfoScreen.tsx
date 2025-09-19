import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingStackParamList } from "navigation/stacks/ProfileNav/SettingStack";

interface FormData {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  location: string;
}

export default function ProfileInfoScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingStackParamList>>();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    location: "",
  });

  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"birthday" | "location" | null>(
    null
  );
  const slideAnim = useRef(new Animated.Value(300)).current;

  // 🗓️ Format date
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}年${month}月${day}日`;
  };

  // 🗓️ Open bottom sheet
  const openBottomSheet = (type: "birthday" | "location") => {
    setModalType(type);
    if (type === "birthday" && selectedDate) {
      setTempDate(selectedDate);
    }
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 🗓️ Close bottom sheet
  const closeBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  // ✅ Confirm date
  const confirmDate = () => {
    setSelectedDate(tempDate);
    setFormData({ ...formData, birthday: formatDate(tempDate) });
    closeBottomSheet();
  };

  // 📸 Pick image
  const pickImage = async () => {
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
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F5EC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2C2C2C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>编辑个人信息</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="输入您的姓名"
            label="姓名"
            iconName="person-outline"
          />
          <InputField
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="输入您的邮箱地址"
            label="邮箱"
            iconName="mail-outline"
            keyboardType="email-address"
          />
          <InputField
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="输入您的手机号码"
            label="手机号"
            iconName="call-outline"
            keyboardType="phone-pad"
          />
          <InputField
            value={formData.birthday}
            placeholder={
              selectedDate ? formatDate(selectedDate) : "选择您的生日"
            }
            label="生日"
            iconName="calendar-outline"
            showArrow
            onPress={() => openBottomSheet("birthday")}
            hasValue={!!selectedDate}
          />
          <InputField
            value={formData.location}
            placeholder="选择您的地区"
            label="地区"
            iconName="location-outline"
            showArrow
            onPress={() => openBottomSheet("location")}
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

          <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>保存更改</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom sheet modal remains same */}
    </SafeAreaView>
  );
}

type InputFieldProps = {
  value: string;
  onChangeText?: (text: string) => void;
  placeholder: string;
  label: string;
  iconName: string;
  showArrow?: boolean;
  onPress?: () => void;
  keyboardType?: any;
  hasValue?: boolean;
};

const InputField = ({
  value,
  onChangeText,
  placeholder,
  label,
  iconName,
  showArrow = false,
  onPress,
  keyboardType = "default",
  hasValue = false,
}: InputFieldProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TouchableOpacity
      style={[styles.inputWrapper, onPress && styles.inputWrapperTouchable]}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
    >
      <View style={styles.inputIconContainer}>
        <Ionicons name={iconName as any} size={18} color="#D7A740" />
      </View>
      <TextInput
        style={[styles.textInput, hasValue && styles.textInputHasValue]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={hasValue ? "#2C2C2C" : "#999"}
        editable={!onPress}
        keyboardType={keyboardType}
      />
      {showArrow && (
        <Ionicons name="chevron-forward" size={18} color="#999" />
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F9F5EC",
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C2C2C",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 34, // Same width as back button to center the title
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D7A740",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  placeholderAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    backgroundColor: "#FFF8E7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconWrapper: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#D7A740",
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarHint: {
    marginTop: 12,
    fontSize: 13,
    color: "#999",
    fontWeight: "400",
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2C",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(215, 167, 64, 0.1)",
  },
  inputWrapperTouchable: {
    backgroundColor: "#FEFCF7",
  },
  inputIconContainer: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#2C2C2C",
    fontWeight: "400",
  },
  textInputHasValue: {
    fontWeight: "500",
    color: "#2C2C2C",
  },
  buttonSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  passwordButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E1C16E",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(215, 167, 64, 0.1)",
  },
  passwordButtonText: {
    flex: 1,
    fontSize: 15,
    color: "#3B4650",
    alignItems: "center",
    textAlign: "center",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#E1C16E",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#D7A740",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  saveButtonText: {
    color: "#3B4650",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: "70%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C2C2C",
    textAlign: "center",
    marginBottom: 20,
  },
  sheetContent: {
    marginBottom: 20,
  },
  datePickerContainer: {
    backgroundColor: "#F9F5EC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  datePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#2C2C2C",
    marginBottom: 8,
  },
  picker: {
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(215, 167, 64, 0.2)",
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  pickerItemSelected: {
    backgroundColor: "#D7A740",
  },
  pickerItemText: {
    fontSize: 15,
    color: "#2C2C2C",
    fontWeight: "400",
  },
  pickerItemTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  selectedDateDisplay: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(215, 167, 64, 0.2)",
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#D7A740",
  },
  datePickerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  datePickerButton: {
    flex: 1,
    backgroundColor: "#D7A740",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  datePickerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  datePickerPlaceholder: {
    alignItems: "center",
    paddingVertical: 40,
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 14,
    color: "#999",
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  sheetOptionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#2C2C2C",
    fontWeight: "400",
  },
  sheetCloseButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  sheetCloseText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});