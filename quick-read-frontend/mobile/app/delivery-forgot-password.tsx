import { Ionicons } from "@expo/vector-icons";
import { InstrumentSans_500Medium, useFonts } from "@expo-google-fonts/instrument-sans";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DeliveryForgotPasswordScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ InstrumentSans_500Medium });
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    Alert.alert("Success", "Password reset link has been sent to your email", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <ImageBackground
      source={require("@/assets/images/UI_Background.jpeg")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#1F2937" />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Reset Your{"\n"}Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your
          password
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(26, 26, 158, 1)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Ionicons
              name="mail-outline"
              size={20}
              color="rgba(26, 26, 158, 1)"
              style={styles.inputIcon}
            />
          </View>
          <TouchableOpacity onPress={handleResetPassword} activeOpacity={0.85}>
            <LinearGradient
              colors={["rgba(133, 77, 253, 1)", "rgba(61, 36, 153, 1)"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>RESET PASSWORD</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40, paddingTop: 120 },
  backButtonContainer: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 26,
    fontWeight: "500",
    color: "rgba(26, 26, 158, 1)",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 26,
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(26, 26, 158, 1)",
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 40,
    lineHeight: 22,
  },
  formContainer: { paddingHorizontal: 30 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 55,
  },
  input: { flex: 1, fontSize: 16, color: "#1F2937" },
  inputIcon: { marginLeft: 10 },
  resetButton: {
    width: 339,
    height: 48,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  resetButtonText: {
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "italic",
    letterSpacing: 0,
    textAlign: "center",
    color: "rgba(255, 255, 255, 1)",
  },
  backText: {
    textAlign: "center",
    fontSize: 14,
    color: "rgba(26, 26, 158, 1)",
    fontWeight: "600",
  },
});
