import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useCallback } from "react";
import config from "@/constants/config";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function SettingsScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("Patient");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(" ");
  const [patientName, setPatientName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [aboutText, setAboutText] = useState("");
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem("fullName");
        const fallbackUserName = await AsyncStorage.getItem("username");

        if (storedName?.trim()) {
          setUserName(storedName);
          return;
        }

        if (fallbackUserName?.trim()) {
          setUserName(fallbackUserName);
        }
      } catch (error) {
        if (__DEV__) console.log("Fetch user name error:", error);
      }
    };

    fetchUserName();
  }, []);

  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadProfileImage = async () => {
        const pic = await AsyncStorage.getItem("profilePicture");
        if (pic) setProfilePicture(pic);
      };
      loadProfileImage();
    }, [])
  );

  const getImageUrl = (path: string | null) => {
    if (!path) return "https://i.pravatar.cc/150?img=5";
    if (path.startsWith("http")) return path;
    return `${config.apiUrl.replace('/api', '')}${path}`;
  };

  const handleLanguage = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const selectLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    setShowLanguageDropdown(false);
  };

  const handleLoginOut = async () => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to logout?")) {
        try {
          await AsyncStorage.clear();
          router.replace("/auth-entry");
        } catch (error) {
          if (__DEV__) console.log("Logout error:", error);
        }
      }
      return;
    }
    Alert.alert("Login Out", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            // Using replace to ensure the current settings screen is removed from history
            router.replace("/auth-entry");
          } catch (error) {
            if (__DEV__) console.log("Logout error:", error);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        try {
          await AsyncStorage.clear();
          alert("Account Deleted");
          router.replace("/patient-signup");
        } catch (error) {
          if (__DEV__) console.log("Delete account error:", error);
        }
      }
      return;
    }
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Account Deleted", "Your account has been deleted.");
              router.replace("/patient-signup");
            } catch (error) {
              if (__DEV__) console.log("Delete account error:", error);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("@/assets/images/UI_Background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={["rgba(139, 152, 255, 0.5)", "rgba(88, 130, 255, 0.5)"]}
          style={styles.gradientOverlay}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require("@/assets/images/quick-read-logo.png")}
                  style={styles.headerLogo}
                  resizeMode="contain"
                  tintColor="#FFFFFF"
                />
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/patient-profile')}>
                  <Image
                    source={{ uri: getImageUrl(profilePicture) }}
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.notificationButton}
                  onPress={() => router.push("/patient-notifications")}
                >
                  <Ionicons name="notifications" size={24} color="#FFFFFF" />
                  <View style={styles.notificationBadge} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.headerBottom}>
              <Text style={styles.settingsTitle}>Settings</Text>
            </View>
          </View>

          {/* Settings Card */}
          <View style={styles.settingsCard}>
            {/* Patient Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Patient Name</Text>
              <TextInput
                style={styles.textInput}
                value={patientName}
                onChangeText={setPatientName}
                placeholder="Enter patient name"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>

            {/* Language */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Language</Text>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleLanguage}
                activeOpacity={0.7}
              >
                <Text style={styles.settingText}>{selectedLanguage}</Text>
                <Ionicons
                  name={showLanguageDropdown ? "chevron-down" : "chevron-forward"}
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              {showLanguageDropdown && (
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => selectLanguage("English")}
                  >
                    <Text style={[styles.dropdownText, selectedLanguage === "English" && styles.dropdownTextSelected]}>English</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => selectLanguage("Sinhala")}
                  >
                    <Text style={[styles.dropdownText, selectedLanguage === "Sinhala" && styles.dropdownTextSelected]}>Sinhala</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dropdownItem, styles.dropdownItemLast]}
                    onPress={() => selectLanguage("Tamil")}
                  >
                    <Text style={[styles.dropdownText, selectedLanguage === "Tamil" && styles.dropdownTextSelected]}>Tamil</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Delivery Address */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Delivery Address</Text>
              <TextInput
                style={styles.textInput}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                placeholder="Enter delivery address"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>

            {/* About */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>About</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={aboutText}
                onChangeText={setAboutText}
                placeholder="Tell us about yourself"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Action Buttons Row */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLoginOut}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonText}>Login Out</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDeleteAccount}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Modern Bottom Navigation Bar */}
        {/* Navigation handled by _layout.tsx */}
      </ImageBackground>
    </View>
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
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 40,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoWrapper: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerLogo: {
    width: 140,
    height: 40,
    marginLeft: -25,
  },
  headerBottom: {
    marginTop: 30,
    alignItems: "center",
  },
  helloText: {
    fontSize: 26,
    color: "#FFFFFF",
    fontWeight: "400",
    fontFamily: "InstrumentSans_700Bold",
    lineHeight: 32,
  },
  userName: {
    fontSize: 24,
    color: "#5409DA",
    fontWeight: "700",
    marginTop: -5,
    fontFamily: "InstrumentSans_700Bold",
  },
  settingsTitle: {
    fontSize: 32,
    color: "#5409DA",
    fontWeight: "700",
    fontFamily: "InstrumentSans_700Bold",
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#5409DA",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF4444",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  settingsCard: {
    backgroundColor: "rgba(200, 180, 255, 0.35)",
    borderRadius: 30,
    padding: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  settingItem: {
    backgroundColor: "rgba(200, 180, 255, 0.4)",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  settingText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "InstrumentSans_700Bold",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 8,
    fontFamily: "InstrumentSans_700Bold",
    marginLeft: 4,
  },
  textInput: {
    backgroundColor: "rgba(200, 180, 255, 0.4)",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    color: "#FFFFFF",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    fontFamily: "InstrumentSans_400Regular",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dropdownContainer: {
    backgroundColor: "rgba(200, 180, 255, 0.4)",
    borderRadius: 20,
    marginTop: -10,
    marginBottom: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  dropdownTextSelected: {
    fontWeight: "700",
    color: "#5409DA",
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "rgba(200, 180, 255, 0.4)",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "InstrumentSans_700Bold",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.3)",
  },
  logo: {
    width: width * 0.4,
    height: 60,
  },
});
