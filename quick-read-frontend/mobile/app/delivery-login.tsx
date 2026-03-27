import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
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
import { registerForPushNotificationsAsync, savePushToken } from "@/utils/push-helper";

export default function DeliveryLoginScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  // Login states
  const [emailLogin, setEmailLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  const handleLogin = async () => {
    if (!emailLogin.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailLogin, password }),
      });
      const result = await response.json();
      if (response.ok) {
        if (result.data.role !== "delivery" && result.data.role !== "driver") {
          Alert.alert("Access Denied", "This login is for delivery personnel only.");
          return;
        }
        await AsyncStorage.setItem("userToken", result.data.token);
        await AsyncStorage.setItem("userRole", result.data.role);
        await AsyncStorage.setItem("userId", result.data.userId.toString());

        // Register for push notifications
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await savePushToken(token);
        }

        router.replace("/delivery-home");
      } else {
        Alert.alert("Login Failed", result.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Server connection failed");
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
          { text: "OK", onPress: () => {
            setShowOTP(false);
            setEmailLogin(pendingEmail);
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
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/quick-read-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>SMART PHARMACY AND {"\n"}PRESCRIPTION SCANNER</Text>
          <Text style={styles.subtitle}>Healthcare management system</Text>

          {showOTP ? (
            <LinearGradient
              colors={["rgba(138, 108, 255, 1)", "rgba(11, 11, 135, 1)"]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.2, y: 1.3 }}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>VERIFY OTP</Text>
              <Text style={{color: '#fff', marginBottom: 10, textAlign: 'center'}}>Enter the code sent to {pendingEmail}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor="#999"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
              />
              <TouchableOpacity style={styles.confirmButton} onPress={handleVerifyOTP} disabled={loading}>
                {loading ? <ActivityIndicator color="rgba(26, 26, 158, 1)" /> : <Text style={styles.confirmButtonText}>Verify</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowOTP(false)} style={{marginTop: 15}}>
                <Text style={{color: '#fff', textDecorationLine: 'underline'}}>Back to Signup</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={["rgba(138, 108, 255, 1)", "rgba(11, 11, 135, 1)"]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.2, y: 1.3 }}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>LOGIN</Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={emailLogin}
                onChangeText={setEmailLogin}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="rgba(26, 26, 158, 1)" /> : <Text style={styles.confirmButtonText}>Confirm</Text>}
              </TouchableOpacity>
            </LinearGradient>
            
          )}
            
          <Text style={styles.cardTitle}>SIGN UP</Text>

                    <View style={styles.rolesRow}>
            <TouchableOpacity
              style={styles.roleItem}
              onPress={() => router.push("/patient-signup")}
            >
              <View style={styles.roleIconCircle}>
                <Image
                  source={require("@/assets/images/patient-role.png")}
                  style={styles.roleIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.roleLabel}>Patient</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleItem}
              onPress={() => router.push("/pharmacy-signup")}
            >
              <View style={styles.roleIconCircle}>
                <Image
                  source={require("@/assets/images/pharmacy-role.png")}
                  style={styles.roleIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.roleLabel}>Pharmacy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleItem}
              onPress={() => router.push("/delivery-signup")}
            >
              <View style={[styles.roleIconCircle, styles.roleIconActive]}>
                <Image
                  source={require("@/assets/images/delivery-role.png")}
                  style={styles.roleIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.roleLabel, styles.roleLabelActive]}>
                Delivery
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/auth-entry")}>
        <Ionicons name="arrow-back" size={24} color="#1E2A78" />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 54,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 18,
  },
  logo: {
    width: 220,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Arial",
    color: "rgba(26, 26, 158, 1)",
    textAlign: "center",
    lineHeight: 30,
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "InstrumentSans-SemiBold",
    fontWeight: "600",
    color: "rgba(26, 26, 158, 1)",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 28,
    lineHeight: 28,
    letterSpacing: 0,
  },
  card: {
    width: "100%",
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 30,
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 22,
    letterSpacing: 1.5,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 22,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333",
    marginBottom: 14,
  },
  confirmButton: {
    backgroundColor: "#ffffffff",
    borderRadius: 25,
    paddingHorizontal: 44,
    paddingVertical: 12,
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  confirmButtonText: {
    color: "rgba(26, 26, 158, 1)",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  roleSectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 1)",
    textAlign: "center",
    letterSpacing: 1,
    marginTop: 90,
    marginBottom: 22,
  },
  rolesRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 36,
    marginTop: "auto",
    paddingTop: 10,
  },
  roleItem: {
    alignItems: "center",
    gap: 6,
  },
  roleIconCircle: {
    width: 78,
    height: 78,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
  },
  roleIconActive: {
    backgroundColor: "#1E2A78",
  },
  roleIcon: {
    width: 40,
    height: 40,
    tintColor: "#fff",
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5A5FAD",
  },
  roleLabelActive: {
    color: "#1E2A78",
    fontWeight: "700",
  },
});
