// =============================================================================
// QuickRead Design System — Single source of truth for all visual tokens
// =============================================================================

// ─── Colour Palette ──────────────────────────────────────────────────────────

/**
 * Primary brand colours and semantic colours used across all three roles
 * (Pharmacy, Patient, Delivery).
 */
export const Colors = {
  // Brand
  brand: {
    primary: "#7B6FD8", // Main purple — buttons, cards, stat chips
    dark: "#1E2A78", // Deep navy — page headings, header bar
    accent: "#5A4FBB", // Active / pressed state
    light: "#EEF0FF", // Light purple surface
    muted: "#B8B8D1", // Inactive text, secondary links
  },

  // Semantic
  semantic: {
    danger: "#E03030", // Emergency, delete, error
    warning: "#E8A020", // Income, caution, amber
    success: "#22C55E", // Confirmed, ok, online
    info: "#3B82F6", // Informational
  },

  // Neutral scale
  neutral: {
    900: "#111827",
    700: "#374151",
    600: "#4A5568",
    400: "#6B7280",
    300: "#9CA3AF",
    200: "#D1D5DB",
    100: "#F3F4F6",
    50: "#F8FAFF",
    white: "#FFFFFF",
  },

  // Overlay / glass layers
  overlay: {
    /** Purple gradient start — used with LinearGradient */
    gradientStart: "rgba(74, 63, 155, 0.45)",
    /** Purple gradient end — used with LinearGradient */
    gradientEnd: "rgba(30, 42, 120, 0.45)",
    /** Low-opacity dark scrim */
    dark: "rgba(0, 0, 0, 0.35)",
    /** Subtle white glass — used for back-button circles etc. */
    light: "rgba(255, 255, 255, 0.18)",
    /** Glass card (low opacity) */
    card: "rgba(255, 255, 255, 0.18)",
    /** Glass card (medium opacity) — used for input rows */
    cardMd: "rgba(255, 255, 255, 0.65)",
    /** Almost-opaque white — used for bottom nav bar */
    cardHi: "rgba(255, 255, 255, 0.97)",
  },
};

// ─── Typography Scale ─────────────────────────────────────────────────────────

export const Typography = {
  displayLG: { fontSize: 28, fontWeight: "700" as const, lineHeight: 36 },
  displayMD: { fontSize: 24, fontWeight: "700" as const, lineHeight: 32 },
  headingLG: { fontSize: 22, fontWeight: "600" as const, lineHeight: 30 },
  headingMD: { fontSize: 18, fontWeight: "600" as const, lineHeight: 26 },
  headingSM: { fontSize: 16, fontWeight: "600" as const, lineHeight: 22 },
  bodyLG: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  bodyMD: { fontSize: 14, fontWeight: "400" as const, lineHeight: 21 },
  bodySM: { fontSize: 12, fontWeight: "400" as const, lineHeight: 18 },
  labelLG: { fontSize: 15, fontWeight: "600" as const, lineHeight: 22 },
  labelMD: { fontSize: 13, fontWeight: "500" as const, lineHeight: 18 },
  buttonLG: { fontSize: 18, fontWeight: "700" as const, letterSpacing: 0.5 },
  buttonMD: { fontSize: 15, fontWeight: "600" as const, letterSpacing: 0.3 },
  buttonSM: { fontSize: 13, fontWeight: "600" as const, letterSpacing: 0.2 },
};

// ─── Spacing Scale ────────────────────────────────────────────────────────────

/** 4-pt base grid */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// ─── Border Radius ────────────────────────────────────────────────────────────

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  pill: 999,
};

// ─── Shadow Presets ───────────────────────────────────────────────────────────

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
  /** Used for bottom navigation bars */
  nav: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 12,
  },
};

// ─── Centralised Asset Paths ──────────────────────────────────────────────────
// Import via:  import { Assets } from '@/constants/theme'
// Then use:    source={Assets.background}

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const Assets = {
  background: require("@/assets/images/UI_Background.jpeg") as number,
  logo: require("@/assets/images/quick-read-logo.png") as number,
  icons: {
    patient: require("@/assets/icons/patient.png") as number,
    pharmacy: require("@/assets/icons/pharmacy.png") as number,
    delivery: require("@/assets/icons/delivery.png") as number,
  },
};

// ─── Legacy re-export (keeps existing imports working) ───────────────────────
export const Fonts = {
  sans: "normal" as const,
  serif: "serif" as const,
  mono: "monospace" as const,
};
