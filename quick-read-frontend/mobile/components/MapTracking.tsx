import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

interface MapTrackingProps {
  location: Location.LocationObject | null;
  errorMsg: string | null;
}

/**
 * MapTracking – a lightweight location display component.
 *
 * Shows the driver's current coordinates when location is available,
 * an error message when permission is denied, or a loading spinner
 * while waiting for the first fix.
 *
 * Replace the inner View with a real map library (e.g. react-native-maps)
 * when you're ready for full map rendering.
 */
export default function MapTracking({ location, errorMsg }: MapTrackingProps) {
  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Ionicons name="warning-outline" size={36} color="#EF4444" />
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Getting your location…</Text>
      </View>
    );
  }

  const { latitude, longitude } = location.coords;

  return (
    <View style={styles.container}>
      <Ionicons name="navigate-circle" size={48} color="#7C3AED" />
      <Text style={styles.coordsText}>
        {latitude.toFixed(5)}, {longitude.toFixed(5)}
      </Text>
      <Text style={styles.hintText}>Live location active</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: 20,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  loadingText: {
    color: "#7C3AED",
    fontSize: 14,
    marginTop: 10,
  },
  coordsText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A9E",
    marginTop: 10,
  },
  hintText: {
    fontSize: 12,
    color: "rgba(26, 26, 158, 0.6)",
    marginTop: 6,
  },
});
