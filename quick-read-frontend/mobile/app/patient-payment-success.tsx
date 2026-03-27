import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Patient Payment Success Screen
 * Shown after a successful payment (card, Koko, or cash on delivery).
 * The "Status" button navigates the patient to the delivery tracking screen.
 */
export default function PatientPaymentSuccessScreen() {
  const router = useRouter();

  const handleDone = () => {
    router.push("/patient-delivery");
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Header */}
        <ImageBackground
          source={require("@/assets/images/payment-header.jpg")}
          style={styles.header}
          resizeMode="cover"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons
              name="keyboard-double-arrow-left"
              size={24}
              color="white"
            />
            <Text style={styles.backText}>BACK</Text>
          </TouchableOpacity>

          <Image
            source={require("@/assets/images/Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </ImageBackground>

        {/* Success Card */}
        <View style={styles.content}>
          <View style={styles.card}>
            {/* Confirmation Title */}
            <Text style={styles.title}>Confirmation</Text>

            {/* Success Icon */}
            <View style={styles.iconContainer}>
              <FontAwesome name="check" size={120} color="#6A5CFF" />
            </View>

            <Text style={styles.title}>Successful!</Text>

            <Text style={styles.message}>Your order number is #1415454</Text>
            <Text style={styles.message}>
              You will receive the order confirmation email shortly
            </Text>
            <Text style={styles.message}>Thank you for joining with us.</Text>

            {/* Status / Track Delivery Button */}
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneButtonText}>Track Delivery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 100,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 60,
    marginBottom: -50,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logo: {
    height: 80,
    width: 180,
    tintColor: "#fff",
    marginTop: 30,
    marginBottom: -30,
  },
  content: {
    flex: 1,
    marginTop: -25,
  },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 40,
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#6A5CFF",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 24,
  },
  doneButton: {
    backgroundColor: "#6A5CFF",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#6A5CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
