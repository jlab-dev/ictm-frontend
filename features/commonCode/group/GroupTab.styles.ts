import { StyleSheet } from 'react-native';
import { screenStyleDefs } from '@/constants/screenStyles';
import { Radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  ...screenStyleDefs,

  // ── 레이아웃
  inner:  { padding: 20, gap: 16 },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  pageTitle:     { fontSize: 20, fontWeight: '600' as const, letterSpacing: -0.3 },
  headerActions: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, flexWrap: 'wrap' as const },

  // ── 통계 카드
  statsGrid: { flexDirection: 'row' as const, gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  statLabel: { fontSize: 11 },
  statValue: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.5 },

  // ── 코드 칩
  codeChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: 'flex-start' as const,
  },
  codeChipText: { fontSize: 11, fontFamily: 'monospace' },
});
