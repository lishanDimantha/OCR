import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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

export default function DeliveryEditProfileScreen() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("partner@quickread.com");
  const [phone, setPhone] = useState("+1 234 567 8900");
  const [vehicleNumber, setVehicleNumber] = useState("ABC 1234");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSave = () => {
    router.back();
  };

  const handleLogout = () => {
    router.replace("/delivery-login");
  };

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
          if (!result.canceled) setProfileImage(result.assets[0].uri);
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
          if (!result.canceled) setProfileImage(result.assets[0].uri);
        },
      },
      { text: "Cancel", style: "cancel" },
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
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <Ionicons name="person" size={60} color="rgba(26, 26, 158, 1)" />
            )}
            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={24} color="rgba(26, 26, 158, 1)" />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={24} color="rgba(26, 26, 158, 1)" />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={24} color="rgba(26, 26, 158, 1)" />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Vehicle Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="car-outline" size={24} color="rgba(26, 26, 158, 1)" />
              <TextInput
                style={styles.input}
                value={vehicleNumber}
                onChangeText={setVehicleNumber}
                placeholder="Enter vehicle number"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={handleSave} activeOpacity={0.85}>
          <LinearGradient
            colors={["rgba(133, 77, 253, 1)", "rgba(61, 36, 153, 1)"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.saveButton}
          >
            <Text style={styles.saveText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButtonContainer: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: { flex: 1 },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
    paddingTop: 100,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  avatarImage: { width: "100%", height: "100%", borderRadius: 60 },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(26, 26, 158, 1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  formContainer: { paddingHorizontal: 20, marginTop: 10 },
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
    backgroundColor: "rgba(255, 255, 255, 0.6)",
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
  saveButton: {
    width: 339,
    height: 48,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  saveText: {
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "italic",
    letterSpacing: 0,
    textAlign: "center",
    color: "rgba(255, 255, 255, 1)",
  },
});
