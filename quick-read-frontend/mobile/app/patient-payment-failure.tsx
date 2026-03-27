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
 * Patient Payment Failure Screen
 * Shown when a card or Koko payment is unsuccessful.
 * Patient can continue to retry or go to the success screen.
 */
export default function PatientPaymentFailureScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/patient-payment-success");
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

        {/* Failure Card */}
        <View style={styles.content}>
          <View style={styles.card}>
            {/* Confirmation Title */}
            <Text style={styles.title}>Confirmation</Text>

            {/* Failure Icon */}
            <View style={styles.iconContainer}>
              <FontAwesome name="close" size={80} color="#6A5CFF" />
            </View>

            {/* Failure Message */}
            <Text style={styles.failTitle}>Fail !</Text>

            <Text style={styles.message}>Your order number is #418454</Text>
            <Text style={styles.message}>Payment is unsuccessful.</Text>
            <Text style={styles.message}>
              Please check your payment details and delivery details.
            </Text>

            <Text style={styles.thankYou}>Thank you for joining with us.</Text>

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
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
    paddingBottom: 80,
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
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 40,
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6A5CFF",
    marginBottom: 30,
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: 30,
  },
  failTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FF4B4B",
    marginBottom: 20,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 22,
  },
  thankYou: {
    fontSize: 14,
    color: "#6A5CFF",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    fontWeight: "600",
  },
  continueButton: {
    backgroundColor: "#6A5CFF",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignItems: "center",
    shadowColor: "#6A5CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
