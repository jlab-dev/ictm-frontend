/**
 * NoticeScreen.tsx — 공지사항 관리 화면
 *
 * 탭 구조:
 *   - 전체공지 / 게시중 / 임시저장 / 종료
 *
 * 기능:
 *   - 공지 목록 테이블 (제목/작성자/상태/등록일/공개기간)
 *   - 검색창 + 상태 필터 드롭다운
 *   - 공지 등록 / 수정 / 삭제 모달
 *
 * URL 경로: /notice
 * 진입점:  app/(app)/notice.tsx → 이 컴포넌트를 re-export
 */

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ─── 타입 ──────────────────────────────────────────────────────────

type NoticeTab = 'all' | 'published' | 'draft' | 'closed';

type ModalType = 'add' | 'edit' | 'del' | null;

/** 공지 상태 */
type NoticeStatus = 'published' | 'draft' | 'closed';

interface Notice {
  id: number;
  title: string;
  author: string;
  status: NoticeStatus;
  pinned: boolean;        // 전체공지 여부
  createdAt: string;
  startDate: string;
  endDate: string;
}

// ─── 목 데이터 ─────────────────────────────────────────────────────

const MOCK_NOTICES: Notice[] = [
  { id: 1,  title: '[필독] 2026년 1분기 시스템 점검 안내',         author: '관리자', status: 'published', pinned: true,  createdAt: '2026-03-25', startDate: '2026-03-25', endDate: '2026-04-30' },
  { id: 2,  title: '장비 등록 절차 개선 안내',                     author: '홍길동', status: 'published', pinned: false, createdAt: '2026-03-20', startDate: '2026-03-20', endDate: '2026-12-31' },
  { id: 3,  title: '5월 정기 유지보수 일정 공지',                  author: '관리자', status: 'published', pinned: false, createdAt: '2026-03-18', startDate: '2026-04-01', endDate: '2026-05-31' },
  { id: 4,  title: '보안 취약점 패치 완료 안내',                   author: '관리자', status: 'published', pinned: false, createdAt: '2026-03-15', startDate: '2026-03-15', endDate: '2026-03-31' },
  { id: 5,  title: '신규 점검 항목 추가 예정',                     author: '홍길동', status: 'draft',     pinned: false, createdAt: '2026-03-10', startDate: '-',          endDate: '-'          },
  { id: 6,  title: '모바일 앱 업데이트 안내 (준비 중)',             author: '관리자', status: 'draft',     pinned: false, createdAt: '2026-03-08', startDate: '-',          endDate: '-'          },
  { id: 7,  title: '2025년 4분기 리포트 제출 안내',                author: '관리자', status: 'closed',   pinned: false, createdAt: '2025-12-01', startDate: '2025-12-01', endDate: '2026-01-15' },
  { id: 8,  title: '동절기 설비 점검 강화 안내',                   author: '홍길동', status: 'closed',   pinned: false, createdAt: '2025-11-15', startDate: '2025-11-15', endDate: '2026-02-28' },
];

// ─── 상태 설정 맵 ─────────────────────────────────────────────────

const STATUS_CONFIG: Record<NoticeStatus, { label: string; color: string; bg: string }> = {
  published: { label: '게시중',   color: '#16A34A', bg: '#DCFCE7' },
  draft:     { label: '임시저장', color: '#B45309', bg: '#FEF9C3' },
  closed:    { label: '종료',     color: '#71717A', bg: '#F4F4F5' },
};

// ─── 모달 폼 필드 서브컴포넌트 ────────────────────────────────────

function ModalField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={mfStyles.row}>
      <Text style={mfStyles.label}>{label}</Text>
      <View style={mfStyles.value}>{children}</View>
    </View>
  );
}

const mfStyles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  label: { width: 80, fontSize: 13, color: '#71717A', paddingTop: 9 },
  value: { flex: 1 },
});

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────

