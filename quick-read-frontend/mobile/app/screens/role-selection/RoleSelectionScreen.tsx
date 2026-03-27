import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RoleSelectionScreen() {
  const router = useRouter();

  const [selectionMode, setSelectionMode] = useState<"login" | "signup">("login");

  const handleRoleSelection = (role: "patient" | "pharmacy" | "delivery") => {
    const target = selectionMode === "login" ? "-login" : "-signup";
    router.push(`/${role}${target}`);
  };

  return (
    <ImageBackground
      source={require("@/assets/images/UI_Background.jpeg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar style="light" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
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
        <Text style={styles.title}>Select Who You Are?</Text>
        <Text style={styles.subtitle}>Choose your role to continue</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, selectionMode === "login" && styles.toggleButtonActive]} 
            onPress={() => setSelectionMode("login")}
          >
            <Text style={[styles.toggleText, selectionMode === "login" && styles.toggleTextActive]}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, selectionMode === "signup" && styles.toggleButtonActive]} 
            onPress={() => setSelectionMode("signup")}
          >
            <Text style={[styles.toggleText, selectionMode === "signup" && styles.toggleTextActive]}>SIGN UP</Text>
          </TouchableOpacity>
        </View>

        {/* Roles */}
        <View style={styles.rolesContainer}>

          {/* Patient */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleRoleSelection("patient")}
          >
            <Image
              source={require("@/assets/icons/patient.png")}
              style={styles.roleIcon}
              resizeMode="contain"
            />
            <Text style={styles.roleText}>Patient</Text>
          </TouchableOpacity>

          {/* Pharmacy */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleRoleSelection("pharmacy")}
          >
            <Image
              source={require("@/assets/icons/pharmacy.png")}
              style={styles.roleIcon}
              resizeMode="contain"
            />
            <Text style={styles.roleText}>Pharmacy</Text>
          </TouchableOpacity>

          {/* Delivery */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleRoleSelection("delivery")}
          >
            <Image
              source={require("@/assets/icons/delivery.png")}
              style={styles.roleIcon}
              resizeMode="contain"
            />
            <Text style={styles.roleText}>Delivery</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 50,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 230,
    height: 130,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A9E",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#1A1A9E",
    textAlign: "center",
    marginBottom: 40,
  },
  rolesContainer: {
    paddingHorizontal: 40,
    gap: 50,
    alignItems: "center",
  },
  roleCard: {
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  roleIcon: {
    width: 50,
    height: 60,
  },
  roleText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A9E",
    marginTop: 5,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
    width: 260,
    alignSelf: "center",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 22,
  },
  toggleButtonActive: {
    backgroundColor: "#1A1A9E",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A9E",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
});
