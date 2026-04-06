import { StyleSheet } from 'react-native';
import { screenStyleDefs } from '@/constants/screenStyles';
import { Radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  ...screenStyleDefs,

  // ── 래퍼
  wrapper: { flex: 1 },
  inner:   { padding: 24, gap: 20 },

  // ── 탭 바
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 24 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginRight: 20,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabText:  { fontSize: 13 },
  tabCount: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 10, minWidth: 20, alignItems: 'center' },

  // ── 헤더
  pageHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pageTitle:     { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  pageDesc:      { fontSize: 13, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  // ── 전체공지 뱃지
  pinnedBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  pinnedText:  { fontSize: 10, fontWeight: '700', color: '#1D4ED8' },

  // ── 모달 (Notice 전용 스타일 — 공통코드와 다름)
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '90%',
    maxWidth: 480,
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: 24,
  },
  modalTitle:   { fontSize: 16, fontWeight: '700' },
  modalDesc:    { fontSize: 13, marginTop: 4, marginBottom: 20, color: '#71717A' },
  input:        { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13 },
  textarea:     { height: 80, textAlignVertical: 'top' },
  radioRow:     { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  radioBtn:     { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.md, borderWidth: 1, borderColor: '#E4E4E7' },
  modalFooter:  { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 24 },
  footerBtn:    { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.md, borderWidth: 1 },
  delIconWrap:  { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
});
