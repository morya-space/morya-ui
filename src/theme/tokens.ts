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

export interface MotionTokens {
  fast: string;
  normal: string;
  ease: string;
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
  motion: {
    fast: "150ms",
    normal: "250ms",
    ease: "cubic-bezier(0.2, 0, 0, 1)",
  },
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
