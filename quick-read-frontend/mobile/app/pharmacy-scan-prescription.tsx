import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/constants/config";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import { apiFetch } from "@/utils/api-helper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanPrescriptionScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [imageDetails, setImageDetails] = useState<{ fileName: string, mimeType: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    const getRole = async () => {
      const role = await AsyncStorage.getItem("role");
      setUserRole(role);
    };
    getRole();
  }, []);

  const uploadPrescription = async (uri: string, fileName: string, type: string) => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (Platform.OS === "web") {
        if (!capturedBlob) {
          // Fallback if blob isn't ready
          const response = await fetch(uri);
          const blob = await response.blob();
          formData.append("file", blob, fileName || "prescription.jpg");
        } else {
          formData.append("file", capturedBlob, fileName || "prescription.jpg");
        }
      } else {
        // On Mobile (iOS/Android), use the React Native specialized object
        formData.append("file", {
          uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
          name: fileName || "prescription.jpg",
          type: type || "image/jpeg",
        } as any);
      }

      const token = await AsyncStorage.getItem("userToken");

      const response = await fetch(`${config.apiUrl}/prescriptions`, {
        method: "POST",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Prescription uploaded and analyzed!", [
          {
            text: "OK",
            onPress: () => router.push({
              pathname: "/extractedmedicinelist",
              params: {
                analysis: JSON.stringify(result.data?.analysis || []),
                prescriptionId: String(result.data?.data?.ID || "")
              }
            }),
          },
        ]);
      } else {
        Alert.alert("Upload Failed", result.error || result.message || "Failed to process prescription");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (isMounted && status !== "granted") {
        Alert.alert(
          "Permission needed",
          "We need camera roll permissions to select images",
        );
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTakePicture = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Permission needed",
          "Camera permission is required to scan prescriptions",
        );
        return;
      }
    }
    setCameraActive(true);
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) {
          setCapturedImage(photo.uri);
          setImageDetails({ fileName: "camera_photo.jpg", mimeType: "image/jpeg" });
          if (Platform.OS === "web") {
            const res = await fetch(photo.uri);
            const blob = await res.blob();
            setCapturedBlob(blob);
          }
        }
        setCameraActive(false);
      } catch (error) {
        if (__DEV__) console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to capture image");
      }
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setCapturedImage(asset.uri);
        setImageDetails({
          fileName: asset.fileName || "gallery_photo.jpg",
          mimeType: asset.mimeType || "image/jpeg"
        });
        if (Platform.OS === "web") {
          const res = await fetch(asset.uri);
          const blob = await res.blob();
          setCapturedBlob(blob);
        }
      }
    } catch (error) {
      if (__DEV__) console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  if (cameraActive) {
    return (
      <View style={styles.cameraContainer}>
        <StatusBar style="light" />
        <CameraView style={styles.camera} ref={cameraRef} facing="back">
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCameraActive(false)}
              >
                <Ionicons name="close" size={32} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Scan Prescription</Text>
            </View>

            <View style={styles.cameraFrame}>
              <View style={[styles.frameCorner, styles.topLeft]} />
              <View style={[styles.frameCorner, styles.topRight]} />
              <View style={[styles.frameCorner, styles.bottomLeft]} />
              <View style={[styles.frameCorner, styles.bottomRight]} />
            </View>

            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={[styles.captureButton, loading && styles.disabledButton]}
                onPress={handleCapture}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#7B6FD8" /> : <View style={styles.captureButtonInner} />}
              </TouchableOpacity>
            </View>

            <Text style={styles.instructionText}>
              Position the prescription within the frame
            </Text>
          </View>
        </CameraView>
      </View>
    );
  }


  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <ImageBackground
        source={require("@/assets/images/UI_Background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <StatusBar style="light" />
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 28 }} />

          <Image
            source={require("@/assets/images/quick-read-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={{ width: 28 }} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Scan Prescription</Text>
        <Text style={styles.subtitle}>
          Choose how to upload the prescription
        </Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {/* Take Photo */}
            <TouchableOpacity
              style={[styles.optionCard, loading && styles.disabledButton]}
              onPress={handleTakePicture}
              disabled={loading}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="camera" size={20} color="#7B6FD8" />
              </View>
              <Text style={styles.optionTitle}>Take Photo</Text>
              <Text style={styles.optionDescription}>
                Use your camera to scan the prescription
              </Text>
            </TouchableOpacity>

            {/* Choose from Gallery */}
            <TouchableOpacity style={[styles.optionCard, loading && styles.disabledButton]} onPress={handlePickImage} disabled={loading}>
              <View style={styles.iconContainer}>
                <Ionicons name="images" size={20} color="#7B6FD8" />
              </View>
              <Text style={styles.optionTitle}>Choose from Gallery</Text>
              <Text style={styles.optionDescription}>
                Select an existing prescription image
              </Text>
            </TouchableOpacity>
          </View>

          {/* Image Preview & Process Button */}
          {capturedImage && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>Selected Prescription:</Text>
              <View style={styles.imageFrame}>
                <Image source={{ uri: capturedImage }} style={styles.previewImage} resizeMode="contain" />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => {
                    setCapturedImage(null);
                    setImageDetails(null);
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.processButton, loading && styles.disabledButton]}
                onPress={() => imageDetails && uploadPrescription(capturedImage, imageDetails.fileName, imageDetails.mimeType)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="scan" size={24} color="#FFF" style={{ marginRight: 10 }} />
                    <Text style={styles.processButtonText}>Process Prescription</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Instructions */}
          {!capturedImage && (
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>
                📋 Tips for best results:
              </Text>
              <Text style={styles.instructionItem}>• Ensure good lighting</Text>
              <Text style={styles.instructionItem}>
                • Keep the prescription flat
              </Text>
              <Text style={styles.instructionItem}>
                • Make sure text is clearly visible
              </Text>
              <Text style={styles.instructionItem}>• Avoid shadows and glare</Text>
            </View>
          )}
        </ScrollView>

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#7B6FD8" />
            <Text style={styles.loadingText}>Analyzing Prescription...</Text>
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#7B6FD8" />
        </TouchableOpacity>
        {/* Navigation handled by _layout.tsx */}
    </ImageBackground>
    </SafeAreaView>
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
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 60,
  },
  helpButton: {
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E0A60",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#1E0A60",
    textAlign: "center",
    marginBottom: 30,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 30,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: "#F0EDFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E0A60",
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: "#1E0A60",
    textAlign: "center",
  },
  instructionsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 18,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E0A60",
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  previewContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E0A60",
    marginBottom: 15,
  },
  imageFrame: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
    position: "relative",
    marginBottom: 20,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFF",
    borderRadius: 12,
  },
  processButton: {
    backgroundColor: "#7B6FD8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: "100%",
  },
  processButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: "#1E0A60",
    fontWeight: "600",
  },
  // Camera styles
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  cameraHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 10,
  },
  cameraTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 20,
  },
  cameraFrame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
    marginVertical: 50,
  },
  frameCorner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#FFF",
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  cameraControls: {
    alignItems: "center",
    paddingBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFF",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF",
  },
  instructionText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    paddingBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
