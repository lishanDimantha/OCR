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

type EmergencyRow = {
  id: string;
  name: string;
  status: "Pending" | "Ongoing" | "Delivered";
  contact: string;
  address: string;
  success: boolean;
};

const rows: EmergencyRow[] = [
  {
    id: "1",
    name: "Ms.Sosya",
    status: "Pending",
    contact: "077 6754 321",
    address: "No : 2/16\nColombo, Kirulapone",
    success: true,
  },
  {
    id: "2",
    name: "Ms.Sosya",
    status: "Ongoing",
    contact: "077 6754 321",
    address: "No : 2/16\nColombo, Kirulapone",
    success: false,
  },
  {
    id: "3",
    name: "Ms.Sosya",
    status: "Delivered",
    contact: "077 6754 321",
    address: "No : 2/16\nColombo, Kirulapone",
    success: true,
  },
  {
    id: "4",
    name: "Ms.Yosheni",
    status: "Ongoing",
    contact: "077 6754 321",
    address: "No : 2/16\nColombo, Kirulapone",
    success: false,
  },
];

export default function EmergencyDeliveryScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/UI_Background.jpeg")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={24} color="#1F2937" />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <Image
            source={require("@/assets/images/quick-read-logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.titleWrap}>
          <View style={styles.plusIconCircle}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </View>
          <LinearGradient
            colors={["rgba(171, 106, 255, 1)", "rgba(255, 52, 66, 1)"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.titlePill}
          >
            <Text style={styles.titleText}>Emergency Delivery List</Text>
          </LinearGradient>
        </View>

        <LinearGradient
          colors={["rgba(255,255,255,0.15)", "rgba(198, 53, 170, 0.22)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tableCard}
        >
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.headerName]}>Name</Text>
            <Text style={[styles.headerText, styles.headerContact]}>Contact No</Text>
            <Text style={[styles.headerText, styles.headerAddress]}>Address</Text>
          </View>

          {rows.map((row) => (
            <View key={row.id} style={styles.tableRow}>
              <View style={styles.nameCell}>
                <Text style={styles.nameText}>{row.name}</Text>
                <Text style={styles.statusText}>({row.status})</Text>
              </View>

              <View style={styles.contactCell}>
                <View style={styles.statusIconWrap}>
                  <Ionicons
                    name={row.success ? "checkmark-circle" : "close-circle"}
                    size={18}
                    color={row.success ? "#38B167" : "#FF2E2E"}
                  />
                </View>
                <Text style={styles.contactText}>{row.contact}</Text>
              </View>

              <Text style={styles.addressText}>{row.address}</Text>
            </View>
          ))}
        </LinearGradient>

        <TouchableOpacity activeOpacity={0.85} style={styles.buttonWrap}>
          <LinearGradient
            colors={["rgba(97, 79, 201, 1)", "rgba(58, 60, 185, 1)"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Contact Pharmacy</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.85} style={styles.buttonWrap}>
          <View style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Contact Customer</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.85} style={styles.buttonWrap}>
          <LinearGradient
            colors={["rgba(255, 82, 82, 1)", "rgba(228, 21, 52, 1)"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.statusButton}
          >
            <Text style={styles.statusButtonText}>Mark Status</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/delivery-home") }>
          <Ionicons name="home" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/delivery-profile") }>
          <Ionicons name="person-outline" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/delivery-notifications") }>
          <Ionicons name="notifications-outline" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/delivery-settings") }>
          <Ionicons name="settings-outline" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: "absolute",
    top: 52,
    left: 18,
    zIndex: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollView: { flex: 1 },
  scrollContent: {
    alignItems: "center",
    paddingTop: 18,
    paddingHorizontal: 10,
    paddingBottom: 120,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 60,
    marginTop:50,
  },
  logoImage: {
    width: 280,
    height: 158,
  },
  titleWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  plusIconCircle: {
    position: "absolute",
    left: 12,
    zIndex: 2,
    width: 44,
    height: 44,
    borderRadius: 17,
    backgroundColor: "rgba(255, 57, 57, 1)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  titlePill: {
    width: "86%",
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  tableCard: {
    width: "100%",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    marginBottom: 14,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "rgba(34, 30, 154, 1)",
  },
  headerName: { width: "33%" },
  headerContact: { width: "34%" },
  headerAddress: { width: "33%", textAlign: "right" },
  tableRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 9,
    paddingHorizontal: 4,
  },
  nameCell: { width: "33%" },
  nameText: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(34, 30, 154, 1)",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(34, 30, 154, 0.92)",
  },
  contactCell: {
    width: "34%",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusIconWrap: {
    width: 18,
    alignItems: "center",
  },
  contactText: {
    fontSize: 9.5,
    fontWeight: "600",
    color: "rgba(255,255,255,0.98)",
  },
  addressText: {
    width: "33%",
    textAlign: "right",
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.98)",
  },
  buttonWrap: {
    width: "92%",
    marginTop: 8,
  },
  primaryButton: {
    height: 54,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  secondaryButton: {
    height: 54,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
    marginTop: 20,
  },
  secondaryButtonText: {
    color: "rgba(34, 30, 154, 1)",
    fontSize: 24,
    fontWeight: "700",
  },
  statusButton: {
    height: 54,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  statusButtonText: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
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
});
