import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { InstrumentSans_500Medium, InstrumentSans_700Bold, useFonts } from "@expo-google-fonts/instrument-sans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

/**
 * Delivery Partner Settings Screen
 */
export default function DeliverySettingsScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ InstrumentSans_500Medium, InstrumentSans_700Bold });
  const [deliveryName, setDeliveryName] = useState("Dilshi Layanga");
  const [aboutDetails, setAboutDetails] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [tempDeliveryName, setTempDeliveryName] = useState("");
  const [tempAboutDetails, setTempAboutDetails] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const languageOptions = ["English", "Sinhala", "Tamil"];

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to logout?")) {
        try {
          await AsyncStorage.clear();
          router.replace("/auth-entry");
        } catch (error) {
          console.log("Logout error:", error);
        }
      }
      return;
    }
    Alert.alert("Logout", "Are you sure you want to logout?", [
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
            console.log("Logout error:", error);
          }
        },
      },
    ]);

  };

  const handleDeleteAccount = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        AsyncStorage.clear();
        router.replace("/auth-entry");
      }
      return;
    }
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
            await AsyncStorage.clear();
            router.replace("/auth-entry");
          }
        },
      ]
    );
  };

  const handleDeliveryNamePress = () => {
    setTempDeliveryName(deliveryName);
    setIsNameModalVisible(true);
  };

  const closeNameModal = () => {
    setIsNameModalVisible(false);
    setTempDeliveryName("");
  };

  const saveDeliveryName = () => {
    if (!tempDeliveryName.trim()) {
      Alert.alert("Error", "Please enter delivery name");
      return;
    }
    setDeliveryName(tempDeliveryName.trim());
    closeNameModal();
  };

  const openAboutModal = () => {
    setTempAboutDetails(aboutDetails);
    setIsAboutModalVisible(true);
  };

  const closeAboutModal = () => {
    setIsAboutModalVisible(false);
    setTempAboutDetails("");
  };

  const saveAboutDetails = () => {
    if (!tempAboutDetails.trim()) {
      Alert.alert("Error", "Please enter about details");
      return;
    }
    setAboutDetails(tempAboutDetails.trim());
    closeAboutModal();
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  const openPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalVisible(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleSavePassword = () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      Alert.alert("Error", "Please enter both current and new password");
      return;
    }

    Alert.alert("Success", "Password updated successfully");
    closePasswordModal();
  };

  const menuItems = [
    { label: "Edit Password", onPress: openPasswordModal },
    { label: "About", onPress: openAboutModal },
  ];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/UI_Background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <StatusBar style="light" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoSection}>
            <Image
              source={require("@/assets/images/quick-read-logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Settings</Text>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDeliveryNamePress}
              activeOpacity={0.75}
            >
              <Text style={styles.menuLabel}>Delivery Name</Text>
              <Text style={styles.menuValue}>{deliveryName}</Text>
            </TouchableOpacity>

            <View>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                  setIsLanguageDropdownOpen((previous) => !previous)
                }
                activeOpacity={0.75}
              >
                <Text style={styles.menuLabel}>Language</Text>
                <View style={styles.languageValueWrap}>
                  <Text style={styles.menuValue}>{selectedLanguage}</Text>
                  <Ionicons
                    name={isLanguageDropdownOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="rgba(26, 26, 158, 0.8)"
                  />
                </View>
              </TouchableOpacity>

              {isLanguageDropdownOpen && (
                <View style={styles.dropdownContainer}>
                  {languageOptions.map((language) => (
                    <TouchableOpacity
                      key={language}
                      style={styles.dropdownItem}
                      onPress={() => handleLanguageSelect(language)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.dropdownItemText}>{language}</Text>
                      {selectedLanguage === language && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color="rgba(26, 26, 158, 0.9)"
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.75}
              >
                <Text style={styles.menuLabel}>{item.label}</Text>
                <FontAwesome5 name="user-edit" size={16} color="rgba(26, 26, 158, 0.8)" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={handleLogout} activeOpacity={0.85} style={styles.actionButtonWrapper}>
              <LinearGradient
                colors={["rgba(133, 77, 253, 1)", "rgba(61, 36, 153, 1)"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.logoutButton}
              >
                <Text style={styles.logoutButtonText}>Log Out</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteAccount} activeOpacity={0.85} style={styles.actionButtonWrapper}>
              <LinearGradient
                colors={["rgba(220, 50, 50, 1)", "rgba(160, 20, 20, 1)"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.logoutButton}
              >
                <Text style={styles.logoutButtonText}>Delete Account</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={isNameModalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeNameModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Edit Delivery Name</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Delivery Name"
                placeholderTextColor="rgba(26, 26, 158, 0.6)"
                value={tempDeliveryName}
                onChangeText={setTempDeliveryName}
              />

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={closeNameModal}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={saveDeliveryName}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isAboutModalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeAboutModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Edit About</Text>

              <TextInput
                style={[styles.modalInput, styles.aboutInput]}
                placeholder="Type about details"
                placeholderTextColor="rgba(26, 26, 158, 0.6)"
                value={tempAboutDetails}
                onChangeText={setTempAboutDetails}
                multiline
                textAlignVertical="top"
              />

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={closeAboutModal}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={saveAboutDetails}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isPasswordModalVisible}
          transparent
          animationType="fade"
          onRequestClose={closePasswordModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Edit Password</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Current Password"
                placeholderTextColor="rgba(26, 26, 158, 0.6)"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="New Password"
                placeholderTextColor="rgba(26, 26, 158, 0.6)"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={closePasswordModal}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={handleSavePassword}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Navigation handled by _layout.tsx */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 150 },
  logoSection: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 10,
  },
  logoImage: { width: 280, height: 158 },
  title: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 26,
    fontWeight: "500",
    color: "rgba(26, 26, 158, 1)",
    textAlign: "center",
    letterSpacing: 0,
    marginBottom: 30,
  },
  menuContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuLabel: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(26, 26, 158, 1)",
    letterSpacing: 0,
  },
  menuValue: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(26, 26, 158, 0.85)",
  },
  languageValueWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropdownContainer: {
    marginTop: 8,
    marginHorizontal: 6,
    marginBottom: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.48)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 14,
    color: "rgba(26, 26, 158, 0.95)",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 70,
    paddingHorizontal: 20,
  },
  actionButtonWrapper: { flex: 1 },
  logoutButton: {
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "italic",
    letterSpacing: 0,
    textAlign: "center",
    color: "rgba(255, 255, 255, 1)",
  },
  actionButton: {
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontFamily: "InstrumentSans_700Bold",
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.65)",
  },
  modalTitle: {
    fontFamily: "InstrumentSans_700Bold",
    fontSize: 22,
    fontWeight: "700",
    color: "rgba(26, 26, 158, 1)",
    textAlign: "center",
    marginBottom: 16,
  },
  modalInput: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(26, 26, 158, 0.2)",
    paddingHorizontal: 14,
    color: "rgba(26, 26, 158, 1)",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 12,
  },
  aboutInput: {
    height: 110,
    paddingTop: 12,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "rgba(240, 240, 247, 1)",
  },
  modalSaveButton: {
    backgroundColor: "rgba(26, 26, 158, 1)",
  },
  modalCancelText: {
    color: "rgba(26, 26, 158, 1)",
    fontSize: 15,
    fontWeight: "700",
  },
  modalSaveText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 18,
    paddingHorizontal: 40,
    marginHorizontal: 30,
    marginBottom: 30,
    justifyContent: "space-around",
    borderRadius: 35,
    alignItems: "center",
  },
  navItem: { padding: 8, alignItems: "center", justifyContent: "center" },
});
