import { Ionicons } from "@expo/vector-icons";
import { InstrumentSans_500Medium, useFonts } from "@expo-google-fonts/instrument-sans";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { apiFetch } from "@/utils/api-helper";
import MapTracking from "@/components/MapTracking";

const { width } = Dimensions.get("window");

export default function DeliveryHomeScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ InstrumentSans_500Medium });
  const [stats, setStats] = useState({ successful: 0, pending: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const response = await apiFetch("/delivery/stats");
      const result = await response.json();
      if (response.ok) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching delivery stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Start watching location
      const subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // update every 10 meters
        },
        (newLocation) => {
          setLocation(newLocation);
          updateBackendLocation(newLocation);
        }
      );

      return () => subscriber.remove();
    })();
  }, []);

    const updateBackendLocation = async (loc: Location.LocationObject) => {
    try {
      // In a real scenario, we'd need an active order ID to update.
      // For now, we update the driver's general location if the backend supports it,
      // or we update the most recent active order.
      // Let's assume we have a general 'update-location' for the driver.
      await apiFetch("/delivery/location", {
        method: "POST",
        body: JSON.stringify({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        }),
      });
    } catch (error) {
      console.error("Error updating location to backend:", error);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/UI_Background.jpeg")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
        </View>

        {/* Logo and Welcome */}
        <View style={styles.logoSection}>
          <Image
            source={require("@/assets/images/quick-read-logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome Delivery Partner</Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <LinearGradient
              colors={["rgba(138, 108, 255, 1)", "rgba(11, 11, 135, 0.9)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statNumber}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pickup</Text>
            </LinearGradient>
            <LinearGradient
              colors={["rgba(138, 108, 255, 1)", "rgba(11, 11, 135, 0.9)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statNumber}>{stats.successful}</Text>
              <Text style={styles.statLabel}>Successful{"\n"}Deliveries</Text>
            </LinearGradient>
            <LinearGradient
              colors={["rgba(138, 108, 255, 1)", "rgba(11, 11, 135, 0.9)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statNumber}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pending{"\n"}Deliveries</Text>
            </LinearGradient>
            <LinearGradient
              colors={["rgba(138, 108, 255, 1)", "rgba(11, 11, 135, 0.9)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statNumber}>{stats.cancelled}</Text>
              <Text style={styles.statLabel}>Cancelled{"\n"}Deliveries</Text>
            </LinearGradient>
          </View>
          <View style={styles.emergencyCardContainer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/emergency-delivery")}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,1)", "rgba(255,255,255,0.1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emergencyCardBorder}
              >
                <View style={styles.emergencyCard}>
                  <Text style={styles.emergencyNumber}>6</Text>
                  <Text style={styles.emergencyLabel}>
                    Emergency{"\n"}Deliveries
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Tracking Map */}
        <View style={styles.mapCardContainer}>
          <Text style={styles.sectionTitle}>Live Route Tracking</Text>
          <View style={styles.mapWrapper}>
            <MapTracking location={location} errorMsg={errorMsg} />
          </View>
        </View>

        <View style={styles.deliveryListButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/delivery-list")}
          >
            <LinearGradient
              colors={["rgba(138, 108, 255, 1)", "rgba(115, 0, 255, 1)"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.deliveryListButton}
            >
              <Text style={styles.deliveryListButtonText}>Delivery List</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </ScrollView>
      {/* Bottom Navigation */}
      {/* Navigation handled by _layout.tsx */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoImage: { width: 280, height: 158 },
  welcomeText: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 24,
    fontWeight: "500",
    color: "rgba(26, 26, 158, 1)",
    lineHeight: 44,
    letterSpacing: 0,
    width: 326,
    textAlign: "center",
    marginTop: 5,
  },
  statsContainer: { paddingHorizontal: 10, marginBottom: 40 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  mapCardContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "rgba(26, 26, 158, 1)",
    marginBottom: 10,
  },
  mapWrapper: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(138, 108, 255, 0.3)",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "rgba(26, 26, 158, 0.5)",
    fontSize: 16,
  },
  statCard: {
    width: 88,
    height: 73,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  statNumber: {
    fontFamily: "Arial",
    fontSize: 24,
    fontWeight: "700",
    fontStyle: "italic",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "rgba(244, 244, 255, 1)",
    marginBottom: 5,
  },
  statLabel: {
    fontFamily: "Arial",
    fontSize: 11,
    fontWeight: "700",
    fontStyle: "italic",
    lineHeight: 11,
    letterSpacing: 0,
    textAlign: "center",
    color: "rgba(244, 244, 255, 1)",
  },
  emergencyCardContainer: { alignItems: "center", marginTop: 40 },
  emergencyCardBorder: {
    width: 132,
    height: 92,
    borderRadius: 21,
    padding: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyCard: {
    backgroundColor: "rgba(255, 0, 0, 0.75)",
    borderRadius: 20,
    width: 130,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(255, 255, 255, 1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  emergencyLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 20,
  },
  deliveryListButtonContainer: {
    alignItems: "center",
    marginTop: 34,
    marginBottom: 30,
  },
  deliveryListButton: {
    width: 280,
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
  deliveryListButtonText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 24,
  },
});
