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
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Platform,
} from "react-native";

export default function PharmacySettingsScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ InstrumentSans_500Medium, InstrumentSans_700Bold });
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  
  // Password Modal State
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Pharmacy Name Modal State
  const [profileName, setProfileName] = useState("Aruna Pharmacy");
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [nameInput, setNameInput] = useState(profileName);

  // About Modal State
  const [aboutText, setAboutText] = useState("We provide 24/7 medical services.");
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
  const [aboutInput, setAboutInput] = useState(aboutText);

  // Address Modal State
  const [addressText, setAddressText] = useState("123 Health Street, Colombo");
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [addressInput, setAddressInput] = useState(addressText);

  const languageOptions = ["English", "Sinhala", "Tamil"];

  const handleLogout = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to logout?")) {
        try {
          AsyncStorage.clear().then(() => router.replace("/auth-entry"));
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
        router.replace("/auth-entry");
      }
      return;
    }
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => router.replace("/") },
      ]
    );
  };

  const handlePharmacyNamePress = () => {
    setNameInput(profileName);
    setIsNameModalVisible(true);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  const handleAboutPress = () => {
    setAboutInput(aboutText);
    setIsAboutModalVisible(true);
  };

  const handleAddressPress = () => {
    setAddressInput(addressText);
    setIsAddressModalVisible(true);
  };

  const menuItems = [
    { label: "Pharmacy address", onPress: handleAddressPress },
    { label: "Edit Password", onPress: () => setIsPasswordModalVisible(true) },
    { label: "About", onPress: handleAboutPress },
  ];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/UI_Background.jpeg")}
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
              source={require("../assets/images/quick-read-logo.png")}
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
              onPress={handlePharmacyNamePress}
              activeOpacity={0.75}
            >
              <Text style={styles.menuLabel}>Edit pharmacy Name</Text>
              <Text style={styles.menuValue}>{profileName}</Text>
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

        {/* Navigation handled by _layout.tsx */}

        {/* Change Password Modal */}
        <Modal
          visible={isPasswordModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsPasswordModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Current Password"
                placeholderTextColor="rgba(26, 26, 158, 0.5)"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="New Password"
                placeholderTextColor="rgba(26, 26, 158, 0.5)"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              
              <View style={styles.modalButtonGroup}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => {
                    setIsPasswordModalVisible(false);
                    setCurrentPassword("");
                    setNewPassword("");
                  }}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={() => {
                    Alert.alert("Success", "Password updated successfully!");
                    setIsPasswordModalVisible(false);
                    setCurrentPassword("");
                    setNewPassword("");
                  }}
                >
                  <Text style={styles.modalSaveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Pharmacy Name Modal */}
        <Modal
          visible={isNameModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsNameModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Pharmacy Name</Text>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Enter Pharmacy Name"
                placeholderTextColor="rgba(26, 26, 158, 0.5)"
                value={nameInput}
                onChangeText={setNameInput}
              />
              
              <View style={styles.modalButtonGroup}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => setIsNameModalVisible(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={() => {
                    setProfileName(nameInput);
                    setIsNameModalVisible(false);
                    Alert.alert("Success", "Pharmacy Name updated successfully!");
                  }}
                >
                  <Text style={styles.modalSaveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit About Modal */}
        <Modal
          visible={isAboutModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsAboutModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit About</Text>
              
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Write about the pharmacy..."
                placeholderTextColor="rgba(26, 26, 158, 0.5)"
                multiline={true}
                numberOfLines={4}
                value={aboutInput}
                onChangeText={setAboutInput}
              />
              
              <View style={styles.modalButtonGroup}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => setIsAboutModalVisible(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={() => {
                    setAboutText(aboutInput);
                    setIsAboutModalVisible(false);
                    Alert.alert("Success", "About information updated successfully!");
                  }}
                >
                  <Text style={styles.modalSaveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Address Modal */}
        <Modal
          visible={isAddressModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsAddressModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Address</Text>
              
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Enter pharmacy address..."
                placeholderTextColor="rgba(26, 26, 158, 0.5)"
                multiline={true}
                numberOfLines={3}
                value={addressInput}
                onChangeText={setAddressInput}
              />
              
              <View style={styles.modalButtonGroup}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => setIsAddressModalVisible(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={() => {
                    setAddressText(addressInput);
                    setIsAddressModalVisible(false);
                    Alert.alert("Success", "Address updated successfully!");
                  }}
                >
                  <Text style={styles.modalSaveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: "InstrumentSans_700Bold",
    fontSize: 20,
    color: "rgba(26, 26, 158, 1)",
    marginBottom: 20,
  },
  modalInput: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderColor: "rgba(26, 26, 158, 0.2)",
    borderWidth: 1,
    color: "rgba(26, 26, 158, 1)",
  },
  modalButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "rgba(200, 200, 200, 0.5)",
    marginRight: 10,
  },
  modalSaveButton: {
    backgroundColor: "rgba(61, 36, 153, 1)",
    marginLeft: 10,
  },
  modalCancelButtonText: {
    fontFamily: "InstrumentSans_700Bold",
    fontSize: 16,
    color: "rgba(26, 26, 158, 0.8)",
  },
  modalSaveButtonText: {
    fontFamily: "InstrumentSans_700Bold",
    fontSize: 16,
    color: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 15,
  },
});
