import { Colors, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ConfirmModal } from '../modals/ConfirmModal';
import { DetailFormModal } from '../modals/DetailFormModal';
import type { CodeDetail, CodeGroup } from '../types';
import { styles } from './DetailTab.styles';
import { useDetailTab } from './useDetailTab';

type C = typeof Colors['light'];

interface Props {
  groups: CodeGroup[];
  details: CodeDetail[];
  selectedGroupId: number;
  setSelectedGroupId: (id: number) => void;
  reload: () => void;
  onBack: () => void;
  C: C;
}

export function DetailTab({ groups, details, selectedGroupId, setSelectedGroupId, reload, onBack, C }: Props) {
  const {
    gpSearch, setGpSearch,
    detailSearch, setDetailSearch,
    detailStatusFilter, setDetailStatusFilter,
    detailStatusDropdown, setDetailStatusDropdown,
    selectedDetailIds, setSelectedDetailIds,
    selectedGroup,
    filteredGroups,
    filteredDetails,
    hasDetailSelected,
    toggleDetail, toggleAllDetails,
    openModal, setOpenModal,
    editTarget,
    openEditDetail,
    handleDelete,
    selectedDetailCodes,
  } = useDetailTab(groups, details, selectedGroupId, setSelectedGroupId, reload);

  return (
    <View style={[styles.splitWrapper, { backgroundColor: C.background }]}>
      {/* 헤더 */}
      <View style={[styles.pageHeader, { padding: 20, paddingBottom: 0 }]}>
        <Text style={[styles.pageTitle, { color: C.foreground }]}>공통코드 상세 목록</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.btn, { borderColor: C.border, backgroundColor: C.background }]} onPress={onBack}>
            <Ionicons name="arrow-back" size={13} color={C.foreground} />
            <Text style={[styles.btnText, { color: C.foreground }]}>그룹 목록</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { borderColor: C.border, backgroundColor: C.background, opacity: hasDetailSelected ? 1 : 0.4 }]}
            disabled={!hasDetailSelected}
            onPress={() => {
              const target = filteredDetails.find((d) => selectedDetailIds.includes(d.id));
              if (target) openEditDetail(target);
            }}
          >
            <Ionicons name="pencil-outline" size={13} color={C.foreground} />
            <Text style={[styles.btnText, { color: C.foreground }]}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { borderColor: '#FCA5A5', backgroundColor: C.background, opacity: hasDetailSelected ? 1 : 0.4 }]}
            disabled={!hasDetailSelected}
            onPress={() => setOpenModal('del')}
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
            <Text style={[styles.btnText, { color: C.primaryForeground, fontWeight: '600' }]}>코드 등록</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 분할 레이아웃 */}
      <View style={styles.split}>
        {/* 좌: 그룹 패널 */}
        <View style={[styles.groupPanel, { borderColor: C.border, backgroundColor: C.card }]}>
          <View style={[styles.gpHead, { borderBottomColor: C.border, backgroundColor: C.muted }]}>
            <Text style={[styles.gpHeadTitle, { color: C.mutedForeground }]}>코드 그룹</Text>
            <Text style={{ fontSize: 11, color: C.mutedForeground }}>{groups.length}개</Text>
          </View>
          <View style={[styles.gpSearchWrap, { borderBottomColor: C.border }]}>
            <TextInput
              style={[styles.gpSearch, { borderColor: C.border, backgroundColor: C.background, color: C.foreground }]}
              placeholder="그룹 검색..."
              placeholderTextColor={C.mutedForeground}
              value={gpSearch}
              onChangeText={setGpSearch}
            />
            <TouchableOpacity style={[styles.gpSearchBtn, { borderColor: C.border }]}>
              <Text style={{ fontSize: 12, color: C.foreground }}>검색</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 500 }}>
            {filteredGroups.map((g, idx, arr) => {
              const isActive = g.id === selectedGroupId;
              return (
                <TouchableOpacity
                  key={g.id}
                  style={[
                    styles.gpItem,
                    { borderBottomColor: C.border },
                    idx !== arr.length - 1 && { borderBottomWidth: 1 },
                    isActive && [styles.gpItemActive, { backgroundColor: '#EFF6FF', borderLeftColor: '#1D4ED8' }],
                  ]}
                  onPress={() => {
                    setSelectedGroupId(g.id);
                    setSelectedDetailIds([]);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.gpItemName, { color: C.foreground }]}>{g.name}</Text>
                    <Text style={[styles.gpItemCode, { color: C.mutedForeground }]}>{g.code}</Text>
                  </View>
                  <View style={[styles.gpCount, { backgroundColor: C.muted, borderColor: C.border }]}>
                    <Text style={{ fontSize: 11, color: C.mutedForeground }}>{g.count}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 우: 상세 패널 */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 16 }}>
          {/* 선택된 그룹 정보 카드 */}
          <View style={[styles.detailHeader, { backgroundColor: C.card, borderColor: C.border }]}>
            <View style={styles.dhLeft}>
              <View style={[styles.dhIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="list" size={18} color="#1D4ED8" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.dhTitleRow}>
                  <Text style={[styles.dhName, { color: C.foreground }]}>{selectedGroup?.name}</Text>
                  <View style={[styles.badge, selectedGroup?.active ? styles.badgeGreen : styles.badgeGray]}>
                    <Text style={[styles.badgeText, { color: selectedGroup?.active ? '#16A34A' : C.mutedForeground }]}>
                      {selectedGroup?.active ? '사용' : '미사용'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.codeChip, { backgroundColor: C.muted, borderColor: C.border, alignSelf: 'flex-start', marginTop: 4 }]}>
                  <Text style={[styles.codeChipText, { color: C.mutedForeground }]}>{selectedGroup?.code}</Text>
                </View>
                <Text style={{ fontSize: 12, color: C.mutedForeground, marginTop: 2 }}>{selectedGroup?.desc}</Text>
              </View>
            </View>
            <View style={[styles.dhStats, { backgroundColor: C.muted, borderRadius: Radius.md }]}>
              <View style={styles.dhStat}>
                <Text style={[styles.dhStatVal, { color: C.foreground }]}>{filteredDetails.length}</Text>
                <Text style={[styles.dhStatLabel, { color: C.mutedForeground }]}>전체</Text>
              </View>
              <View style={styles.dhStat}>
                <Text style={[styles.dhStatVal, { color: '#16A34A' }]}>{filteredDetails.filter((d) => d.active).length}</Text>
                <Text style={[styles.dhStatLabel, { color: C.mutedForeground }]}>사용 중</Text>
              </View>
            </View>
          </View>

          {/* 상세 검색 */}
          <View style={[styles.filterRow, { zIndex: 10 }]}>
            <View style={[styles.searchBox, { borderColor: C.border, backgroundColor: C.background }]}>
              <Ionicons name="search-outline" size={14} color={C.mutedForeground} />
              <TextInput
                style={[styles.searchInput, { color: C.foreground }]}
                placeholder="코드, 코드명 검색"
                placeholderTextColor={C.mutedForeground}
                value={detailSearch}
                onChangeText={setDetailSearch}
              />
            </View>
            <View style={{ position: 'relative', zIndex: 10 }}>
              <TouchableOpacity
                style={[styles.dropdown, { borderColor: C.border, backgroundColor: C.background }]}
                onPress={() => setDetailStatusDropdown((v) => !v)}
              >
                <Text style={[styles.dropdownText, { color: C.foreground }]}>
                  {detailStatusFilter === 'all' ? '전체 상태' : detailStatusFilter === 'use' ? '사용' : '미사용'}
                </Text>
                <Ionicons name="chevron-down" size={13} color={C.mutedForeground} />
              </TouchableOpacity>
              {detailStatusDropdown && (
                <View style={[styles.dropdownList, { backgroundColor: C.card, borderColor: C.border }]}>
                  {([['all', '전체 상태'], ['use', '사용'], ['nouse', '미사용']] as const).map(([v, l]) => (
                    <TouchableOpacity
                      key={v}
                      style={[styles.dropdownItem, detailStatusFilter === v && { backgroundColor: C.muted }]}
                      onPress={() => { setDetailStatusFilter(v); setDetailStatusDropdown(false); }}
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

          {/* 상세 테이블 */}
          <View>
            <View style={[styles.tableHeader, { backgroundColor: C.muted, borderColor: C.border }]}>
              <TouchableOpacity style={styles.colChk} onPress={toggleAllDetails}>
                <View style={[styles.checkbox, {
                  borderColor: C.border,
                  backgroundColor: selectedDetailIds.length === filteredDetails.length && filteredDetails.length > 0 ? C.primary : C.background,
                }]}>
                  {selectedDetailIds.length === filteredDetails.length && filteredDetails.length > 0 && (
                    <Ionicons name="checkmark" size={10} color={C.primaryForeground} />
                  )}
                </View>
              </TouchableOpacity>
              {(['상세 코드', '코드명', '설명', '정렬', '사용 여부', '수정일'] as const).map((h, i) => (
                <Text
                  key={h}
                  style={[
                    styles.headerText, { color: C.mutedForeground },
                    i === 0 && { flex: 2.5 },
                    i === 1 && { flex: 1.5 },
                    i === 2 && { flex: 2 },
                    i === 3 && { width: 44, textAlign: 'center' },
                    i === 4 && { width: 72 },
                    i === 5 && { width: 90 },
                  ]}
                >{h}</Text>
              ))}
            </View>
            {filteredDetails.map((d, idx) => {
              const isSel  = selectedDetailIds.includes(d.id);
              const isLast = idx === filteredDetails.length - 1;
              return (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.tableRow, { borderColor: C.border }, isSel && { backgroundColor: C.muted }, !isLast && { borderBottomWidth: 1 }]}
                  onPress={() => toggleDetail(d.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.colChk}>
                    <View style={[styles.checkbox, { borderColor: C.border, backgroundColor: isSel ? C.primary : C.background }]}>
                      {isSel && <Ionicons name="checkmark" size={10} color={C.primaryForeground} />}
                    </View>
                  </View>
                  <View style={{ flex: 2.5 }}>
                    <View style={[styles.codeChip, { backgroundColor: C.muted, borderColor: C.border }]}>
                      <Text style={[styles.codeChipText, { color: C.foreground }]} numberOfLines={1}>{d.code}</Text>
                    </View>
                  </View>
                  <Text style={[styles.cellText, { flex: 1.5, color: C.foreground, fontWeight: '500' }]} numberOfLines={1}>{d.name}</Text>
                  <Text style={[styles.cellText, { flex: 2, color: C.mutedForeground }]} numberOfLines={1}>{d.desc}</Text>
                  <Text style={[styles.cellText, { width: 44, color: C.foreground, textAlign: 'center' }]}>{d.sort}</Text>
                  <View style={{ width: 72 }}>
                    <View style={[styles.badge, d.active ? styles.badgeGreen : styles.badgeGray]}>
                      <Text style={[styles.badgeText, { color: d.active ? '#16A34A' : C.mutedForeground }]}>
                        {d.active ? '사용' : '미사용'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.cellText, { width: 90, color: C.mutedForeground }]} numberOfLines={1}>{d.updatedAt}</Text>
                </TouchableOpacity>
              );
            })}
            <View style={[styles.tableBottom, { borderColor: C.border }]} />
          </View>

          {/* 페이지네이션 */}
          <View style={styles.pagination}>
            <Text style={[styles.totalText, { color: C.mutedForeground }]}>
              전체 <Text style={{ fontWeight: '600', color: C.foreground }}>{filteredDetails.length}개</Text> 코드
            </Text>
            <View style={styles.pageButtons}>
              <TouchableOpacity style={[styles.pageBtn, { borderColor: C.border, backgroundColor: C.primary }]}>
                <Text style={{ fontSize: 13, color: C.primaryForeground }}>1</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* 모달: 등록 */}
      <DetailFormModal
        mode="add"
        visible={openModal === 'add'}
        selectedGroup={selectedGroup}
        onClose={() => setOpenModal(null)}
        onSuccess={reload}
        C={C}
      />

      {/* 모달: 수정 */}
      {editTarget && (
        <DetailFormModal
          mode="edit"
          visible={openModal === 'edit'}
          detail={editTarget}
          selectedGroup={selectedGroup}
          onClose={() => setOpenModal(null)}
          onSuccess={reload}
          C={C}
        />
      )}

      {/* 모달: 삭제 확인 */}
      <ConfirmModal
        visible={openModal === 'del'}
        title="코드 삭제"
        selectedCodes={selectedDetailCodes}
        onConfirm={handleDelete}
        onCancel={() => setOpenModal(null)}
        C={C}
      />
    </View>
  );
}
