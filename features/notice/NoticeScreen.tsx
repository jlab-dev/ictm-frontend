/**
 * NoticeScreen.tsx — 공지사항 관리 화면
 *
 * 탭 구조: 전체공지 / 게시중 / 임시저장 / 종료
 * 기능: 목록 조회 · 검색 · 등록 / 수정 / 삭제 모달
 *
 * URL 경로: /notice
 * 진입점:  app/(app)/notice.tsx → 이 컴포넌트를 re-export
 */

import { ModalField } from '@/components/ui/ModalField';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './NoticeScreen.styles';
import { STATUS_CONFIG, useNotice, type NoticeTab } from './useNotice';

const TABS: { key: NoticeTab; label: string }[] = [
  { key: 'all',       label: '전체공지' },
  { key: 'published', label: '게시중' },
  { key: 'draft',     label: '임시저장' },
  { key: 'closed',    label: '종료' },
];

export default function NoticeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  const {
    activeTab, setActiveTab,
    openModal, setOpenModal,
    selectedIds, setSelectedIds,
    search, setSearch,
    statusFilter, setStatusFilter,
    statusDropdown, setStatusDropdown,
    formTitle, setFormTitle,
    formContent, setFormContent,
    formStartDate, setFormStartDate,
    formEndDate, setFormEndDate,
    formPinned, setFormPinned,
    formStatus, setFormStatus,
    filtered,
    counts,
    toggleItem, toggleAll,
    hasSelected,
    openEdit, openAdd,
  } = useNotice();

  return (
    <View style={[styles.wrapper, { backgroundColor: C.background }]}>

      {/* ── 탭 바 ──────────────────────────────────────────────────── */}
      <View style={[styles.tabBar, { borderBottomColor: C.border }]}>
        {TABS.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.tab, isActive && { borderBottomColor: C.foreground, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab(key)}
            >
              <Text style={[styles.tabText, { color: isActive ? C.foreground : C.mutedForeground }, isActive && { fontWeight: '600' }]}>
                {label}
              </Text>
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
            <Text style={[styles.pageDesc, { color: C.mutedForeground }]}>공지사항을 등록하고 관리합니다.</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.btn, { borderColor: C.border, backgroundColor: C.background, opacity: hasSelected ? 1 : 0.4 }]}
              disabled={!hasSelected}
              onPress={() => {
                const target = filtered.find((n) => n.id === selectedIds[0]);
                if (target) openEdit(target);
              }}
            >
              <Ionicons name="pencil-outline" size={13} color={C.foreground} />
              <Text style={[styles.btnText, { color: C.foreground }]}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { borderColor: '#FCA5A5', backgroundColor: C.background, opacity: hasSelected ? 1 : 0.4 }]}
              disabled={!hasSelected}
              onPress={() => setOpenModal('del')}
            >
              <Ionicons name="trash-outline" size={13} color="#EF4444" />
              <Text style={[styles.btnText, { color: '#EF4444' }]}>삭제</Text>
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: C.border }]} />
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: C.primary, borderColor: C.primary }]}
              onPress={openAdd}
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
          <View style={{ position: 'relative', zIndex: 10 }}>
            <TouchableOpacity
              style={[styles.dropdown, { borderColor: C.border, backgroundColor: C.background }]}
              onPress={() => setStatusDropdown((v) => !v)}
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
            <View style={[styles.tableHeader, { backgroundColor: C.muted, borderColor: C.border }]}>
              <TouchableOpacity style={styles.colChk} onPress={toggleAll}>
                <View style={[styles.checkbox, {
                  borderColor: C.border,
                  backgroundColor: selectedIds.length === filtered.length && filtered.length > 0 ? C.primary : C.background,
                }]}>
                  {selectedIds.length === filtered.length && filtered.length > 0 && (
                    <Ionicons name="checkmark" size={10} color={C.primaryForeground} />
                  )}
                </View>
              </TouchableOpacity>
              {[
                { label: '제목',   width: 280 },
                { label: '작성자', width: 100 },
                { label: '상태',   width: 100 },
                { label: '등록일', width: 110 },
                { label: '시작일', width: 110 },
                { label: '종료일', width: 110 },
                { label: '수정',   width: 60  },
              ].map((h) => (
                <Text key={h.label} style={[styles.headerText, { color: C.mutedForeground, width: h.width }]}>{h.label}</Text>
              ))}
            </View>

            {filtered.length === 0 ? (
              <View style={[styles.emptyRow, { borderColor: C.border }]}>
                <Ionicons name="megaphone-outline" size={28} color={C.mutedForeground} />
                <Text style={[styles.emptyText, { color: C.mutedForeground }]}>공지사항이 없습니다.</Text>
              </View>
            ) : (
              filtered.map((notice, idx) => {
                const isSelected = selectedIds.includes(notice.id);
                const isLast     = idx === filtered.length - 1;
                const sc         = STATUS_CONFIG[notice.status];
                return (
                  <TouchableOpacity
                    key={notice.id}
                    style={[styles.tableRow, { borderColor: C.border }, isSelected && { backgroundColor: C.muted }, !isLast && { borderBottomWidth: 1 }]}
                    onPress={() => toggleItem(notice.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.colChk}>
                      <View style={[styles.checkbox, { borderColor: C.border, backgroundColor: isSelected ? C.primary : C.background }]}>
                        {isSelected && <Ionicons name="checkmark" size={10} color={C.primaryForeground} />}
                      </View>
                    </View>
                    <View style={{ width: 280, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {notice.pinned && (
                        <View style={styles.pinnedBadge}><Text style={styles.pinnedText}>필독</Text></View>
                      )}
                      <Text style={[styles.cellText, { color: C.foreground, fontWeight: notice.pinned ? '600' : '400' }]} numberOfLines={1}>
                        {notice.title}
                      </Text>
                    </View>
                    <Text style={[styles.cellText, { width: 100, color: C.mutedForeground }]}>{notice.author}</Text>
                    <View style={{ width: 100 }}>
                      <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                        <Text style={[styles.badgeText, { color: sc.color }]}>{sc.label}</Text>
                      </View>
                    </View>
                    <Text style={[styles.cellText, { width: 110, color: C.mutedForeground }]}>{notice.createdAt}</Text>
                    <Text style={[styles.cellText, { width: 110, color: C.mutedForeground }]}>{notice.startDate}</Text>
                    <Text style={[styles.cellText, { width: 110, color: C.mutedForeground }]}>{notice.endDate}</Text>
                    <View style={{ width: 60, alignItems: 'center' }}>
                      <TouchableOpacity style={[styles.actionBtn, { borderColor: C.border }]} onPress={() => openEdit(notice)}>
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

      {/* ════ 모달: 공지 등록 ════ */}
      <Modal visible={openModal === 'add'} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpenModal(null)}>
          <Pressable style={[styles.modalBox, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={[styles.modalTitle, { color: C.foreground }]}>공지 등록</Text>
            <Text style={[styles.modalDesc, { color: C.mutedForeground }]}>새 공지사항을 등록합니다.</Text>
            <ModalField label="제목" C={C}>
              <TextInput
                style={[styles.input, { borderColor: C.border, color: C.foreground, backgroundColor: C.background }]}
                placeholder="공지 제목 입력"
                placeholderTextColor={C.mutedForeground}
                value={formTitle}
                onChangeText={setFormTitle}
              />
            </ModalField>
            <ModalField label="내용" C={C}>
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
            <ModalField label="시작일" C={C}>
              <TextInput
                style={[styles.input, { borderColor: C.border, color: C.foreground, backgroundColor: C.background }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={C.mutedForeground}
                value={formStartDate}
                onChangeText={setFormStartDate}
              />
            </ModalField>
            <ModalField label="종료일" C={C}>
              <TextInput
                style={[styles.input, { borderColor: C.border, color: C.foreground, backgroundColor: C.background }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={C.mutedForeground}
                value={formEndDate}
                onChangeText={setFormEndDate}
              />
            </ModalField>
            <ModalField label="전체공지" C={C}>
              <Switch value={formPinned} onValueChange={setFormPinned} trackColor={{ true: C.primary }} />
            </ModalField>
            <ModalField label="상태" C={C}>
              <View style={styles.radioRow}>
                {(['draft', 'published'] as const).map((s) => (
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
              <TouchableOpacity style={[styles.footerBtn, { borderColor: C.border, backgroundColor: C.background }]} onPress={() => setOpenModal(null)}>
                <Text style={{ color: C.foreground, fontSize: 13 }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.footerBtn, { backgroundColor: C.primary, borderColor: C.primary }]} onPress={() => setOpenModal(null)}>
                <Text style={{ color: C.primaryForeground, fontSize: 13, fontWeight: '600' }}>등록</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ════ 모달: 공지 수정 ════ */}
      <Modal visible={openModal === 'edit'} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpenModal(null)}>
          <Pressable style={[styles.modalBox, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={[styles.modalTitle, { color: C.foreground }]}>공지 수정</Text>
            <Text style={[styles.modalDesc, { color: C.mutedForeground }]}>공지사항 내용을 수정합니다.</Text>
            <ModalField label="제목" C={C}>
              <TextInput style={[styles.input, { borderColor: C.border, color: C.foreground, backgroundColor: C.background }]} value={formTitle} onChangeText={setFormTitle} />
            </ModalField>
            <ModalField label="시작일" C={C}>
              <TextInput style={[styles.input, { borderColor: C.border, color: C.foreground, backgroundColor: C.background }]} value={formStartDate} onChangeText={setFormStartDate} placeholder="YYYY-MM-DD" placeholderTextColor={C.mutedForeground} />
            </ModalField>
            <ModalField label="종료일" C={C}>
              <TextInput style={[styles.input, { borderColor: C.border, color: C.foreground, backgroundColor: C.background }]} value={formEndDate} onChangeText={setFormEndDate} placeholder="YYYY-MM-DD" placeholderTextColor={C.mutedForeground} />
            </ModalField>
            <ModalField label="전체공지" C={C}>
              <Switch value={formPinned} onValueChange={setFormPinned} trackColor={{ true: C.primary }} />
            </ModalField>
            <ModalField label="상태" C={C}>
              <View style={styles.radioRow}>
                {(['draft', 'published', 'closed'] as const).map((s) => (
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
              <TouchableOpacity style={[styles.footerBtn, { borderColor: C.border, backgroundColor: C.background }]} onPress={() => setOpenModal(null)}>
                <Text style={{ color: C.foreground, fontSize: 13 }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.footerBtn, { backgroundColor: C.primary, borderColor: C.primary }]} onPress={() => setOpenModal(null)}>
                <Text style={{ color: C.primaryForeground, fontSize: 13, fontWeight: '600' }}>저장</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ════ 모달: 삭제 확인 ════ */}
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
              <TouchableOpacity style={[styles.footerBtn, { borderColor: C.border, backgroundColor: C.background }]} onPress={() => setOpenModal(null)}>
                <Text style={{ color: C.foreground, fontSize: 13 }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.footerBtn, { backgroundColor: '#EF4444', borderColor: '#EF4444' }]} onPress={() => { setSelectedIds([]); setOpenModal(null); }}>
                <Text style={{ color: '#FAFAFA', fontSize: 13, fontWeight: '600' }}>삭제</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
}
