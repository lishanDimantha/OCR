import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
/**
 * Welcome Screen
 * The landing page for the Quick Read app
 * Shows the app branding and a "Get Started" button
 */
export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth-entry");
  };

  return (
    <ImageBackground
      source={require("@/assets/images/UI_Background.jpeg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Logo and Branding */}
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/quick-read-logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.welcomeHeading}>Welcome to Quick Read!</Text>
        </View>

        {/* Service Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>SMART PHARMACY</Text>
          <Text style={styles.descriptionText}>AND</Text>
          <Text style={styles.descriptionText}>PRESCRIPTION SCANNER</Text>
        </View>

        {/* Feature Icons */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Image
              source={require("@/assets/images/prescription-scanning .png")}
              style={styles.featureImage}
              resizeMode="contain"
            />
            <Text style={styles.featureLabel}> Scan</Text>
          </View>

          <View style={styles.featureItem}>
            <Image
              source={require("@/assets/images/Order-medicines png.png")}
              style={styles.featureImage}
              resizeMode="contain"
            />
            <Text style={styles.featureLabel}>Order </Text>
          </View>

          <View style={styles.featureItem}>
            <Image
              source={require("@/assets/images/pharmacy.png")}
              style={styles.featureImage}
              resizeMode="contain"
            />
            <Text style={styles.featureLabel}>Select Pharmacy</Text>
          </View>
        </View>

        {/* Get Started Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#7C3AED", "#6D28D9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoImage: {
    width: 230,
    height: 130,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3aedba",
    marginBottom: 4,
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#7C3AED",
    marginBottom: 8,
    letterSpacing: 2,
  },
  brandTagline: {
    fontSize: 12,
    color: "#A78BFA",
    letterSpacing: 2,
  },
  headingContainer: {
    marginBottom: 32,
  },
  welcomeHeading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1A1A9E",
    textAlign: "center",
    lineHeight: 40,
  },
  descriptionContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  descriptionText: {
    fontSize: 16,
    color: "#1A1A9E",
    fontWeight: "600",
    marginVertical: 2,
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 10,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 0,
  },
  featureItem: {
    alignItems: "center",
  },
  featureIcon: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  featureImage: {
    width: 90,
    height: 95,
    
  },
  featureLabel: {
    fontSize: 12,
    color: "#1A1A9E",
    fontWeight: "600",
    marginTop: 2,
    marginLeft: 15,

    
  },
  buttonContainer: {
    marginTop: "auto",
  },
  button: {
    overflow: "hidden",
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 8,
  },
});
