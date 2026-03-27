import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePathname, useRouter } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import PatientBottomNav from "@/components/PatientBottomNav";
import PharmacyBottomNav from "@/components/PharmacyBottomNav";
import DeliveryBottomNav from "@/components/DeliveryBottomNav";

// Prevent the splash screen from hiding before the root layout is ready.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const router = useRouter();


  // Role-based Nav Logic
  const isPatientRoute = pathname.startsWith("/patient-") ||
    pathname === "/extractedmedicinelist" ||
    pathname === "/history";

  const isPharmacyRoute = pathname.startsWith("/pharmacy-");

  const isDeliveryRoute = pathname.startsWith("/delivery-");

  // Specific exclusions (e.g., login/signup screens shouldn't show nav)
  const isAuthScreen = pathname.includes("login") ||
    pathname.includes("signup") ||
    pathname === "/patient-auth" ||
    pathname === "/auth-entry" ||
    pathname === "/index";

  useEffect(() => {
    const checkSession = async () => {
      // Small Delay to ensure Splash Screen is hidden
      await SplashScreen.hideAsync();
      
      const token = await AsyncStorage.getItem("userToken");
      
      if (!token && !isAuthScreen) {
        // If no token and not an auth screen, redirect to entry
        // We use replace to prevent the current screen from being in the stack
        router.replace("/auth-entry");
      }
    };
    
    checkSession();
  }, [pathname, isAuthScreen]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth-entry" />
          {/* Pharmacy Screens */}
          <Stack.Screen name="pharmacy-login" />
          <Stack.Screen name="pharmacy-inventory" />
          <Stack.Screen name="pharmacy-orders" />
          <Stack.Screen name="pharmacy-scan-prescription" />
          <Stack.Screen name="pharmacy-settings" />
          <Stack.Screen name="pharmacy-notification" />
          {/* Patient Screens */}
          <Stack.Screen name="patient-login" />
          <Stack.Screen name="patient-signup" />
          <Stack.Screen name="patient-auth" />
          <Stack.Screen name="patient-home" />
          <Stack.Screen name="patient-medicines" />
          <Stack.Screen name="patient-profile" />
          <Stack.Screen name="patient-delivery" />
          <Stack.Screen name="patient-settings" />
          <Stack.Screen name="patient-notifications" />
          <Stack.Screen name="patient-payment" />
          <Stack.Screen name="patient-payment-method" />
          <Stack.Screen name="patient-payment-success" />
          <Stack.Screen name="patient-payment-failure" />
          <Stack.Screen name="patient-cash-on-delivery" />
          <Stack.Screen name="patient-koko-payment" />
          {/* Delivery Screens (protected - wrap content in ProtectedRoute inside each screen file) */}
          <Stack.Screen name="delivery-login" />
          <Stack.Screen name="delivery-signup" />
          <Stack.Screen name="delivery-home" />
          <Stack.Screen name="delivery-profile" />
          <Stack.Screen name="delivery-settings" />
          <Stack.Screen name="delivery-notifications" />
          <Stack.Screen name="delivery-edit-profile" />
          <Stack.Screen name="delivery-change-password" />
          <Stack.Screen name="delivery-forgot-password" />
          <Stack.Screen name="delivery-about" />
          <Stack.Screen name="delivery-terms" />
          {/* Shared / Utility Screens */}
          <Stack.Screen name="emergency-pharmacy" />
          <Stack.Screen name="emergency-delivery" />
          <Stack.Screen name="extractedmedicinelist" />
          <Stack.Screen name="history" />
        </Stack>
        {isPatientRoute && !isAuthScreen && <PatientBottomNav />}
        {isPharmacyRoute && !isAuthScreen && <PharmacyBottomNav />}
        {isDeliveryRoute && !isAuthScreen && <DeliveryBottomNav />}
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
