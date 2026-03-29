import { Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import config from "@/constants/config";

/**
 * Registers the device for push notifications (Expo Push Notifications).
 * Returns the Expo push token string, or null if registration fails.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    // Push notifications only work on physical devices
    if (Platform.OS === "web") {
      return null;
    }

    // Check / request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Push notification permission not granted.");
      return null;
    }

    // Get the Expo push token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({
      ...(projectId ? { projectId } : {}),
    });

    // Configure notification behaviour when app is foregrounded
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    return tokenData.data; // e.g. "ExponentPushToken[xxxx]"
  } catch (error) {
    console.warn("Failed to register for push notifications:", error);
    return null;
  }
}

/**
 * Sends the push token to the backend so it can be stored against the
 * currently-authenticated user (via the profile-update endpoint).
 */
export async function savePushToken(pushToken: string): Promise<void> {
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    if (!userToken) {
      console.warn("No auth token found – cannot save push token.");
      return;
    }

    await fetch(`${config.apiUrl}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ push_token: pushToken }),
    });
  } catch (error) {
    console.warn("Failed to save push token to backend:", error);
  }
}
