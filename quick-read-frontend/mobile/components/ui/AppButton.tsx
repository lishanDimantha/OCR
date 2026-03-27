/**
 * AppButton
 * ─────────────────────────────────────────────────────────────────────────────
 * Standardised button used across all roles and screens.
 *
 * Variants:
 *   primary   — brand purple fill (default)
 *   secondary — dark navy fill
 *   outline   — transparent fill with purple border
 *   danger    — red fill (delete / logout)
 *   ghost     — no background, just coloured text
 */
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from "react-native";

import {
    Colors,
    Radius,
    Shadows,
    Spacing,
    Typography,
} from "@/constants/theme";

type Variant = "primary" | "secondary" | "outline" | "danger" | "ghost";

interface AppButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  loading?: boolean;
  /** Stretch to fill parent width. Default: true */
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const VARIANT_STYLE: Record<
  Variant,
  { bg: string; text: string; border?: string }
> = {
  primary: { bg: Colors.brand.primary, text: Colors.neutral.white },
  secondary: { bg: Colors.brand.dark, text: Colors.neutral.white },
  outline: {
    bg: "transparent",
    text: Colors.brand.primary,
    border: Colors.brand.primary,
  },
  danger: { bg: Colors.semantic.danger, text: Colors.neutral.white },
  ghost: { bg: "transparent", text: Colors.brand.muted },
};

export default function AppButton({
  label,
  variant = "primary",
  loading = false,
  fullWidth = true,
  style,
  textStyle,
  disabled,
  ...props
}: AppButtonProps) {
  const v = VARIANT_STYLE[variant];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        { backgroundColor: v.bg, alignSelf: fullWidth ? "stretch" : "center" },
        v.border ? { borderWidth: 1.5, borderColor: v.border } : undefined,
        Shadows.md,
        disabled || loading ? styles.disabled : undefined,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.82}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <Text style={[Typography.buttonLG, { color: v.text }, textStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  disabled: { opacity: 0.6 },
});
