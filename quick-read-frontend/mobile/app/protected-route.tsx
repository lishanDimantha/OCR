import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Slot } from "expo-router";

export default function ProtectedRoute() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        router.replace("/auth-entry");
      }
    };
    checkAuth();
  }, []);

  return <Slot />;
}
