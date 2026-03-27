import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PharmacyProfileScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async () => {
    Alert.alert("Change Profile Photo", "Choose an option", [
      {
        text: "Take Photo",
        onPress: async () => {
          const permissionResult =
            await ImagePicker.requestCameraPermissionsAsync();
          if (permissionResult.granted === false) {
            Alert.alert(
              "Permission Required",
              "Camera permission is required to take photos",
            );
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          });

          if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
          }
        },
      },
      {
        text: "Choose from Gallery",
        onPress: async () => {
          const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (permissionResult.granted === false) {
            Alert.alert(
              "Permission Required",
              "Gallery permission is required to select photos",
            );
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

          if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const profileFields = [
    { key: "deliveryAddress", placeholder: "Delivery address" },
    { key: "contactNumber", placeholder: "Contact number" },
    { key: "emailAddress", placeholder: "Email address" },
    { key: "registeredNo", placeholder: "Registered No" },
  ];

  return (
    <ImageBackground
      source={require("../assets/images/UI_Background.jpeg")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <Image
            source={require("../assets/images/quick-read-logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarOuter} onPress={pickImage}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <FontAwesome5 name="building" size={45} color="#151779" />
            )}
          </TouchableOpacity>
          <View style={styles.nameRow}>
            <Text style={styles.namePrimary}>Aruna Pharmacy</Text>
            <Ionicons name="create-outline" size={30} color="rgba(42, 28, 164, 1)" style={{ marginLeft: 8 }} />
          </View>
        </View>

        <View style={styles.formContainer}>
          {profileFields.map((field) => (
            <View key={field.key} style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="rgba(33, 34, 150, 1)"
              />
              <FontAwesome5 name="user-edit" size={17} color="rgba(33, 34, 150, 1)" />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} activeOpacity={0.85}>
          <LinearGradient
            colors={["rgba(70, 114, 245, 1)", "rgba(88, 28, 255, 1)"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>SAVE</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>

      {/* Navigation handled by _layout.tsx */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 150,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  logoImage: { width: 280, height: 158 },
  profileSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 5,
  },
  avatarPlaceholderIcon: {
    opacity: 0.95,
  },
  avatarImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  namePrimary: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  formContainer: {
    width: "100%",
    gap: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    paddingHorizontal: 25,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  input: {
    flex: 1,
    color: "rgba(33, 34, 150, 1)",
    fontSize: 18,
    fontWeight: "600",
  },
  saveButton: {
    width: "80%",
    height: 60,
    marginTop: 40,
    marginBottom: 18,
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    shadowColor: "rgba(0,0,0,0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 10,
  },
  saveButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
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
  navItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 18,
  },
});
