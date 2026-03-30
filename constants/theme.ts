import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#FFFFFF',
    foreground: '#09090B',
    card: '#FFFFFF',
    cardForeground: '#09090B',
    primary: '#18181B',
    primaryForeground: '#FAFAFA',
    secondary: '#F4F4F5',
    secondaryForeground: '#18181B',
    muted: '#F4F4F5',
    mutedForeground: '#71717A',
    accent: '#F4F4F5',
    accentForeground: '#18181B',
    border: '#E4E4E7',
    input: '#E4E4E7',
    destructive: '#EF4444',
    destructiveForeground: '#FAFAFA',
    success: '#22C55E',
    warning: '#F59E0B',
    // aliases
    text: '#09090B',
    textSecondary: '#71717A',
    tint: '#18181B',
    icon: '#71717A',
    tabIconDefault: '#71717A',
    tabIconSelected: '#18181B',
  },
  dark: {
    background: '#09090B',
    foreground: '#FAFAFA',
    card: '#18181B',
    cardForeground: '#FAFAFA',
    primary: '#FAFAFA',
    primaryForeground: '#09090B',
    secondary: '#27272A',
    secondaryForeground: '#FAFAFA',
    muted: '#27272A',
    mutedForeground: '#A1A1AA',
    accent: '#27272A',
    accentForeground: '#FAFAFA',
    border: '#27272A',
    input: '#27272A',
    destructive: '#EF4444',
    destructiveForeground: '#FAFAFA',
    success: '#22C55E',
    warning: '#F59E0B',
    // aliases
    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
    tint: '#FAFAFA',
    icon: '#A1A1AA',
    tabIconDefault: '#A1A1AA',
    tabIconSelected: '#FAFAFA',
  },
  sidebar: {
    light: {
      background: '#F9F9F9',
      backgroundActive: '#F0F0F0',
      border: '#E4E4E7',
      text: '#71717A',
      textActive: '#09090B',
      indicator: '#18181B',
    },
    dark: {
      background: '#18181B',
      backgroundActive: '#27272A',
      border: '#27272A',
      text: '#A1A1AA',
      textActive: '#FAFAFA',
      indicator: '#FAFAFA',
    },
  },
};

export const Radius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 14,
};

export const Spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', mono: 'ui-monospace' },
  default: { sans: 'normal', mono: 'monospace' },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
