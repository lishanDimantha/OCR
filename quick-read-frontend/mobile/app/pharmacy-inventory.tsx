import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function InventoryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const inventoryData = [
    {
      product: "Amoxicillin Tablets",
      stockLevel: "15",
      threshold: "15",
      refNo: "PZ 16",
    },
    {
      product: "Allermine Syrup",
      stockLevel: "15",
      threshold: "15",
      refNo: "PZ 14",
    },
    {
      product: "Paracetamol Tablets",
      stockLevel: "15",
      threshold: "15",
      refNo: "PZ 12",
    },
  ];

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
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="#0B0B87" />
            </TouchableOpacity>

          <Image
            source={require("@/assets/images/quick-read-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

        </View>

        {/* Title */}
        <Text style={styles.title}>Stock Inventory</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={24}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search in Stocks"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Inventory Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colProduct]}>
              Product
            </Text>
            <Text style={[styles.tableHeaderText, styles.colStock]}>
              Stock{"\n"}Level
            </Text>
            <Text style={[styles.tableHeaderText, styles.colThreshold]}>
              Threshold
            </Text>
            <Text style={[styles.tableHeaderText, styles.colRef]}>Ref No</Text>
          </View>

          {/* Table Rows */}
          {inventoryData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colProduct]}>
                {item.product}
              </Text>
              <Text style={[styles.tableCell, styles.colStock]}>
                {item.stockLevel}
              </Text>
              <Text style={[styles.tableCell, styles.colThreshold]}>
                {item.threshold}
              </Text>
              <Text style={[styles.tableCell, styles.colRef]}>
                {item.refNo}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push("/pharmacy-add-stock")}
          >
            <Text style={styles.actionButtonText}>Add Stock</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push("/pharmacy-update-stock")}
          >
            <Text style={styles.actionButtonText}>Update Stock</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
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
  
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E0A60",
    textAlign: "center",
    marginBottom: 25,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  tableContainer: {
    backgroundColor: "#7B6FD8",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 15,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
  },
  tableHeaderText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
  },
  tableCell: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
  },
  colProduct: {
    flex: 2.5,
    textAlign: "left",
    paddingLeft: 5,
  },
  colStock: {
    flex: 1,
  },
  colThreshold: {
    flex: 1,
  },
  colRef: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#7B6FD8",
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomNav: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "space-around",
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
});

