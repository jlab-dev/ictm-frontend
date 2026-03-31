/**
 * AuthContext.tsx — 로그인 상태 전역 관리
 *
 * React Context를 사용해 "지금 누가 로그인되어 있는지"를 앱 전체에서
 * 공유합니다. Context를 쓰면 어떤 컴포넌트에서든 로그인 정보를
 * props 없이 바로 꺼내 쓸 수 있습니다.
 *
 * 사용 예시:
 *   const { user, login, logout } = useAuth();
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

// ─── 타입 정의 ─────────────────────────────────────────────────────

/** 로그인한 사용자 정보 */
type User = {
  username: string; // 아이디
  role: string;     // 역할 (ADMIN 또는 INSPECTOR)
};

/** Context에서 제공하는 값과 함수 목록 */
type AuthContextType = {
  user: User | null;                                          // 현재 로그인한 유저 (로그아웃 상태면 null)
  login: (username: string, password: string) => Promise<void>; // 로그인 함수
  logout: () => Promise<void>;                               // 로그아웃 함수
  isLoading: boolean;                                        // 앱 시작 시 토큰 복원 중 여부
};

// Context 객체 생성 — 초기값은 null (AuthProvider 밖에서 쓰면 에러 발생)
const AuthContext = createContext<AuthContextType | null>(null);

// ─── AuthProvider ───────────────────────────────────────────────────
/**
 * 앱 전체를 감싸는 Provider 컴포넌트
 * app/_layout.tsx 에서 <AuthProvider>로 앱을 감싸줍니다.
 * 이 Provider 안에 있는 모든 컴포넌트에서 useAuth()를 사용할 수 있습니다.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // 현재 로그인 유저 상태
  const [isLoading, setIsLoading] = useState(true);    // 토큰 복원 완료 여부
  const router = useRouter();                           // 화면 이동에 사용

  /**
   * 앱이 처음 켜질 때 AsyncStorage에 저장된 토큰을 확인합니다.
   * 토큰이 있으면 자동으로 로그인 상태로 복원합니다. (자동 로그인)
   */
  useEffect(() => {
    (async () => {
      const token    = await AsyncStorage.getItem('token');
      const username = await AsyncStorage.getItem('username');
      const role     = await AsyncStorage.getItem('role');

      if (token && username && role) {
        // 저장된 정보가 모두 있으면 로그인 상태로 복원
        setUser({ username, role });
      }

      // 복원 작업 완료 — 이후 _layout.tsx에서 화면 이동 결정
      setIsLoading(false);
    })();
  }, []);

  /**
   * 로그인 함수
   * 1. 백엔드에 아이디/비밀번호 전송
   * 2. 성공 시 JWT 토큰과 유저 정보를 AsyncStorage에 저장
   * 3. 앱 상태를 로그인 상태로 변경
   * 4. 대시보드(/)로 이동
   */
  const login = async (username: string, password: string) => {
    // POST /api/v1/auth/login 요청
    const response = await api.post('/auth/login', { username, password });
    const { token, role } = response.data;

    // AsyncStorage = 앱을 껐다 켜도 유지되는 로컬 저장소 (웹의 localStorage와 유사)
    await AsyncStorage.setItem('token',    token);
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('role',     role);

    // 전역 상태 업데이트 → 앱 전체에서 user 값이 바뀜
    setUser({ username, role });

    // 대시보드로 이동 (replace는 뒤로가기 시 로그인 화면으로 돌아가지 않게 함)
    router.replace('/');
  };

  /**
   * 로그아웃 함수
   * 1. AsyncStorage에서 저장된 토큰/유저 정보 삭제
   * 2. 앱 상태를 로그아웃 상태로 변경
   * 3. 로그인 화면으로 이동
   */
  const logout = async () => {
    // multiRemove = 여러 키를 한 번에 삭제
    await AsyncStorage.multiRemove(['token', 'username', 'role']);

    // 전역 상태를 null로 → 앱 전체에서 user가 null이 됨
    setUser(null);

    router.replace('/login');
  };

  return (
    // value로 전달한 값들을 하위 컴포넌트에서 useAuth()로 꺼내 쓸 수 있음
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── useAuth 훅 ────────────────────────────────────────────────────
/**
 * 컴포넌트에서 로그인 정보를 꺼내 쓰는 커스텀 훅
 *
 * 사용 예시:
 *   const { user, logout } = useAuth();
 *   console.log(user?.username); // "admin"
 */
export function useAuth() {
  const context = useContext(AuthContext);

  // AuthProvider 밖에서 실수로 사용하면 명확한 에러 메시지를 보여줌
  if (!context) throw new Error('useAuth must be used within AuthProvider');

  return context;
}
