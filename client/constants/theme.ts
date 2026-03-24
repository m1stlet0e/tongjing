export const Colors = {
  light: {
    textPrimary: "#1A1A2E",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    primary: "#002FA7", // 克莱因蓝 - 专业、深邃、艺术
    accent: "#C9A96E", // 香槟金 - 高端点缀
    success: "#10B981",
    error: "#EF4444",
    backgroundRoot: "#F8F6F2", // 米金白背景
    backgroundDefault: "#FFFFFF",
    backgroundTertiary: "#F3F1ED", // 去线留白
    buttonPrimaryText: "#FFFFFF",
    tabIconSelected: "#002FA7",
    border: "#E5E5E0",
    borderLight: "#F0EDE7",
  },
  dark: {
    textPrimary: "#FAFAF9",
    textSecondary: "#A8A29E",
    textMuted: "#6F767E",
    primary: "#002FA7", // 克莱因蓝 - 保持一致
    accent: "#C9A96E", // 香槟金 - 高端点缀
    success: "#34D399",
    error: "#F87171",
    backgroundRoot: "#0A0A0F", // 深空黑背景 - 让照片成为焦点
    backgroundDefault: "#1A1A2E", // 深蓝黑卡片背景
    backgroundTertiary: "#1F1F2E", // 去线留白背景
    buttonPrimaryText: "#FFFFFF",
    tabIconSelected: "#002FA7",
    border: "#2A2A3E",
    borderLight: "#1F1F2E",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 112,
    lineHeight: 112,
    fontWeight: "200" as const,
    letterSpacing: -4,
  },
  displayLarge: {
    fontSize: 112,
    lineHeight: 112,
    fontWeight: "200" as const,
    letterSpacing: -2,
  },
  displayMedium: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "200" as const,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "300" as const, // 极细字重 - 高定感
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  smallMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  captionMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  labelSmall: {
    fontSize: 11, // 极小字重 - 奢侈品感
    lineHeight: 16,
    fontWeight: "300" as const, // 极细字重
    letterSpacing: 6, // 大字间距
    textTransform: "uppercase" as const,
  },
  labelTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  stat: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "300" as const,
  },
  tiny: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "400" as const,
  },
  navLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "500" as const,
  },
  // 技术参数专用 - 等宽字体风格
  exifParam: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
    fontFamily: "monospace" as const,
  },
};

export type Theme = typeof Colors.light;
