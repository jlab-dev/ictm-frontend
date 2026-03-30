import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Variant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  const variantStyles: Record<Variant, object> = {
    default: { backgroundColor: C.primary, borderWidth: 0 },
    secondary: { backgroundColor: C.secondary, borderWidth: 0 },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: C.border },
    ghost: { backgroundColor: 'transparent', borderWidth: 0 },
    destructive: { backgroundColor: C.destructive, borderWidth: 0 },
  };

  const textColors: Record<Variant, string> = {
    default: C.primaryForeground,
    secondary: C.secondaryForeground,
    outline: C.foreground,
    ghost: C.foreground,
    destructive: C.destructiveForeground,
  };

  const sizeStyles: Record<Size, object> = {
    sm: { paddingVertical: 6, paddingHorizontal: 12 },
    md: { paddingVertical: 10, paddingHorizontal: 16 },
    lg: { paddingVertical: 12, paddingHorizontal: 24 },
  };

  const textSizes: Record<Size, number> = { sm: 13, md: 14, lg: 15 };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColors[variant]} />
      ) : (
        <Text style={[styles.text, { color: textColors[variant], fontSize: textSizes[size] }]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  text: {
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});
