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
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ExtractedMedicineListScreen() {
  const router = useRouter();
  const { analysis, prescriptionId } = useLocalSearchParams<{ analysis: string, prescriptionId: string }>();

  const medicineData = useMemo(() => {
    if (!analysis) return [];
    try {
      const parsed = JSON.parse(analysis);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse analysis:", e);
      return [];
    }
  }, [analysis]);

  const handleConfirmOrder = () => {
    // Navigate to payment page with the prescription info
    router.push({
      pathname: "/patient-payment",
      params: {
        prescriptionId,
        items: JSON.stringify(medicineData)
      }
    });
  };

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
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLogoWrapper}>
                <Image
                  source={require("../assets/images/quick-read-logo.png")}
                  style={styles.headerLogo}
                  resizeMode="contain"
                  tintColor="#FFFFFF"
                />
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.headerBottom}>
              <Text style={styles.title}>Extracted Medicines</Text>
            </View>
          </View>

          {/* Medicine Cards */}
          <View style={styles.medicineList}>
            {medicineData.length > 0 ? (
              medicineData.map((med: any, index: number) => (
                <View key={index} style={styles.medicineCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.iconCircle}>
                      <MaterialCommunityIcons name="pill" size={24} color="#5409DA" />
                    </View>
                    <View style={styles.medMainInfo}>
                      <Text style={styles.medNameText}>
                        {med.drug_name || med.medicine_name || med.dosage || "Extracted Item"}
                      </Text>
                      <Text style={styles.medSubText}>
                        {med.dosage ? `${med.dosage} • ` : ""}{med.instructions || med.frequency || "Dosage instructions not found"}
                      </Text>
                    </View>
                    <View style={styles.quantityBadge}>
                      <Text style={styles.quantityText}>
                        {(!med.quantity || med.quantity === "UNKNOWN") ? "Qty ?" : med.quantity}
                      </Text>
                    </View>
                  </View>
                  
                  {(med.duration || med.use) && (
                    <View style={styles.cardFooter}>
                      <Ionicons name="information-circle-outline" size={14} color="rgba(255,255,255,0.6)" />
                      <Text style={styles.durationText}>
                        {med.duration ? `Duration: ${med.duration}` : `Use: ${med.use}`}
                      </Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={60} color="rgba(255,255,255,0.3)" />
                <Text style={styles.emptyText}>No medicines extracted. Please scan again.</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmOrder}
            >
              <LinearGradient
                colors={["#424FC2", "#322E91"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Confirm Order</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.notifyButton} onPress={() => router.push("/emergency-pharmacy")}
            >
              <LinearGradient
                colors={["#FF4B4B", "#D32F2F"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Notify Delivery</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
        {/* Remove manual Bottom Nav - now in _layout.tsx */}
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
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerBottom: {
    marginTop: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "InstrumentSans_700Bold",
  },
  medicineList: {
    gap: 15,
    marginBottom: 40,
  },
  medicineCard: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  medMainInfo: {
    flex: 1,
  },
  medNameText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "InstrumentSans_700Bold",
    marginBottom: 2,
  },
  medSubText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    fontFamily: "InstrumentSans_500Medium",
  },
  quantityBadge: {
    backgroundColor: "rgba(84, 9, 218, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(84, 9, 218, 0.3)",
  },
  quantityText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "InstrumentSans_700Bold",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    gap: 6,
  },
  durationText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontFamily: "InstrumentSans_500Medium",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  emptyText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    fontFamily: "InstrumentSans_500Medium",
    opacity: 0.7,
  },
  buttonContainer: {
    gap: 15,
    alignItems: "center",
    paddingBottom: 20,
  },
  confirmButton: {
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#5409DA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  notifyButton: {
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "InstrumentSans_700Bold",
    letterSpacing: 0.5,
  }
});
