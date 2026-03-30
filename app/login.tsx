import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Radius } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const { login } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: C.muted }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
          {/* 로고 영역 */}
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

          {/* 폼 */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    alignItems: 'center',
    padding: 32,
    paddingBottom: 24,
    gap: 8,
  },
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
  divider: {
    height: 1,
    marginHorizontal: 0,
  },
  form: {
    padding: 24,
    gap: 14,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: 10,
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
  },
  loginBtn: {
    marginTop: 4,
    width: '100%',
  },
});
