import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"; /**
 * Patient Payment Method Screen
 * Allows patients to choose their preferred payment method:
 * - Card Payment (Visa / Mastercard)
 * - Cash On Delivery
 * - Koko Mobile Wallet
 */
export default function PatientPaymentMethodScreen() {
  const router = useRouter();

  const handlePaymentMethod = (method: string) => {
    if (method === "card") {
      router.push("/patient-payment");
    } else if (method === "cash") {
      router.push("/patient-cash-on-delivery");
    } else if (method === "koko") {
      router.push("/patient-koko-payment");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/UI_Background.jpeg")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />

      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>BACK</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Choose Payment Method</Text>

        {/* Card Payment */}
        <TouchableOpacity
          style={styles.paymentCard}
          onPress={() => handlePaymentMethod("card")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="card" size={40} color="#6A5CFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.methodTitle}>Card Payment</Text>
            <Text style={styles.methodDescription}>
              Pay with Credit or Debit Card
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Cash On Delivery */}
        <TouchableOpacity
          style={styles.paymentCard}
          onPress={() => handlePaymentMethod("cash")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="cash" size={40} color="#6A5CFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.methodTitle}>Cash On Delivery</Text>
            <Text style={styles.methodDescription}>
              Pay with Cash on Delivery
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Koko Payment */}
        <TouchableOpacity
          style={styles.paymentCard}
          onPress={() => handlePaymentMethod("koko")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="wallet" size={40} color="#6A5CFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.methodTitle}>Koko Payment</Text>
            <Text style={styles.methodDescription}>
              Pay with Koko Mobile Wallet
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      {/* Bottom Navigation Bar */}
      {/* Navigation handled by _layout.tsx */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 100,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3e0fbeff",
    textAlign: "center",
    marginBottom: 40,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#F0EDFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 13,
    color: "#6B7280",
  },
});