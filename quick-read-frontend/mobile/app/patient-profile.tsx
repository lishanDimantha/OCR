import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import config from "@/constants/config";
import * as ImagePicker from "expo-image-picker";
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

export default function ProfileScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("Patient");
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [fullName, setFullName] = useState("Patient Name");
  const [nickName, setNickName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getImageUrl = (path: string | null) => {
    if (!path) return "https://i.pravatar.cc/300?img=5";
    if (path.startsWith("http")) return path;
    return `${config.apiUrl.replace('/api', '')}${path}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;

        const response = await fetch(`${config.apiUrl}/users/profile`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await response.json();
        if (response.ok && result.data) {
          const user = result.data;
          if (user.name) {
            setUserName(user.name.split(" ")[0]);
            setFullName(user.name);
            setNickName(user.name);
          }
          if (user.email) setEmailAddress(user.email);
          if (user.phone) setContactNumber(user.phone);
          if (user.address) setDeliveryAddress(user.address);
          if (user.date_of_birth) setDateOfBirth(user.date_of_birth);
          if (user.profile_picture) {
            setProfilePicture(user.profile_picture);
            await AsyncStorage.setItem("profilePicture", user.profile_picture);
          }
        } else {
          // Fallback to async storage if profile fails
          const storedName = await AsyncStorage.getItem("fullName");
          if (storedName) { setUserName(storedName); setFullName(storedName); }
        }
      } catch (error) {
        if (__DEV__) console.error("Error fetching profile:", error);
      }
    };

   fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${config.apiUrl}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: nickName || fullName,
          email: emailAddress,
          phone: contactNumber,
          address: deliveryAddress,
          date_of_birth: dateOfBirth,
        })
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Profile Updated", "Your profile has been updated successfully!");
        setFullName(result.data.name || nickName);
        setUserName((result.data.name || nickName).split(" ")[0]);
      } else {
        Alert.alert("Update Failed", result.message || "Could not update profile.");
      }
    } catch (error) {
      console.error("Save profile error:", error);
      Alert.alert("Error", "Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const uploadProfilePicture = async (base64Image: string) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${config.apiUrl}/users/profile-picture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ base64_image: base64Image }),
      });

      const result = await response.json().catch(() => ({ message: 'Could not parse response' }));
      if (response.ok) {
        if (result.data?.profile_picture) {
          setProfilePicture(result.data.profile_picture);
          await AsyncStorage.setItem("profilePicture", result.data.profile_picture);
        }
        Alert.alert("Success", "Profile picture updated!");
      } else {
        Alert.alert("Upload Failed", `Server rejected: ${result.message || JSON.stringify(result)}`);
      }
    } catch (error: any) {
      console.error("Upload error JSON:", error);
      Alert.alert("Error Caught", `Could not upload. Details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to update your profile picture.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3, // Compressed for base64 transfer
        base64: true, // Fetch the base64 string directly
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (result.assets[0].base64) {
          uploadProfilePicture(result.assets[0].base64);
        } else {
          Alert.alert("Error", "Could not process image contents.");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Could not pick image");
    }
  };

  const handleEditName = () => {
    Alert.alert("Edit Name", "You can edit your name in the form below.");
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
              <View style={styles.headerLogoWrapper}>
                <Image
                  source={require("@/assets/images/quick-read-logo.png")}
                  style={styles.headerLogo}
                  resizeMode="contain"
                  tintColor="#FFFFFF"
                />
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.profileButton}>
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
          </View>

          {/* Profile Picture Section */}
          <View style={styles.profilePictureSection}>
            <TouchableOpacity onPress={handleImagePick} style={styles.profilePictureContainer}>
              <Image
                source={{ uri: getImageUrl(profilePicture) }}
                style={styles.profilePictureLarge}
              />
              <View style={styles.editImageOverlay}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <View style={styles.nameContainer}>
              <Text style={styles.fullNameText}>{fullName}</Text>
              <TouchableOpacity
                onPress={handleEditName}
                style={styles.editIcon}
              >
                <Ionicons name="create-outline" size={24} color="#6B5FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Form */}
          <View style={styles.formContainer}>
            {/* Nick Name */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nick Name"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={nickName}
                onChangeText={setNickName}
              />
              <Ionicons
                name="create-outline"
                size={20}
                color="#FFFFFF"
                style={styles.inputIcon}
              />
            </View>

            {/* Date of Birth */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Date of Birth"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />
              <Ionicons
                name="create-outline"
                size={20}
                color="#FFFFFF"
                style={styles.inputIcon}
              />
            </View>

            {/* Delivery Address */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Delivery address"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
              />
              <Ionicons
                name="create-outline"
                size={20}
                color="#FFFFFF"
                style={styles.inputIcon}
              />
            </View>

            {/* Contact Number */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Contact number"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
              />
              <Ionicons
                name="create-outline"
                size={20}
                color="#FFFFFF"
                style={styles.inputIcon}
              />
            </View>

            {/* Email Address */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Ionicons
                name="create-outline"
                size={20}
                color="#FFFFFF"
                style={styles.inputIcon}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4E71FF", "#5409DA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>SAVE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Logo */}
        </ScrollView>
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
    marginBottom: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLogoWrapper: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerLogo: {
    width: 140,
    height: 40,
    marginLeft: -25,
  },
  headerBottom: {
    marginTop: 5,
  },
  helloText: {
    fontSize: 26,
    color: "#FFFFFF",
    fontWeight: "400",
    fontFamily: "InstrumentSans_500Medium",
    lineHeight: 32,
  },
  userNameHeader: {
    fontSize: 26,
    color: "#5409DA",
    fontWeight: "700",
    fontFamily: "InstrumentSans_700Bold",
  },
  dateText: {
    fontSize: 14,
    color: "#E0E7FF",
    marginTop: 4,
    fontFamily: "InstrumentSans_500Medium",
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
  profilePictureSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePictureContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "rgba(200, 180, 255, 0.5)",
    overflow: "hidden",
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  profilePictureLarge: {
    width: "100%",
    height: "100%",
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fullNameText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#5409DA",
    fontFamily: "instrument-sans-700",
  },
  editIcon: {
    padding: 4,
  },
  formContainer: {
    gap: 15,
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: "rgba(200, 180, 255, 0.35)",
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "500",
    fontFamily: "instrument-sans-700",
  },
  inputIcon: {
    marginLeft: 10,
  },
  saveButton: {
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 10,
    elevation: 6,
    shadowColor: "#5882FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
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
