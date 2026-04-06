/**
 * screenStyles — 관리 화면 공통 스타일
 *
 * CommonCodeScreen.styles.ts, NoticeScreen.styles.ts 등 각 화면의
 * 스타일 파일에서 공통 스타일을 가져다 쓸 수 있도록 raw 객체를 제공합니다.
 *
 * 사용법 (각 화면의 .styles.ts 파일에서):
 *   import { screenStyleDefs } from '@/constants/screenStyles';
 *   export const styles = StyleSheet.create({ ...screenStyleDefs, myStyle: { ... } });
 */

import { StyleSheet } from 'react-native';
import { Radius } from './theme';

/** StyleSheet.create에 spread할 수 있는 raw 스타일 객체 */
export const screenStyleDefs = {
  // ── 버튼
  btn:     { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 5, paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderRadius: Radius.md },
  btnText: { fontSize: 13 },
  divider: { width: 1, height: 18, marginHorizontal: 2 },

  // ── 검색 / 필터
  filterRow:   { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, zIndex: 10 },
  searchBox:   { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 12, height: 36 },
  searchInput: { flex: 1, fontSize: 13, height: 36 },

  // ── 드롭다운
  dropdownText: { fontSize: 13, flex: 1 },
  dropdownList: { position: 'absolute' as const, top: 40, left: 0, minWidth: 120, borderWidth: 1, borderRadius: Radius.md, zIndex: 100, overflow: 'hidden' as const },
  dropdownItem: { paddingVertical: 8, paddingHorizontal: 12 },
  dropdown:     { flexDirection: 'row' as const, alignItems: 'center' as const, borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 10, height: 36, gap: 6, minWidth: 100 },

  // ── 테이블
  tableHeader: { flexDirection: 'row' as const, alignItems: 'center' as const, paddingVertical: 9, paddingHorizontal: 12, borderWidth: 1, borderBottomWidth: 0, borderTopLeftRadius: Radius.md, borderTopRightRadius: Radius.md },
  headerText:  { fontSize: 11, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: 0.4 },
  tableRow:    { flexDirection: 'row' as const, alignItems: 'center' as const, paddingVertical: 10, paddingHorizontal: 12, borderLeftWidth: 1, borderRightWidth: 1 },
  tableBottom: { borderWidth: 1, borderTopWidth: 0, borderBottomLeftRadius: Radius.md, borderBottomRightRadius: Radius.md, height: 1 },
  colChk:      { width: 36, alignItems: 'center' as const },
  checkbox:    { width: 16, height: 16, borderWidth: 1, borderRadius: 4, justifyContent: 'center' as const, alignItems: 'center' as const },
  cellText:    { fontSize: 13 },

  // ── 빈 상태
  emptyRow:  { alignItems: 'center' as const, justifyContent: 'center' as const, paddingVertical: 48, gap: 10, borderLeftWidth: 1, borderRightWidth: 1 },
  emptyText: { fontSize: 13 },

  // ── 뱃지
  badgeText:  { fontSize: 11, fontWeight: '600' as const },
  badgeGreen: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  badgeGray:  { backgroundColor: '#F4F4F5', borderColor: '#E4E4E7' },
  badge:      { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 100, borderWidth: 1, alignSelf: 'flex-start' as const },

  // ── 액션 버튼 (테이블 행 내)
  actionBtnText: { fontSize: 11, fontWeight: '500' as const },
  actionBtn:     { paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderRadius: Radius.sm },

  // ── 페이지네이션
  pagination:  { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
  totalText:   { fontSize: 13 },
  pageButtons: { flexDirection: 'row' as const, gap: 4 },
  pageBtn:     { width: 30, height: 30, borderWidth: 1, borderRadius: Radius.sm, justifyContent: 'center' as const, alignItems: 'center' as const },

  // ── 모달 오버레이
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center' as const, alignItems: 'center' as const },
};

/** 직접 JSX에서 쓸 수 있도록 등록된 스타일 (선택적 사용) */
export const screenStyles = StyleSheet.create(screenStyleDefs);
