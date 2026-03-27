import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function AuthScreen() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async () => {
    // Basic validation
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    if (isSignUp && (!fullName.trim() || !address.trim())) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      if (isSignUp) {
        // Handle sign up
        await AsyncStorage.setItem("userToken", "patient_user_token");
        await AsyncStorage.setItem("userRole", "patient");
        await AsyncStorage.setItem("fullName", fullName);
        await AsyncStorage.setItem("email", email);
        // Navigate to home screen after signup
        router.replace("/patient-home");
      } 
    } catch (error) {
      Alert.alert("Error", "Failed to save login information");
      if (__DEV__) console.log("Auth error:", error);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    // Clear form fields when switching
    setFullName("");
    setAddress("");
    setEmail("");
    setPassword("");
    setAgreeToTerms(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      <ImageBackground
        source={require("@/assets/images/UI_Background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={["rgba(139, 152, 255, 0.4)", "rgba(88, 130, 255, 0.4)"]}
          style={styles.gradientOverlay}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              <Text style={styles.backText}>BACK</Text>
            </TouchableOpacity>

            <Image
              source={require("@/assets/images/quick-read-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.title}>Get Started</Text>

            {/* Sign Up Form */}
            {isSignUp && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter full name"
                    placeholderTextColor="#A8B8FF"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter current address"
                    placeholderTextColor="#A8B8FF"
                    value={address}
                    onChangeText={setAddress}
                  />
                </View>
              </>
            )}

            {/* Email Input (both sign up and sign in) */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                placeholderTextColor="#A8B8FF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input (both sign up and sign in) */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder={
                  isSignUp ? "Enter strong password" : "Enter password"
                }
                placeholderTextColor="#A8B8FF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Terms Checkbox (Sign Up only) */}
            {isSignUp && (
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    agreeToTerms && styles.checkboxChecked,
                  ]}
                >
                  {agreeToTerms && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.checkboxText}>
                  I agree to the processing of{" "}
                  <Text style={styles.checkboxTextBold}>Personal data</Text>
                </Text>
              </TouchableOpacity>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#7B8FFF", "#5882FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButtonGradient}
              >
                <Text style={styles.submitButtonText}>
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Sign Up with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Ionicons name="logo-facebook" size={28} color="#4267B2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Ionicons name="logo-twitter" size={28} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Ionicons name="logo-apple" size={28} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Ionicons name="logo-google" size={28} color="#DB4437" />
              </TouchableOpacity>
            </View>

            {/* Toggle Auth Mode */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
              </Text>
              <TouchableOpacity onPress={toggleAuthMode}>
                <Text style={styles.toggleLink}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  logo: {
    width: width * 0.5,
    height: 80,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
    marginTop: 20,
    minHeight: height * 0.65,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#5882FF",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5882FF",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 2,
    borderColor: "#5882FF",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333333",
    backgroundColor: "#FFFFFF",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#5882FF",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    backgroundColor: "#5882FF",
    borderColor: "#5882FF",
  },
  checkboxText: {
    fontSize: 14,
    color: "#5882FF",
    flex: 1,
  },
  checkboxTextBold: {
    fontWeight: "700",
  },
  submitButton: {
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 25,
    elevation: 4,
    shadowColor: "#5882FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#5882FF",
  },
  dividerText: {
    color: "#5882FF",
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 15,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 25,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F7FF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 14,
    color: "#7B8FFF",
  },
  toggleLink: {
    fontSize: 14,
    color: "#5882FF",
    fontWeight: "700",
  },
});
