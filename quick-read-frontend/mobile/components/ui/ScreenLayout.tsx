/**
 * ScreenLayout
 * ─────────────────────────────────────────────────────────────────────────────
 * Unified full-screen wrapper used by every screen in the app.
 *
 * • Renders the shared UI_Background.jpeg
 * • Optionally adds the purple LinearGradient overlay (default: true)
 * • Sets StatusBar to light mode
 * • Provides a ScrollView or plain View body
 * • Optionally wraps content in KeyboardAvoidingView
 */
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ScrollViewProps,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

import { Assets, Colors } from "@/constants/theme";

interface ScreenLayoutProps {
  children: React.ReactNode;
  /** Render children inside a ScrollView. Default: true */
  scrollable?: boolean;
  scrollViewProps?: ScrollViewProps;
  /** Extra styles for the inner content container when scrollable=false */
  contentStyle?: ViewStyle;
  /** Wrap in KeyboardAvoidingView. Default: false */
  keyboardAvoiding?: boolean;
  /** Render the purple LinearGradient overlay. Default: true */
  withGradient?: boolean;
}

export default function ScreenLayout({
  children,
  scrollable = true,
  scrollViewProps,
  contentStyle,
  keyboardAvoiding = false,
  withGradient = true,
}: ScreenLayoutProps) {
  const body = scrollable ? (
    <ScrollView showsVerticalScrollIndicator={false} {...scrollViewProps}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  const wrapped = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {body}
    </KeyboardAvoidingView>
  ) : (
    body
  );

  return (
    <ImageBackground
      source={Assets.background}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      {withGradient && (
        <LinearGradient
          colors={[Colors.overlay.gradientStart, Colors.overlay.gradientEnd]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
      )}
      {wrapped}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  flex: { flex: 1 },
});
