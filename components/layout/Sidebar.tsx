/**
 * Sidebar.tsx — 사이드바 네비게이션 컴포넌트
 *
 * 세 가지 영역으로 구성됩니다:
 *   1. 상단 로고 영역 — 앱 이름 표시
 *   2. 중앙 메뉴 영역 — 페이지 이동 버튼들
 *   3. 하단 유저 영역 — 로그인한 사용자 정보 + 로그아웃 버튼
 *
 * 데스크탑에서는 항상 보이고, 모바일에서는 드로어로 표시됩니다.
 * (AppLayout.tsx에서 제어)
 */

import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/features/auth/AuthContext';
import { Colors, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * 네비게이션 메뉴 항목 정의
 * 새 화면을 추가할 때 여기에 항목을 추가하면 됩니다.
 *
 * label: 메뉴에 표시되는 텍스트
 * icon: 비활성 상태 아이콘 이름 (Ionicons)
 * iconActive: 활성(선택됨) 상태 아이콘 이름
 * route: 이동할 URL 경로
 */
const NAV_ITEMS = [
  { label: '대시보드', icon: 'home-outline' as const, iconActive: 'home' as const, route: '/' },
];

export default function Sidebar() {
  const scheme = useColorScheme() ?? 'light';
  const S = Colors.sidebar[scheme]; // 사이드바 전용 색상
  const pathname = usePathname();   // 현재 URL 경로 (활성 메뉴 표시에 사용)
  const router = useRouter();       // 화면 이동 함수
  const { user, logout } = useAuth(); // 유저 정보와 로그아웃 함수

  return (
    <View style={[styles.sidebar, { backgroundColor: S.background, borderRightColor: S.border }]}>

      {/* ── 1. 로고 영역 ────────────────────────────────── */}
      <View style={[styles.logoArea, { borderBottomColor: S.border }]}>
        <Text style={[styles.logoText, { color: S.textActive }]}>ICTM</Text>
        <Text style={[styles.logoSub, { color: S.text }]}>정보통신설비 유지보수</Text>
      </View>

      {/* ── 2. 메뉴 영역 ────────────────────────────────── */}
      <View style={styles.nav}>
        <Text style={[styles.navSection, { color: S.text }]}>메뉴</Text>

        {/* NAV_ITEMS 배열을 순회하며 메뉴 버튼 렌더링 */}
        {NAV_ITEMS.map((item) => {
          // 현재 경로와 메뉴의 route가 같으면 활성(선택됨) 상태
          const isActive = pathname === item.route;

          return (
            <TouchableOpacity
              key={item.route}
              style={[
                styles.navItem,
                // 활성 상태일 때만 배경색 변경
                isActive && { backgroundColor: S.backgroundActive },
              ]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              {/* 활성 상태면 채워진 아이콘, 아니면 outline 아이콘 */}
              <Ionicons
                name={isActive ? item.iconActive : item.icon}
                size={18}
                color={isActive ? S.textActive : S.text}
              />
              <Text
                style={[
                  styles.navLabel,
                  { color: isActive ? S.textActive : S.text },
                  isActive && styles.navLabelActive, // 활성 상태면 볼드
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── 3. 하단 유저 영역 ────────────────────────────── */}
      <View style={[styles.bottom, { borderTopColor: S.border }]}>
        {/* 유저 정보 카드 */}
        <View style={[styles.userRow, { backgroundColor: S.backgroundActive, borderRadius: Radius.md }]}>
          {/* 아바타 — 유저 이름 첫 글자를 대문자로 표시 */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.username?.[0]?.toUpperCase()}</Text>
          </View>
          <View style={styles.userTexts}>
            {/* numberOfLines={1}: 이름이 길면 ...으로 잘림 */}
            <Text style={[styles.userName, { color: S.textActive }]} numberOfLines={1}>
              {user?.username}
            </Text>
            <Text style={[styles.userRole, { color: S.text }]}>{user?.role}</Text>
          </View>
        </View>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={16} color={S.text} />
          <Text style={[styles.logoutText, { color: S.text }]}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 사이드바 전체 컨테이너 — 고정 너비 240px
  sidebar: {
    width: 240,
    borderRightWidth: 1,
    flexDirection: 'column',
  },
  // 로고 영역
  logoArea: {
    padding: 20,
    borderBottomWidth: 1,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  logoSub: {
    fontSize: 10,
    marginTop: 3,
  },
  // 메뉴 영역 — flex: 1로 남은 공간 모두 차지 (하단 영역을 아래로 밀어냄)
  nav: {
    flex: 1,
    padding: 12,
    gap: 2,
  },
  // "메뉴" 섹션 레이블 (작은 대문자 텍스트)
  navSection: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  // 개별 메뉴 항목
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    gap: 10,
  },
  navLabel: {
    fontSize: 13,
  },
  navLabelActive: {
    fontWeight: '600',
  },
  // 하단 유저 영역
  bottom: {
    padding: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  // 유저 정보 가로 배치 (아바타 | 이름/역할)
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  // 원형 아바타
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FAFAFA',
    fontWeight: '600',
    fontSize: 13,
  },
  userTexts: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
  },
  userRole: {
    fontSize: 11,
    marginTop: 1,
  },
  // 로그아웃 버튼
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
  },
  logoutText: {
    fontSize: 13,
  },
});
