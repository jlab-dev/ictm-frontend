/**
 * app/(app)/_layout.tsx — 로그인 후 화면 공통 레이아웃
 *
 * (app) 폴더 안의 모든 화면(대시보드 등)에 공통으로 적용되는 레이아웃입니다.
 * AppLayout으로 감싸서 사이드바(데스크탑)와 헤더(모바일)를 제공합니다.
 *
 * 구조:
 *   AppLayout (사이드바 + 헤더)
 *     └── Slot (현재 경로의 실제 화면이 여기에 렌더링됨)
 *
 * Slot = Expo Router가 제공하는 컴포넌트로, 현재 URL에 맞는 화면을
 * 자동으로 끼워 넣어줍니다. (React의 children과 비슷한 개념)
 */

import { Slot } from 'expo-router';
import AppLayout from '@/components/layout/AppLayout';

export default function AppGroupLayout() {
  return (
    <AppLayout>
      {/* Slot 위치에 현재 경로의 화면이 렌더링됩니다 */}
      {/* 예: / → DashboardScreen, /equipment → EquipmentScreen */}
      <Slot />
    </AppLayout>
  );
}
