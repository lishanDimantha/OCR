/**
 * AppInput
 * ─────────────────────────────────────────────────────────────────────────────
 * Standardised text input used across all screens.
 *
 * theme prop:
 *   'glass'  — semi-transparent white, white text/icons (for dark bg screens, default)
 *   'solid'  — opaque white, dark text/icons   (for light / card bg screens)
 */
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

import { Colors, Radius, Spacing, Typography } from "@/constants/theme";

interface AppInputProps extends TextInputProps {
  /** Ionicons name for leading icon */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Ionicons name for trailing icon (e.g. eye toggle) */
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  onTrailingIconPress?: () => void;
  /** Optional label rendered above the input row */
  label?: string;
  containerStyle?: ViewStyle;
  /** Visual theme. Default: 'glass' */
  theme?: "glass" | "solid";
}

export default function AppInput({
  icon,
  trailingIcon,
  onTrailingIconPress,
  label,
  containerStyle,
  theme = "glass",
  style,
  ...props
}: AppInputProps) {
  const isGlass = theme === "glass";

  const bg = isGlass ? Colors.overlay.cardMd : Colors.neutral.white;
  const textColor = isGlass ? Colors.neutral.white : Colors.neutral[900];
  const placeholder = isGlass ? "rgba(255,255,255,0.60)" : Colors.neutral[300];
  const iconColor = isGlass ? "rgba(255,255,255,0.70)" : Colors.neutral[400];

  return (
    <View style={containerStyle}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: isGlass ? Colors.neutral.white : Colors.neutral[700] },
          ]}
        >
          {label}
        </Text>
      )}
      <View style={[styles.row, { backgroundColor: bg }]}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={iconColor}
            style={styles.leadIcon}
          />
        )}
        <TextInput
          style={[Typography.bodyLG, styles.input, { color: textColor }, style]}
          placeholderTextColor={placeholder}
          {...props}
        />
        {trailingIcon && (
          <TouchableOpacity
            onPress={onTrailingIconPress}
            style={styles.trailBtn}
          >
            <Ionicons name={trailingIcon} size={20} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...Typography.labelMD,
    marginBottom: Spacing.xs,
    marginLeft: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.base,
    height: 54,
    marginBottom: Spacing.md,
  },
  leadIcon: { marginRight: Spacing.sm },
  input: { flex: 1 },
  trailBtn: { padding: Spacing.xs },
});
