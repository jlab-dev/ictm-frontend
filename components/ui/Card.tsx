import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Card({ style, children, ...props }: ViewProps) {
  const C = Colors[useColorScheme() ?? 'light'];
  return (
    <View
      style={[styles.card, { backgroundColor: C.card, borderColor: C.border }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardHeader({ style, children, ...props }: ViewProps) {
  return (
    <View style={[styles.header, style]} {...props}>
      {children}
    </View>
  );
}

export function CardTitle({ style, children, ...props }: React.ComponentProps<typeof Text>) {
  const C = Colors[useColorScheme() ?? 'light'];
  return (
    <Text style={[styles.title, { color: C.foreground }, style]} {...props}>
      {children}
    </Text>
  );
}

export function CardDescription({ style, children, ...props }: React.ComponentProps<typeof Text>) {
  const C = Colors[useColorScheme() ?? 'light'];
  return (
    <Text style={[styles.description, { color: C.mutedForeground }, style]} {...props}>
      {children}
    </Text>
  );
}

export function CardContent({ style, children, ...props }: ViewProps) {
  return (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ style, children, ...props }: ViewProps) {
  const C = Colors[useColorScheme() ?? 'light'];
  return (
    <View style={[styles.footer, { borderTopColor: C.border }, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    paddingBottom: 0,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  content: {
    padding: 20,
  },
  footer: {
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
