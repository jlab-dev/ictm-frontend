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

import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLogin } from './useLogin';
import { styles } from './LoginScreen.styles';

export default function LoginScreen() {
  const { username, setUsername, password, setPassword, error, loading, handleLogin } = useLogin();
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: C.muted }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>

          {/* ── 로고 영역 ────────────────────────────────── */}
          <View style={styles.cardHeader}>
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
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Input
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error ? (
              <View style={[styles.errorBox, { backgroundColor: C.destructive + '15', borderColor: C.destructive + '40' }]}>
                <Text style={[styles.errorText, { color: C.destructive }]}>{error}</Text>
              </View>
            ) : null}

            <Button onPress={handleLogin} loading={loading} size="lg" style={styles.loginBtn}>
              로그인
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
