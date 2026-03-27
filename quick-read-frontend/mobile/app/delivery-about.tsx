import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DeliveryAboutScreen() {
  const handleOpenURL = (url: string) => {
    Linking.openURL(url);
  };
  const handleContactEmail = () => {
    Linking.openURL("mailto:support@quickread.com");
  };
  const handleContactPhone = () => {
    Linking.openURL("tel:+1234567890");
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
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/quick-read-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>QuickRead</Text>
            <Text style={styles.tagline}>Your Trusted Delivery Partner</Text>
          </View>

          {/* Version */}
          <View style={styles.infoCard}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
            <Text style={styles.buildText}>Build 2026.02.04</Text>
            <Text style={styles.updateText}>Last Updated: February 2026</Text>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About QuickRead</Text>
            <Text style={styles.description}>
              QuickRead is a comprehensive delivery management platform designed
              to empower delivery partners with efficient tools for managing
              their daily operations, tracking deliveries, and maximizing their
              earnings.
            </Text>
          </View>

          {/* Mission */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.description}>
              To provide delivery partners with the best technology and support
              to ensure seamless delivery experiences while building a
              sustainable and rewarding career.
            </Text>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleContactEmail}
            >
              <Ionicons name="mail-outline" size={24} color="rgba(26, 26, 158, 1)" />
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>support@quickread.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(26, 26, 158, 1)" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleContactPhone}
            >
              <Ionicons name="call-outline" size={24} color="rgba(26, 26, 158, 1)" />
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>+1 (234) 567-890</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(26, 26, 158, 1)" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleOpenURL("https://quickreadscanner.com/")}
            >
              <Ionicons name="globe-outline" size={24} color="rgba(26, 26, 158, 1)" />
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>
                  https://quickreadscanner.com/
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(26, 26, 158, 1)" />
            </TouchableOpacity>
          </View>

          {/* Social Media */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Follow Us</Text>
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleOpenURL("https://www.facebook.com/share/1AiUKozMLF/")}
              >
                <Ionicons name="logo-facebook" size={28} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleOpenURL("https://instagram.com/quickread")}
              >
                <Ionicons name="logo-instagram" size={28} color="#E4405F" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() =>
                  handleOpenURL("https://www.linkedin.com/company/quick-read/")
                }
              >
                <Ionicons name="logo-linkedin" size={28} color="#0A66C2" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Technical Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Information</Text>
            <View style={styles.techInfoContainer}>
              <View style={styles.techInfoItem}>
                <Text style={styles.techLabel}>Platform</Text>
                <Text style={styles.techValue}>React Native</Text>
              </View>
              <View style={styles.techInfoItem}>
                <Text style={styles.techLabel}>Framework</Text>
                <Text style={styles.techValue}>Expo SDK 54</Text>
              </View>
              <View style={styles.techInfoItem}>
                <Text style={styles.techLabel}>Minimum OS</Text>
                <Text style={styles.techValue}>iOS 13+ / Android 6+</Text>
              </View>
            </View>
          </View>

          {/* Copyright */}
          <View style={styles.copyrightContainer}>
            <Text style={styles.copyrightText}>
              © 2026 QuickRead Inc. All rights reserved.
            </Text>
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
  logoContainer: { alignItems: "center", marginTop: 100, marginBottom: 20 },
  logo: { width: 220, height: 120, marginBottom: 15 },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: "rgba(26, 26, 158, 1)",
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(26, 26, 158, 1)",
    fontStyle: "italic",
  },
  infoCard: {
    backgroundColor: "rgba(139, 127, 232, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(123, 111, 216, 0.25)",
    alignItems: "center",
  },
  versionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "rgba(26, 26, 158, 1)",
    marginBottom: 5,
  },
  buildText: { fontSize: 14, color: "rgba(26, 26, 158, 1)", marginBottom: 3 },
  updateText: { fontSize: 14, color: "rgba(26, 26, 158, 1)" },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "rgba(26, 26, 158, 1)",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "rgba(26, 26, 158, 1)",
    lineHeight: 24,
    textAlign: "justify",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  contactTextContainer: { flex: 1, marginLeft: 15 },
  contactLabel: { fontSize: 14, color: "rgba(26, 26, 158, 1)", marginBottom: 3 },
  contactValue: { fontSize: 16, color: "#1F2937", fontWeight: "500" },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  techInfoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 12,
    padding: 15,
  },
  techInfoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(156, 163, 175, 0.2)",
  },
  techLabel: { fontSize: 15, color: "rgba(26, 26, 158, 1)" },
  techValue: { fontSize: 15, color: "#1F2937", fontWeight: "600" },
  copyrightContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 10,
  },
  copyrightText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 5,
  },
  copyrightSubtext: {
    fontSize: 13,
    color: "rgba(255,255,255,0.50)",
    fontStyle: "italic",
  },
});
