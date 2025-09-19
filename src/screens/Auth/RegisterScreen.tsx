import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useCallback } from "react";
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
import { registerUser } from "../../services/userApi";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  formatDateForApi,
  formatDateForDisplay,
  getDateFromBirthday,
  parseBirthdayInput
} from "../../utils/dateUtils";

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
    selectedDate: null as Date | null,
    avatarUri: null as string | null,
  });

  // Validation state
  const [validation, setValidation] = useState({
    passwordStrength: 0,
    emailValid: true,
  });

  // Handlers
  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateUiState = useCallback((field: string, value: any) => {
    setUiState(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePhoneChange = useCallback((text: string) => {
    const digitsOnly = text.replace(/\D/g, "");
    updateFormData("phone", digitsOnly.slice(0, 10));
  }, [updateFormData]);

  const formatPhoneForDisplay = useCallback((value: string) => {
    if (!value) return "";
    const len = value.length;
    if (len <= 3) return value;
    if (len <= 6) return `${value.slice(0, 3)}-${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 6)}${value.slice(6)}`;
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

  const handleBirthdayChange = useCallback((text: string) => {
    const formatted = parseBirthdayInput(text);
    updateFormData("birthday", formatted);

    if (formatted.length === 10) {
      const date = getDateFromBirthday(formatted);
      if (date) updateUiState("selectedDate", date);
    }
  }, [updateFormData, updateUiState]);

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
    const { username, name, phone, email, password, confirmPassword } = formData;
    const { agreeToTerms } = uiState;
    const { passwordStrength, emailValid } = validation;

    if (!username.trim()) {
      Alert.alert("Error", "Username is required.");
      return false;
    }
    if (!name.trim()) {
      Alert.alert("Error", "Name is required.");
      return false;
    }
    if (!phone || phone.length < 9) {
      Alert.alert("Error", "Please enter a valid phone number.");
      return false;
    }
    if (!email || !emailValid) {
      Alert.alert("Error", "Please enter a valid email address.");
      return false;
    }
    if (!password || passwordStrength < 50) {
      Alert.alert("Error", "Please create a stronger password.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return false;
    }
    if (!agreeToTerms) {
      Alert.alert("Error", "Please agree to terms and conditions.");
      return false;
    }
    return true;
  }, [formData, uiState, validation]);

  const handleRegister = useCallback(async () => {
    if (!validateForm()) return;

    const { username, name, phone, email, password, location, referralCode } = formData;
    const { selectedDate } = uiState;

    updateUiState("loading", true);

    try {
      const dob = formatDateForApi(selectedDate, formData.birthday);
      const response = await registerUser({
        username: username.trim(),
        passcode: password,
        name: name.trim(),
        phone: `+60${phone}`,
        email,
        dob,
        address: location,
        referral: referralCode.trim(),
      });

      if (response.success) {
        Alert.alert("Success", response.message || "Registration successful!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Failed", response.message || "Registration failed.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to register. Please try again.");
    } finally {
      updateUiState("loading", false);
    }
  }, [formData, uiState, validateForm, updateUiState, navigation]);

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
      <View style={[styles.inputContainer, options.isValid === false && styles.inputError]}>
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
            style={styles.eyeButton}
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
                { autoCapitalize: "words" }
              )}

              {/* Name */}
              {renderInputField(
                "person-outline",
                "输入您的姓名",
                formData.name,
                (text) => updateFormData("name", text),
                { autoCapitalize: "words" }
              )}

              {/* Phone */}
              {renderInputField(
                "call-outline",
                "输入您的电话号码",
                formatPhoneForDisplay(formData.phone),
                handlePhoneChange,
                { keyboardType: "phone-pad" }
              )}

              {/* Email */}
              {renderInputField(
                "mail-outline",
                "输入您的电子邮件",
                formData.email,
                handleEmailChange,
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
                {
                  secureTextEntry: !uiState.showConfirmPassword,
                  showToggle: true,
                  onToggle: () => updateUiState("showConfirmPassword", !uiState.showConfirmPassword)
                }
              )}

              {/* Birthday */}
              {renderInputField(
                "",
                "输入生日日期 DD/MM/YYYY",
                formData.birthday,
                handleBirthdayChange,
                {
                  keyboardType: "numeric",
                  maxLength: 10,
                  iconSource: require("assets/icons/reg-birth.png")
                }
              )}

              {/* Location */}
              <View style={styles.inputGroup}>
                <TouchableOpacity
                  style={styles.inputContainer}
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
                  <Ionicons name="chevron-down" size={normalize(SIZES.iconSize)} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>

              {/* Referral Code */}
              {renderInputField(
                "",
                "推荐码 (如有)",
                formData.referralCode,
                (text) => updateFormData("referralCode", text),
                {
                  autoCapitalize: "characters",
                  iconSource: require("assets/icons/reg-referral.png")
                }
              )}

              {/* Terms */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={[styles.checkbox, uiState.agreeToTerms && styles.checkboxChecked]}
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
    justifyContent: "space-between", // 确保左右元素分布一致
    paddingHorizontal: wp(2),
    paddingVertical: Platform.OS === "ios" ? hp(1.5) : hp(2.0), // 适当微调 iOS 顶部间距
    zIndex: 10,
  },
  backButton: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
    backgroundColor: COLORS.white,
    marginLeft:10,
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
    marginRight: normalize(45), // Offset for back button
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
    flex: 1,
    fontSize: normalize(SIZES.base),
    color: COLORS.text,
    paddingVertical: 0,
  },
  placeholderText: {
    color: COLORS.placeholder,
  },
  eyeButton: {
    padding: normalize(4),
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
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