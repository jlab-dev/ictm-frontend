/**
 * app/_layout.tsx — 앱 전체 루트 레이아웃
 *
 * Expo Router에서 가장 먼저 실행되는 파일입니다.
 * 두 가지 역할을 합니다:
 *   1. AuthProvider로 앱 전체를 감싸 로그인 상태를 전역으로 제공
 *   2. 로그인 여부에 따라 적절한 화면으로 자동 이동 (라우팅 보호)
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/features/auth/AuthContext';
import { ThemeProvider as AppThemeProvider } from '@/context/ThemeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Expo Router 설정 — 앱 시작 시 기본으로 보여줄 그룹 지정
export const unstable_settings = {
  anchor: '(app)',
};

/**
 * 실제 네비게이션 로직을 담당하는 내부 컴포넌트
 * AuthProvider 안에 있어야 useAuth()를 사용할 수 있어서 분리했습니다.
 */
function RootLayoutNav() {
  const { user, isLoading } = useAuth(); // 현재 로그인 상태와 로딩 여부
  const segments = useSegments();        // 현재 URL 경로 조각 (예: ['login'] 또는 ['(app)'])
  const router = useRouter();            // 화면 이동 함수
  const colorScheme = useColorScheme();  // 다크/라이트 모드

  /**
   * user 또는 isLoading 상태가 바뀔 때마다 실행됩니다.
   * 로그인 상태에 따라 적절한 화면으로 자동 이동합니다.
   */
  useEffect(() => {
    // 아직 토큰 복원 중이면 아무것도 하지 않음 (깜박임 방지)
    if (isLoading) return;

    // 현재 /login 페이지에 있는지 확인
    const inAuthGroup = segments[0] === 'login';

    if (!user && !inAuthGroup) {
      // 로그인 안 됨 + /login이 아닌 곳에 있으면 → 로그인 화면으로 이동
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // 로그인 됨 + /login에 있으면 → 대시보드로 이동 (이미 로그인한 상태)
      router.replace('/');
    }
  }, [user, isLoading, segments]);

  return (
    // ThemeProvider: 다크/라이트 모드에 따라 네비게이션 테마 적용
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Stack: 화면을 스택처럼 쌓아서 이동하는 네비게이터 */}
      <Stack>
        {/* 로그인 화면 — 헤더(상단 제목 바) 숨김 */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        {/* (app) 그룹 — 대시보드 등 로그인 후 화면들, 헤더 숨김 */}
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
      {/* 상태바(시계/배터리 표시줄) 스타일 자동 설정 */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

/**
 * 최상위 컴포넌트 — AuthProvider로 앱 전체를 감쌉니다.
 * AuthProvider가 없으면 하위 컴포넌트에서 useAuth()를 쓸 수 없습니다.
 */
export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </AppThemeProvider>
  );
}
