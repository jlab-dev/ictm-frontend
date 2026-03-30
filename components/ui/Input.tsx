import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  return (
    <View style={styles.wrapper}>
      {label && <Text style={[styles.label, { color: C.foreground }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: C.background,
            borderColor: error ? C.destructive : C.input,
            color: C.foreground,
          },
          style,
        ]}
        placeholderTextColor={C.mutedForeground}
        {...props}
      />
      {error && <Text style={[styles.error, { color: C.destructive }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: 9,
    paddingHorizontal: 12,
    fontSize: 14,
    height: 40,
  },
  error: {
    fontSize: 12,
    marginTop: 2,
  },
});
