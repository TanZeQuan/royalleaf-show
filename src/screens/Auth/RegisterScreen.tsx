import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  PixelRatio,
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
import { registerUser, uploadFile } from "../../services/UserService/userApi";
import { formatDateForApi } from "../../utils/dateUtils";

const { width, height } = Dimensions.get("window");

// Constants
const COLORS = {
  primary: "#E1C16E",
  primaryDark: "#D4AF37",
  secondary: "#5F6734",
  background: "#f8f6f0",
  white: "#fff",
  text: "#333",
  textLight: "#666",
  textMuted: "#999",
  placeholder: "#999",
  border: "#e0e0e0",
  error: "#FF6B6B",
  success: "#4ECDC4",
  warning: "#FFE66D",
  shadow: "#000",
};

const SIZES = {
  base: 16,
  small: 12,
  medium: 14,
  large: 18,
  xl: 20,
  radius: 25,
  avatarSize: 100,
  iconSize: 20,
};

// Utility functions
const normalize = (size: number) => {
  const scale = width / 330;
  const newSize = size * scale;
  return Platform.OS === "ios"
    ? Math.round(PixelRatio.roundToNearestPixel(newSize))
    : Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

const hp = (percentage: number) => (height * percentage) / 100;
const wp = (percentage: number) => (width * percentage) / 100;

// Types
interface RegisterScreenProps {
  navigation: any;
  onRegister?: (username: string) => void;
}

interface LocationData {
  id: string;
  name: string;
}

// Mock data
const LOCATIONS: LocationData[] = [
  { id: "1", name: "Kuala Lumpur" },
  { id: "2", name: "Selangor" },
  { id: "3", name: "Penang" },
  { id: "4", name: "Johor" },
  { id: "5", name: "Perak" },
  { id: "6", name: "Sabah" },
  { id: "7", name: "Sarawak" },
];

export default function RegisterScreen({ navigation, onRegister }: RegisterScreenProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: "",
    location: "",
    referralCode: "",
  });

  // UI state
  const [uiState, setUiState] = useState({
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
    agreeToTerms: false,
    showDatePicker: false,
    showLocationModal: false,
    selectedDate: new Date(2000, 0, 1),
    avatarUri: null as string | null,
    errors: {} as Record<string, string>, // Track field-specific errors
  });

  // Validation state
  const [validation, setValidation] = useState({
    passwordStrength: 0,
    emailValid: true,
  });

  // Helper function to generate unique values for testing
  const generateUniqueValue = (base: string, type: 'username' | 'email' | 'phone') => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);

    switch (type) {
      case 'username':
        return `${base}${timestamp}${random}`.toLowerCase().replace(/[^a-z0-9]/g, '');
      case 'email':
        return `${base.split('@')[0]}${timestamp}${random}@${base.split('@')[1] || 'test.com'}`;
      case 'phone':
        // Keep the +60 prefix and randomize the last few digits
        const baseDigits = base.replace(/[^\d]/g, '');
        const prefix = baseDigits.slice(0, -4);
        const suffix = String(timestamp).slice(-4);
        return `+60${prefix}${suffix}`;
      default:
        return base;
    }
  };

  // Clear field-specific error when user starts typing
  const clearFieldError = (field: string) => {
    setUiState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: '' }
    }));
  };

  // Handlers
  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearFieldError(field);
  }, []);

  const updateUiState = useCallback((field: string, value: any) => {
    setUiState(prev => ({ ...prev, [field]: value }));
  }, []);

  // Handle phone input with proper +60 formatting
  const handlePhoneChange = useCallback((text: string) => {
    let digitsOnly = text.replace(/\D/g, "");

    if (text.startsWith('+60')) {
      digitsOnly = digitsOnly.slice(2);
    } else if (text.startsWith('0')) {
      digitsOnly = digitsOnly.slice(1);
    }

    const formattedPhone = `+60${digitsOnly.slice(0, 10)}`;
    updateFormData("phone", formattedPhone);
  }, [updateFormData]);

  // Format phone for display with proper formatting
  const formatPhoneForDisplay = useCallback((value: string) => {
    if (!value) return "";

    if (value.startsWith('+60')) {
      const digits = value.slice(3);
      if (digits.length <= 3) return `+60 ${digits}`;
      if (digits.length <= 6) return `+60 ${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `+60 ${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    const len = value.length;
    if (len <= 3) return value;
    if (len <= 6) return `${value.slice(0, 3)}-${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
  }, []);

  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setValidation(prev => ({ ...prev, emailValid: isValid }));
    return isValid;
  }, []);

  const handleEmailChange = useCallback((text: string) => {
    updateFormData("email", text);
    if (text.length > 0) validateEmail(text);
    else setValidation(prev => ({ ...prev, emailValid: true }));
  }, [updateFormData, validateEmail]);

  const calculatePasswordStrength = useCallback((password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setValidation(prev => ({ ...prev, passwordStrength: strength }));
    return strength;
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    updateFormData("password", text);
    calculatePasswordStrength(text);
  }, [updateFormData, calculatePasswordStrength]);

  const getPasswordStrengthColor = useCallback(() => {
    const { passwordStrength } = validation;
    if (passwordStrength < 50) return COLORS.error;
    if (passwordStrength < 75) return COLORS.warning;
    return COLORS.success;
  }, [validation.passwordStrength]);

  const getPasswordStrengthText = useCallback(() => {
    const { passwordStrength } = validation;
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  }, [validation.passwordStrength]);

  // Handle DateTimePicker change
  const handleDateChange = useCallback((event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      updateUiState("showDatePicker", false);
    }

    if (selectedDate) {
      updateUiState("selectedDate", selectedDate);
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear().toString();
      updateFormData("birthday", `${day}/${month}/${year}`);
    }
  }, [updateFormData, updateUiState]);

  const showDatePicker = useCallback(() => {
    updateUiState("showDatePicker", true);
  }, [updateUiState]);

  const pickImageFromGallery = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission denied", "We need access to your photo library to select an image.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        updateUiState("avatarUri", result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  }, [updateUiState]);

  const handleLocationSelect = useCallback((locationName: string) => {
    updateFormData("location", locationName);
    updateUiState("showLocationModal", false);
  }, [updateFormData, updateUiState]);

  const validateForm = useCallback(() => {
    const { username, name, phone, email, password, confirmPassword, birthday } = formData;
    const { agreeToTerms } = uiState;
    const { passwordStrength, emailValid } = validation;
    const errors: Record<string, string> = {};

    if (!username.trim()) {
      errors.username = "Username is required";
    }
    if (!name.trim()) {
      errors.name = "Name is required";
    }
    if (!phone || phone.length < 8) {
      errors.phone = "Please enter a valid phone number";
    }
    if (!email || !emailValid) {
      errors.email = "Please enter a valid email address";
    }
    if (!password || passwordStrength < 50) {
      errors.password = "Please create a stronger password";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!birthday) {
      errors.birthday = "Please select your birthday";
    }
    if (!agreeToTerms) {
      errors.terms = "Please agree to terms and conditions";
    }

    if (Object.keys(errors).length > 0) {
      setUiState(prev => ({ ...prev, errors }));
      // Show the first error
      const firstError = Object.values(errors)[0];
      Alert.alert("Error", firstError);
      return false;
    }
    return true;
  }, [formData, uiState, validation]);

  function formatPhoneForApi(input: string) {
    let phone = input.trim().replace(/[^\d+]/g, "");

    if (phone.startsWith("+60")) {
      const digits = phone.slice(3).slice(0, 10);
      return `+60${digits}`;
    } else if (phone.startsWith("0")) {
      const digits = phone.slice(1).slice(0, 10);
      return `+60${digits}`;
    } else {
      const digits = phone.slice(0, 10);
      return `+60${digits}`;
    }
  }

  // Show confirmation dialog for testing unique values
  const showRetryWithUniqueValues = (originalError: string) => {
    Alert.alert(
      "Registration Failed",
      `${originalError}\n\nWould you like to try with automatically generated unique values for testing?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Try with unique values",
          onPress: () => handleRegisterWithUniqueValues()
        }
      ]
    );
  };

  const handleRegisterWithUniqueValues = async () => {
    // Generate unique values
    const uniqueUsername = generateUniqueValue(formData.username || 'user', 'username');
    const uniqueEmail = generateUniqueValue(formData.email || 'test@example.com', 'email');
    const uniquePhone = generateUniqueValue(formData.phone || '+60123456789', 'phone');

    // Update form data
    setFormData(prev => ({
      ...prev,
      username: uniqueUsername,
      email: uniqueEmail,
      phone: uniquePhone
    }));

    // Show what we're using
    Alert.alert(
      "Using Unique Values",
      `Username: ${uniqueUsername}\nEmail: ${uniqueEmail}\nPhone: ${uniquePhone}\n\nProceeding with registration...`,
      [{ text: "OK", onPress: () => performRegistration(uniqueUsername, uniqueEmail, uniquePhone) }]
    );
  };

  const performRegistration = async (username?: string, email?: string, phone?: string) => {
    const { name, password, location, referralCode } = formData;
    const { selectedDate, avatarUri, loading } = uiState;

    // 防止重复点击注册按钮
    if (loading) return;

    updateUiState("loading", true);

    try {
      const dob = formatDateForApi(selectedDate, formData.birthday);
      const formattedPhone = formatPhoneForApi(phone || formData.phone);

      const registrationData = {
        username: (username || formData.username).trim(),
        passcode: password,
        name: name.trim(),
        phone: formattedPhone,
        email: email || formData.email,
        dob,
        address: location,
        referral: referralCode.trim(),
      };

      console.log("Registration data:", registrationData);

      const response = await registerUser(registrationData);
      console.log("Raw register response:", response);

      // ✅ 判断是否成功：success === true 且包含 user_id
      if (response?.success === true && response?.data?.user_id) {
        const userId = response.data.user_id;

        if (avatarUri) {
          const fileInfo = { uri: avatarUri, type: "image/jpeg", name: "avatar.jpg" };
          try {
            await uploadFile(userId, fileInfo);
          } catch (err) {
            console.warn("Avatar upload failed:", err);
          }
        }

        Alert.alert(
          "注册成功",
          "欢迎您！我们即将跳转登录页面！",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"),
            },
          ],
          { cancelable: false }
        );
      } else {
                Alert.alert(
          "注册成功",
          "欢迎您！我们即将跳转登录页面！",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"),
            },
          ],
          { cancelable: false }
        );
      }

      // ❌ 如果没有成功，统一视为失败
      Alert.alert("❌ Registration Failed", response?.message || "Registration failed.");
    } catch (error: any) {
      console.error("Register Error:", error);
      // Display a clear, static error message regardless of the backend's response text
      Alert.alert("注册失败", "该用户名或邮箱已被使用，或发生了未知错误。请检查您的信息或稍后再试。");
    } finally {
      updateUiState("loading", false);
    }
  };

  const handleRegister = useCallback(async () => {
    if (!validateForm()) return;
    await performRegistration();
  }, [formData, uiState, validateForm]);

  // Render components
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.6}
      >
        <Ionicons name="arrow-back" size={normalize(SIZES.iconSize)} color={COLORS.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>创建账号</Text>
    </View>
  );

  const renderAvatar = () => (
    <View style={styles.avatarSection}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}>
          {uiState.avatarUri ? (
            <Image
              source={{ uri: uiState.avatarUri }}
              style={styles.avatarImage}
            />
          ) : (
            <Ionicons name="person" size={normalize(40)} color={COLORS.textMuted} />
          )}
        </View>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={pickImageFromGallery}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={normalize(16)} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInputField = (
    iconName: string,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    fieldKey: string,
    options: {
      secureTextEntry?: boolean;
      keyboardType?: any;
      autoCapitalize?: any;
      maxLength?: number;
      showToggle?: boolean;
      onToggle?: () => void;
      validation?: React.ReactNode;
      isValid?: boolean;
      iconSource?: any;
    } = {}
  ) => (
    <View style={styles.inputGroup}>
      <View style={[
        styles.inputContainer,
        options.isValid === false && styles.inputError,
        uiState.errors[fieldKey] && styles.inputError
      ]}>
        {options.iconSource ? (
          <Image
            source={options.iconSource}
            style={[styles.inputIcon, styles.imageIcon]}
            resizeMode="contain"
          />
        ) : (
          <Ionicons
            name={iconName as any}
            size={normalize(SIZES.iconSize)}
            color={COLORS.textMuted}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={options.secureTextEntry}
          keyboardType={options.keyboardType}
          autoCapitalize={options.autoCapitalize}
          maxLength={options.maxLength}
        />
        {options.showToggle && (
          <TouchableOpacity
            onPress={options.onToggle}
            style={[styles.eyeButton, styles.pushRight]}
            activeOpacity={0.6}
          >
            <Ionicons
              name={options.secureTextEntry ? "eye-outline" : "eye-off-outline"}
              size={normalize(SIZES.iconSize)}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>
      {uiState.errors[fieldKey] && (
        <Text style={styles.errorText}>{uiState.errors[fieldKey]}</Text>
      )}
      {options.validation}
    </View>
  );

  const renderPasswordStrength = () => {
    if (formData.password.length === 0) return null;

    return (
      <View style={styles.passwordStrengthContainer}>
        <View style={styles.passwordStrengthBar}>
          <View
            style={[
              styles.passwordStrengthFill,
              {
                width: `${validation.passwordStrength}%`,
                backgroundColor: getPasswordStrengthColor()
              }
            ]}
          />
        </View>
        <Text style={[styles.passwordStrengthText, { color: getPasswordStrengthColor() }]}>
          {getPasswordStrengthText()}
        </Text>
      </View>
    );
  };

  // Render Birthday Field with DateTimePicker
  const renderBirthdayField = () => (
    <View style={styles.inputGroup}>
      <TouchableOpacity
        style={[
          styles.inputContainer,
          uiState.errors.birthday && styles.inputError
        ]}
        onPress={showDatePicker}
        activeOpacity={0.7}
      >
        <Image
          source={require("assets/icons/reg-birth.png")}
          style={[styles.inputIcon, styles.imageIcon]}
          resizeMode="contain"
        />
        <Text style={[styles.input, !formData.birthday && styles.placeholderText]}>
          {formData.birthday || "输入生日日期 DD/MM/YYYY"}
        </Text>
        <Ionicons name="calendar-outline" size={normalize(SIZES.iconSize)} color={COLORS.textLight} style={styles.pushRight} />
      </TouchableOpacity>

      {uiState.errors.birthday && (
        <Text style={styles.errorText}>{uiState.errors.birthday}</Text>
      )}

      {uiState.showDatePicker && (
        <DateTimePicker
          value={uiState.selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
          style={Platform.OS === 'ios' ? styles.datePickerIOS : undefined}
        />
      )}

      {Platform.OS === 'ios' && uiState.showDatePicker && (
        <TouchableOpacity
          style={styles.datePickerCloseButton}
          onPress={() => updateUiState("showDatePicker", false)}
        >
          <Text style={styles.datePickerCloseText}>Done</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderLocationModal = () => (
    <Modal
      visible={uiState.showLocationModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => updateUiState("showLocationModal", false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Location</Text>
            <TouchableOpacity
              onPress={() => updateUiState("showLocationModal", false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={normalize(24)} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {LOCATIONS.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                style={styles.locationItem}
                onPress={() => handleLocationSelect(loc.name)}
              >
                <Text style={styles.locationText}>{loc.name}</Text>
                <Ionicons name="chevron-forward" size={normalize(SIZES.iconSize)} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderHeader()}

            <Image
              source={require("assets/icons/login-bg.png")}
              style={styles.backgroundPattern}
              resizeMode="cover"
            />

            {renderAvatar()}

            <View style={styles.form}>
              {/* Username */}
              {renderInputField(
                "person-outline",
                "输入您的用户名",
                formData.username,
                (text) => updateFormData("username", text),
                "username",
                { autoCapitalize: "none" }
              )}

              {/* Name */}
              {renderInputField(
                "person-outline",
                "输入您的姓名",
                formData.name,
                (text) => updateFormData("name", text),
                "name",
                { autoCapitalize: "words" }
              )}

              {/* Phone */}
              {renderInputField(
                "call-outline",
                "输入您的电话号码 (例如: +60123456789)",
                formatPhoneForDisplay(formData.phone),
                handlePhoneChange,
                "phone",
                { keyboardType: "phone-pad" }
              )}

              {/* Email */}
              {renderInputField(
                "mail-outline",
                "输入您的电子邮件",
                formData.email,
                handleEmailChange,
                "email",
                {
                  keyboardType: "email-address",
                  autoCapitalize: "none",
                  isValid: validation.emailValid,
                  validation: !validation.emailValid && formData.email.length > 0 && (
                    <Text style={styles.errorText}>Please enter a valid email</Text>
                  )
                }
              )}

              {/* Password */}
              {renderInputField(
                "lock-closed-outline",
                "创建密码",
                formData.password,
                handlePasswordChange,
                "password",
                {
                  secureTextEntry: !uiState.showPassword,
                  showToggle: true,
                  onToggle: () => updateUiState("showPassword", !uiState.showPassword),
                  validation: renderPasswordStrength()
                }
              )}

              {/* Confirm Password */}
              {renderInputField(
                "lock-closed-outline",
                "确认密码",
                formData.confirmPassword,
                (text) => updateFormData("confirmPassword", text),
                "confirmPassword",
                {
                  secureTextEntry: !uiState.showConfirmPassword,
                  showToggle: true,
                  onToggle: () => updateUiState("showConfirmPassword", !uiState.showConfirmPassword)
                }
              )}

              {/* Birthday with DateTimePicker */}
              {renderBirthdayField()}

              {/* Location */}
              <View style={styles.inputGroup}>
                <TouchableOpacity
                  style={[
                    styles.inputContainer,
                    uiState.errors.location && styles.inputError
                  ]}
                  onPress={() => updateUiState("showLocationModal", true)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="location-outline"
                    size={normalize(SIZES.iconSize)}
                    color={COLORS.textMuted}
                    style={styles.inputIcon}
                  />
                  <Text style={[styles.input, !formData.location && styles.placeholderText]}>
                    {formData.location || "选择您的地点"}
                  </Text>
                  <Ionicons name="chevron-down" size={normalize(SIZES.iconSize)} color={COLORS.textLight} style={styles.pushRight} />
                </TouchableOpacity>
                {uiState.errors.location && (
                  <Text style={styles.errorText}>{uiState.errors.location}</Text>
                )}
              </View>

              {/* Referral Code */}
              {renderInputField(
                "",
                "推荐码 (如有)",
                formData.referralCode,
                (text) => updateFormData("referralCode", text),
                "referralCode",
                {
                  autoCapitalize: "characters",
                  iconSource: require("assets/icons/reg-referral.png")
                }
              )}

              {/* Terms */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    uiState.agreeToTerms && styles.checkboxChecked,
                    uiState.errors.terms && styles.checkboxError
                  ]}
                  onPress={() => updateUiState("agreeToTerms", !uiState.agreeToTerms)}
                  activeOpacity={0.8}
                >
                  {uiState.agreeToTerms && (
                    <Ionicons name="checkmark" size={normalize(12)} color={COLORS.white} />
                  )}
                </TouchableOpacity>
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>
                    I agree with{" "}
                    <Text style={styles.linkText}>terms and conditions</Text> and{" "}
                    <Text style={styles.linkText}>privacy policy</Text>
                  </Text>
                </View>
              </View>
              {uiState.errors.terms && (
                <Text style={styles.errorText}>{uiState.errors.terms}</Text>
              )}

              {/* Register Button */}
              <TouchableOpacity
                style={[styles.registerButton, uiState.loading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                activeOpacity={0.8}
                disabled={uiState.loading}
              >
                <Text style={styles.registerButtonText}>
                  {uiState.loading ? "Registering..." : "Register"}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or Sign Up with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Buttons */}
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={require("assets/icons/reg-google.png")}
                    style={styles.socialIconImg}
                    resizeMode="contain"
                  />
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={require("assets/icons/reg-apple.png")}
                    style={styles.socialIconImg}
                    resizeMode="contain"
                  />
                  <Text style={styles.socialText}>Apple</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={require("assets/icons/reg-facebook.png")}
                    style={styles.socialIconImg}
                    resizeMode="contain"
                  />
                  <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={require("assets/icons/reg-ins.png")}
                    style={styles.socialIconImg}
                    resizeMode="contain"
                  />
                  <Text style={styles.socialText}>Instagram</Text>
                </TouchableOpacity>
              </View>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {renderLocationModal()}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: width,
    height: height,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  contentContainer: {
    flexGrow: 1,
    minHeight: height,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(2),
    paddingVertical: Platform.OS === "ios" ? hp(1.5) : hp(2.0),
    zIndex: 10,
  },
  backButton: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
    backgroundColor: COLORS.white,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: normalize(SIZES.xl),
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
    textAlign: "center",
    marginRight: normalize(45),
  },

  quickFillButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickFillText: {
    color: COLORS.white,
    fontSize: normalize(12),
    fontWeight: '600',
  },
  backgroundPattern: {
    position: "absolute",
    top: -hp(5),
    left: 0,
    right: 0,
    width,
    height: hp(30),
    opacity: 0.08,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: hp(2),
  },
  avatarContainer: {
    position: "relative",
  },
  avatarPlaceholder: {
    width: normalize(SIZES.avatarSize),
    height: normalize(SIZES.avatarSize),
    borderRadius: normalize(SIZES.avatarSize / 2),
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: normalize(SIZES.avatarSize / 2),
  },
  cameraButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    backgroundColor: COLORS.text,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  form: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(5),
    flex: 1,
  },
  inputGroup: {
    marginBottom: hp(2),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: normalize(SIZES.radius),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.8),
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: Platform.OS === "android" ? 3 : 0,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: wp(3),
  },
  imageIcon: {
    width: normalize(18),
    height: normalize(18),
    tintColor: COLORS.textMuted,
  },
  input: {
    fontSize: normalize(14),
    color: COLORS.text,
    paddingVertical: 0,
  },
  placeholderText: {
    color: COLORS.placeholder,
  },
  eyeButton: {
    padding: normalize(4),
  },
  pushRight: {
    marginLeft: 'auto',
  },
  errorText: {
    fontSize: normalize(SIZES.small),
    color: COLORS.error,
    marginTop: hp(0.5),
    marginLeft: wp(4),
  },
  passwordStrengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.8),
    marginLeft: wp(4),
  },
  passwordStrengthBar: {
    flex: 1,
    height: normalize(4),
    backgroundColor: COLORS.border,
    borderRadius: normalize(2),
    marginRight: wp(3),
  },
  passwordStrengthFill: {
    height: "100%",
    borderRadius: normalize(2),
  },
  passwordStrengthText: {
    fontSize: normalize(SIZES.small),
    fontWeight: "500",
  },
  // DateTimePicker styles
  datePickerIOS: {
    backgroundColor: COLORS.white,
    borderRadius: normalize(10),
    marginTop: hp(1),
  },
  datePickerCloseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: normalize(8),
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    alignItems: "center",
    marginTop: hp(1),
  },
  datePickerCloseText: {
    fontSize: normalize(SIZES.base),
    fontWeight: "600",
    color: COLORS.text,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(3),
    paddingHorizontal: wp(1),
  },
  checkbox: {
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(4),
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
    marginTop: hp(0.2),
  },
  checkboxChecked: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  checkboxError: {
    borderColor: COLORS.error,
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: normalize(SIZES.small),
    color: COLORS.textLight,
    lineHeight: normalize(18),
  },
  linkText: {
    color: COLORS.primaryDark,
    fontWeight: "500",
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: normalize(SIZES.radius),
    paddingVertical: hp(1.8),
    alignItems: "center",
    marginBottom: hp(3),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: normalize(SIZES.base),
    fontWeight: "600",
    color: COLORS.text,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2.5),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: normalize(SIZES.small),
    color: COLORS.textLight,
    paddingHorizontal: wp(3),
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(2),
    marginBottom: hp(1.5),
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    paddingVertical: hp(1.5),
    borderRadius: normalize(20),
    marginHorizontal: wp(1),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  socialIconImg: {
    width: normalize(20),
    height: normalize(20),
    marginRight: wp(2),
  },
  socialText: {
    fontSize: normalize(SIZES.medium),
    color: COLORS.textLight,
    fontWeight: "500",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    color: COLORS.textLight,
    fontSize: normalize(SIZES.medium),
  },
  loginLink: {
    color: COLORS.secondary,
    fontSize: normalize(SIZES.medium),
    fontWeight: "600",
    marginLeft: wp(1),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
    paddingTop: hp(2),
    maxHeight: hp(60),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: normalize(SIZES.large),
    fontWeight: "600",
    color: COLORS.text,
  },
  modalCloseButton: {
    padding: normalize(5),
  },
  modalScroll: {
    paddingHorizontal: wp(5),
  },
  locationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.8),
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  locationText: {
    fontSize: normalize(SIZES.base),
    color: COLORS.text,
  },
});