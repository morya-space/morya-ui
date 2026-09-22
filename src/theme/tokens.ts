export interface ColorTokens {
  primary: string;
  primaryHover: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  focusRing: string;
}

export interface SpacingTokens {
  1: string;
  2: string;
  3: string;
  4: string;
  6: string;
  8: string;
}

export interface RadiusTokens {
  sm: string;
  md: string;
  lg: string;
  full: string;
}

/** JS mirror of `--m-motion-*` (CSS in `theme/styles.css` is authoritative). */
export interface MotionTokens {
  fast: string;
  normal: string;
  ease: string;
  enter: string;
  exit: string;
  distance: string;
  spin: string;
  spinDash: string;
  spinFast: string;
  spinMedium: string;
  skeleton: string;
  pulse: string;
  scrollbarShow: string;
  scrollbarHide: string;
  loadingAurora: string;
  loadingBounce: string;
  loadingPulse: string;
  loadingStardust: string;
  loadingCircularRotate: string;
}

export interface LayoutTokens {
  height: string;
  headerHeight: string;
  footerHeight: string;
  siderWidth: string;
  siderCollapsedWidth: string;
  padding: string;
  radius: string;
  borderWidth: string;
}

export interface DesignTokens {
  color: ColorTokens;
  space: SpacingTokens;
  radius: RadiusTokens;
  fontSans: string;
  motion: MotionTokens;
  layout: LayoutTokens;
}

const motionTokens: MotionTokens = {
  fast: "150ms",
  normal: "250ms",
  ease: "cubic-bezier(0.2, 0, 0, 1)",
  enter: "180ms",
  exit: "130ms",
  distance: "1rem",
  spin: "1s",
  spinDash: "1.5s",
  spinFast: "0.8s",
  spinMedium: "0.7s",
  skeleton: "1.4s",
  pulse: "1.2s",
  scrollbarShow: "340ms",
  scrollbarHide: "120ms",
  loadingAurora: "3s",
  loadingBounce: "0.6s",
  loadingPulse: "1.8s",
  loadingStardust: "1.6s",
  loadingCircularRotate: "2s",
};

export const lightTokens: DesignTokens = {
  color: {
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    surface: "#ffffff",
    text: "#0f172a",
    textMuted: "#64748b",
    border: "#e2e8f0",
    focusRing: "#2563eb",
  },
  space: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    6: "1.5rem",
    8: "2rem",
  },
  radius: { sm: "0.25rem", md: "0.5rem", lg: "0.75rem", full: "9999px" },
  fontSans: "Inter, ui-sans-serif, system-ui, sans-serif",
  motion: motionTokens,
  layout: {
    height: "100%",
    headerHeight: "56px",
    footerHeight: "48px",
    siderWidth: "272px",
    siderCollapsedWidth: "48px",
    padding: "0",
    radius: "0",
    borderWidth: "1px",
  },
};

export const darkTokens: DesignTokens = {
  ...lightTokens,
  color: {
    ...lightTokens.color,
    primary: "#60a5fa",
    primaryHover: "#93c5fd",
    surface: "#0f172a",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    border: "#334155",
    focusRing: "#93c5fd",
  },
};
