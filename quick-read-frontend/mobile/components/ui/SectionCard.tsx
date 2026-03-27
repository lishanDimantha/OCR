/**
 * SectionCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Standard white card used to group content on overlay-background screens.
 *
 * variant:
 *   'solid' — fully opaque white card (default)
 *   'glass' — semi-transparent white glass card
 */
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { Colors, Radius, Shadows, Spacing } from "@/constants/theme";

interface SectionCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "solid" | "glass";
}

export default function SectionCard({
  children,
  style,
  variant = "solid",
}: SectionCardProps) {
  const bg = variant === "glass" ? Colors.overlay.cardMd : Colors.neutral.white;

  return (
    <View style={[styles.card, { backgroundColor: bg }, Shadows.md, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
});
