import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback } from "react";
import config from "@/constants/config";
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Sample medicine data
const MEDICINES_DATA = [
  {
    id: "1",
    name: "Paracetamol",
    icon: "💊",
    description: [
      "It helps with headaches, muscle aches, toothache, colds, and fever.",
      "It is generally gentle on the stomach.",
      "Taking too much can harm the liver, so doses must be followed carefully.",
    ],
  },
  {
    id: "2",
    name: "Ibuprofen",
    icon: "💊",
    description: [
      "Reduces pain, inflammation, and fever.",
      "Commonly used for headaches, dental pain, and arthritis.",
      "Should be taken with food to avoid stomach upset.",
    ],
  },
  {
    id: "3",
    name: "Amoxicillin",
    icon: "💊",
    description: [
      "An antibiotic used to treat bacterial infections.",
      "Effective for ear, nose, throat, and skin infections.",
      "Complete the full course even if you feel better.",
    ],
  },
  {
    id: "4",
    name: "Aspirin",
    icon: "💊",
    description: [
      "Used for pain relief and reducing fever.",
      "Also helps prevent blood clots.",
      "Not recommended for children under 16.",
    ],
  },
  {
    id: "5",
    name: "Piriton",
    icon: "💊",
    description: [
      "Piriton is an antihistamine used to treat allergies.",
      "It helps relieve sneezing, itching, and rashes.",
      "It may cause drowsiness.",
    ],
  },
];

export default function SearchMedicineScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("Patient");
  const [currentDate] = useState(new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '. '));
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState<typeof MEDICINES_DATA>([]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem("fullName");
        if (storedName) {
          setUserName(storedName);
        }
      } catch (error) {
        if (__DEV__) console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []);

  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadProfileImage = async () => {
        const pic = await AsyncStorage.getItem("profilePicture");
        if (pic) setProfilePicture(pic);
      };
      loadProfileImage();
    }, [])
  );

  const getImageUrl = (path: string | null) => {
    if (!path) return "https://i.pravatar.cc/150?img=5";
    if (path.startsWith("http")) return path;
    return `${config.apiUrl.replace('/api', '')}${path}`;
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredMedicines([]);
    } else {
      const query = text.toLowerCase().trim();
      const filtered = MEDICINES_DATA.filter((medicine) =>
        medicine.name.toLowerCase().startsWith(query),
      );
      setFilteredMedicines(filtered);
    }
  };

  const renderMedicineCard = ({
    item,
  }: {
    item: (typeof MEDICINES_DATA)[0];
  }) => (
    <View style={styles.medicineCard}>
      {/* Medicine Icon */}
      <View style={styles.medicineIconContainer}>
        <View style={styles.medicineIconCircle}>
          <MaterialCommunityIcons name="medical-bag" size={45} color="#FFFFFF" />
        </View>
      </View>

      {/* Medicine Name */}
      <Text style={styles.medicineName}>{item.name}</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Medicine Description */}
      <View style={styles.descriptionContainer}>
        {item.description.map((desc, index) => (
          <Text key={String(index)} style={styles.descriptionText}>
            {desc}
          </Text>
        ))}
      </View>

      {/* Action Button */}
      <TouchableOpacity style={styles.viewDetailsButton} activeOpacity={0.7}>
        <Text style={styles.viewDetailsText}>Copy</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("@/assets/images/UI_Background.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={["rgba(139, 152, 255, 0.5)", "rgba(88, 130, 255, 0.5)"]}
          style={styles.gradientOverlay}
        />

        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require("@/assets/images/quick-read-logo.png")}
                  style={styles.headerLogo}
                  resizeMode="contain"
                  tintColor="#FFFFFF"
                />
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/patient-profile')}>
                  <Image
                    source={{ uri: getImageUrl(profilePicture) }}
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.notificationButton}
                  onPress={() => router.push("/patient-notifications")}
                >
                  <Ionicons name="notifications" size={24} color="#FFFFFF" />
                  <View style={styles.notificationBadge} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.headerBottom}>
              <Text style={styles.helloText}>
                <Text style={styles.userNameHeader}>Search Medicine</Text>
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search medicine"
              placeholderTextColor="rgba(255, 255, 255, 0.9)"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <MaterialCommunityIcons
              name="feature-search-outline"
              size={28}
              color="#FFFFFF"
              style={styles.searchIcon}
            />
          </View>

          {/* Medicine List */}
          <FlatList
            data={filteredMedicines}
            renderItem={renderMedicineCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery.trim() === ""
                    ? "Search for a medicine to see its details"
                    : "No medicines found"}
                </Text>
              </View>
            }
          />
        </View>

        {/* Remove manual Bottom Nav - now in _layout.tsx */}
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
  content: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 25,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoWrapper: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerLogo: {
    width: 140,
    height: 40,
    marginLeft: -25,
  },
  headerBottom: {
    marginTop: 5,
  },
  helloText: {
    fontSize: 26,
    color: "#FFFFFF",
    fontWeight: "400",
    fontFamily: "InstrumentSans_500Medium",
    lineHeight: 32,
  },
  userNameHeader: {
    fontSize: 26,
    color: "#5409DA",
    fontWeight: "700",
    fontFamily: "InstrumentSans_700Bold",
  },
  dateText: {
    fontSize: 14,
    color: "#E0E7FF",
    marginTop: 4,
    fontFamily: "InstrumentSans_500Medium",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#5409DA",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF4444",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  searchContainer: {
    backgroundColor: "rgba(200, 180, 255, 0.3)",
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "instrument-sans-500",
  },
  searchIcon: {
    marginLeft: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  medicineCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 40,
    padding: 30,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    alignItems: "center",
  },
  medicineIconContainer: {
    marginBottom: 20,
  },
  medicineIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFC107",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  medicineIconEmoji: {
    fontSize: 45,
  },
  medicineName: {
    fontSize: 26,
    fontWeight: "700",
    fontFamily: "instrument-sans-700",
    color: "#5409DA",
    marginBottom: 15,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginBottom: 25,
  },
  descriptionContainer: {
    width: "100%",
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
    marginBottom: 15,
    fontFamily: "instrument-sans-700",
    fontWeight: "600",
    textAlign: "left",
  },
  viewDetailsButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    alignSelf: "flex-end",
  },
  viewDetailsText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "instrument-sans-700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});