export default function NoticeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  // ── 공통 상태
  const [activeTab, setActiveTab] = useState<NoticeTab>('all');
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [, setEditTarget] = useState<Notice | null>(null);

  // ── 검색 / 필터
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState<NoticeStatus | 'all'>('all');
  const [statusDropdown, setStatusDropdown] = useState(false);

  // ── 등록 폼
  const [formTitle,     setFormTitle]     = useState('');
  const [formContent,   setFormContent]   = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate,   setFormEndDate]   = useState('');
  const [formPinned,    setFormPinned]    = useState(false);
  const [formStatus,    setFormStatus]    = useState<NoticeStatus>('draft');

  // ── 탭 필터링
  const tabFiltered = MOCK_NOTICES.filter(n => {
    if (activeTab === 'published') return n.status === 'published';
    if (activeTab === 'draft')     return n.status === 'draft';
    if (activeTab === 'closed')    return n.status === 'closed';
    return true; // 'all'
  });

  // ── 검색 + 상태 필터링
  const filtered = tabFiltered.filter(n => {
    const matchSearch =
      search === '' ||
      n.title.includes(search) ||
      n.author.includes(search);
    const matchStatus =
      statusFilter === 'all' || n.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── 체크박스
  const toggleItem = (id: number) =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  const toggleAll = () =>
    setSelectedIds(prev =>
      prev.length === filtered.length ? [] : filtered.map(n => n.id)
    );

  const hasSelected = selectedIds.length > 0;

  // ── 편집 모달 열기
  const openEdit = (notice: Notice) => {
    setEditTarget(notice);
    setFormTitle(notice.title);
    setFormPinned(notice.pinned);
    setFormStatus(notice.status);
    setFormStartDate(notice.startDate === '-' ? '' : notice.startDate);
    setFormEndDate(notice.endDate === '-' ? '' : notice.endDate);
    setOpenModal('edit');
  };

  // ── 탭 카운트
  const counts: Record<NoticeTab, number> = {
    all:       MOCK_NOTICES.length,
    published: MOCK_NOTICES.filter(n => n.status === 'published').length,
    draft:     MOCK_NOTICES.filter(n => n.status === 'draft').length,
    closed:    MOCK_NOTICES.filter(n => n.status === 'closed').length,
  };

  const TABS: { key: NoticeTab; label: string }[] = [
    { key: 'all',       label: '전체공지' },
    { key: 'published', label: '게시중' },
    { key: 'draft',     label: '임시저장' },
    { key: 'closed',    label: '종료' },
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: C.background }]}>

      {/* ── 탭 바 ──────────────────────────────────────────────────── */}
      <View style={[styles.tabBar, { borderBottomColor: C.border }]}>
        {TABS.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.tab,
                isActive && { borderBottomColor: C.foreground, borderBottomWidth: 2 },
              ]}
              onPress={() => setActiveTab(key)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? C.foreground : C.mutedForeground },
                  isActive && { fontWeight: '600' },
                ]}
              >
                {label}
              </Text>
              {/* 카운트 뱃지 */}
              <View style={[styles.tabCount, { backgroundColor: isActive ? C.primary : C.muted }]}>
                <Text style={{ fontSize: 10, color: isActive ? C.primaryForeground : C.mutedForeground, fontWeight: '600' }}>
                  {counts[key]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.inner}>

        {/* ── 헤더 ──────────────────────────────────────────────────── */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={[styles.pageTitle, { color: C.foreground }]}>공지사항</Text>
            <Text style={[styles.pageDesc, { color: C.mutedForeground }]}>
              공지사항을 등록하고 관리합니다.
            </Text>
          </View>
          <View style={styles.headerActions}>
            {/* 수정 버튼 */}
            <TouchableOpacity
              style={[
                styles.btn,
                { borderColor: C.border, backgroundColor: C.background, opacity: hasSelected ? 1 : 0.4 },
              ]}
              disabled={!hasSelected}
              onPress={() => {
                const target = MOCK_NOTICES.find(n => n.id === selectedIds[0]);
                if (target) openEdit(target);
              }}
            >
              <Ionicons name="pencil-outline" size={13} color={C.foreground} />
              <Text style={[styles.btnText, { color: C.foreground }]}>수정</Text>
            </TouchableOpacity>
            {/* 삭제 버튼 */}
            <TouchableOpacity
              style={[
                styles.btn,
                { borderColor: '#FCA5A5', backgroundColor: C.background, opacity: hasSelected ? 1 : 0.4 },
              ]}
              disabled={!hasSelected}
              onPress={() => setOpenModal('del')}
            >
              <Ionicons name="trash-outline" size={13} color="#EF4444" />
              <Text style={[styles.btnText, { color: '#EF4444' }]}>삭제</Text>
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: C.border }]} />
            {/* 등록 버튼 */}
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: C.primary, borderColor: C.primary }]}
              onPress={() => {
                setFormTitle(''); setFormContent(''); setFormStartDate('');
                setFormEndDate(''); setFormPinned(false); setFormStatus('draft');
                setOpenModal('add');
              }}
            >
              <Ionicons name="add" size={14} color={C.primaryForeground} />
              <Text style={[styles.btnText, { color: C.primaryForeground, fontWeight: '600' }]}>공지 등록</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 검색 바 ───────────────────────────────────────────────── */}
        <View style={styles.filterRow}>
          <View style={[styles.searchBox, { borderColor: C.border, backgroundColor: C.background }]}>
            <Ionicons name="search-outline" size={14} color={C.mutedForeground} />
            <TextInput
              style={[styles.searchInput, { color: C.foreground }]}
              placeholder="제목, 작성자 검색"
              placeholderTextColor={C.mutedForeground}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          {/* 상태 드롭다운 */}
          <View style={{ position: 'relative', zIndex: 10 }}>
            <TouchableOpacity
              style={[styles.dropdown, { borderColor: C.border, backgroundColor: C.background }]}
              onPress={() => setStatusDropdown(v => !v)}
            >
              <Text style={[styles.dropdownText, { color: C.foreground }]}>
                {statusFilter === 'all' ? '전체 상태' : STATUS_CONFIG[statusFilter].label}
              </Text>
              <Ionicons name="chevron-down" size={13} color={C.mutedForeground} />
            </TouchableOpacity>
            {statusDropdown && (
              <View style={[styles.dropdownList, { backgroundColor: C.card, borderColor: C.border }]}>
                {([['all', '전체 상태'], ['published', '게시중'], ['draft', '임시저장'], ['closed', '종료']] as const).map(([v, l]) => (
                  <TouchableOpacity
                    key={v}
                    style={[styles.dropdownItem, statusFilter === v && { backgroundColor: C.muted }]}
                    onPress={() => { setStatusFilter(v as any); setStatusDropdown(false); }}
                  >
                    <Text style={{ color: C.foreground, fontSize: 13 }}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <TouchableOpacity style={[styles.btn, { borderColor: C.border, backgroundColor: C.background }]}>
            <Ionicons name="search" size={13} color={C.foreground} />
            <Text style={[styles.btnText, { color: C.foreground }]}>검색</Text>
          </TouchableOpacity>
        </View>

        {/* ── 테이블 ────────────────────────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* 헤더 행 */}
            <View style={[styles.tableHeader, { backgroundColor: C.muted, borderColor: C.border }]}>
              <TouchableOpacity style={styles.colChk} onPress={toggleAll}>
                <View style={[styles.checkbox, {
                  borderColor: C.border,
                  backgroundColor:
                    selectedIds.length === filtered.length && filtered.length > 0
                      ? C.primary
                      : C.background,
                }]}>
                  {selectedIds.length === filtered.length && filtered.length > 0 && (
                    <Ionicons name="checkmark" size={10} color={C.primaryForeground} />
                  )}
                </View>
              </TouchableOpacity>
              {[
                { label: '제목',     width: 280 },
                { label: '작성자',   width: 100 },
                { label: '상태',     width: 100 },
                { label: '등록일',   width: 110 },
                { label: '시작일',   width: 110 },
                { label: '종료일',   width: 110 },
                { label: '수정',     width: 60  },
              ].map(h => (
                <Text
                  key={h.label}
                  style={[styles.headerText, { color: C.mutedForeground, width: h.width }]}
                >
                  {h.label}
                </Text>
              ))}
            </View>

            {/* 데이터 행 */}
            {filtered.length === 0 ? (
              <View style={[styles.emptyRow, { borderColor: C.border }]}>
                <Ionicons name="megaphone-outline" size={28} color={C.mutedForeground} />
                <Text style={[styles.emptyText, { color: C.mutedForeground }]}>공지사항이 없습니다.</Text>
              </View>
            ) : (
              filtered.map((notice, idx) => {
                const isSelected = selectedIds.includes(notice.id);
                const isLast = idx === filtered.length - 1;
                const sc = STATUS_CONFIG[notice.status];
                return (
                  <TouchableOpacity
                    key={notice.id}
                    style={[
                      styles.tableRow,
                      { borderColor: C.border },
                      isSelected && { backgroundColor: C.muted },
                      !isLast && { borderBottomWidth: 1 },
                    ]}
                    onPress={() => toggleItem(notice.id)}
                    activeOpacity={0.7}
                  >
                    {/* 체크박스 */}
                    <View style={styles.colChk}>
                      <View style={[styles.checkbox, {
                        borderColor: C.border,
                        backgroundColor: isSelected ? C.primary : C.background,
                      }]}>
                        {isSelected && <Ionicons name="checkmark" size={10} color={C.primaryForeground} />}
                      </View>
                    </View>
                    {/* 제목 */}
                    <View style={{ width: 280, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {notice.pinned && (
                        <View style={styles.pinnedBadge}>
                          <Text style={styles.pinnedText}>필독</Text>
                        </View>
                      )}
                      <Text
                        style={[styles.cellText, { color: C.foreground, fontWeight: notice.pinned ? '600' : '400' }]}
                        numberOfLines={1}
                      >
                        {notice.title}
                      </Text>
                    </View>
                    {/* 작성자 */}
                    <Text style={[styles.cellText, { width: 100, color: C.mutedForeground }]}>{notice.author}</Text>
                    {/* 상태 뱃지 */}
                    <View style={{ width: 100 }}>
                      <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                        <Text style={[styles.badgeText, { color: sc.color }]}>{sc.label}</Text>
                      </View>
                    </View>
                    {/* 등록일 */}
                    <Text style={[styles.cellText, { width: 110, color: C.mutedForeground }]}>{notice.createdAt}</Text>
                    {/* 시작일 */}
                    <Text style={[styles.cellText, { width: 110, color: C.mutedForeground }]}>{notice.startDate}</Text>
                    {/* 종료일 */}
                    <Text style={[styles.cellText, { width: 110, color: C.mutedForeground }]}>{notice.endDate}</Text>
                    {/* 수정 버튼 */}
                    <View style={{ width: 60, alignItems: 'center' }}>
                      <TouchableOpacity
                        style={[styles.actionBtn, { borderColor: C.border }]}
                        onPress={() => openEdit(notice)}
                      >
                        <Text style={[styles.actionBtnText, { color: C.foreground }]}>수정</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
            <View style={[styles.tableBottom, { borderColor: C.border }]} />
          </View>
        </ScrollView>

        {/* ── 페이지네이션 ──────────────────────────────────────────── */}
        <View style={styles.pagination}>
          <Text style={[styles.totalText, { color: C.mutedForeground }]}>
            전체 <Text style={{ fontWeight: '600', color: C.foreground }}>{filtered.length}개</Text> 공지
          </Text>
          <View style={styles.pageButtons}>
            <TouchableOpacity style={[styles.pageBtn, { borderColor: C.border, backgroundColor: C.background }]}>
              <Ionicons name="chevron-back" size={13} color={C.foreground} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pageBtn, { borderColor: C.border, backgroundColor: C.primary }]}>
              <Text style={{ fontSize: 13, color: C.primaryForeground }}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pageBtn, { borderColor: C.border, backgroundColor: C.background }]}>
              <Ionicons name="chevron-forward" size={13} color={C.foreground} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ════════════════════════════════════════════════════════════
          모달: 공지 등록
      ════════════════════════════════════════════════════════════ */}
      <Modal visible={openModal === 'add'} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpenModal(null)}>
          <Pressable style={[styles.modalBox, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={[styles.modalTitle, { color: C.foreground }]}>공지 등록</Text>
            <Text style={[styles.modalDesc, { color: C.mutedForeground }]}>새 공지사항을 등록합니다.</Text>

            <ModalField label="제목">
              <TextInput
                style={[styles.input, { borderColor: C.border, color: C.foreground, backgroundColor: C.background }]}
                placeholder="공지 제목 입력"
                placeholderTextColor={C.mutedForeground}
                value={formTitle}
                onChangeText={setFormTitle}
              />
            </ModalField>
            <ModalField label="내용">
              <TextInput
                style={[styles.input, styles.textarea, { borderColor: C.border, color: C.foreground, backgroundColor: C.background }]}
                placeholder="공지 내용 입력"
                placeholderTextColor={C.mutedForeground}
                value={formContent}
                onChangeText={setFormContent}
                multiline
                numberOfLines={4}
              />
            </ModalField>
            <ModalField label="시작일">
              <TextInput
                style={[styles.input, { borderColor: C.border, color: C.foreground, backgroundColor: C.background }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={C.mutedForeground}
                value={formStartDate}
                onChangeText={setFormStartDate}
              />
            </ModalField>
            <ModalField label="종료일">
              <TextInput
                style={[styles.input, { borderColor: C.border, color: C.foreground, backgroundColor: C.background }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={C.mutedForeground}
                value={formEndDate}
                onChangeText={setFormEndDate}
              />
            </ModalField>
            <ModalField label="전체공지">
              <Switch
                value={formPinned}
                onValueChange={setFormPinned}
                trackColor={{ true: C.primary }}
              />
            </ModalField>
            <ModalField label="상태">
              <View style={styles.radioRow}>
                {(['draft', 'published'] as NoticeStatus[]).map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.radioBtn, formStatus === s && { borderColor: C.primary, backgroundColor: C.muted }]}
                    onPress={() => setFormStatus(s)}
                  >
                    <Text style={{ fontSize: 13, color: C.foreground }}>{STATUS_CONFIG[s].label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ModalField>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerBtn, { borderColor: C.border, backgroundColor: C.background }]}
                onPress={() => setOpenModal(null)}
              >
                <Text style={{ color: C.foreground, fontSize: 13 }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerBtn, { backgroundColor: C.primary, borderColor: C.primary }]}
                onPress={() => setOpenModal(null)}
              >
                <Text style={{ color: C.primaryForeground, fontSize: 13, fontWeight: '600' }}>등록</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ════════════════════════════════════════════════════════════
          모달: 공지 수정
      ════════════════════════════════════════════════════════════ */}
      <Modal visible={openModal === 'edit'} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpenModal(null)}>
          <Pressable style={[styles.modalBox, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={[styles.modalTitle, { color: C.foreground }]}>공지 수정</Text>
            <Text style={[styles.modalDesc, { color: C.mutedForeground }]}>공지사항 내용을 수정합니다.</Text>

            <ModalField label="제목">
              <TextInput
                style={[styles.input, { borderColor: C.border, color: C.foreground, backgroundColor: C.background }]}
                value={formTitle}
                onChangeText={setFormTitle}
              />
            </ModalField>
            <ModalField label="시작일">
              <TextInput
                style={[styles.input, { borderColor: C.border, color: C.foreground, backgroundColor: C.background }]}
                value={formStartDate}
                onChangeText={setFormStartDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={C.mutedForeground}
              />
            </ModalField>
            <ModalField label="종료일">
              <TextInput
                style={[styles.input, { borderColor: C.border, color: C.foreground, backgroundColor: C.background }]}
                value={formEndDate}
                onChangeText={setFormEndDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={C.mutedForeground}
              />
            </ModalField>
            <ModalField label="전체공지">
              <Switch
                value={formPinned}
                onValueChange={setFormPinned}
                trackColor={{ true: C.primary }}
              />
            </ModalField>
            <ModalField label="상태">
              <View style={styles.radioRow}>
                {(['draft', 'published', 'closed'] as NoticeStatus[]).map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.radioBtn, formStatus === s && { borderColor: C.primary, backgroundColor: C.muted }]}
                    onPress={() => setFormStatus(s)}
                  >
                    <Text style={{ fontSize: 13, color: C.foreground }}>{STATUS_CONFIG[s].label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ModalField>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerBtn, { borderColor: C.border, backgroundColor: C.background }]}
                onPress={() => setOpenModal(null)}
              >
                <Text style={{ color: C.foreground, fontSize: 13 }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerBtn, { backgroundColor: C.primary, borderColor: C.primary }]}
                onPress={() => setOpenModal(null)}
              >
                <Text style={{ color: C.primaryForeground, fontSize: 13, fontWeight: '600' }}>저장</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ════════════════════════════════════════════════════════════
          모달: 삭제 확인
      ════════════════════════════════════════════════════════════ */}
      <Modal visible={openModal === 'del'} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpenModal(null)}>
          <Pressable style={[styles.modalBox, { backgroundColor: C.card, borderColor: C.border, maxWidth: 360 }]}>
            <View style={[styles.delIconWrap, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="trash-outline" size={22} color="#EF4444" />
            </View>
            <Text style={[styles.modalTitle, { color: C.foreground, marginTop: 12 }]}>공지 삭제</Text>
            <Text style={[styles.modalDesc, { color: C.mutedForeground, textAlign: 'center' }]}>
              선택한 {selectedIds.length}개 공지를 삭제하시겠습니까?{'\n'}삭제 후 복구할 수 없습니다.
            </Text>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerBtn, { borderColor: C.border, backgroundColor: C.background }]}
                onPress={() => setOpenModal(null)}
              >
                <Text style={{ color: C.foreground, fontSize: 13 }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerBtn, { backgroundColor: '#EF4444', borderColor: '#EF4444' }]}
                onPress={() => { setSelectedIds([]); setOpenModal(null); }}
              >
                <Text style={{ color: '#FAFAFA', fontSize: 13, fontWeight: '600' }}>삭제</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
}

// ─── 스타일 ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: { flex: 1 },

  // ── 탭
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 24,
  },
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
  tabCount: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },

  // ── 내부 컨텐츠
  inner: { padding: 24, gap: 20 },

  // ── 헤더
  pageHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pageTitle:     { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  pageDesc:      { fontSize: 13, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  // ── 버튼
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  btnText: { fontSize: 13 },
  divider: { width: 1, height: 20 },

  // ── 검색 / 필터
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 10 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    height: 36,
  },
  searchInput: { flex: 1, fontSize: 13, outlineStyle: 'none' } as any,
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: Radius.md,
    minWidth: 110,
  },
  dropdownText: { fontSize: 13, flex: 1 },
  dropdownList: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: Radius.md,
    zIndex: 99,
    overflow: 'hidden',
  },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 8 },

  // ── 테이블
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
  },
  headerText: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  tableBottom: {
    height: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomLeftRadius: Radius.md,
    borderBottomRightRadius: Radius.md,
  },
  colChk:   { width: 36, alignItems: 'center' },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: { fontSize: 13 },

  // ── 뱃지
  badge:     { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.sm, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '600' },
  pinnedBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  pinnedText:  { fontSize: 10, fontWeight: '700', color: '#1D4ED8' },

  // ── 액션 버튼
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  actionBtnText: { fontSize: 12 },

  // ── 빈 상태
  emptyRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  emptyText: { fontSize: 13 },

  // ── 페이지네이션
  pagination:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalText:   { fontSize: 13 },
  pageButtons: { flexDirection: 'row', gap: 4 },
  pageBtn: {
    width: 30,
    height: 30,
    borderRadius: Radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── 모달
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
  modalTitle: { fontSize: 16, fontWeight: '700' },
  modalDesc:  { fontSize: 13, marginTop: 4, marginBottom: 20, color: '#71717A' },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  textarea: { height: 80, textAlignVertical: 'top' },
  radioRow:  { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  radioBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 24 },
  footerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  delIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
