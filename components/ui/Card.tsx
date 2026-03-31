/**
 * Card.tsx — 카드 컴포넌트
 *
 * 콘텐츠를 둥근 모서리의 박스 안에 담아주는 컨테이너입니다.
 * 여러 하위 컴포넌트로 구성되어 있어 조합해서 사용합니다.
 *
 * 구성 요소:
 *   Card         — 외부 컨테이너 (흰 배경 + 테두리)
 *   CardHeader   — 카드 상단 영역 (제목/설명 감싸는 용도)
 *   CardTitle    — 카드 제목 텍스트
 *   CardDescription — 카드 부제목/설명 텍스트
 *   CardContent  — 카드 본문 영역
 *   CardFooter   — 카드 하단 영역 (버튼 등)
 *
 * 사용 예시:
 *   <Card>
 *     <CardHeader>
 *       <CardTitle>최근 점검 내역</CardTitle>
 *       <CardDescription>최근 등록된 점검 항목을 확인하세요.</CardDescription>
 *     </CardHeader>
 *     <CardContent>
 *       {// 본문 내용}
 *     </CardContent>
 *   </Card>
 */

import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** 외부 컨테이너 — 배경색, 테두리, 둥근 모서리 적용 */
export function Card({ style, children, ...props }: ViewProps) {
  const C = Colors[useColorScheme() ?? 'light'];
  return (
    <View
      style={[styles.card, { backgroundColor: C.card, borderColor: C.border }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

/** 카드 상단 영역 — CardTitle, CardDescription을 감싸는 용도 */
export function CardHeader({ style, children, ...props }: ViewProps) {
  return (
    <View style={[styles.header, style]} {...props}>
      {children}
    </View>
  );
}

/** 카드 제목 — 굵고 약간 큰 텍스트 */
export function CardTitle({ style, children, ...props }: React.ComponentProps<typeof Text>) {
  const C = Colors[useColorScheme() ?? 'light'];
  return (
    <Text style={[styles.title, { color: C.foreground }, style]} {...props}>
      {children}
    </Text>
  );
}

/** 카드 설명 — 작고 회색 텍스트 */
export function CardDescription({ style, children, ...props }: React.ComponentProps<typeof Text>) {
  const C = Colors[useColorScheme() ?? 'light'];
  return (
    <Text style={[styles.description, { color: C.mutedForeground }, style]} {...props}>
      {children}
    </Text>
  );
}

/** 카드 본문 영역 — 실제 콘텐츠가 들어가는 곳 */
export function CardContent({ style, children, ...props }: ViewProps) {
  return (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  );
}

/** 카드 하단 영역 — 상단에 구분선이 있고, 버튼 등을 가로로 배치할 때 사용 */
export function CardFooter({ style, children, ...props }: ViewProps) {
  const C = Colors[useColorScheme() ?? 'light'];
  return (
    <View style={[styles.footer, { borderTopColor: C.border }, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  // 카드 외부 컨테이너
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden', // 자식 요소가 모서리 밖으로 나가지 않게
  },
  // 헤더 — 좌우 패딩 있고 하단 패딩은 없음 (content와 붙어있어야 해서)
  header: {
    padding: 20,
    paddingBottom: 0,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  // 본문 — 사방 패딩
  content: {
    padding: 20,
  },
  // 푸터 — 상단 구분선 + 가로 배치
  footer: {
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
