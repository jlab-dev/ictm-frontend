import { StyleSheet } from 'react-native';
import { screenStyleDefs } from '@/constants/screenStyles';
import { Radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  ...screenStyleDefs,

  // ── 레이아웃
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  pageTitle:     { fontSize: 20, fontWeight: '600' as const, letterSpacing: -0.3 },
  headerActions: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, flexWrap: 'wrap' as const },

  splitWrapper: { flex: 1 },
  split: { flex: 1, flexDirection: 'row' as const, padding: 20, gap: 16 },

  // ── 좌측 그룹 패널
  groupPanel: { width: 220, borderWidth: 1, borderRadius: Radius.lg, overflow: 'hidden', height: '100%' as any },
  gpHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  gpHeadTitle:  { fontSize: 10, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  gpSearchWrap: { flexDirection: 'row' as const, gap: 6, padding: 8, paddingHorizontal: 10, borderBottomWidth: 1 },
  gpSearch:     { flex: 1, borderWidth: 1, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 5, fontSize: 12 },
  gpSearchBtn:  { borderWidth: 1, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 5 },
  gpItem:       { flexDirection: 'row' as const, alignItems: 'center' as const, padding: 10, paddingHorizontal: 14 },
  gpItemActive: { borderLeftWidth: 2, paddingLeft: 12 },
  gpItemName:   { fontSize: 13, fontWeight: '500' as const },
  gpItemCode:   { fontSize: 10, fontFamily: 'monospace', marginTop: 1 },
  gpCount:      { paddingHorizontal: 7, paddingVertical: 1, borderRadius: 100, borderWidth: 1 },

  // ── 우측 상세 헤더
  detailHeader: { borderWidth: 1, borderRadius: Radius.lg, padding: 16, gap: 12 },
  dhLeft:       { flexDirection: 'row' as const, gap: 12, flex: 1 },
  dhIcon:       { width: 38, height: 38, borderRadius: 9, justifyContent: 'center' as const, alignItems: 'center' as const, flexShrink: 0 },
  dhTitleRow:   { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 },
  dhName:       { fontSize: 15, fontWeight: '600' as const, letterSpacing: -0.2 },
  dhStats:      { flexDirection: 'row' as const, gap: 20, padding: 10, paddingHorizontal: 18 },
  dhStat:       { alignItems: 'center' as const },
  dhStatVal:    { fontSize: 17, fontWeight: '600' as const },
  dhStatLabel:  { fontSize: 11 },

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
