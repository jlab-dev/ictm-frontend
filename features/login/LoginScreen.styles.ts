import { StyleSheet } from 'react-native';
import { Radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    alignItems: 'center',
    padding: 32,
    paddingBottom: 24,
    gap: 8,
  },
  logoMark: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  logoMarkText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginHorizontal: 0,
  },
  form: {
    padding: 24,
    gap: 14,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: 10,
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
  },
  loginBtn: {
    marginTop: 4,
    width: '100%',
  },
});
