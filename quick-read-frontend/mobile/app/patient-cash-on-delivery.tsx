import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

/**
 * Patient Cash On Delivery Screen
 * Shows order summary and allows patients to place a COD order.
 * A 5% cash payment fee (max Rs. 100) is added to the sub-total.
 */
export default function PatientCashOnDeliveryScreen() {
  const router = useRouter();

  const subTotal = 2500;
  const cashFee = 125; // 5% of 2500
  const totalAmount = subTotal + cashFee;

  const handleCheckout = () => {
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

        {/* Payment Card */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cash On Delivery</Text>

            {/* Icon */}
            <View style={styles.iconContainer}>
              <Image
                source={require("@/assets/images/cash-icon.png")}
                style={styles.cashIcon}
                resizeMode="contain"
              />
            </View>

            {/* Description */}
            <Text style={styles.description}>
              You may pay in cash upon receiving your parcel
            </Text>

            <Text style={styles.infoText}>
              Cash payment fee (5%), with a maximum cap of RS. 100 applies only
              to cash on delivery payment method. There is no extra fee when
              using other payment methods.
            </Text>

            <Text style={styles.confirmText}>
              Before you make your payment, confirm your order number, sender
              information and tracking number on the parcel.
            </Text>

            {/* Order Summary */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sub total</Text>
                <Text style={styles.summaryValue}>Rs. {subTotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cash payment fee (5%)</Text>
                <Text style={styles.summaryValue}>Rs. {cashFee}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total amount</Text>
                <Text style={styles.totalValue}>Rs. {totalAmount}</Text>
              </View>
            </View>

            {/* Total Fee Display */}
            <View style={styles.totalFeeContainer}>
              <Text style={styles.totalFeeLabel}>Total Fee</Text>
              <View style={styles.totalFeeBox}>
                <Text style={styles.totalFeeText}>Rs. {totalAmount}</Text>
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
        </ScrollView>
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
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  cashIcon: {
    width: 60,
    height: 60,
  },
  description: {
    fontSize: 14,
    fontWeight: "600",
    color: "#04c5f5ff",
    textAlign: "left",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 12,
    color: "#04c5f5ff",
    textAlign: "left",
    lineHeight: 18,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  confirmText: {
    fontSize: 11,
    color: "#04c5f5ff",
    textAlign: "left",
    lineHeight: 16,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  summaryContainer: {
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#2e0ee0ff",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 13,
    color: "#04c5f5ff",
    fontWeight: "600",
  },
  totalRow: {
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    color: "#2e0ee0ff",
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 14,
    color: "#2e0ee0ff",
    fontWeight: "700",
  },
  totalFeeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  totalFeeLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2701fcff",
    marginBottom: 12,
  },
  totalFeeBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 18,
    gap: 8,
  },
  totalFeeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#04c5f5ff",
  },
  checkoutButton: {
    backgroundColor: "#6A5CFF",
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
