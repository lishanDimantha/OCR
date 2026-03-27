import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { apiFetch } from "@/utils/api-helper";

export default function DeliveryListScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await apiFetch("/delivery/orders");
      const result = await response.json();
      if (response.ok) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Error fetching delivery orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleContactPharmacy = () => {
    Alert.alert("Contact", "Opening dialer for Pharmacy...");
  };

  const handleContactCustomer = () => {
    Alert.alert("Contact", "Opening dialer for Customer...");
  };

  const handleMarkStatus = async (orderId: string, currentStatus: string) => {
    let nextStatus = "";
    if (currentStatus === "ready_to_ship") nextStatus = "pick_up";
    else if (currentStatus === "pick_up") nextStatus = "in_transit";
    else if (currentStatus === "in_transit") nextStatus = "out_of_delivery";
    else if (currentStatus === "out_of_delivery") nextStatus = "delivered";

    if (!nextStatus) {
      Alert.alert("Info", "Order is already delivered or in an unchangeable state.");
      return;
    }

    try {
      const response = await apiFetch(`/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus }),
      });
      if (response.ok) {
        Alert.alert("Success", `Status updated to ${nextStatus.replace(/_/g, ' ')}`);
        fetchOrders();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/UI_Background.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* Logo */}
        <View style={styles.logoSection}>
          <Image
            source={require("@/assets/images/quick-read-logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <LinearGradient
          colors={["#7C3AED", "#9333EA"]}
          style={styles.titleBox}
        >
          <Text style={styles.titleText}>Delivery List</Text>
        </LinearGradient>

        {/* Delivery Card */}
        <LinearGradient
          colors={["rgba(124,58,237,0.6)", "rgba(147,51,234,0.9)"]}
          style={styles.card}
        >

          {/* Table Header */}
          <View style={styles.row}>
            <Text style={styles.header}>Name</Text>
            <Text style={styles.header}>Status</Text>
            <Text style={styles.header}>Contact</Text>
            <Text style={styles.header}>Address</Text>
          </View>

          {/* Row 1 */}
          <View style={styles.row}>
            <View>
              <Text style={styles.name}>Mr.Sosya</Text>
              <Text style={styles.sub}>(To PickUp)</Text>
            </View>

            <View style={styles.status}>
              <Ionicons name="checkmark-circle" size={28} color="green" />
            </View>

            <Text style={styles.contact}>077 6754 321</Text>

            <Text style={styles.address}>
              No :2/16{"\n"}Colombo, Kirulapone
            </Text>
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            <View>
              <Text style={styles.name}>Mr.Sosya</Text>
              <Text style={styles.sub}>(To PickUp)</Text>
            </View>

            <View style={styles.status}>
              <Ionicons name="close-circle" size={28} color="red" />
            </View>

            <Text style={styles.contact}>077 6754 321</Text>

            <Text style={styles.address}>
              No :2/16{"\n"}Colombo, Kirulapone
            </Text>
          </View>

          {loading ? (
             <ActivityIndicator color="#FFF" style={{ marginVertical: 20 }} />
          ) : orders.length === 0 ? (
             <Text style={{ color: '#FFF', textAlign: 'center', marginVertical: 20 }}>No active orders.</Text>
          ) : orders.map((order) => (
            <View style={styles.row} key={order.ID}>
              <View>
                <Text style={styles.name}>{order.UserID}</Text>
                <Text style={styles.sub}>({order.status.replace(/_/g, ' ')})</Text>
              </View>

              <TouchableOpacity 
                style={styles.status}
                onPress={() => handleMarkStatus(order.ID, order.status)}
              >
                <Ionicons 
                  name={order.status === 'delivered' ? "checkmark-circle" : "ellipsis-horizontal-circle"} 
                  size={28} 
                  color={order.status === 'delivered' ? "green" : "#FFF"} 
                />
              </TouchableOpacity>

              <Text style={styles.contact}>ID: {order.ID}</Text>

              <Text style={styles.address}>
                {order.delivery_lat.toFixed(2)}, {order.delivery_lng.toFixed(2)}
              </Text>
            </View>
          ))}

        </LinearGradient>

        {/* Buttons */}

        <TouchableOpacity
          style={styles.button}
          onPress={handleContactPharmacy}
        >
          <Text style={styles.buttonText}>Contact Pharmacy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryBtn]}
          onPress={handleContactCustomer}
        >
          <Text style={[styles.buttonText, { color: "#2E3192" }]}>Contact Customer</Text>
        </TouchableOpacity>

      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1E2A78" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/delivery-profile")}
        >
          <Ionicons name="person-outline" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/delivery-notifications")}
        >
          <Ionicons name="notifications-outline" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/delivery-settings")}
        >
          <Ionicons name="settings-outline" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  background: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 140,
    alignItems: "center",
  },

  logoSection: {
    alignItems: "center",
    marginBottom: 20,
  },

  logoImage: {
    width: 280,
    height: 158,
  },

  titleBox: {
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginBottom: 20,
  },

  titleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  card: {
    width: "100%",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },

  status: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    color: "#1A1A9E",
    fontWeight: "bold",
    fontSize: 14,
  },

  name: {
    color: "white",
    fontWeight: "bold",
  },

  sub: {
    color: "white",
    fontSize: 12,
  },

  contact: {
    color: "white",
  },

  address: {
    color: "white",
    fontSize: 12,
  },

  button: {
    width: "90%",
    backgroundColor: "#5B5BD6",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 8,
  },

  secondaryBtn: {
    backgroundColor: "#ffffffff",
  },

  markBtn: {
    backgroundColor: "#EF4444",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
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

  navItem: { padding: 8, alignItems: "center", justifyContent: "center" },

});