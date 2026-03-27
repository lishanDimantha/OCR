import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PharmacyAddStockScreen() {
  const router = useRouter();
  const [stockLevel, setStockLevel] = useState(2);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ImageBackground
        source={require("../assets/images/UI_Background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(139, 152, 255, 0.2)", "rgba(88, 130, 255, 0.4)"]}
          style={styles.gradientOverlay}
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/quick-read-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Title Area */}
          <Text style={styles.titleText}>{"Add Stock"}</Text>

          {/* Form Container */}
          <View style={styles.formContainer}>
            
            {/* Product Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Product Name</Text>
              <TouchableOpacity style={styles.inputControl}>
                <Text style={styles.inputText}>Add Name</Text>
                <Ionicons name="chevron-down" size={20} color="#151779" />
              </TouchableOpacity>
            </View>

            {/* Stock Level */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Stock Level</Text>
              <View style={styles.inputControl}>
                <Text style={styles.inputText}>Remaining</Text>
                <View style={styles.stockCounter}>
                  <Text style={styles.counterValue}>{stockLevel}</Text>
                  <TouchableOpacity onPress={() => setStockLevel(stockLevel + 1)} style={styles.counterBtn}>
                    <Ionicons name="add" size={20} color="#1C1C65" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setStockLevel(Math.max(0, stockLevel - 1))} style={styles.counterBtn}>
                    <Ionicons name="remove" size={20} color="#1C1C65" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Ref No */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ref No</Text>
              <TouchableOpacity style={styles.inputControl}>
                <View style={{flexDirection: 'row', gap: 15, alignItems: 'center'}}>
                  <Text style={styles.inputText}>Ref No</Text>
                  <Text style={styles.inputTextValue}>PZ 16</Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#151779" />
              </TouchableOpacity>
            </View>

          </View>

          <View style={styles.saveBtnContainer}>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Navigation handled by _layout.tsx */}

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 100,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#2A2A86",
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    marginBottom: 30,
    gap: 20,
  },
  inputGroup: {
    gap: 10,
  },
  inputLabel: {
    color: "#2A2A86",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  inputControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(182, 219, 255, 0.6)",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  inputText: {
    color: "#1C1C65",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputTextValue: {
    color: "#1C1C65",
    fontSize: 16,
    fontWeight: "bold",
  },
  stockCounter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  counterValue: {
    color: "#1C1C65",
    fontSize: 18,
    fontWeight: "bold",
  },
  counterBtn: {
    padding: 2,
  },
  saveBtnContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#4228D3",
    width: "70%",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomActionsContainer: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  navItem: {
    padding: 8,
  },
});
