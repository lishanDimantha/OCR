import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback, useRef } from "react";
import config from "@/constants/config";
import {
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

const { width } = Dimensions.get("window");

const STAGE_ORDER = [
  "processing",
  "ready_to_ship",
  "pick_up",
  "in_transit",
  "out_of_delivery",
  "review",
  "delivered",
];

export default function DeliveryScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("Patient");
  const [currentDate] = useState(new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '. '));


  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem("fullName");
        if (storedName) {
          setUserName(storedName);
        }
      } catch (error) {
        if (__DEV__) console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []);

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

  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [deliveryEvents, setDeliveryEvents] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchDeliveryData = async () => {
        try {
          if (!activeOrder) setLoading(true);

          const ordersRes = await apiFetch("/orders");
          if (!ordersRes.ok) throw new Error("Failed to fetch orders");
          const ordersData = await ordersRes.json();

          const activeOrders = (ordersData.data || []).filter(
            (o: any) => o.status !== "delivered" && o.status !== "cancelled"
          );

          if (activeOrders.length > 0) {
            const latestOrder = activeOrders.sort((a: any, b: any) => b.ID - a.ID)[0];
            if (isActive) setActiveOrder(latestOrder);

            const historyRes = await apiFetch(`/delivery/order-history/${latestOrder.ID}`);
            if (historyRes.ok) {
              const historyData = await historyRes.json();
              if (isActive) setDeliveryEvents(historyData.data || []);
            }
          } else {
            if (isActive) setActiveOrder(null);
          }
        } catch (err) {
          if (__DEV__) console.error("Error fetching delivery data:", err);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchDeliveryData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!activeOrder || !activeOrder.ID) return;

    const wsProtocol = config.apiUrl.startsWith('https') ? 'wss' : 'ws';
    const wsUrl = `${config.apiUrl.replace(/^https?/, wsProtocol)}/ws/track/${activeOrder.ID}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      if (__DEV__) console.log("🟢 WebSocket Connected for order", activeOrder.ID);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (__DEV__) console.log("📥 WS Message:", data);

        // 1. Update the active order's current status and location
        setActiveOrder((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            status: data.status,
            DeliveryLat: data.lat,
            DeliveryLng: data.lng,
          };
        });

        // 2. Prepend a new delivery event if the status actually changed
        setDeliveryEvents((prevList) => {
          const sortedList = [...prevList].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          const lastEvent = sortedList[0];
          if (lastEvent && lastEvent.status === data.status) {
            // Status hasn't changed (just a GPS update), no need to add a brand new list item
            return prevList;
          }

          const newEvent = {
            ID: new Date().getTime(),
            status: data.status,
            note: `Live update: Order is now ${data.status.replace(/_/g, " ")}.`,
            timestamp: new Date().toISOString()
          };

          return [newEvent, ...prevList];
        });

      } catch (e) {
        if (__DEV__) console.error("Failed to parse WS message", e);
      }
    };

    ws.onerror = (e) => {
      if (__DEV__) console.error("WebSocket error:", e);
    };

    return () => {
      if (__DEV__) console.log("🔴 Closing WebSocket for order", activeOrder.ID);
      ws.close();
    };
  }, [activeOrder?.ID]);

  const currentStageIndex = activeOrder ? STAGE_ORDER.indexOf(activeOrder.status) : -1;

  const DELIVERY_STAGES = [
    { id: 1, label: "Ready to ship", active: currentStageIndex >= STAGE_ORDER.indexOf("ready_to_ship") },
    { id: 2, label: "Pick UP", active: currentStageIndex >= STAGE_ORDER.indexOf("pick_up") },
    { id: 3, label: "In transit", active: currentStageIndex >= STAGE_ORDER.indexOf("in_transit") },
    { id: 4, label: "Out of delivery", active: currentStageIndex >= STAGE_ORDER.indexOf("out_of_delivery") },
    { id: 5, label: "Review", active: currentStageIndex >= STAGE_ORDER.indexOf("review") },
  ];

  const sortedEvents = [...deliveryEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const formattedUpdates = sortedEvents.map((event, index) => ({
    id: event.ID || index,
    status: event.status.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
    message: event.note,
    submessage: new Date(event.timestamp).toLocaleString(),
  }));

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
              <View style={styles.logoWrapper}>
                <Image
                  source={require("@/assets/images/quick-read-logo.png")}
                  style={styles.headerLogo}
                  resizeMode="contain"
                  tintColor="#FFFFFF"
                />
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/patient-profile')}>
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

          {loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 100 }}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={{ color: "#FFF", marginTop: 15, fontFamily: "instrument-sans-500" }}>Loading delivery status...</Text>
            </View>
          ) : !activeOrder ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 80 }}>
              <MaterialCommunityIcons name="package-variant" size={80} color="rgba(255,255,255,0.5)" />
              <Text style={{ color: "rgba(255,255,255,0.8)", marginTop: 20, fontSize: 18, fontFamily: "instrument-sans-700" }}>
                No active deliveries
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 10, textAlign: "center", paddingHorizontal: 40, fontFamily: "instrument-sans-400" }}>
                You currently don't have any orders out for delivery. Check your history for past orders.
              </Text>
            </View>
          ) : (
            <View>

          {/* Delivery Status Title */}
          <Text style={styles.deliveryTitle}>Delivery Status</Text>

          {/* Delivery Truck Icon */}
          <View style={styles.truckIconContainer}>
            <MaterialCommunityIcons
              name="truck-delivery"
              size={120}
              color="#FFFFFF"
            />
          </View>

          {/* Delivery Progress Stages */}
          <View style={styles.stagesContainer}>
            {DELIVERY_STAGES.map((stage, index) => (
              <View key={stage.id} style={styles.stageItem}>
                <View
                  style={[
                    styles.stageDot,
                    stage.active && styles.stageDotActive,
                  ]}
                />
                <Text
                  style={[
                    styles.stageLabel,
                    stage.active && styles.stageLabelActive,
                  ]}
                >
                  {stage.label}
                </Text>
                {index < DELIVERY_STAGES.length - 1 && (
                  <View
                    style={[
                      styles.stageLine,
                      stage.active && styles.stageLineActive,
                    ]}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Delivery Updates Card */}
              {formattedUpdates.length > 0 && (
                <View style={styles.updatesCard}>
                  {formattedUpdates.map((update, index) => (
                    <View key={update.id}>
                      <View style={styles.updateItem}>
                        <Text style={styles.updateStatus}>{update.status}</Text>
                        <Text style={styles.updateMessage}>{update.message}</Text>
                        {update.submessage && (
                          <Text style={styles.updateSubmessage}>
                            {update.submessage}
                          </Text>
                        )}
                      </View>
                      {index < formattedUpdates.length - 1 && (
                        <View style={styles.updateDivider} />
                      )}
                    </View>
                  ))}

                  {/* More Options Indicator */}
                  <View style={styles.moreIndicator}>
                    <View style={styles.moreDot} />
                    <View style={styles.moreDot} />
                    <View style={styles.moreDot} />
                  </View>
                </View>
              )}
            </View>
          )}
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
  deliveryTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "instrument-sans-700",
  },
  truckIconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  stagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  stageItem: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  stageDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 8,
  },
  stageDotActive: {
    backgroundColor: "#FFFFFF",
  },
  stageLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    fontWeight: "500",
  },
  stageLabelActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  stageLine: {
    position: "absolute",
    top: 6,
    left: "50%",
    right: "-50%",
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  stageLineActive: {
    backgroundColor: "#FFFFFF",
  },
  updatesCard: {
    backgroundColor: "rgba(200, 180, 255, 0.35)",
    borderRadius: 30,
    padding: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  updateItem: {
    marginBottom: 15,
  },
  updateStatus: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6B5FFF",
    marginBottom: 5,
  },
  updateMessage: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    marginBottom: 3,
  },
  updateSubmessage: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 18,
  },
  updateDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: 15,
  },
  moreIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
  },
  moreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
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
