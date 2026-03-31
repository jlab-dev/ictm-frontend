/**
 * LoginScreen.tsx — 로그인 화면
 *
 * 사용자가 아이디와 비밀번호를 입력해 로그인하는 화면입니다.
 * 로그인 성공 시 AuthContext의 login() 함수가 토큰을 저장하고
 * 자동으로 대시보드(/)로 이동합니다.
 *
 * URL 경로: /login
 * 진입점:  app/login.tsx → 이 컴포넌트를 re-export
 */

import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Radius } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const { login } = useAuth();               // AuthContext에서 login 함수 가져오기
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];                  // 현재 모드에 맞는 색상

  // ─── 로컬 상태 ─────────────────────────────────────────────────
  const [username, setUsername] = useState(''); // 아이디 입력값
  const [password, setPassword] = useState(''); // 비밀번호 입력값
  const [error, setError]       = useState(''); // 에러 메시지 (빈 문자열이면 표시 안 함)
  const [loading, setLoading]   = useState(false); // 로그인 요청 중 여부 (버튼 로딩 표시)

  /**
   * 로그인 버튼을 눌렀을 때 실행되는 함수
   * 1. 입력값 유효성 검사
   * 2. AuthContext의 login() 호출 → 백엔드 API 요청
   * 3. 실패 시 에러 메시지 표시
   */
  const handleLogin = async () => {
    // 빈 입력값 체크
    if (!username || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setError('');    // 이전 에러 메시지 초기화
    setLoading(true); // 로딩 시작

    try {
      // AuthContext의 login() 호출 — 성공 시 자동으로 대시보드로 이동
      await login(username, password);
    } catch {
      // 백엔드에서 인증 실패(401) 또는 네트워크 오류 시 에러 메시지 표시
      // 보안상 "아이디가 틀렸는지" "비밀번호가 틀렸는지" 구분하지 않음
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false); // 성공/실패 상관없이 로딩 종료
    }
  };

  return (
    /**
     * KeyboardAvoidingView: 키보드가 올라올 때 입력창이 가려지지 않도록
     * 화면을 위로 밀어주는 컴포넌트
     * iOS는 'padding', Android는 'height' 방식이 더 자연스럽습니다
     */
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: C.muted }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 스크롤 가능하게 감싸기 — 작은 화면에서 키보드가 올라와도 스크롤로 접근 가능 */}
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* 로그인 카드 — maxWidth 400으로 너무 넓어지지 않게 제한 */}
        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>

          {/* ── 로고 영역 ────────────────────────────────── */}
          <View style={styles.cardHeader}>
            {/* "IC" 텍스트 로고 마크 */}
            <View style={[styles.logoMark, { backgroundColor: C.primary }]}>
              <Text style={[styles.logoMarkText, { color: C.primaryForeground }]}>IC</Text>
            </View>
            <Text style={[styles.title, { color: C.foreground }]}>ICTM</Text>
            <Text style={[styles.subtitle, { color: C.mutedForeground }]}>
              정보통신설비 유지보수 관리 시스템
            </Text>
          </View>

          {/* 구분선 */}
          <View style={[styles.divider, { backgroundColor: C.border }]} />

          {/* ── 로그인 폼 ────────────────────────────────── */}
          <View style={styles.form}>
            <Input
              label="아이디"
              placeholder="아이디를 입력하세요"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none" // 첫 글자 자동 대문자 비활성화
              autoCorrect={false}   // 자동 수정 비활성화
            />
            <Input
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={setPassword}
              secureTextEntry // 비밀번호 마스킹 (•••)
            />

            {/* 에러 메시지 — error 상태가 있을 때만 표시 */}
            {error ? (
              <View style={[styles.errorBox, { backgroundColor: C.destructive + '15', borderColor: C.destructive + '40' }]}>
                <Text style={[styles.errorText, { color: C.destructive }]}>{error}</Text>
              </View>
            ) : null}

            {/* 로그인 버튼 — loading 상태면 스피너 표시 */}
            <Button onPress={handleLogin} loading={loading} size="lg" style={styles.loginBtn}>
              로그인
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // 전체 화면 배경 (연한 회색)
  container: {
    flex: 1,
  },
  // 스크롤뷰 내부 — 카드를 화면 중앙에 배치
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  // 로그인 카드 컨테이너
  card: {
    width: '100%',
    maxWidth: 400, // 너무 넓어지지 않도록 최대 너비 제한
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  // 카드 상단 로고 영역
  cardHeader: {
    alignItems: 'center',
    padding: 32,
    paddingBottom: 24,
    gap: 8,
  },
  // "IC" 로고 마크 (원형 배경)
  logoMark: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  logoMarkText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  // 로고 영역과 폼 사이 구분선
  divider: {
    height: 1,
    marginHorizontal: 0,
  },
  // 폼 영역 (입력창들)
  form: {
    padding: 24,
    gap: 14,
  },
  // 에러 메시지 박스
  errorBox: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: 10,
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
  },
  // 로그인 버튼 — 가로 전체 차지
  loginBtn: {
    marginTop: 4,
    width: '100%',
  },
});
