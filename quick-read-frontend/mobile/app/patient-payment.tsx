import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useMemo } from "react";
import { apiFetch } from "@/utils/api-helper";
import {
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PatientPaymentScreen() {
  const router = useRouter();
  const { prescriptionId, items } = useLocalSearchParams<{ prescriptionId: string, items: string }>();
  
  const [loading, setLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<"visa" | "master">("visa");

  const medicineItems = useMemo(() => {
    if (!items) return [];
    try {
      return JSON.parse(items);
    } catch (e) {
      return [];
    }
  }, [items]);

  const totalAmount = useMemo(() => {
    // For now, let's assume a default price if items don't have it
    // In a real app, we'd fetch prices from backend
    return medicineItems.length > 0 ? medicineItems.length * 500 : 2500;
  }, [medicineItems]);

  const handleCheckout = async () => {
    if (selectedCardType === "visa" || selectedCardType === "master") {
      if (!cardholderName || !cardNumber || !cvv || !expiryDate) {
        Alert.alert("Error", "Please fill in all card details");
        return;
      }
    }

    setLoading(true);
    try {
      const orderData = {
        prescription_id: parseInt(prescriptionId || "0"),
        total_amount: totalAmount,
        is_emergency: false,
        payment_method: "card",
        payment_status: "paid", // For this demo, let's assume payment is immediate
        status: "processing",
        pharmacy_id: 1, // Defaulting to 1 for demo
      };

      const response = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Order placed successfully!");
        router.push("/patient-home"); // Or a success screen if available
      } else {
        Alert.alert("Error", result.message || "Failed to place order");
      }
    } catch (error) {
      Alert.alert("Error", "Server connection failed");
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.cardTitle}>Card Payment</Text>

            {/* Payment Method Icons */}
            <View style={styles.paymentMethods}>
              <TouchableOpacity
                style={[
                  styles.paymentIcon,
                  selectedCardType === "master" && styles.paymentIconSelected,
                ]}
                onPress={() => setSelectedCardType("master")}
              >
                <View style={styles.checkmarkContainer}>
                  {selectedCardType === "master" ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#6A5CFF"
                    />
                  ) : (
                    <Ionicons
                      name="ellipse-outline"
                      size={20}
                      color="#C0C0FF"
                    />
                  )}
                </View>
                <FontAwesome6 name="cc-mastercard" size={32} color="#6A5CFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paymentIcon,
                  selectedCardType === "visa" && styles.paymentIconSelected,
                ]}
                onPress={() => setSelectedCardType("visa")}
              >
                <View style={styles.checkmarkContainer}>
                  {selectedCardType === "visa" ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#6A5CFF"
                    />
                  ) : (
                    <Ionicons
                      name="ellipse-outline"
                      size={20}
                      color="#C0C0FF"
                    />
                  )}
                </View>
                <FontAwesome6 name="cc-visa" size={32} color="#6A5CFF" />
              </TouchableOpacity>
            </View>

            {/* Cardholder Name */}
            <View style={styles.inputGroup}>
              {!cardholderName && (
                <Text style={styles.floatingLabel}>Cardholder Name</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Enter cardholder name"
                placeholderTextColor="#C0C5E0"
                value={cardholderName}
                onChangeText={setCardholderName}
              />
            </View>

            {/* Card Number */}
            <View style={styles.inputGroup}>
              {!cardNumber && (
                <Text style={styles.floatingLabel}>Card Number</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Enter card number"
                placeholderTextColor="#C0C5E0"
                keyboardType="numeric"
                maxLength={16}
                value={cardNumber}
                onChangeText={setCardNumber}
              />
            </View>

            {/* CVV and Expiry Date */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, styles.halfInput]}>
                <TextInput
                  style={styles.input}
                  placeholder="CVV"
                  placeholderTextColor="#C0C5E0"
                  keyboardType="numeric"
                  maxLength={3}
                  value={cvv}
                  onChangeText={setCvv}
                  secureTextEntry
                />
              </View>
              <View style={[styles.inputGroup, styles.halfInput]}>
                <TextInput
                  style={styles.input}
                  placeholder="Expiry Date"
                  placeholderTextColor="#C0C5E0"
                  maxLength={5}
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                />
              </View>
            </View>

            {/* Save Card Toggle */}
            <TouchableOpacity
              style={styles.saveCardRow}
              onPress={() => setSaveCard(!saveCard)}
            >
              <Text style={styles.saveCardText}>Save this card data</Text>
              <View
                style={[
                  styles.toggleSwitch,
                  saveCard && styles.toggleSwitchActive,
                ]}
              >
                <View
                  style={[
                    styles.toggleCircle,
                    saveCard && styles.toggleCircleActive,
                  ]}
                />
              </View>
            </TouchableOpacity>

            {/* Total Price */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Fee</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>RS. 2500</Text>
              </View>
              <View style={styles.priceIconBox}>
                <Ionicons name="cash" size={28} color="#6A5CFF" />
              </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Check out</Text>
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
    paddingHorizontal: 70,
    paddingTop: 25,
    paddingBottom: 40,
    minHeight: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#6A5CFF",
    textAlign: "center",
    marginBottom: 20,
  },
  paymentMethods: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 25,
  },
  paymentIcon: {
    width: 100,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E0E0FF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8FF",
    position: "relative",
  },
  paymentIconSelected: {
    backgroundColor: "#F0EDFF",
    borderColor: "#6A5CFF",
  },
  checkmarkContainer: {
    position: "absolute",
    top: 25,
    left: 0,
  },
  inputGroup: {
    marginBottom: 15,
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
  rowInputs: {
    flexDirection: "row",
    gap: 15,
  },
  halfInput: {
    flex: 1,
  },
  saveCardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 28,
  },
  saveCardText: {
    fontSize: 12,
    color: "#6A5CFF",
    fontWeight: "600",
  },
  toggleSwitch: {
    width: 40,
    height: 18,
    borderRadius: 14,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  toggleSwitchActive: {
    backgroundColor: "#6A5CFF",
  },
  toggleCircle: {
    width: 12,
    height: 12,
    borderRadius: 11,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  toggleCircleActive: {
    alignSelf: "flex-end",
  },
  totalContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6A5CFF",
  },
  priceIconBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutButton: {
    backgroundColor: "#6A5CFF",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#6A5CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
