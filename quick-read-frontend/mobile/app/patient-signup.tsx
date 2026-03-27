import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  InstrumentSans_500Medium,
  useFonts,
} from "@expo-google-fonts/instrument-sans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  ActivityIndicator,
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
import config from "@/constants/config";

export default function PatientSignupScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ InstrumentSans_500Medium });
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(true);

  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  if (!fontsLoaded) {
    return null;
  }

  const handleSignup = async () => {
    if (!fullName.trim() || !address.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters long");
      return;
    }

    if (!accepted) {
      Alert.alert("Validation Error", "Please agree to the processing of personal data");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          password: password,
          address: address,
          role: "patient",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setPendingEmail(email);
        setShowOTP(true);
        Alert.alert("Success", "Registration successful. Please enter the OTP sent to your email.");
      } else {
        Alert.alert("Signup Failed", result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Failed to connect to the server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, otp }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "OTP verified! You can now login.", [
          { text: "OK", onPress: async () => {
            // Pre-emptively store name for immediate use after login
            await AsyncStorage.setItem("fullName", fullName);
            router.replace("/patient-login");
          }}
        ]);
      } else {
        Alert.alert("Verification Failed", result.message || "Invalid OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/UI_Background.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topSection}>
            <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
              <Text style={styles.backText}>BACK</Text>
            </TouchableOpacity>

            <Image
              source={require("@/assets/images/quick-read-logo.png")}
              style={styles.logo}
              resizeMode="contain"
              tintColor="#FFFFFF"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Get Started</Text>

            {showOTP ? (
              <View>
                <Text style={{ color: '#4D66F3', marginBottom: 20, textAlign: 'center', fontWeight: '600', fontSize: 14 }}>
                  Enter the code sent to {pendingEmail}
                </Text>
                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>OTP Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="#7A8FDD"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                  />
                </View>

                <TouchableOpacity onPress={handleVerifyOTP} activeOpacity={0.9} disabled={loading}>
                  <LinearGradient
                    colors={["#5865E8", "#79A5FF"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.signupButton}
                  >
                    {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.signupButtonText}>Verify OTP</Text>}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowOTP(false)}>
                  <Text style={styles.loginText}>Back to Signup</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter full name"
                    placeholderTextColor="#7A8FDD"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>

                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter current address"
                    placeholderTextColor="#7A8FDD"
                    value={address}
                    onChangeText={setAddress}
                  />
                </View>

                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter email address"
                    placeholderTextColor="#7A8FDD"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter strong password"
                    placeholderTextColor="#7A8FDD"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setAccepted((previous) => !previous)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
                    {accepted ? <Ionicons name="checkmark" size={12} color="#FFFFFF" /> : null}
                  </View>
                  <Text style={styles.checkboxText}>I agree to the processing of Personal data</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSignup} activeOpacity={0.9} disabled={loading}>
                  <LinearGradient
                    colors={["#5865E8", "#79A5FF"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.signupButton}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.signupButtonText}>Sign Up</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Sign Up with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialRow}>
              <FontAwesome name="facebook" size={22} color="#4D66F3" />
              <FontAwesome name="twitter" size={22} color="#4D66F3" />
              <Ionicons name="logo-apple" size={22} color="#4D66F3" />
              <FontAwesome name="google" size={22} color="#4D66F3" />
            </View>

            <TouchableOpacity onPress={() => router.push("/patient-login")}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  topSection: {
    paddingTop: 55,
    paddingHorizontal: 18,
    alignItems: "flex-end",
    minHeight: 180,
  },
  backRow: {
    position: "absolute",
    left: 14,
    top: 65,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  logo: {
    width: 210,
    height: 95,
    marginTop: 10,
    backgroundColor: "White",
  },
  formContainer: {
    backgroundColor: "#F7F7F7",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 28,
    minHeight: 560,
  },
  title: {
    textAlign: "center",
    color: "#4D66F3",
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: 0,
    marginBottom: 30,
  },
  inputWrap: {
    marginBottom: 12,
  },
  inputLabel: {
    color: "#4D66F3",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: -8,
    marginLeft: 16,
    zIndex: 1,
    alignSelf: "flex-start",
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 4,
    fontFamily:"Semibold_500Medium",
  },
  input: {
    borderWidth: 2,
    borderColor: "#7A8FDD",
    borderRadius: 30,
    height: 58,
    paddingHorizontal: 22,
    color: "#4D66F3",
    fontSize: 10,
    backgroundColor: "transparent",
    fontFamily:"Semibold_500Medium",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 18,
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#4D66F3",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    backgroundColor: "#4D66F3",
  },
  checkboxText: {
    color: "#4D66F3",
    fontSize: 11,
    fontWeight: "500",
    flexShrink: 1,
    fontFamily: "InstrumentSans_500Medium",
  },
  signupButton: {
    height: 56,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily:"InstrumentSans_500Medium",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#4D66F3",
  },
  dividerText: {
    color: "#4D66F3",
    fontSize: 11,
    fontWeight: "500",
    fontFamily: "InstrumentSans_500Medium",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  loginText: {
    textAlign: "center",
    color: "#4D66F3",
    fontSize: 11,
    fontWeight: "500",
    fontFamily: "InstrumentSans_500Medium",
  },
  loginLink: {
    fontWeight: "700",
    fontFamily: "InstrumentSans_500Medium",
    fontSize:11,
  },
});
