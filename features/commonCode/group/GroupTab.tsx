import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ConfirmModal } from '../modals/ConfirmModal';
import { GroupFormModal } from '../modals/GroupFormModal';
import type { CodeDetail, CodeGroup } from '../types';
import { styles } from './GroupTab.styles';
import { useGroupTab } from './useGroupTab';

type C = typeof Colors['light'];

interface Props {
  groups: CodeGroup[];
  details: CodeDetail[];
  reload: () => void;
  onNavigateToDetail: (groupId: number) => void;
  C: C;
}

export function GroupTab({ groups, details, reload, onNavigateToDetail, C }: Props) {
  const {
    groupSearch, setGroupSearch,
    groupStatusFilter, setGroupStatusFilter,
    statusDropdown, setStatusDropdown,
    selectedGroupIds, selectedGroup,
    toggleGroup, toggleAllGroups,
    hasGroupSelected, canEditGroup, canDeleteGroup,
    groupPage, setGroupPage, totalPages, pagedGroups, pageNumbers,
    filteredGroups,
    openModal, setOpenModal,
    handleDelete, selectedCodes,
  } = useGroupTab(groups, reload);

  return (
    <ScrollView contentContainerStyle={styles.inner}>
      {/* 헤더 */}
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: C.foreground }]}>공통코드 그룹 목록</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.btn, { borderColor: C.border, backgroundColor: C.background, opacity: canEditGroup ? 1 : 0.4 }]}
            onPress={() => canEditGroup && setOpenModal('edit')}
            disabled={!canEditGroup}
          >
            <Ionicons name="pencil-outline" size={13} color={C.foreground} />
            <Text style={[styles.btnText, { color: C.foreground }]}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { borderColor: '#FCA5A5', backgroundColor: C.background, opacity: canDeleteGroup ? 1 : 0.4 }]}
            onPress={() => canDeleteGroup && setOpenModal('del')}
            disabled={!canDeleteGroup}
          >
            <Ionicons name="trash-outline" size={13} color="#EF4444" />
            <Text style={[styles.btnText, { color: '#EF4444' }]}>삭제</Text>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: C.border }]} />
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: C.primary, borderColor: C.primary }]}
            onPress={() => setOpenModal('add')}
          >
            <Ionicons name="add" size={14} color={C.primaryForeground} />
            <Text style={[styles.btnText, { color: C.primaryForeground, fontWeight: '600' }]}>그룹 등록</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 통계 카드 */}
      <View style={styles.statsGrid}>
        {[
          { label: '전체 그룹',    value: groups.length,                          color: C.foreground },
          { label: '전체 코드 수', value: details.length,                         color: '#1D4ED8' },
          { label: '사용 중',      value: groups.filter((g) => g.active).length,  color: '#16A34A' },
          { label: '미사용',       value: groups.filter((g) => !g.active).length, color: '#B45309' },
        ].map((s) => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={[styles.statLabel, { color: C.mutedForeground }]}>{s.label}</Text>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
          </View>
        ))}
      </View>

      {/* 검색 바 */}
      <View style={styles.filterRow}>
        <View style={[styles.searchBox, { borderColor: C.border, backgroundColor: C.background }]}>
          <Ionicons name="search-outline" size={14} color={C.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: C.foreground }]}
            placeholder="그룹 코드, 그룹명 검색"
            placeholderTextColor={C.mutedForeground}
            value={groupSearch}
            onChangeText={setGroupSearch}
          />
        </View>
        <View style={{ position: 'relative', zIndex: 10 }}>
          <TouchableOpacity
            style={[styles.dropdown, { borderColor: C.border, backgroundColor: C.background }]}
            onPress={() => setStatusDropdown((v) => !v)}
          >
            <Text style={[styles.dropdownText, { color: C.foreground }]}>
              {groupStatusFilter === 'all' ? '전체 상태' : groupStatusFilter === 'use' ? '사용' : '미사용'}
            </Text>
            <Ionicons name="chevron-down" size={13} color={C.mutedForeground} />
          </TouchableOpacity>
          {statusDropdown && (
            <View style={[styles.dropdownList, { backgroundColor: C.card, borderColor: C.border }]}>
              {([['all', '전체 상태'], ['use', '사용'], ['nouse', '미사용']] as const).map(([v, l]) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.dropdownItem, groupStatusFilter === v && { backgroundColor: C.muted }]}
                  onPress={() => { setGroupStatusFilter(v); setStatusDropdown(false); }}
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

      {/* 테이블 */}
      <View>
        <View style={[styles.tableHeader, { backgroundColor: C.muted, borderColor: C.border }]}>
          <TouchableOpacity style={styles.colChk} onPress={toggleAllGroups}>
            <View style={[styles.checkbox, {
              borderColor: C.border,
              backgroundColor: selectedGroupIds.length === filteredGroups.length && filteredGroups.length > 0 ? C.primary : C.background,
            }]}>
              {selectedGroupIds.length === filteredGroups.length && filteredGroups.length > 0 && (
                <Ionicons name="checkmark" size={10} color={C.primaryForeground} />
              )}
            </View>
          </TouchableOpacity>
          {(['그룹 코드', '그룹명', '설명', '코드 수', '정렬', '사용 여부', '수정일', '상세'] as const).map((h, i) => (
            <Text
              key={h}
              style={[
                styles.headerText, { color: C.mutedForeground },
                i === 0 && { flex: 2 },
                i === 1 && { flex: 1.5 },
                i === 2 && { flex: 2 },
                i === 3 && { width: 60, textAlign: 'center' },
                i === 4 && { width: 44, textAlign: 'center' },
                i === 5 && { width: 72 },
                i === 6 && { width: 90 },
                i === 7 && { width: 52, textAlign: 'center' },
              ]}
            >{h}</Text>
          ))}
        </View>
        {pagedGroups.map((group, idx) => {
          const isSelected = selectedGroupIds.includes(group.id);
          const isLast = idx === pagedGroups.length - 1;
          return (
            <TouchableOpacity
              key={group.id}
              style={[styles.tableRow, { borderColor: C.border }, isSelected && { backgroundColor: C.muted }, !isLast && { borderBottomWidth: 1 }]}
              onPress={() => toggleGroup(group.id)}
              activeOpacity={0.7}
            >
              <View style={styles.colChk}>
                <View style={[styles.checkbox, { borderColor: C.border, backgroundColor: isSelected ? C.primary : C.background }]}>
                  {isSelected && <Ionicons name="checkmark" size={10} color={C.primaryForeground} />}
                </View>
              </View>
              <View style={{ flex: 2 }}>
                <View style={[styles.codeChip, { backgroundColor: C.muted, borderColor: C.border }]}>
                  <Text style={[styles.codeChipText, { color: C.foreground }]} numberOfLines={1}>{group.code}</Text>
                </View>
              </View>
              <Text style={[styles.cellText, { flex: 1.5, color: C.foreground, fontWeight: '500' }]} numberOfLines={1}>{group.name}</Text>
              <Text style={[styles.cellText, { flex: 2, color: C.mutedForeground }]} numberOfLines={1}>{group.desc}</Text>
              <Text style={[styles.cellText, { width: 60, color: '#1D4ED8', textAlign: 'center', fontWeight: '600' }]}>{group.count}</Text>
              <Text style={[styles.cellText, { width: 44, color: C.foreground, textAlign: 'center' }]}>{group.sort}</Text>
              <View style={{ width: 72 }}>
                <View style={[styles.badge, group.active ? styles.badgeGreen : styles.badgeGray]}>
                  <Text style={[styles.badgeText, { color: group.active ? '#16A34A' : C.mutedForeground }]}>
                    {group.active ? '사용' : '미사용'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.cellText, { width: 90, color: C.mutedForeground }]} numberOfLines={1}>{group.updatedAt}</Text>
              <View style={{ width: 52, alignItems: 'center' }}>
                <TouchableOpacity style={[styles.actionBtn, { borderColor: C.border }]} onPress={() => onNavigateToDetail(group.id)}>
                  <Text style={[styles.actionBtnText, { color: C.foreground }]}>상세</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={[styles.tableBottom, { borderColor: C.border }]} />
      </View>

      {/* 페이지네이션 */}
      <View style={styles.pagination}>
        <Text style={[styles.totalText, { color: C.mutedForeground }]}>
          전체 <Text style={{ fontWeight: '600', color: C.foreground }}>{filteredGroups.length}개</Text> 그룹
        </Text>
        <View style={styles.pageButtons}>
          <TouchableOpacity
            style={[styles.pageBtn, { borderColor: C.border, backgroundColor: C.background, opacity: groupPage === 1 ? 0.4 : 1 }]}
            onPress={() => setGroupPage((p) => Math.max(1, p - 1))}
            disabled={groupPage === 1}
          >
            <Ionicons name="chevron-back" size={13} color={C.foreground} />
          </TouchableOpacity>
          {pageNumbers.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.pageBtn, { borderColor: C.border, backgroundColor: groupPage === p ? C.primary : C.background }]}
              onPress={() => setGroupPage(p)}
            >
              <Text style={{ fontSize: 13, color: groupPage === p ? C.primaryForeground : C.foreground }}>{p}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.pageBtn, { borderColor: C.border, backgroundColor: C.background, opacity: groupPage === totalPages ? 0.4 : 1 }]}
            onPress={() => setGroupPage((p) => Math.min(totalPages, p + 1))}
            disabled={groupPage === totalPages}
          >
            <Ionicons name="chevron-forward" size={13} color={C.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 모달: 등록 */}
      <GroupFormModal
        mode="add"
        visible={openModal === 'add'}
        onClose={() => setOpenModal(null)}
        onSuccess={reload}
        C={C}
      />

      {/* 모달: 수정 */}
      {selectedGroup && (
        <GroupFormModal
          mode="edit"
          visible={openModal === 'edit'}
          group={selectedGroup}
          onClose={() => setOpenModal(null)}
          onSuccess={reload}
          C={C}
        />
      )}

      {/* 모달: 삭제 확인 */}
      <ConfirmModal
        visible={openModal === 'del'}
        title="코드 그룹 삭제"
        warning="해당 그룹의 모든 상세 코드가 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
        selectedCodes={selectedCodes}
        onConfirm={handleDelete}
        onCancel={() => setOpenModal(null)}
        C={C}
      />
    </ScrollView>
  );
}
