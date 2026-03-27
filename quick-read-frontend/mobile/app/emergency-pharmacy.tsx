import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
const MEDICINES = ["GTN Tablets", "Salbutamol", "Aspirin", "G Coman", "Comonx"];

export default function EmergencyMedicineScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("../assets/images/UI_Background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(139, 152, 255, 0.4)", "rgba(88, 130, 255, 0.6)"]}
          style={styles.gradientOverlay}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/quick-read-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* FAB and Scan Card Row */}
          <View style={styles.scanActionRow}>
            <View style={styles.scanCardContainer}>
              <TouchableOpacity
                style={styles.scanCard}
                onPress={() => router.push("/pharmacy-scan-prescription")}
              >
                <LinearGradient
                  colors={["#4F51C0", "#FF4B4B"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.scanGradient}
                >
                  <Ionicons name="camera" size={30} color="white" />
                  <Text style={styles.scanText}>
                    Scan Emergency prescription
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.fabPlus}>
                <Ionicons name="add" size={32} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Medicine List Title */}
          <Text style={styles.listTitle}>Medicine List</Text>

          {/* Medicine Names */}
          <View style={styles.medicineList}>
            {MEDICINES.map((item, index) => (
              <Text key={index} style={styles.medicineItem}>
                {item}
              </Text>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {}}
            >
              <LinearGradient
                colors={["#424FC2", "#322E91"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Confirm Order</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.notifyButton} onPress={() => router.push("/pharmacy-emergency-delivery")}
            >
              <LinearGradient
                colors={["#FF4B4B", "#D32F2F"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Notify Delivery</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Spacer for Bottom Nav */}
          <View style={{ height: 100 }} />
        </ScrollView>

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
    padding: 20,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 120,
  },
  scanActionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    gap: 15,
  },
  fabPlus: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FF4B4B",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: -20,
    top: -15,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  scanCardContainer: {
    flex: 1,
    position: "relative",
    marginLeft: 20,
  },
  scanCard: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scanGradient: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    gap: 8,
  },
  scanText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  listTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  medicineList: {
    alignItems: "center",
    marginBottom: 40,
    gap: 15,
    
  },
  medicineItem: {
    color: "#040212",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    gap: 20,
    alignItems: "center",
  },
  confirmButton: {
    width: "90%",
    borderRadius: 30,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  notifyButton: {
    width: "60%",
    borderRadius: 30,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  navBarContainer: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  navItem: {
    padding: 8,
  },
});
