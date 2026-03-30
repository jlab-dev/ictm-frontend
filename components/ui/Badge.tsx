import { StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Variant = 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  const variantStyles: Record<Variant, { bg: string; text: string; border?: string }> = {
    default:     { bg: C.primary,      text: C.primaryForeground },
    secondary:   { bg: C.secondary,    text: C.secondaryForeground },
    outline:     { bg: 'transparent',  text: C.foreground, border: C.border },
    destructive: { bg: C.destructive,  text: C.destructiveForeground },
    success:     { bg: '#DCFCE7',      text: '#166534' },
    warning:     { bg: '#FEF9C3',      text: '#854D0E' },
  };

  const v = variantStyles[variant];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: v.bg, borderColor: v.border ?? 'transparent', borderWidth: v.border ? 1 : 0 },
      ]}
    >
      <Text style={[styles.text, { color: v.text }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
