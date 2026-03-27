import { Ionicons } from "@expo/vector-icons";
import { InstrumentSans_500Medium, useFonts } from "@expo-google-fonts/instrument-sans";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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

export default function DeliveryChangePasswordScreen() {
  const [fontsLoaded] = useFonts({ InstrumentSans_500Medium });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }
    Alert.alert("Success", "Password changed successfully", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/UI_Background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <StatusBar style="light" />

        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>
              Enter your current password and choose a new one
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Current Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color="rgba(26, 26, 158, 1)"
                />
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="rgba(26, 26, 158, 1)"
                  secureTextEntry={!showCurrent}
                />
                <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                  <Ionicons
                    name={showCurrent ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="rgba(26, 26, 158, 1)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color="rgba(26, 26, 158, 1)"
                />
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="rgba(26, 26, 158, 1)"
                  secureTextEntry={!showNew}
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  <Ionicons
                    name={showNew ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="rgba(26, 26, 158, 1)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color="rgba(26, 26, 158, 1)"
                />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="rgba(26, 26, 158, 1)"
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons
                    name={showConfirm ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="rgba(26, 26, 158, 1)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>
                Password must contain:
              </Text>
              <Text style={styles.requirementItem}>
                • At least 6 characters
              </Text>
              <Text style={styles.requirementItem}>
                • Mix of letters and numbers (recommended)
              </Text>
            </View>

            <TouchableOpacity onPress={handleChangePassword} activeOpacity={0.85}>
              <LinearGradient
                colors={["rgba(133, 77, 253, 1)", "rgba(61, 36, 153, 1)"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.changeButton}
              >
                <Text style={styles.changeButtonText}>Change Password</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  backButtonContainer: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  titleContainer: { paddingHorizontal: 20, marginTop: 120, marginBottom: 30 },
  title: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 26,
    fontWeight: "500",
    color: "rgba(26, 26, 158, 1)",
    textAlign: "center",
    letterSpacing: 0,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(26, 26, 158, 1)",
    lineHeight: 24,
    textAlign: "center",
  },
  formContainer: { paddingHorizontal: 20 },
  inputContainer: { marginBottom: 20 },
  inputLabel: {
    fontSize: 14,
    color: "rgba(26, 26, 158, 1)",
    fontWeight: "600",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  requirementsContainer: {
    backgroundColor: "rgba(139, 127, 232, 0.1)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(26, 26, 158, 1)",
    marginBottom: 10,
  },
  requirementItem: { fontSize: 13, color: "rgba(26, 26, 158, 1)", marginBottom: 5 },
  changeButton: {
    width: 339,
    height: 48,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    alignSelf: "center",
  },
  changeButtonText: {
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "italic",
    letterSpacing: 0,
    textAlign: "center",
    color: "rgba(255, 255, 255, 1)",
  },
});
