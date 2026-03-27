import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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

export default function EmergencyDeliveryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ImageBackground
        source={require("../assets/images/UI_Background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/quick-read-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Directly request</Text>

          {/* Map Image / Circle */}
          <View style={styles.mapBorder}>
            <Image 
              source={{ uri: "https://www.mapquest.com/mq/maps/1.0/map?width=400&height=400&zoom=14&scaleType=3&lat=5.949&lng=80.536" }} 
              style={styles.mapImage} 
            />
          </View>

          {/* Loaders / Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLine} />
            <View style={styles.progressLine} />
            <View style={styles.progressLine} />
          </View>

          {/* Avatars */}
          <View style={styles.avatarsContainer}>
            <Image source={{ uri: "https://i.pravatar.cc/150?img=11" }} style={styles.avatar} />
            <Image source={{ uri: "https://i.pravatar.cc/150?img=12" }} style={[styles.avatar, styles.centerAvatar]} />
            <Image source={{ uri: "https://i.pravatar.cc/150?img=13" }} style={styles.avatar} />
          </View>
        </ScrollView>

        {/* Navigation handled by _layout.tsx */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backgroundImage: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120, alignItems: "center" },
  logoContainer: { alignItems: "center", marginBottom: 30, marginTop: 20 },
  logo: { width: 180, height: 60 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1A1A9E", marginBottom: 30 },
  mapBorder: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: "#1A1A9E",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0E0E0",
    marginBottom: 40,
  },
  mapImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 30,
    width: "100%",
  },
  progressLine: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#524EB7",
  },
  avatarsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#1A1A9E",
  },
  centerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
    overflow: "hidden",
  },
  navItem: { padding: 8 },
});
