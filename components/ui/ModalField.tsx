/**
 * ModalField — 모달 폼 필드 레이아웃 컴포넌트
 *
 * 레이블 + 입력값을 가로로 나란히 배치하는 래퍼입니다.
 * 선택적으로 필수 표시(*)와 힌트 텍스트를 지원합니다.
 *
 * 사용 예시:
 *   <ModalField label="그룹코드" required C={C}>
 *     <TextInput ... />
 *   </ModalField>
 */

import { Colors } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

type ColorScheme = typeof Colors['light'];

export function ModalField({
  label,
  required,
  hint,
  children,
  C,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  C: ColorScheme;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: C.mutedForeground }]}>
        {label}
        {required && <Text style={{ color: C.destructive }}> *</Text>}
      </Text>
      <View style={styles.value}>
        {children}
        {hint && <Text style={[styles.hint, { color: C.mutedForeground }]}>{hint}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  label: { width: 80, fontSize: 13, fontWeight: '500', paddingTop: 8 },
  value: { flex: 1 },
  hint:  { fontSize: 11, marginTop: 4 },
});
