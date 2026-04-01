/**
 * AppLayout.tsx — 반응형 앱 레이아웃
 *
 * 화면 너비에 따라 두 가지 레이아웃을 제공합니다:
 *   - 데스크탑 (768px 이상): 왼쪽에 사이드바 고정 + 오른쪽에 콘텐츠
 *   - 모바일 (768px 미만): 상단 헤더 + 햄버거 메뉴로 사이드바를 드로어로 표시
 *
 * 모든 로그인 후 화면은 이 컴포넌트 안에 렌더링됩니다.
 */

import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useAuth } from '@/features/auth/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Sidebar from './Sidebar';

/** 데스크탑/모바일 전환 기준 너비 (px) */
const BREAKPOINT = 768;

/** 경로(URL)별 페이지 제목 — 모바일 헤더에 표시됩니다 */
const PAGE_TITLES: Record<string, string> = {
  '/':            '대시보드',
  '/notice':      '공지사항',
  '/common-code': '공통코드',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();       // 현재 화면 너비 (리사이즈 시 자동 업데이트)
  const isDesktop = width >= BREAKPOINT;          // 데스크탑 여부 판단
  const [drawerOpen, setDrawerOpen] = useState(false); // 모바일 드로어(사이드바) 열림 상태
  const pathname = usePathname();                 // 현재 URL 경로 (예: '/', '/equipment')
  const { user, logout } = useAuth();              // 유저 정보와 로그아웃 함수
  const scheme = useColorScheme() ?? 'light';     // 다크/라이트 모드
  const C = Colors[scheme];                       // 현재 모드에 맞는 색상
  const S = Colors.sidebar[scheme];               // 사이드바 전용 색상
  const pageTitle = PAGE_TITLES[pathname] ?? '';  // 현재 페이지 제목

  // ─── 데스크탑 레이아웃 ─────────────────────────────────────────
  if (isDesktop) {
    return (
      <View style={[styles.desktop, { backgroundColor: C.background }]}>
        {/* 왼쪽 사이드바 — 항상 고정 표시 */}
        <Sidebar />
        {/* 오른쪽 콘텐츠 영역 — 실제 화면이 여기에 들어옴 */}
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  // ─── 모바일 레이아웃 ─────────────────────────────────────────
  return (
    <View style={[styles.mobile, { backgroundColor: C.background }]}>
      {/* 상단 헤더 바 */}
      <View style={[styles.mobileHeader, { backgroundColor: S.background, borderBottomColor: S.border }]}>
        {/* 햄버거 메뉴 버튼 — 누르면 사이드바 드로어가 열림 */}
        <TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.iconBtn}>
          <Ionicons name="menu-outline" size={22} color={S.textActive} />
        </TouchableOpacity>

        {/* 현재 페이지 제목 */}
        <Text style={[styles.mobileTitle, { color: S.textActive }]}>{pageTitle}</Text>

        {/* 역할 뱃지 */}
        <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'}>
          {user?.role}
        </Badge>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity onPress={logout} style={styles.iconBtn}>
          <Ionicons name="log-out-outline" size={20} color={S.text} />
        </TouchableOpacity>
      </View>

      {/* 콘텐츠 영역 */}
      <View style={styles.content}>{children}</View>

      {/* 사이드바 드로어 — 모바일에서 햄버거 메뉴를 누르면 나타나는 오버레이 */}
      <Modal visible={drawerOpen} transparent animationType="fade">
        {/* 바깥 영역을 누르면 드로어 닫힘 */}
        <Pressable style={styles.overlay} onPress={() => setDrawerOpen(false)}>
          {/* 사이드바 내부를 누를 때는 닫히지 않게 이벤트 전파 막음 */}
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.drawer}>
              <Sidebar />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // 데스크탑: 가로로 나란히 (사이드바 | 콘텐츠)
  desktop: {
    flex: 1,
    flexDirection: 'row',
  },
  // 모바일: 세로로 쌓기 (헤더 위 / 콘텐츠 아래)
  mobile: {
    flex: 1,
    flexDirection: 'column',
  },
  // 콘텐츠 영역: 남은 공간 모두 차지
  content: {
    flex: 1,
  },
  // 모바일 상단 헤더
  mobileHeader: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  // 헤더 아이콘 버튼 (햄버거, 로그아웃)
  iconBtn: {
    padding: 6,
  },
  // 헤더 페이지 제목
  mobileTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
  },
  // 드로어 뒤 반투명 검정 오버레이
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
  },
  // 드로어 컨테이너 (사이드바가 들어가는 박스)
  drawer: {
    height: '100%',
  },
});
