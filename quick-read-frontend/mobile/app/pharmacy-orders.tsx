import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { apiFetch } from "@/utils/api-helper";

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "Active" | "Pending" | "Completed" | "Cancelled"
  >("Active");

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("/pharmacy/orders");
      const result = await response.json();
      if (response.ok) {
        setOrders(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching pharmacy orders:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeTab === "Pending") return order.status === "pending" || order.status === "processing";
      if (activeTab === "Active") return order.status === "ready_to_ship" || order.status === "in_transit" || order.status === "out_of_delivery";
      if (activeTab === "Completed") return order.status === "delivered";
      if (activeTab === "Cancelled") return order.status === "cancelled";
      return false;
    });
  }, [orders, activeTab]);

  return (
    <ImageBackground
      source={require("@/assets/images/UI_Background.jpeg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 28 }} />

          <Image
            source={require("@/assets/images/quick-read-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={28} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>Orders</Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {["Active", "Pending", "Completed", "Cancelled"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() =>
                setActiveTab(
                  tab as "Active" | "Pending" | "Completed" | "Cancelled",
                )
              }
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders List */}
        <View style={styles.ordersList}>
          {loading ? (
             <ActivityIndicator color="#FFF" style={{ padding: 20 }} />
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <TouchableOpacity
                key={index}
                style={styles.orderCard}
                onPress={() =>
                  router.push({
                    pathname: "/order-details",
                    params: { orderId: order.ID.toString() }
                  } as any)
                }
              >
                <View style={styles.orderLeft}>
                  <Text style={styles.orderPatient}>Order #{order.ID}</Text>
                  <Text style={styles.orderRef}>Total: RS. {order.total_amount}</Text>
                </View>
                <View style={styles.orderCenter}>
                  <View style={styles.statusBadge}>
                    <View
                      style={[
                        styles.statusDot,
                        order.status === "delivered" && styles.statusDotCompleted,
                        order.status === "cancelled" && styles.statusDotCancelled,
                        (order.status === "pending" || order.status === "processing") && styles.statusDotPending,
                      ]}
                    />
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                </View>
                <View style={styles.orderRight}>
                  <Text style={styles.orderTime}>{new Date(order.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#FFF" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: '#FFF', padding: 20 }}>No {activeTab.toLowerCase()} orders found.</Text>
          )}
        </View>

        {/* Bottom padding */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#7B6FD8" />
      </TouchableOpacity>

      
      {/* Navigation handled by _layout.tsx */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 60,
  },
  helpButton: {
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7B6FD8",
    textAlign: "center",
    marginBottom: 25,
    fontStyle: "italic",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#7B6FD8",
    marginHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#7B6FD8",
  },
  tabText: {
    color: "#E8E4FF",
    fontSize: 13,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  ordersList: {
    backgroundColor: "#7B6FD8",
    marginHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  orderLeft: {
    flex: 1,
  },
  orderPatient: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  orderRef: {
    color: "#E8E4FF",
    fontSize: 12,
  },
  orderCenter: {
    flex: 1,
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00FF00",
    marginRight: 6,
  },
  statusDotCompleted: {
    backgroundColor: "#3498DB",
  },
  statusDotCancelled: {
    backgroundColor: "#E03030",
  },
  statusDotPending: {
    backgroundColor: "#F39C12",
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  orderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderTime: {
    color: "#FFFFFF",
    fontSize: 14,
    marginRight: 5,
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
