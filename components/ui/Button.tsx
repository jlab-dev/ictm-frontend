/**
 * Button.tsx — 공통 버튼 컴포넌트
 *
 * 앱 전체에서 사용하는 버튼입니다.
 * variant로 스타일을, size로 크기를 조절할 수 있습니다.
 * loading 상태일 때는 텍스트 대신 스피너를 표시합니다.
 *
 * 사용 예시:
 *   <Button onPress={handleLogin} size="lg" loading={isLoading}>
 *     로그인
 *   </Button>
 *
 *   <Button variant="outline" onPress={handleCancel}>
 *     취소
 *   </Button>
 */

import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * 버튼 스타일 종류:
 * - default:     진한 배경 (주요 액션)
 * - secondary:   연한 회색 배경 (보조 액션)
 * - outline:     테두리만 (취소 등)
 * - ghost:       배경 없음 (텍스트만)
 * - destructive: 빨간 배경 (삭제 등 위험한 액션)
 */
type Variant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';

/**
 * 버튼 크기:
 * - sm: 작은 버튼 (인라인 액션)
 * - md: 기본 크기
 * - lg: 큰 버튼 (폼 제출 등)
 */
type Size = 'sm' | 'md' | 'lg';

/**
 * TouchableOpacityProps를 상속받아 기본 터치 이벤트(onPress 등)도 그대로 사용 가능합니다.
 */
interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: Variant;  // 스타일 종류 (기본값: 'default')
  size?: Size;        // 크기 (기본값: 'md')
  loading?: boolean;  // true면 텍스트 대신 스피너 표시 + 버튼 비활성화
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  loading = false,
  disabled,
  style,
  ...props // onPress, testID 등 나머지 TouchableOpacity 속성들
}: ButtonProps) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  // variant별 배경색과 테두리 스타일
  const variantStyles: Record<Variant, object> = {
    default:     { backgroundColor: C.primary,     borderWidth: 0 },
    secondary:   { backgroundColor: C.secondary,   borderWidth: 0 },
    outline:     { backgroundColor: 'transparent', borderWidth: 1, borderColor: C.border },
    ghost:       { backgroundColor: 'transparent', borderWidth: 0 },
    destructive: { backgroundColor: C.destructive, borderWidth: 0 },
  };

  // variant별 텍스트 색상
  const textColors: Record<Variant, string> = {
    default:     C.primaryForeground,
    secondary:   C.secondaryForeground,
    outline:     C.foreground,
    ghost:       C.foreground,
    destructive: C.destructiveForeground,
  };

  // size별 패딩 크기
  const sizeStyles: Record<Size, object> = {
    sm: { paddingVertical: 6,  paddingHorizontal: 12 },
    md: { paddingVertical: 10, paddingHorizontal: 16 },
    lg: { paddingVertical: 12, paddingHorizontal: 24 },
  };

  // size별 텍스트 크기
  const textSizes: Record<Size, number> = { sm: 13, md: 14, lg: 15 };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        // disabled 또는 loading 상태면 반투명하게 표시
        (disabled || loading) && styles.disabled,
        style, // 외부에서 전달한 추가 스타일
      ]}
      // loading 중이거나 disabled면 터치 이벤트 차단
      disabled={disabled || loading}
      activeOpacity={0.8} // 눌렀을 때 80% 불투명도로 변경
      {...props}
    >
      {/* loading이면 스피너, 아니면 텍스트 표시 */}
      {loading ? (
        <ActivityIndicator size="small" color={textColors[variant]} />
      ) : (
        <Text style={[styles.text, { color: textColors[variant], fontSize: textSizes[size] }]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // 버튼 기본 스타일 — 모든 variant/size에 공통 적용
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8, // 아이콘과 텍스트 사이 간격
  },
  text: {
    fontWeight: '500',
  },
  // 비활성 상태 — 50% 투명도
  disabled: {
    opacity: 0.5,
  },
});
