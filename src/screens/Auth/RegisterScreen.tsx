import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  Modal,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  parseBirthdayInput,
  getDateFromBirthday,
  formatDateForDisplay,
  formatDateForApi
} from "../../utils/dateUtils";
import * as ImagePicker from "expo-image-picker";
import { registerUser } from "../../services/registerApi";
import { SafeAreaView } from "react-native-safe-area-context";
import { PixelRatio } from 'react-native';

const { width, height } = Dimensions.get("window");

// Standardized sizing function
const normalize = (size: number) => {
  const scale = width / 375; // Base width
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

const hp = (percentage: number) => (height * percentage) / 100;
const wp = (percentage: number) => (width * percentage) / 100;

type RegisterScreenProps = {
  navigation: any;
  onRegister?: () => void; // optional
};

interface LocationData {
  id: string;
  name: string;
}

const locations: LocationData[] = [
  { id: "1", name: "Kuala Lumpur" },
  { id: "2", name: "Selangor" },
  { id: "3", name: "Penang" },
  { id: "4", name: "Johor" },
  { id: "5", name: "Perak" },
  { id: "6", name: "Sabah" },
  { id: "7", name: "Sarawak" },
];

export default function RegisterScreen({ navigation, onRegister }: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [location, setLocation] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Additional
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailValid, setEmailValid] = useState(true);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);


  const handlePhoneChange = (text: string) => {
    const digitsOnly = text.replace(/\D/g, ""); // remove non-digit
    setPhone(digitsOnly.slice(0, 10)); // max 10 digits
  };

  // Display formatted phone but without interfering with typing
  const formatPhoneForDisplay = (value: string) => {
    if (!value) return ""; // empty when nothing typed
    const len = value.length;

    if (len <= 3) return value;
    if (len <= 6) return `${value.slice(0, 3)}-${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 6)}${value.slice(6)}`;
  };

  // --- Email ---
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailValid(isValid);
    return isValid;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.length > 0) validateEmail(text);
    else setEmailValid(true);
  };

  const pickImageFromGallery = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission denied", "We need access to your photo library to select an image.");
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct usage for expo-image-picker
      allowsEditing: true,
      quality: 1,
    });


    if (!result.canceled) {
      // Save the selected image URI
      setAvatarUri(result.assets[0].uri);
    }
  };

  // --- Password ---
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
    return strength;
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    calculatePasswordStrength(text);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "#FF6B6B";
    if (passwordStrength < 75) return "#FFE66D";
    return "#4ECDC4";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  // --- Input typing ---
  const handleBirthdayChange = (text: string) => {
    const formatted = parseBirthdayInput(text);
    setBirthday(formatted);

    if (formatted.length === 10) {
      const date = getDateFromBirthday(formatted);
      if (date) setSelectedDate(date);
    }
  };

  // --- Date picker ---
  const handleDateSelect = (event: any, date?: Date) => {
    if (date && !isNaN(date.getTime())) {
      setSelectedDate(date);
      setBirthday(formatDateForDisplay(date));
    }
    if (Platform.OS === "android") setShowDatePicker(false);
  };

  // --- When submitting ---
  const dobFormatted = selectedDate ? selectedDate.toISOString().split("T")[0] : "";

  // --- Location ---
  const handleLocationSelect = (locationName: string) => {
    setLocation(locationName);
    setShowLocationModal(false);
  };

  // --- Register ---
  const handleRegister = async () => {
    if (!username.trim()) return Alert.alert("Error", "Username is required.");
    if (!name.trim()) return Alert.alert("Error", "Name is required.");
    if (!phone || phone.length < 9) return Alert.alert("Error", "Please enter a valid phone number.");
    if (!email || !validateEmail(email)) return Alert.alert("Error", "Please enter a valid email address.");
    if (!password || passwordStrength < 50) return Alert.alert("Error", "Please create a stronger password.");
    if (password !== confirmPassword) return Alert.alert("Error", "Passwords do not match.");
    if (!agreeToTerms) return Alert.alert("Error", "Please agree to terms and conditions.");

    // Convert DD/MM/YYYY -> yyyy-MM-dd
    let dobForBackend = "";
    const dob = formatDateForApi(selectedDate, birthday);

    setLoading(true);
    try {
      const res = await registerUser({
        username: username.trim(),  // ✅ use the username state
        passcode: password,
        name: name.trim(),
        phone: `+60${phone}`,
        email,
        dob,
        address: location,
        referral: referralCode.trim(),
      });

      if (res.success) {
        Alert.alert("Success", res.message || "Registration successful!");
        navigation.navigate("Login"); // <-- navigate back to Login screen
      } else {
        Alert.alert("Failed", res.message || "Registration failed.");
      }

    } catch (error) {
      Alert.alert("Error", "Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.fullScreenContainer}>
      {/* Status Bar */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f8f6f0"
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
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.6}
              >
                <Ionicons name="arrow-back" size={normalize(20)} color="#333" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create an Account</Text>
            </View>

            {/* Background */}
            <Image
              source={require("assets/icons/login-bg.png")}
              style={styles.backgroundPattern}
              resizeMode="cover"
            />

            {/* Avatar */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarPlaceholder}>
                  {avatarUri ? (
                    <Image
                      source={{ uri: avatarUri }}
                      style={{ width: '100%', height: '100%', borderRadius: normalize(50) }}
                    />
                  ) : (
                    <Ionicons name="person" size={normalize(40)} color="#999" />
                  )}
                </View>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={pickImageFromGallery}
                  activeOpacity={0.8}
                >
                  <Ionicons name="camera" size={normalize(16)} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Usename */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={normalize(20)}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your Username"
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Name */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={normalize(20)}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="call-outline"
                    size={normalize(20)}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    placeholderTextColor="#999"
                    value={formatPhoneForDisplay(phone)} // only formatted display
                    onChangeText={handlePhoneChange}
                  />

                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, !emailValid && styles.inputError]}>
                  <Ionicons
                    name="mail-outline"
                    size={normalize(20)}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email address"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={handleEmailChange}
                  />
                  {email.length > 0 && (
                    <Ionicons
                      name={emailValid ? "checkmark-circle" : "close-circle"}
                      size={normalize(20)}
                      color={emailValid ? "#4ECDC4" : "#FF6B6B"}
                    />
                  )}
                </View>
                {!emailValid && email.length > 0 && (
                  <Text style={styles.errorText}>Please enter a valid email</Text>
                )}
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={normalize(20)}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={handlePasswordChange}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    activeOpacity={0.6}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={normalize(20)}
                      color="#5c5c5cff"
                    />
                  </TouchableOpacity>
                </View>
                {password.length > 0 && (
                  <View style={styles.passwordStrengthContainer}>
                    <View style={styles.passwordStrengthBar}>
                      <View
                        style={[
                          styles.passwordStrengthFill,
                          {
                            width: `${passwordStrength}%`,
                            backgroundColor: getPasswordStrengthColor()
                          }
                        ]}
                      />
                    </View>
                    <Text style={[styles.passwordStrengthText, { color: getPasswordStrengthColor() }]}>
                      {getPasswordStrengthText()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={normalize(20)}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                    activeOpacity={0.6}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                      size={normalize(20)}
                      color="#5c5c5cff"
                    />
                  </TouchableOpacity>
                  {confirmPassword.length > 0 && (
                    <Ionicons
                      name={password === confirmPassword ? "checkmark-circle" : "close-circle"}
                      size={normalize(20)}
                      color={password === confirmPassword ? "#4ECDC4" : "#FF6B6B"}
                    />
                  )}
                </View>
              </View>

              {/* Birthday */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Image
                    source={require("assets/icons/reg-birth.png")}
                    style={[styles.inputIcon, { width: normalize(18), height: normalize(18), tintColor: "#999" }]}
                    resizeMode="contain"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={birthday}
                    onChangeText={handleBirthdayChange}
                    maxLength={10}
                  />
                </View>
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowLocationModal(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="location-outline"
                    size={normalize(20)}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <Text style={[styles.input, !location && styles.placeholderText]}>
                    {location || "Choose your location"}
                  </Text>
                  <Ionicons name="chevron-down" size={normalize(20)} color="#5c5c5cff" />
                </TouchableOpacity>
              </View>

              {/* Referral Code */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Image
                    source={require("assets/icons/reg-referral.png")}
                    style={[styles.inputIcon, { width: normalize(20), height: normalize(20), tintColor: "#999" }]}
                    resizeMode="contain"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Referral Code (Optional)"
                    placeholderTextColor="#999"
                    value={referralCode}
                    onChangeText={setReferralCode}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.6}>
                    <Ionicons name="qr-code-outline" size={normalize(20)} color="#5c5c5cff" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                  activeOpacity={0.8}
                >
                  {agreeToTerms && (
                    <Ionicons name="checkmark" size={normalize(12)} color="#fff" />
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

              {/* Register */}
              <TouchableOpacity
                style={styles.registerButton}  // removed [styles.registerButton, loading && styles.registerButtonDisabled]
                onPress={handleRegister}
                activeOpacity={0.8} // optional for click effect
              >
                <Text style={styles.registerButtonText}>
                  {loading ? "Registering..." : "Register"}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or Sign Up with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social */}
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

              {/* Login */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Location Modal */}
          <Modal
            visible={showLocationModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowLocationModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Location</Text>
                  <TouchableOpacity
                    onPress={() => setShowLocationModal(false)}
                    style={styles.modalCloseButton}
                  >
                    <Ionicons name="close" size={normalize(24)} color="#333" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalScroll}>
                  {locations.map((loc) => (
                    <TouchableOpacity
                      key={loc.id}
                      style={styles.locationItem}
                      onPress={() => handleLocationSelect(loc.name)}
                    >
                      <Text style={styles.locationText}>{loc.name}</Text>
                      <Ionicons name="chevron-forward" size={normalize(20)} color="#999" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#f8f6f0",
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
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    zIndex: 10,
  },
  backButton: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: "500",
    color: "#333",
    marginLeft: wp(4)
  },
  backgroundPattern: {
    position: "absolute",
    top: -hp(15),
    left: 0,
    right: 0,
    width,
    height: hp(40),
    opacity: 0.08,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: hp(2.5)
  },
  avatarContainer: {
    position: "relative"
  },
  avatarPlaceholder: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cameraButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
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
    marginBottom: hp(2)
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: normalize(25),
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.0),
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.30,
    shadowRadius: 4,
    elevation: Platform.OS === "android" ? 5 : 0,
  },
  inputError: {
    borderColor: "#FF6B6B",
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: wp(4)
  },
  input: {
    flex: 1,
    fontSize: normalize(16),
    color: "#333",
    paddingVertical: 0,
  },
  placeholderText: {
    color: "#999",
  },
  eyeButton: {
    padding: normalize(4)
  },
  actionButton: {
    padding: normalize(4)
  },
  errorText: {
    fontSize: normalize(12),
    color: "#FF6B6B",
    marginTop: hp(0.5),
    marginLeft: wp(5),
  },
  passwordStrengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.8),
    marginLeft: wp(5),
  },
  passwordStrengthBar: {
    flex: 1,
    height: normalize(4),
    backgroundColor: "#e0e0e0",
    borderRadius: normalize(2),
    marginRight: wp(3),
  },
  passwordStrengthFill: {
    height: "100%",
    borderRadius: normalize(2),
  },
  passwordStrengthText: {
    fontSize: normalize(12),
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
    borderColor: "#ddd",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
    marginLeft: wp(1),
    marginTop: hp(0.3),
  },
  checkboxChecked: {
    backgroundColor: "#D4AF37",
    borderColor: "#D4AF37"
  },
  termsTextContainer: {
    flex: 1
  },
  termsText: {
    fontSize: normalize(12),
    color: "#666",
    lineHeight: hp(2.2)
  },
  linkText: {
    color: "#D4AF37",
    fontWeight: "500"
  },
  registerButton: {
    backgroundColor: "#E1C16E",
    borderRadius: normalize(25),
    paddingVertical: hp(1.8),
    alignItems: "center",
    marginBottom: hp(3),
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5,
  },
  registerButtonText: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: "#232323"
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2.5)
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd"
  },
  dividerText: {
    fontSize: normalize(12),
    color: "#666",
    paddingHorizontal: wp(3)
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
    marginBottom: hp(1.5),
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: hp(1.5),
    borderRadius: normalize(20),
    marginHorizontal: wp(1.2),
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.30,
    shadowRadius: 2,
    elevation: 2,
  },
  socialIconImg: {
    width: normalize(20),
    height: normalize(20),
    marginRight: wp(2)
  },
  socialText: {
    fontSize: normalize(14),
    color: "#7C838A"
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(2.2),
    marginBottom: hp(3),
  },
  loginText: {
    color: "#666",
    fontSize: normalize(14)
  },
  loginLink: {
    color: "#5F6734",
    fontSize: normalize(14),
    fontWeight: "600",
    marginLeft: wp(1.3)
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
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
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: normalize(18),
    fontWeight: "600",
    color: "#333",
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
    fontSize: normalize(16),
    color: "#333",
  },
  imagePickerOptions: {
    padding: wp(5),
  },
  imagePickerOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(2),
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  imagePickerText: {
    fontSize: normalize(16),
    color: "#333",
    marginLeft: wp(4),
  },
});