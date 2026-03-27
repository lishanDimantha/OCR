import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
    Alert,
    ActivityIndicator,
    Dimensions,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { apiFetch } from "@/utils/api-helper";
import config from "@/constants/config";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("Patient");
  const [currentDate] = useState("2025.12.01");

  useEffect(
    useCallback(() => {
    const fetchUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem("fullName");
        if (storedName) {
          setUserName(storedName.split(" ")[0]);
        } else{
          //Fallback: fatch from profile API if not in storage
          const token = await AsyncStorage.getItem("userToken");
            if (token) {
              const response = await fetch(`${config.apiUrl}/users/profile`, {
                headers: { "Authorization": `Bearer ${token}` }
              });
              const result = await response.json();
              if (response.ok && result.data?.name) {
                const name = result.data.name;
                setUserName(name.split(" ")[0]);
                await AsyncStorage.setItem("fullName", name);
              }
            }
          }
        }
      } catch (error) {
        if (__DEV__) console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, [])
);

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

  const [loading, setLoading] = useState(false);

  const uploadPrescription = async (uri: string, fileName: string, type: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name: fileName || "prescription.jpg",
        type: type || "image/jpeg",
      } as any);

      const response = await apiFetch("/prescriptions", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Prescription uploaded and analyzed!");
        router.push({
          pathname: "/extractedmedicinelist",
          params: {
            analysis: JSON.stringify(result.data.analysis),
            prescriptionId: result.data.data.ID
          }
        });
      } else {
        Alert.alert("Upload Failed", result.message || "Failed to process prescription");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleAttachFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        const file = result.assets[0];
        await uploadPrescription(file.uri, file.name, file.mimeType || "image/jpeg");
      }
    } catch (error) {
      Alert.alert("File Error", "Unable to open file picker.");
    }
  };

  const handleScan = () => {
    handleCameraOpen();
  };

  const handleCameraOpen = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Camera access is needed to take a prescription photo.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const photo = result.assets[0];
        Alert.alert("Photo Captured", "Prescription photo captured successfully.");
      }
    } catch (error) {
      Alert.alert("Camera Error", "Unable to open camera.");
    }
  };

  const handleSearchMedicines = () => {
    router.push("/patient-medicines");
  };

  const handleHistory = () => {
    router.push("/history");
  };

  const handleEmergencySetup = () => {
    router.push("/emergency-pharmacy");
  };

  const handleEmergencyButton = () => {
    router.push("/emergency-pharmacy");
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
            <View style={styles.headerLeft}>
              <Text style={styles.helloText}>Hello</Text>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.dateText}>{currentDate}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.profileButton}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?img=5" }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications" size={24} color="#FFFFFF" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Prescription Upload Section */}
          <TouchableOpacity
            style={styles.cameraPanel}
            onPress={handleCameraOpen}
            activeOpacity={0.85}
          >
            <Ionicons name="camera" size={24} color="#FFFFFF" />
          </TouchableOpacity>

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
                <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/patient-profile")}>
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
              <Text style={styles.helloText}>
                Hello <Text style={styles.userName}>{userName}</Text>
              </Text>
              <Text style={styles.dateText}>{currentDate}</Text>
            </View>
          </View>

          {/* Modern Prescription Upload Card */}
          <View style={styles.uploadCard}>
            <Text style={styles.uploadTitle}>Add your prescription</Text>
            <Text style={styles.uploadSubtitle}>Maximum file size 10 MB</Text>

            <View style={styles.uploadActionsRow}>
              <TouchableOpacity
                style={styles.uploadActionItem}
                onPress={handleCameraOpen}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconCircle}>
                  <Ionicons name="camera" size={28} color="#5409DA" />
                </View>
                <Text style={styles.actionLabel}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadActionItem}
                onPress={handleAttachFile}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconCircle}>
                  <Ionicons name="images" size={28} color="#5409DA" />
                </View>
                <Text style={styles.actionLabel}>Gallery</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modernScanButton}
              onPress={handleScan}
              activeOpacity={0.8}
            >
            <LinearGradient
              colors={["#4E71FF", "#5409DA","#6EA4FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.scanButtonGradient}
            >
             {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.scanButtonText}>SCAN NOW</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>


          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            {/* Search Medicines */}
            <View style={styles.quickActionRow}>
              <TouchableOpacity
                style={styles.quickActionIcon}
                onPress={handleSearchMedicines}
              >
                <MaterialCommunityIcons name="pill" size={28} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={handleSearchMedicines}
                activeOpacity={0.7}
              >
                <Text style={styles.quickActionText}>Search medicines</Text>
              </TouchableOpacity>
            </View>

            {/* History */}
            <View style={styles.quickActionRow}>
              <TouchableOpacity
                style={styles.quickActionIcon}
                onPress={handleHistory}
              >
                <MaterialCommunityIcons
                  name="history"
                  size={28}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={handleHistory}
                activeOpacity={0.7}
              >
                <Text style={styles.quickActionText}>History</Text>
              </TouchableOpacity>
            </View>

            {/* Emergency Medicine Setup */}
            <View style={styles.quickActionRow}>
              <TouchableOpacity
                style={styles.quickActionIcon}
                onPress={handleEmergencySetup}
              >
                <Ionicons name="medical" size={28} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={handleEmergencySetup}
                activeOpacity={0.7}
              >
                <Text style={styles.quickActionText}>
                  Emergency medicine setup
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Emergency Button */}
          <View style={styles.emergencySection}>
            <Text style={styles.emergencyLabel}>Emergency Button</Text>
            <Text style={styles.emergencySubtext}>
              Use this button for only emergencies
            </Text>
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={handleEmergencyButton}
              activeOpacity={0.8}
            >
              <View style={styles.emergencyIconContainer}>
                <Ionicons name="medical" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.emergencyButtonMain}>
                <Text style={styles.emergencyButtonText}>Hold 10s</Text>
              </View>
            </TouchableOpacity>
          </View>
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
    marginTop: 5,
  },
  helloText: {
    fontSize: 26,
    color: "#FFFFFF",
    fontWeight: "400",
    fontFamily: "InstrumentSans_500Medium",
    lineHeight: 32,
  },
  userName: {
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
  uploadCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 35,
    padding: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
  },
  uploadTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    fontFamily: "InstrumentSans_700Bold",
  },
  uploadSubtitle: {
    fontSize: 13,
    color: "#E0E7FF",
    marginBottom: 25,
    fontFamily: "InstrumentSans_500Medium",
  },
  uploadActionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginBottom: 30,
  },
  uploadActionItem: {
    alignItems: "center",
  },
  actionIconCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "InstrumentSans_500Medium",
  },
  modernScanButton: {
    borderRadius: 25,
    overflow: "hidden",
    width: "100%",
    elevation: 8,
    shadowColor: "#5409DA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  scanButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1.5,
    fontFamily: "InstrumentSans_700Bold",
  },
  quickActionsContainer: {
    gap: 15,
    marginBottom: 30,
  },
  quickActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(107, 95, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionText: {
    color: "#5882FF",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "semibold",
  },
  emergencySection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  emergencyLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF4444",
    marginBottom: 5,
    fontFamily: "instrumentSans_medium",
  },
  emergencySubtext: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 15,
    fontFamily: "instrumentSans_medium",
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  emergencyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF4444",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#FF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  emergencyButtonMain: {
    backgroundColor: "#FF0000",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 30,
    elevation: 6,
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  emergencyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "instrumentSans_medium",
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
