import { Ionicons } from "@expo/vector-icons";
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
import { registerForPushNotificationsAsync, savePushToken } from "@/utils/push-helper";

export default function PharmacyLoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        if (result.data.role !== "pharmacist") {
          Alert.alert("Access Denied", "This login is for pharmacists only.");
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

        router.replace("/pharmacy-home");
      } else {
        Alert.alert("Login Failed", result.message || "Invalid credentials");
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
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/quick-read-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            SMART PHARMACY AND{"\n"}PRESCRIPTION SCANNER
          </Text>
          <Text style={styles.subtitle}>Healthcare management system</Text>

          {/* Login Card */}
          <LinearGradient
            colors={["rgba(138, 108, 255, 1)", "rgba(11, 11, 135, 1)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>LOGIN</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#1E2A78"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#1E2A78"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.confirmButton} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="rgba(26, 26, 158, 1)" /> : <Text style={styles.confirmButtonText}>Confirm</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/pharmacy-signup")} style={{marginTop: 20}}>
               <Text style={{color: '#FFFFFF', fontWeight: '600', textDecorationLine: 'underline'}}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
          </LinearGradient>
          
          <Text style={styles.roleSectionTitle}>SIGN UP</Text>

          {/* Role navigation */}
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
              <View style={[styles.roleIconCircle, styles.roleIconActive]}>
                <Image
                  source={require("@/assets/images/pharmacy-role.png")}
                  style={styles.roleIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.roleLabel, styles.roleLabelActive]}>
                Pharmacy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleItem}
              onPress={() => router.push("/delivery-signup")}
            >
              <View style={styles.roleIconCircle}>
                <Image
                  source={require("@/assets/images/delivery-role.png")}
                  style={styles.roleIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.roleLabel}>Delivery</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Back Button */}
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

  /* Logo */
  logoContainer: {
    alignItems: "center",
    marginBottom: 18,
  },
  logo: {
    width: 220,
    height: 80,
  },

  /* Title */
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "rgba(26, 26, 158, 1)",
    textAlign: "center",
    lineHeight: 30,
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(26, 26, 158, 1)",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 28,
    lineHeight: 28,
  },

  /* Card */
  card: {
    width: "90%",
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 35,
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 30,
    letterSpacing: 1.5,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 22,
    paddingVertical: 14,
    fontSize: 16,
    color: "#080808",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "700",
  },
  confirmButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 12,
    marginTop: 10,
  },
  confirmButtonText: {
    color: "rgba(26, 26, 158, 1)",
    fontSize: 16,
    fontWeight: "800",
  },

  /* Role section */
  roleSectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 22,
  },

  /* Role row */
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
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  roleIconActive: {
    borderWidth: 2,
    borderColor: "#1E2A78",
    borderRadius: 12,
    backgroundColor: "#1E2A78",
  },
  roleIcon: {
    width: 45,
    height: 45,
    tintColor: "#f7f8fc",
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E2A78",
  },
  roleLabelActive: {
    color: "#0B0B87",
    fontWeight: "800",
  },
});
