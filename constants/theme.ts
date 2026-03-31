/**
 * theme.ts — 앱 전체 디자인 토큰 정의
 *
 * 색상, 모서리 반경, 간격, 폰트 등 앱 전체에서 공통으로 사용하는
 * 디자인 값들을 한 곳에 모아둔 파일입니다.
 *
 * 사용 예시:
 *   import { Colors, Radius } from '@/constants/theme';
 *   const C = Colors['light'];
 *   <View style={{ backgroundColor: C.background }} />
 */

import { Platform } from 'react-native';

export const Colors = {
  // ─── 라이트 모드 색상 ───────────────────────────────────────────
  light: {
    background: '#FFFFFF',          // 화면 배경색
    foreground: '#09090B',          // 기본 텍스트 색상
    card: '#FFFFFF',                // 카드 배경색
    cardForeground: '#09090B',      // 카드 안 텍스트 색상
    primary: '#18181B',             // 주요 버튼/강조 색상 (거의 검정)
    primaryForeground: '#FAFAFA',   // primary 위의 텍스트 색상 (흰색)
    secondary: '#F4F4F5',           // 보조 버튼/배경 색상 (연한 회색)
    secondaryForeground: '#18181B', // secondary 위의 텍스트 색상
    muted: '#F4F4F5',               // 비활성 배경 색상 (연한 회색)
    mutedForeground: '#71717A',     // 비활성 텍스트 색상 (회색)
    accent: '#F4F4F5',              // 강조 배경색
    accentForeground: '#18181B',    // 강조 텍스트 색상
    border: '#E4E4E7',              // 테두리 색상
    input: '#E4E4E7',               // 입력창 테두리 색상
    destructive: '#EF4444',         // 에러/삭제 색상 (빨강)
    destructiveForeground: '#FAFAFA', // 에러 위의 텍스트 색상
    success: '#22C55E',             // 성공 색상 (초록)
    warning: '#F59E0B',             // 경고 색상 (노랑)
    // 별칭 — 위 색상과 동일하지만 용도별로 구분하기 위한 이름
    text: '#09090B',
    textSecondary: '#71717A',
    tint: '#18181B',
    icon: '#71717A',
    tabIconDefault: '#71717A',
    tabIconSelected: '#18181B',
  },

  // ─── 다크 모드 색상 ───────────────────────────────────────────
  dark: {
    background: '#09090B',          // 화면 배경색 (거의 검정)
    foreground: '#FAFAFA',          // 기본 텍스트 색상 (흰색)
    card: '#18181B',                // 카드 배경색
    cardForeground: '#FAFAFA',
    primary: '#FAFAFA',             // 주요 버튼 색상 (흰색)
    primaryForeground: '#09090B',   // primary 위의 텍스트 색상 (검정)
    secondary: '#27272A',
    secondaryForeground: '#FAFAFA',
    muted: '#27272A',
    mutedForeground: '#A1A1AA',
    accent: '#27272A',
    accentForeground: '#FAFAFA',
    border: '#27272A',
    input: '#27272A',
    destructive: '#EF4444',
    destructiveForeground: '#FAFAFA',
    success: '#22C55E',
    warning: '#F59E0B',
    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
    tint: '#FAFAFA',
    icon: '#A1A1AA',
    tabIconDefault: '#A1A1AA',
    tabIconSelected: '#FAFAFA',
  },

  // ─── 사이드바 전용 색상 ───────────────────────────────────────
  // 사이드바는 라이트/다크 모드와 별도로 자체 색상 체계를 사용합니다
  sidebar: {
    light: {
      background: '#F9F9F9',          // 사이드바 배경
      backgroundActive: '#F0F0F0',    // 선택된 메뉴 항목 배경
      border: '#E4E4E7',              // 사이드바 오른쪽 테두리
      text: '#71717A',                // 일반 메뉴 텍스트 색상
      textActive: '#09090B',          // 선택된 메뉴 텍스트 색상
      indicator: '#18181B',           // 활성 상태 인디케이터 색상
    },
    dark: {
      background: '#18181B',
      backgroundActive: '#27272A',
      border: '#27272A',
      text: '#A1A1AA',
      textActive: '#FAFAFA',
      indicator: '#FAFAFA',
    },
  },
};

// ─── 모서리 반경 (border-radius) ───────────────────────────────────
// 숫자가 클수록 더 둥근 모서리
export const Radius = {
  sm: 6,   // 작은 요소 (뱃지 등)
  md: 8,   // 일반 요소 (버튼, 입력창 등)
  lg: 10,  // 큰 요소 (카드 등)
  xl: 14,  // 매우 큰 요소 (모달, 로그인 카드 등)
};

// ─── 간격 (spacing) ────────────────────────────────────────────────
// 패딩/마진에 사용하는 표준 간격 값 (4의 배수)
export const Spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
};

// ─── 폰트 ─────────────────────────────────────────────────────────
// 플랫폼(iOS/Android/웹)마다 사용하는 기본 폰트가 다릅니다
// Platform.select()가 현재 실행 환경에 맞는 폰트를 자동으로 선택해줍니다
export const Fonts = Platform.select({
  ios:     { sans: 'system-ui', mono: 'ui-monospace' },
  default: { sans: 'normal',    mono: 'monospace' },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
