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
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientScanPrescriptionScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [imageDetails, setImageDetails] = useState<{ fileName: string, mimeType: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  const uploadPrescription = async (uri: string, fileName: string, type: string) => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (Platform.OS === "web") {
        if (!capturedBlob) {
          const response = await fetch(uri);
          const blob = await response.blob();
          formData.append("file", blob, fileName || "prescription.jpg");
        } else {
          formData.append("file", capturedBlob, fileName || "prescription.jpg");
        }
      } else {
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
            } as any),
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
            Choose how to upload your prescription for analysis
          </Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionCard, loading && styles.disabledButton]}
              onPress={handleTakePicture}
              disabled={loading}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="camera" size={30} color="#5409DA" />
              </View>
              <Text style={styles.optionTitle}>Take Photo</Text>
              <Text style={styles.optionDescription}>
                Snap a clear picture of your prescription
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionCard, loading && styles.disabledButton]} onPress={handlePickImage} disabled={loading}>
              <View style={styles.iconContainer}>
                <Ionicons name="images" size={30} color="#5409DA" />
              </View>
              <Text style={styles.optionTitle}>Choose from Gallery</Text>
              <Text style={styles.optionDescription}>
                Pick an existing photo from your phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Image Preview & Process Button */}
          {capturedImage && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>Prescription Preview:</Text>
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
                    <Ionicons name="analytics" size={24} color="#FFF" style={{ marginRight: 10 }} />
                    <Text style={styles.processButtonText}>Analyze Prescription</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {!capturedImage && (
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>
                📋 Instructions:
              </Text>
              <Text style={styles.instructionItem}>• Ensure the prescription is well-lit</Text>
              <Text style={styles.instructionItem}>• Align the text horizontally</Text>
              <Text style={styles.instructionItem}>• Avoid blur and camera shake</Text>
            </View>
          )}
        </ScrollView>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#5409DA" />
            <Text style={styles.loadingText}>Analyzing Prescription...</Text>
          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#5409DA" />
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
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "InstrumentSans_700Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E7FF",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 30,
  },
  optionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: "#E0E7FF",
    textAlign: "center",
  },
  instructionsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 20,
    elevation: 5,
  },
  previewContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  imageFrame: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.1)",
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
    backgroundColor: "#5409DA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 20,
    width: "100%",
  },
  processButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
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
