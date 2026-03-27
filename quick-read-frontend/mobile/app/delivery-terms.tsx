import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DeliveryTermsScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/UI_Background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <StatusBar style="light" />

        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Terms & Conditions</Text>
            <Text style={styles.subtitle}>Last Updated: February 4, 2026</Text>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
              <Text style={styles.paragraph}>
                By accessing and using the QuickRead delivery partner
                application, you accept and agree to be bound by these Terms and
                Conditions. If you do not agree to these terms, please do not
                use the application.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Eligibility</Text>
              <Text style={styles.paragraph}>
                To use this service, you must:
              </Text>
              <Text style={styles.bulletPoint}>
                • Be at least 18 years of age
              </Text>
              <Text style={styles.bulletPoint}>
                • Have a valid driver&apos;s license
              </Text>
              <Text style={styles.bulletPoint}>
                • Own or have legal access to a delivery vehicle
              </Text>
              <Text style={styles.bulletPoint}>
                • Provide accurate registration information
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                3. Delivery Partner Responsibilities
              </Text>
              <Text style={styles.paragraph}>
                As a delivery partner, you agree to:
              </Text>
              <Text style={styles.bulletPoint}>
                • Complete deliveries in a timely and professional manner
              </Text>
              <Text style={styles.bulletPoint}>
                • Handle all packages with care
              </Text>
              <Text style={styles.bulletPoint}>
                • Maintain your vehicle in safe working condition
              </Text>
              <Text style={styles.bulletPoint}>
                • Follow all traffic laws and regulations
              </Text>
              <Text style={styles.bulletPoint}>
                • Provide excellent customer service
              </Text>
              <Text style={styles.bulletPoint}>
                • Maintain accurate records of deliveries
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Payment Terms</Text>
              <Text style={styles.paragraph}>
                Delivery partners will be compensated according to the agreed
                payment schedule. Payments are processed weekly and include:
              </Text>
              <Text style={styles.bulletPoint}>
                • Base delivery fee per completed delivery
              </Text>
              <Text style={styles.bulletPoint}>
                • Distance-based compensation
              </Text>
              <Text style={styles.bulletPoint}>
                • Tips received from customers
              </Text>
              <Text style={styles.bulletPoint}>
                • Bonus incentives for high performance
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Account Security</Text>
              <Text style={styles.paragraph}>
                You are responsible for maintaining the confidentiality of your
                account credentials. You must notify QuickRead immediately of
                any unauthorized use of your account or security breach.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                6. Insurance and Liability
              </Text>
              <Text style={styles.paragraph}>
                Delivery partners must maintain appropriate insurance coverage
                for their vehicle and deliveries. QuickRead is not liable for
                damages, injuries, or losses incurred during delivery operations
                unless caused by QuickRead&apos;s negligence.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                7. Data Collection and Privacy
              </Text>
              <Text style={styles.paragraph}>
                We collect location data, delivery information, and performance
                metrics to improve our service. All data is handled in
                accordance with our Privacy Policy and applicable data
                protection laws.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Termination</Text>
              <Text style={styles.paragraph}>
                QuickRead reserves the right to suspend or terminate your
                account at any time for violation of these terms, fraudulent
                activity, or other misconduct. You may also terminate your
                account at any time by contacting support.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
              <Text style={styles.paragraph}>
                QuickRead may update these Terms and Conditions at any time. We
                will notify you of significant changes via email or in-app
                notification. Continued use of the service after changes
                constitutes acceptance of the new terms.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>10. Dispute Resolution</Text>
              <Text style={styles.paragraph}>
                Any disputes arising from these terms will be resolved through
                binding arbitration in accordance with applicable laws. Both
                parties agree to waive their right to a jury trial.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>11. Contact Information</Text>
              <Text style={styles.paragraph}>
                For questions about these Terms and Conditions, please contact:
              </Text>
              <Text style={styles.bulletPoint}>Email: legal@quickread.com</Text>
              <Text style={styles.bulletPoint}>Phone: +1 (234) 567-890</Text>
              <Text style={styles.bulletPoint}>
                Address: 123 Delivery Street, City, State 12345
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => router.back()}
          >
            <Text style={styles.acceptButtonText}>I Accept</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  backButtonContainer: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  titleContainer: { paddingHorizontal: 20, marginTop: 120, marginBottom: 30 },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.80)" },
  contentContainer: { paddingHorizontal: 20 },
  section: {
    marginBottom: 25,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 15,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 24,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 24,
    paddingLeft: 10,
    marginBottom: 8,
  },
  acceptButton: {
    backgroundColor: "#7B6FD8",
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#7B6FD8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  acceptButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
