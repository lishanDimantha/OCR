import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/constants/config";
import {
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { height } = Dimensions.get("window");

const HISTORY_DATA = [
  { id: 1, text: "Atorvastatin ordered" },
  { id: 2, text: '"Metformin" name searched' },
  { id: 3, text: "Use emergency order function" },
];

export default function HistoryScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("Patient");
  const [currentDate] = useState(new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '. '));
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUserName = async () => {
        try {
          const storedName = await AsyncStorage.getItem("fullName");
          if (storedName) {
            setUserName(storedName.split(" ")[0]);
          }
        } catch (error) {
          if (__DEV__) console.error("Error fetching user name:", error);
        }
      };
      fetchUserName();
    }, [])
  );

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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("@/assets/images/UI_Background.jpeg")} // Use your background image
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(139, 152, 255, 0.4)", "rgba(88, 130, 255, 0.6)"]}
          style={styles.gradientOverlay}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLogoWrapper}>
                <Image
                  source={require("@/assets/images/quick-read-logo.png")}
                  style={styles.headerLogo}
                  resizeMode="contain"
                  tintColor="#FFFFFF"
                />
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backButton}
                >
                  <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/patient-profile')}>
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

          {/* Page Title */}
          <Text style={styles.pageTitle}>History</Text>

          {/* Glass History Card */}
          <View style={styles.glassCard}>
            <View style={styles.listContainer}>
              {HISTORY_DATA.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.historyText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  scrollContent: {
    padding: 25,
    paddingTop: 60,
    paddingBottom: 120,
    flexGrow: 1,
  },
  header: {
    marginBottom: 40,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
  },
  backButton: { marginRight: 5 },
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
  pageTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 60,
    paddingHorizontal: 30,
    paddingVertical: 50,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    minHeight: height * 0.5,
  },
  listContainer: { gap: 20 },
  historyItem: { flexDirection: "row", alignItems: "center", gap: 15 },
  bullet: { width: 12, height: 12, borderRadius: 6, backgroundColor: "white" },
  historyText: { color: "white", fontSize: 16, fontWeight: "400" },
  logoContainer: { marginTop: "auto", paddingBottom: 40, alignItems: "center" },
  logoWrapper: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoDivider: {
    width: 1.5,
    height: 40,
    backgroundColor: "white",
    opacity: 0.5,
  },
  logoTextMain: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 1,
  },
  logoTextSub: {
    color: "white",
    fontSize: 8,
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  navBarContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  navItem: {
    padding: 8,
  },
});
