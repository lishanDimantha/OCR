import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Patient Koko Payment Screen
 * Allows patients to pay using their Koko Mobile Wallet.
 * On checkout navigates to payment-failure for confirmation.
 */
export default function PatientKokoPaymentScreen() {
  const router = useRouter();
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");

  const totalFee = 2600;

  const handleCheckout = () => {
    // Navigate to failure page (validation can be added here)
    router.push("/patient-payment-failure");
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

        {/* Payment Card */}
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>KOKO Payment</Text>

            {/* Koko Icon */}
            <View style={styles.iconContainer}>
              <Image
                source={require("@/assets/images/koko-icon.png")}
                style={styles.kokoIcon}
                resizeMode="contain"
              />
            </View>

            {/* Account Name Input */}
            <View style={styles.inputGroup}>
              {!accountName && (
                <Text style={styles.floatingLabel}>Account Name</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Enter Account Name"
                placeholderTextColor="#C0C5E0"
                value={accountName}
                onChangeText={setAccountName}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              {!password && <Text style={styles.floatingLabel}>Password</Text>}
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#C0C5E0"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Total Fee Display */}
            <View style={styles.totalFeeContainer}>
              <Text style={styles.totalFeeLabel}>Total Fee</Text>
              <View style={styles.totalFeeBox}>
                <Text style={styles.totalFeeText}>RS. {totalFee}</Text>
              </View>
              <Ionicons name="cash" size={24} color="#6A5CFF" />
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Check Out</Text>
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
    paddingTop: 25,
    paddingBottom: 40,
    minHeight: "100%",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#6A5CFF",
    textAlign: "center",
    marginBottom: 30,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  kokoIcon: {
    width: 60,
    height: 60,
  },
  inputGroup: {
    marginBottom: 24,
    position: "relative",
  },
  floatingLabel: {
    position: "absolute",
    left: 15,
    top: -8,
    fontSize: 12,
    fontWeight: "600",
    color: "#6A5CFF",
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    zIndex: 1,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#D0D5FF",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 11,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
  },
  totalFeeContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  totalFeeLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2701fcff",
    marginBottom: 12,
  },
  totalFeeBox: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 18,
    marginBottom: 8,
  },
  totalFeeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6A5CFF",
  },
  checkoutButton: {
    backgroundColor: "#6A5CFF",
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#6A5CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
