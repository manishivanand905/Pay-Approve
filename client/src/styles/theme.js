const theme = {
  // ─── Colors ────────────────────────────────────────────────────────────────
  colors: {
    // Backgrounds
    bgPrimary: "#0f1117", // main page background
    bgSecondary: "#161b27", // sidebar background
    bgCard: "#1c2333", // cards, table rows background
    bgHover: "#222b3d", // hover state for rows / nav items
    bgInput: "#1a2236", // input fields background
    bgModal: "#1c2333", // modal background

    // Borders
    border: "#2a3448", // default border
    borderLight: "#334060", // slightly lighter border for inputs

    // Text
    textPrimary: "#e8edf5", // main text
    textSecondary: "#8b97b0", // subtitles, labels
    textMuted: "#4f5d78", // placeholders, disabled

    // Brand Accent
    accent: "#3b7eff", // primary blue (buttons, active nav)
    accentHover: "#5c93ff", // hover state for accent
    accentSoft: "#3b7eff1a", // very light accent bg (badge backgrounds)

    // Status Colors
    success: "#22c55e", // Paid / Approved / Head Approved
    successSoft: "#22c55e1a", // light success bg
    warning: "#f59e0b", // Pending / On Hold
    warningSoft: "#f59e0b1a", // light warning bg
    danger: "#ef4444", // Rejected
    dangerSoft: "#ef44441a", // light danger bg
    info: "#06b6d4", // Manager Approved
    infoSoft: "#06b6d41a", // light info bg
    purple: "#a78bfa", // escalated / finance head accent
    purpleSoft: "#a78bfa1a",

    // Sidebar
    sidebarBg: "#161b27",
    sidebarActive: "#1e2d47",
    sidebarText: "#8b97b0",
    sidebarTextActive: "#e8edf5",
    sidebarBorder: "#1f2a3d",

    // Table
    tableHeader: "#161b27",
    tableRowHover: "#1e2a40",
    tableBorder: "#1f2a3d",

    // White / Black
    white: "#ffffff",
    black: "#000000",
  },

  // ─── Typography ────────────────────────────────────────────────────────────
  fonts: {
    main: `'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif`,
    mono: `'DM Mono', 'Courier New', monospace`,
  },

  fontSizes: {
    xs: "11px",
    sm: "13px",
    md: "14px",
    lg: "16px",
    xl: "18px",
    "2xl": "22px",
    "3xl": "28px",
    "4xl": "36px",
  },

  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // ─── Spacing ───────────────────────────────────────────────────────────────
  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    7: "28px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
  },

  // ─── Layout ────────────────────────────────────────────────────────────────
  layout: {
    sidebarWidth: "240px",
    sidebarCollapsed: "64px",
    contentMaxWidth: "1200px",
    headerHeight: "60px",
    pageHorizontalPad: "32px",
    pageVerticalPad: "32px",
  },

  // ─── Border Radius ─────────────────────────────────────────────────────────
  radii: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },

  // ─── Shadows ───────────────────────────────────────────────────────────────
  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.3)",
    md: "0 4px 12px rgba(0,0,0,0.4)",
    lg: "0 8px 24px rgba(0,0,0,0.5)",
    card: "0 2px 8px rgba(0,0,0,0.35)",
    modal: "0 16px 48px rgba(0,0,0,0.6)",
    accent: "0 0 0 3px rgba(59,126,255,0.2)",
  },

  // ─── Transitions ───────────────────────────────────────────────────────────
  transitions: {
    fast: "0.1s ease",
    normal: "0.2s ease",
    slow: "0.35s ease",
  },

  // ─── Z-Index ───────────────────────────────────────────────────────────────
  zIndex: {
    base: 0,
    above: 1,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    toast: 400,
  },

  // ─── Status Map (for StatusBadge component) ────────────────────────────────
  statusColors: {
    pending: {
      color: "#f59e0b",
      bg: "#f59e0b1a",
      label: "Pending",
    },
    manager_approved: {
      color: "#06b6d4",
      bg: "#06b6d41a",
      label: "Manager Approved",
    },
    head_approved: {
      color: "#22c55e",
      bg: "#22c55e1a",
      label: "Head Approved",
    },
    paid: {
      color: "#22c55e",
      bg: "#22c55e1a",
      label: "Paid",
    },
    partially_paid: {
      color: "#a78bfa",
      bg: "#a78bfa1a",
      label: "Partially Paid",
    },
    rejected: {
      color: "#ef4444",
      bg: "#ef44441a",
      label: "Rejected",
    },
    on_hold: {
      color: "#f59e0b",
      bg: "#f59e0b1a",
      label: "On Hold",
    },
    escalated: {
      color: "#a78bfa",
      bg: "#a78bfa1a",
      label: "Escalated",
    },
  },

  // ─── Role Color Map (for role badges / avatars) ────────────────────────────
  roleColors: {
    requester: {
      color: "#3b7eff",
      bg: "#3b7eff1a",
    },
    finance_manager: {
      color: "#22c55e",
      bg: "#22c55e1a",
    },
    finance_head: {
      color: "#f59e0b",
      bg: "#f59e0b1a",
    },
    banker: {
      color: "#a78bfa",
      bg: "#a78bfa1a",
    },
    admin: {
      color: "#06b6d4",
      bg: "#06b6d41a",
    },
  },
};

export default theme;
