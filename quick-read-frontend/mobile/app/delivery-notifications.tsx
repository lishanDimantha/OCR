import { Ionicons } from "@expo/vector-icons";
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

const notifications = [
  { id: "1", text: "Order on the way", time: "12:50" },
  { id: "2", text: "Payment successful", time: "12:30" },
  { id: "3", text: "Payment not complete", time: "12:00" },
];

/**
 * Delivery Partner Notifications Screen
 */
export default function DeliveryNotificationsScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/UI_Background.jpeg")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />

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

        <Text style={styles.title}>Notification</Text>

        <View style={styles.notificationsList}>
          {notifications.map((item) => (
            <View key={item.id} style={styles.notificationRow}>
              <View style={styles.notificationLeft}>
               
                <Text style={styles.notificationText}>{item.text}</Text>
              </View>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 40,
  },
  logoImage: {
    width: 280,
    height: 158,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "rgba(26, 26, 158, 1)",
    textAlign: "center",
    marginBottom: 32,
  },
  notificationsList: {
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.32)",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.38)",
  },
  notificationLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  notificationText: {
    fontSize: 22,
    fontWeight: "500",
    color: "rgba(26, 26, 158, 1)",
  },
  notificationTime: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(26, 26, 158, 0.9)",
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
  navItem: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
