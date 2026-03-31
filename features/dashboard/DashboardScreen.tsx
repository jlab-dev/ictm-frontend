/**
 * DashboardScreen.tsx — 대시보드 화면
 *
 * 로그인 후 처음 보이는 메인 화면입니다.
 * 현재는 통계 카드와 최근 목록을 보여주지만, 실제 데이터는 아직
 * 연결되지 않아 모두 '0' 또는 빈 상태로 표시됩니다. (mock data)
 *
 * URL 경로: /
 * 진입점:  app/(app)/index.tsx → 이 컴포넌트를 re-export
 */

import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * 상단 통계 카드 데이터
 * 백엔드 API 연결 후 value 값을 실제 데이터로 교체하면 됩니다.
 */
const STATS = [
  { label: '전체 장비',     value: '0', icon: 'hardware-chip-outline' as const,    color: '#6366F1' },
  { label: '대기 중 점검',  value: '0', icon: 'time-outline' as const,              color: '#F59E0B' },
  { label: '완료된 점검',   value: '0', icon: 'checkmark-circle-outline' as const,  color: '#22C55E' },
  { label: '이번달 리포트', value: '0', icon: 'document-text-outline' as const,     color: '#3B82F6' },
];

export default function DashboardScreen() {
  const { user } = useAuth();               // 현재 로그인한 유저 정보
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];                 // 현재 모드에 맞는 색상

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={styles.inner}
    >
      {/* ── 페이지 헤더 ──────────────────────────────────── */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={[styles.pageTitle, { color: C.foreground }]}>대시보드</Text>
          {/* 로그인한 유저 이름으로 인사말 표시 */}
          <Text style={[styles.pageDesc, { color: C.mutedForeground }]}>
            안녕하세요, {user?.username} 님
          </Text>
        </View>
        {/* 역할 뱃지 — ADMIN이면 진한 색, 나머지는 회색 */}
        <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'}>
          {user?.role}
        </Badge>
      </View>

      {/* ── 통계 카드 그리드 ──────────────────────────────── */}
      {/* flexWrap: 'wrap' — 화면이 좁으면 아래로 줄바꿈 */}
      <View style={styles.statsGrid}>
        {STATS.map((stat) => (
          <Card key={stat.label} style={styles.statCard}>
            <CardContent style={styles.statContent}>
              {/* 아이콘 배경 — 색상에 18(hex) = 약 10% 투명도 */}
              <View style={[styles.statIcon, { backgroundColor: stat.color + '18' }]}>
                <Ionicons name={stat.icon} size={20} color={stat.color} />
              </View>
              {/* 숫자 값 */}
              <Text style={[styles.statValue, { color: C.foreground }]}>{stat.value}</Text>
              {/* 라벨 */}
              <Text style={[styles.statLabel, { color: C.mutedForeground }]}>{stat.label}</Text>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* ── 최근 점검 내역 카드 ───────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>최근 점검 내역</CardTitle>
          <CardDescription>최근 등록된 점검 항목을 확인하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 데이터가 없을 때 표시하는 빈 상태 UI */}
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: C.muted }]}>
              <Ionicons name="clipboard-outline" size={28} color={C.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: C.foreground }]}>점검 내역이 없습니다</Text>
            <Text style={[styles.emptyDesc, { color: C.mutedForeground }]}>
              새로운 점검 항목을 등록해보세요.
            </Text>
          </View>
        </CardContent>
      </Card>

      {/* ── 최근 등록 장비 카드 ───────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>최근 등록 장비</CardTitle>
          <CardDescription>최근 등록된 장비 목록을 확인하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: C.muted }]}>
              <Ionicons name="hardware-chip-outline" size={28} color={C.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: C.foreground }]}>등록된 장비가 없습니다</Text>
            <Text style={[styles.emptyDesc, { color: C.mutedForeground }]}>
              장비 관리 메뉴에서 장비를 등록해보세요.
            </Text>
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // contentContainerStyle: ScrollView 내부 콘텐츠 영역 스타일
  inner: {
    padding: 24,
    gap: 20, // 각 섹션 사이 간격
  },
  // 페이지 제목 + 뱃지를 양쪽으로 배치
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  pageDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  // 통계 카드 그리드 — 가로로 배치, 좁으면 줄바꿈
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  // 개별 통계 카드 — flex: 1로 동일한 너비 유지, minWidth로 너무 작아지지 않게 제한
  statCard: {
    flex: 1,
    minWidth: 140,
  },
  statContent: {
    gap: 10,
    paddingVertical: 20,
  },
  // 통계 아이콘 원형 배경
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 통계 숫자 (크고 굵게)
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
  },
  // 빈 상태 UI — 가운데 정렬
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28, // 완전한 원형
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
});
