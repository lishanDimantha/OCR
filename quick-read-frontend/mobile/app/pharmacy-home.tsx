import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import React, { useState, useEffect }  from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiFetch } from "@/utils/api-helper";

export default function HomeScreen() {
  const router = useRouter();

  const [statsData, setStatsData] = useState([
    { count: "0", label: "Active\nOrders", color: "#7B6FD8" },
    { count: "0", label: "Pending\nOrders", color: "#7B6FD8" },
    { count: "0", label: "Completed\nOrders", color: "#7B6FD8" },
    { count: "0", label: "Cancelled\nOrders", color: "#7B6FD8" },
    { count: "0", label: "Emergency\nOrders", color: "#E03030" },
  ]);

  const [orders, setOrders] = useState<any[]>([]);
  
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Fetch order stats
        const statsRes = await apiFetch("/pharmacy/dashboard/orders");
        if (statsRes.ok) {
          const statsResult = await statsRes.json();
          const d = statsResult.data || {};
          setStatsData([
            { count: String(d.active || 0), label: "Active\nOrders", color: "#7B6FD8" },
            { count: String(d.pending || 0), label: "Pending\nOrders", color: "#7B6FD8" },
            { count: String(d.completed || 0), label: "Completed\nOrders", color: "#7B6FD8" },
            { count: String(d.cancelled || 0), label: "Cancelled\nOrders", color: "#7B6FD8" },
            { count: String(d.emergency || 0), label: "Emergency\nOrders", color: "#E03030" },
          ]);
        }

        // Fetch recent orders
        const ordersRes = await apiFetch("/pharmacy/orders");
        if (ordersRes.ok) {
          const ordersResult = await ordersRes.json();
          const recentOrders = (ordersResult.data || []).slice(0, 3).map((o: any) => ({
            patient: o.user?.name || "Patient",
            refNo: `ref no ${o.ID || o.id}`,
            status: o.status || "Active",
            time: new Date(o.created_at || o.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
          setOrders(recentOrders);
        }
      } catch (error) {
        if (__DEV__) console.log("Dashboard load error:", error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ImageBackground
        source={require("@/assets/images/UI_Background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <StatusBar style="light" />
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/quick-read-logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

          </View>

          {/* Welcome Text */}
          <Text style={styles.welcomeText}>Welcome, New Pharmacy</Text>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            {statsData.map((stat, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.statCard, { backgroundColor: stat.color }]}
              >
                <Text style={styles.statCount}>{stat.count}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Scan Prescription Button */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push("/pharmacy-scan-prescription")}
          >
            <View style={styles.scanIconContainer}>
              <Ionicons name="camera" size={40} color="#7B6FD8" />
            </View>
            <View style={styles.scanTextContainer}>
              <Text style={styles.scanTitle}>Scan New Prescription</Text>
              <Text style={styles.scanSubtitle}>Upload Prescription Image</Text>
            </View>
          </TouchableOpacity>

          {/* Orders Section */}
          <View style={styles.ordersSectionHeader}>
            <Text style={styles.sectionTitle}>Orders</Text>
          </View>

          {/* Orders Table */}
          <View style={styles.ordersTable}>
            {/* Headers */}
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Active</Text>
              <Text style={styles.tableHeaderText}>Pending</Text>
              <Text style={styles.tableHeaderTextCenter}>Completed</Text>
              <Text style={styles.tableHeaderTextRight}>Cancelled</Text>
            </View>

            {/* List */}
            {orders.map((order, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tableRow}
                onPress={() =>
                  (router.push as any)(
                    `/order-details?patient=${order.patient}&refNo=${order.refNo}&status=${order.status}&time=${order.time}`
                  )
                }
              >
                {/* Active Column */}
                <View style={styles.tableCol}>
                  <Text style={styles.patientBold}>{order.patient}</Text>
                  <Text style={styles.refSmall}>{order.refNo}</Text>
                </View>

                {/* Pending Column */}
                <View style={styles.tableCol}>
                  <Text style={styles.patientBold}>{order.patient}</Text>
                  <Text style={styles.refSmall}>{order.refNo}</Text>
                </View>

                {/* Completed Column */}
                <View style={styles.tableColCenter}>
                  <View style={styles.statusRow}>
                    <View style={styles.statusDotGreen} />
                    <Text style={styles.statusTextWhite}>{order.status}</Text>
                  </View>
                </View>

                {/* Cancelled Column */}
                <View style={styles.tableColRightAligned}>
                  <Text style={styles.timeText}>{order.time} {">"}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            {/* Inventory */}
            <View style={styles.bottomColumn}>
              <Text style={styles.bottomTitle}>Inventory</Text>
              <TouchableOpacity
                style={styles.inventoryCard}
                onPress={() => router.push("/pharmacy-inventory")}
              >
                <View style={styles.inventoryIconContainer}>
                  <Ionicons name="clipboard" size={26} color="#1E0A60" />
                  <Ionicons 
                    name="checkmark-circle" 
                    size={15} 
                    color="#1E0A60" 
                    style={styles.inventoryCheckmark} 
                  />
                </View>
                <Text style={styles.inventoryText}>View Stock{"\n"}Levels</Text>
              </TouchableOpacity>
            </View>

            {/* Alerts */}
            <View style={styles.bottomColumn}>
              <Text style={styles.bottomTitle}>Alerts</Text>
              <View style={styles.alertsContainer}>
                <TouchableOpacity
                  style={styles.alertRow}
                  onPress={() => router.push("/emergency-pharmacy")}
                >
                  <View style={styles.emergencyIcon}>
                    <Ionicons name="add" size={20} color="#FFF" />
                  </View>
                  <Text style={styles.alertText}>Emergency</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.alertRow}
                  onPress={() => router.push("/pharmacy-income")}
                >
                  <View style={styles.incomeIcon}>
                    <Text style={styles.incomeText}>$</Text>
                  </View>
                  <Text style={styles.alertText}>Income</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.alertRow}
                  onPress={() => router.push("/pharmacy-delivery")}
                >
                  <Image
                    source={require("@/assets/icons/delivey.png")}
                    style={{ width: 24, height: 24, tintColor: "#1E0A60" }}
                    resizeMode="contain"
                  />
                  <Text style={styles.alertText}>Delivery</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Bottom padding for navigation */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        {/* Navigation handled by _layout.tsx */}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
    position: "relative",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 80,
  },
  helpButton: {
    padding: 5,
    position: "absolute",
    right: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E0A60",
    textAlign: "center",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statCard: {
    width: "18.5%",
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  statCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center",
  },
  statLabel: {
    fontSize:8,
    color: "#FFFFFF",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 12,
  },
  scanButton: {
    backgroundColor: "#7B6FD8",
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  scanIconContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  scanTextContainer: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
    textAlign: "center",
  },
  scanSubtitle: {
    fontSize: 14,
    color: "#E8E4FF",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A9E",
    paddingHorizontal: 20,
    marginBottom: 15,
    fontStyle: "italic",
  },
  ordersSectionHeader: {
    paddingHorizontal: 0,
  },
  ordersTable: {
    backgroundColor: "#7B6FD8",
    borderRadius: 15,
    marginHorizontal: 20,
    padding: 15,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    paddingBottom: 10,
    marginBottom: 5,
  },
  tableHeaderText: {
    flex: 1.2,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  tableHeaderTextCenter: {
    flex: 1.2,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableHeaderTextRight: {
    flex: 0.8,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  tableCol: {
    flex: 1.2,
  },
  tableColCenter: {
    flex: 1.2,
    alignItems: "center",
  },
  tableColRightAligned: {
    flex: 0.8,
    alignItems: "flex-end",
  },
  patientBold: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  refSmall: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },
  statusTextWhite: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  bottomSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 25,
    gap: 15,
  },
  bottomColumn: {
    flex: 1,
  },
  bottomTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A9E",
    marginBottom: 15,
    fontStyle: "italic",
  },
  inventoryCard: {
    backgroundColor: "#7B6FD8",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 15,
    flex: 1,
  },
  inventoryIconContainer: {
    backgroundColor: "#FFF",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 58,
    height: 58,
    position: "relative",
  },
  inventoryCheckmark: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#FFF",
    borderRadius: 8,
    overflow: "hidden",
  },
  inventoryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "left",
    lineHeight: 22,
  },
  alertsContainer: {
    backgroundColor: "#7B6FD8",
    borderRadius: 15,
    padding: 15,
    gap: 15,
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  emergencyIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F93737",
    justifyContent: "center",
    alignItems: "center",
  },
  incomeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FAD201",
    justifyContent: "center",
    alignItems: "center",
  },
  incomeText: {
    color: "#1E0A60",
    fontWeight: "bold",
    fontSize: 14,
  },
  alertText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
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
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 20,
    padding: 10,
  },
  notificationIconWrapper: {
    backgroundColor: "#FFFFFF",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
});


