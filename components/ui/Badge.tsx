/**
 * Badge.tsx — 뱃지 컴포넌트
 *
 * 짧은 텍스트를 색상 배경으로 감싸서 표시하는 작은 라벨입니다.
 * 주로 역할(ADMIN/INSPECTOR), 상태(완료/대기) 등을 표시할 때 씁니다.
 *
 * 사용 예시:
 *   <Badge variant="default">ADMIN</Badge>
 *   <Badge variant="success">완료</Badge>
 *   <Badge variant="warning">대기</Badge>
 */

import { StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * 뱃지 스타일 종류:
 * - default:     진한 배경 (기본, ADMIN 등 중요한 항목)
 * - secondary:   연한 회색 배경 (일반, INSPECTOR 등)
 * - outline:     테두리만 있는 스타일
 * - destructive: 빨간 배경 (에러, 위험)
 * - success:     초록 배경 (성공, 완료)
 * - warning:     노란 배경 (경고, 대기)
 */
type Variant = 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';

interface BadgeProps {
  children: React.ReactNode; // 뱃지 안에 표시할 텍스트
  variant?: Variant;         // 스타일 종류 (기본값: 'default')
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme]; // 현재 모드에 맞는 색상

  // variant별 배경색과 텍스트 색상 정의
  const variantStyles: Record<Variant, { bg: string; text: string; border?: string }> = {
    default:     { bg: C.primary,     text: C.primaryForeground },
    secondary:   { bg: C.secondary,   text: C.secondaryForeground },
    outline:     { bg: 'transparent', text: C.foreground, border: C.border }, // 테두리만
    destructive: { bg: C.destructive, text: C.destructiveForeground },
    success:     { bg: '#DCFCE7',     text: '#166534' }, // 연한 초록 배경 + 진한 초록 텍스트
    warning:     { bg: '#FEF9C3',     text: '#854D0E' }, // 연한 노랑 배경 + 갈색 텍스트
  };

  const v = variantStyles[variant];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: v.bg,
          // border가 있는 variant만 테두리 표시
          borderColor: v.border ?? 'transparent',
          borderWidth: v.border ? 1 : 0,
        },
      ]}
    >
      <Text style={[styles.text, { color: v.text }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start', // 텍스트 길이에 맞게 너비 자동 조절
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
