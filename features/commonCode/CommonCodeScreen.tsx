/**
 * CommonCodeScreen.tsx — 공통코드 관리 화면 (탭 전환 진입점)
 *
 * 탭 구조:
 *   - GroupTab (SCR-036): 코드 그룹 목록
 *   - DetailTab (SCR-037): 코드 상세 목록
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DetailTab } from './detail/DetailTab';
import { GroupTab } from './group/GroupTab';
import { type Tab } from './types';
import { useCommonCodeData } from './useCommonCodeData';

const TABS: [Tab, string][] = [
  ['group',  '코드 그룹 목록'],
  ['detail', '코드 상세 목록'],
];

export default function CommonCodeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  const {
    groups,
    details,
    isLoading,
    reload,
    activeTab,
    setActiveTab,
    selectedGroupId,
    setSelectedGroupId,
  } = useCommonCodeData();

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: C.background }]}>
        <Text style={{ color: C.mutedForeground, fontSize: 13 }}>불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: C.background }]}>
      {/* ── 탭 바 */}
      <View style={[styles.tabBar, { borderBottomColor: C.border }]}>
        {TABS.map(([tab, label]) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && { borderBottomColor: C.foreground, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, { color: isActive ? C.foreground : C.mutedForeground }, isActive && { fontWeight: '600' }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── 탭 콘텐츠 */}
      {activeTab === 'group' && (
        <GroupTab
          groups={groups}
          details={details}
          reload={reload}
          onNavigateToDetail={(id) => { setSelectedGroupId(id); setActiveTab('detail'); }}
          C={C}
        />
      )}
      {activeTab === 'detail' && (
        <DetailTab
          groups={groups}
          details={details}
          selectedGroupId={selectedGroupId}
          setSelectedGroupId={setSelectedGroupId}
          reload={reload}
          onBack={() => setActiveTab('group')}
          C={C}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  center:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabBar:  { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 20 },
  tab:     { paddingVertical: 13, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: 13 },
});
