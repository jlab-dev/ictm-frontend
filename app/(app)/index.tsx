import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

const STATS = [
  { label: '전체 장비',    value: '0', icon: 'hardware-chip-outline' as const, color: '#6366F1' },
  { label: '대기 중 점검', value: '0', icon: 'time-outline' as const,           color: '#F59E0B' },
  { label: '완료된 점검',  value: '0', icon: 'checkmark-circle-outline' as const, color: '#22C55E' },
  { label: '이번달 리포트', value: '0', icon: 'document-text-outline' as const,  color: '#3B82F6' },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  return (
    <ScrollView style={[styles.container, { backgroundColor: C.background }]} contentContainerStyle={styles.inner}>
      {/* 페이지 헤더 */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={[styles.pageTitle, { color: C.foreground }]}>대시보드</Text>
          <Text style={[styles.pageDesc, { color: C.mutedForeground }]}>
            안녕하세요, {user?.username} 님
          </Text>
        </View>
        <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'}>
          {user?.role}
        </Badge>
      </View>

      {/* 통계 카드 */}
      <View style={styles.statsGrid}>
        {STATS.map((stat) => (
          <Card key={stat.label} style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '18' }]}>
                <Ionicons name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: C.foreground }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: C.mutedForeground }]}>{stat.label}</Text>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* 최근 점검 내역 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 점검 내역</CardTitle>
          <CardDescription>최근 등록된 점검 항목을 확인하세요.</CardDescription>
        </CardHeader>
        <CardContent>
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

      {/* 최근 등록 장비 */}
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
  inner: {
    padding: 24,
    gap: 20,
  },
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
  },
  statContent: {
    gap: 10,
    paddingVertical: 20,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
