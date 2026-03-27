/**
 * BackButton
 * ─────────────────────────────────────────────────────────────────────────────
 * Standard back-navigation button used on overlay screens.
 * Renders a semi-transparent white circle with a chevron icon.
 */
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";

import { Colors, Radius } from "@/constants/theme";

interface BackButtonProps extends TouchableOpacityProps {
  /** Override default router.back() */
  onPress?: () => void;
  /** Icon colour. Defaults to dark so it reads on the white circle bg. */
  color?: string;
  /** Icon size. Default: 24 */
  size?: number;
}

export default function BackButton({
  onPress,
  color = Colors.neutral[700],
  size = 24,
  style,
  ...props
}: BackButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress ?? (() => router.back())}
      activeOpacity={0.7}
      {...props}
    >
      <Ionicons name="chevron-back" size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255, 255, 255, 0.90)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
