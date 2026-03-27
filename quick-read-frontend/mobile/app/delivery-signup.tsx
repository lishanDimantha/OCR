import { FontAwesome5 } from "@expo/vector-icons";
import { InstrumentSans_500Medium, InstrumentSans_700Bold, useFonts } from "@expo-google-fonts/instrument-sans";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import config from "@/constants/config";

/**
 * Delivery Sign Up Screen
 * Allows new delivery partners to create an account.
 */

export default function DeliverySignUpScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ InstrumentSans_500Medium, InstrumentSans_700Bold });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  
  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !vehicleNo.trim()) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          address: vehicleNo, // Using vehicleNo as address/details for delivery
          role: "delivery",
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setPendingEmail(email);
        setShowOTP(true);
        Alert.alert("Success", "Registration successful. Please enter the OTP sent to your email.");
      } else {
        Alert.alert("Signup Failed", result.message || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, otp }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "OTP verified! You can now login.", [
          { text: "OK", onPress: () => router.replace("/delivery-login") }
        ]);
      } else {
        Alert.alert("Verification Failed", result.message || "Invalid OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/UI_Background.jpeg")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
        </View>

        {/* Logo */}
        <View style={styles.logoSection}>
          <Image
            source={require("@/assets/images/quick-read-logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Sign up for a delivery{"\n"}account</Text>

        <View style={styles.formContainer}>
          {showOTP ? (
            <View>
              <Text style={{color: 'rgba(26, 26, 158, 1)', marginBottom: 20, textAlign: 'center', fontWeight: '600', fontSize: 16}}>
                Enter the code sent to {pendingEmail}
              </Text>
              <LinearGradient
                colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.1)"]}
                locations={[0.0073, 0.4997, 0.992]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.inputGradientBorder}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  placeholderTextColor="rgba(26, 26, 158, 0.8)"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                />
              </LinearGradient>

              <TouchableOpacity onPress={handleVerifyOTP} activeOpacity={0.85} disabled={loading}>
                <LinearGradient
                  colors={["rgba(133, 77, 253, 1)", "rgba(61, 36, 153, 1)"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.signUpButton}
                >
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.signUpButtonText}>VERIFY OTP</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowOTP(false)}>
                <Text style={styles.loginText}>Back to Signup</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Name Input */}
              <LinearGradient
                colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.1)"]}
                locations={[0.0073, 0.4997, 0.992]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.inputGradientBorder}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="rgba(26, 26, 158, 0.8)"
                  value={name}
                  onChangeText={setName}
                />
                <FontAwesome5 name="user-edit" size={17} color="rgba(26, 26, 158, 0.8)" style={styles.inputIcon} />
              </LinearGradient>

              {/* Email Input */}
              <LinearGradient
                colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.1)"]}
                locations={[0.0073, 0.4997, 0.992]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.inputGradientBorder}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="rgba(26, 26, 158, 0.8)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <FontAwesome5 name="user-edit" size={17} color="rgba(26, 26, 158, 0.8)" style={styles.inputIcon} />
              </LinearGradient>

              {/* Password Input */}
              <LinearGradient
                colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.1)"]}
                locations={[0.0073, 0.4997, 0.992]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.inputGradientBorder}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(26, 26, 158, 0.8)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <FontAwesome5 name="user-edit" size={17} color="rgba(26, 26, 158, 0.8)" style={styles.inputIcon} />
              </LinearGradient>

              {/* Vehicle No Input */}
              <LinearGradient
                colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.1)"]}
                locations={[0.0073, 0.4997, 0.992]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.inputGradientBorder}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Vehicle No"
                  placeholderTextColor="rgba(26, 26, 158, 0.8)"
                  value={vehicleNo}
                  onChangeText={setVehicleNo}
                  autoCapitalize="characters"
                />
                <FontAwesome5 name="user-edit" size={17} color="rgba(26, 26, 158, 0.8)" style={styles.inputIcon} />
              </LinearGradient>

              <View style={styles.deliveryIconContainer}>
                <Image
                  source={require("@/assets/images/truck.png")}
                  style={styles.deliveryIcon}
                  resizeMode="contain"
                />
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity onPress={handleSignUp} activeOpacity={0.85} disabled={loading}>
                <LinearGradient
                  colors={["rgba(133, 77, 253, 1)", "rgba(61, 36, 153, 1)"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.signUpButton}
                >
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.signUpButtonText}>SIGN UP</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/delivery-login")}>
                <Text style={styles.loginText}>
                  Already have an account?{" "}
                  <Text style={styles.loginLink}>Log In</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    marginBottom: 20,
  },
  logoSection: { alignItems: "center", marginBottom: 20 },
  logoImage: { width: 220, height: 120 },
  title: {
    fontFamily: "InstrumentSans_500Medium",
    fontSize: 26,
    fontWeight: "500",
    color: "rgba(26, 26, 158, 1)",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 26,
    letterSpacing: 0,
    width: 339,
    alignSelf: "center",
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  inputGradientBorder: {
    width: 351,
    height: 48,
    borderRadius: 30,
    alignSelf: "center",
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 29,
    paddingHorizontal: 18,
  },
  input: {
    flex: 1,
    fontFamily: "InstrumentSans_700Bold",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "left",
    color: "rgba(26, 26, 158, 1)",
  },
  inputIcon: {
    marginLeft: 10,
  },
  deliveryIconContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  deliveryIcon: {
    width: 50,
    height: 50,
  },
  signUpButton: {
    width: 339,
    height: 48,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  signUpButtonText: {
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "italic",
    letterSpacing: 0,
    textAlign: "center",
    color: "rgba(255, 255, 255, 1)",
  },
  loginText: {
    fontFamily: "InstrumentSans_700Bold",
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "italic",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "center",
    color: "rgba(26, 26, 158, 1)",
  },
  loginLink: {
    fontFamily: "InstrumentSans_700Bold",
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "italic",
    color: "rgba(26, 26, 158, 1)",
  },
});
