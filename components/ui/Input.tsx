/**
 * Input.tsx — 텍스트 입력 컴포넌트
 *
 * 라벨(선택), 입력창, 에러 메시지(선택)를 하나로 묶은 컴포넌트입니다.
 * React Native의 TextInput을 감싸서 앱 디자인에 맞게 스타일을 적용했습니다.
 *
 * 사용 예시:
 *   <Input
 *     label="아이디"
 *     placeholder="아이디를 입력하세요"
 *     value={username}
 *     onChangeText={setUsername}
 *   />
 *
 *   <Input
 *     label="비밀번호"
 *     secureTextEntry          // 비밀번호 마스킹 (•••)
 *     error="비밀번호가 틀렸습니다"  // 에러 시 빨간 테두리 + 에러 메시지
 *   />
 */

import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * TextInputProps를 상속받아 placeholder, onChangeText, secureTextEntry 등
 * 기본 TextInput 속성을 모두 그대로 사용할 수 있습니다.
 */
interface InputProps extends TextInputProps {
  label?: string; // 입력창 위에 표시되는 라벨 텍스트 (선택)
  error?: string; // 에러 메시지 (있으면 빨간 테두리 + 에러 텍스트 표시)
}

export function Input({ label, error, style, ...props }: InputProps) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  return (
    // wrapper: 라벨 + 입력창 + 에러를 세로로 쌓음
    <View style={styles.wrapper}>
      {/* 라벨 — label prop이 있을 때만 표시 */}
      {label && <Text style={[styles.label, { color: C.foreground }]}>{label}</Text>}

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: C.background,
            // 에러 상태면 빨간 테두리, 아니면 기본 테두리색
            borderColor: error ? C.destructive : C.input,
            color: C.foreground, // 입력 텍스트 색상
          },
          style, // 외부에서 전달한 추가 스타일
        ]}
        // placeholder 텍스트 색상 (TextInput에서 별도로 지정해야 함)
        placeholderTextColor={C.mutedForeground}
        {...props} // placeholder, value, onChangeText, secureTextEntry 등
      />

      {/* 에러 메시지 — error prop이 있을 때만 표시 */}
      {error && <Text style={[styles.error, { color: C.destructive }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  // 전체 래퍼 — 라벨/입력/에러 사이 간격
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: 9,
    paddingHorizontal: 12,
    fontSize: 14,
    height: 40,
  },
  error: {
    fontSize: 12,
    marginTop: 2,
  },
});
