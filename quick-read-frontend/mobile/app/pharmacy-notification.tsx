import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
    Image,
    ImageBackground,
    LayoutAnimation,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import config from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PatientNotificationScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<any[]>([
    {
      ID: 1,
      title: "Welcome to Quick-Read",
      message: "Thank you for joining. Explore your smart pharmacy.",
      CreatedAt: new Date().toISOString()
    }
  ]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;
        const response = await fetch(`${config.apiUrl}/notifications`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response.json();
        if (response.ok && result.data && result.data.notifications) {
          setNotifications(result.data.notifications);
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };
    fetchNotifications();
  }, []);

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
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

          <Text style={styles.pageTitle}>Notification</Text>

          <View style={styles.listContainer}>
            {notifications.map((item) => {
              const isExpanded = expandedId === item.ID;
              const timeString = new Date(item.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => toggleExpand(item.id)}
                  style={[
                    styles.glassCard,
                    isExpanded ? styles.expandedCard : styles.collapsedCard,
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    {!isExpanded && (
                      <Text style={styles.timeText}>{item.time}</Text>
                    )}
                  </View>

                  {isExpanded && (
                    <View style={styles.detailsContainer}>
                      <Text style={styles.detailsText}>{item.details}</Text>
                      <Text style={styles.expandedTimeText}>{item.time}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            {notifications.length === 0 && (
              <Text style={{ textAlign: "center", color: "#FFF", marginTop: 20 }}>No notifications yet.</Text>
            )}
          </View>
        </ScrollView>


        {/* Navigation handled by _layout.tsx */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  scrollContent: { paddingTop: 60, paddingHorizontal: 25 },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 100,
  },
  pageTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  listContainer: { gap: 15 },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    overflow: "hidden",
  },
  collapsedCard: {
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  expandedCard: {
    paddingVertical: 25,
    paddingHorizontal: 25,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: "#1C1C65",
    fontSize: 16,
    fontWeight: "600",
  },
  timeText: {
    color: "#1C1C65",
    fontSize: 12,
  },
  detailsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  detailsText: {
    color: "#1C1C65",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  expandedTimeText: {
    color: "#1C1C65",
    fontSize: 12,
    alignSelf: "flex-end",
    marginTop: 15,
  },
  backButton: {
    position: "absolute",
    top: 54,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  navItem: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
});
