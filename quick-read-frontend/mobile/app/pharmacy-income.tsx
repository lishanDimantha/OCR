import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import PharmacyBottomNav from "../components/PharmacyBottomNav";
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

export default function PharmacyIncomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ImageBackground
        source={require("@/assets/images/UI_Background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(139, 152, 255, 0.2)", "rgba(88, 130, 255, 0.4)"]}
          style={styles.gradientOverlay}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/quick-read-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Table Container */}
          <View style={styles.tableContainer}>
            
            {/* Headers row */}
            <View style={styles.tableHeaderRow}>
              <View style={styles.invisibleHeaderHeader} />
              <View style={styles.headerPill}>
                <Text style={styles.headerText}>COMPLETE</Text>
              </View>
              <View style={styles.headerPill}>
                <Text style={styles.headerText}>PENDING</Text>
              </View>
            </View>

            {/* Data Columns Wrapper */}
            <View style={styles.dataWrapper}>
              
              {/* Patient Column */}
              <View style={styles.patientColumn}>
                {[1, 2, 3, 4].map((_, index) => (
                  <View key={index} style={styles.patientRow}>
                    <Text style={styles.patientName}>Perera</Text>
                    <Text style={styles.patientRef}>ref no 12345</Text>
                  </View>
                ))}
              </View>

              {/* Patient Column (2nd duplicate for screenshot's 2 columns in first block) */}
              <View style={styles.patientColumn}>
                {[1, 2, 3, 4].map((_, index) => (
                  <View key={index} style={styles.patientRow}>
                    <Text style={styles.patientName}>Perera</Text>
                    <Text style={styles.patientRef}>ref no 12345</Text>
                  </View>
                ))}
              </View>

              {/* Complete Items Column */}
              <View style={styles.dashColumn}>
                {[1, 2, 3].map((_, index) => (
                  <View key={index} style={styles.dashRow}>
                    <Text style={styles.dashText}>----------------</Text>
                  </View>
                ))}
              </View>

              {/* Pending Items Column */}
              <View style={styles.dashColumn}>
                {[1, 2, 3].map((_, index) => (
                  <View key={index} style={styles.dashRow}>
                    <Text style={styles.dashText}>----------------</Text>
                  </View>
                ))}
              </View>
            </View>
            
          </View>

          {/* Income summary row */}
          <View style={styles.incomeRow}>
            <View style={styles.incomePill}>
              <Text style={styles.incomeText}>INCOME</Text>
            </View>
            <View style={styles.incomeDashPill}>
              <Text style={styles.dashText}>----------------</Text>
            </View>
            <View style={styles.incomeDashPill}>
              <Text style={styles.dashText}>----------------</Text>
            </View>
          </View>

          {/* Get Report Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.reportButton}>
              <Text style={styles.reportButtonText}>Get report</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Navigation handled by _layout.tsx */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  scrollContent: { paddingTop: 60, paddingHorizontal: 15 },
  logoContainer: { alignItems: "center", marginBottom: 30 },
  logo: { width: 250, height: 100 },
  
  tableContainer: {
    marginBottom: 40,
  },
  tableHeaderRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
    gap: 10,
  },
  invisibleHeaderHeader: {
    flex: 2,
    marginRight: 10,
  },
  headerPill: {
    flex: 1,
    backgroundColor: "rgba(88, 101, 242, 0.7)",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },

  dataWrapper: {
    flexDirection: "row",
    gap: 10,
  },
  patientColumn: {
    flex: 1,
    backgroundColor: "rgba(88, 101, 242, 0.7)",
    borderRadius: 15,
    padding: 10,
    gap: 15,
  },
  patientRow: {
    marginBottom: 5,
  },
  patientName: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  patientRef: {
    color: "#FFFFFF",
    fontSize: 10,
  },

  dashColumn: {
    flex: 1,
    backgroundColor: "rgba(88, 101, 242, 0.7)",
    borderRadius: 15,
    padding: 10,
    justifyContent: "space-around",
  },
  dashRow: {
    alignItems: "center",
  },
  dashText: {
    color: "#FFFFFF",
    fontSize: 10,
    letterSpacing: 1,
  },

  incomeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 60,
  },
  incomePill: {
    flex: 2,
    backgroundColor: "rgba(88, 101, 242, 0.7)",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  incomeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  incomeDashPill: {
    flex: 1,
    backgroundColor: "rgba(88, 101, 242, 0.7)",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContainer: {
    alignItems: "center",
  },
  reportButton: {
    backgroundColor: "#4228D3",
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  reportButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  bottomActionsContainer: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  navItem: {
    padding: 8,
  },
});