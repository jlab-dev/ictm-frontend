/**
 * context/ThemeContext.tsx — 사용자 설정 다크/라이트 모드 관리
 *
 * - AsyncStorage에 테마 설정을 저장하여 앱 재시작 후에도 유지
 * - useColorScheme() 훅에서 이 Context를 사용하도록 연결
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';

interface ThemeContextValue {
  colorScheme: ColorScheme;
  toggleTheme: () => void;
  setTheme: (theme: ColorScheme) => void;
}

const STORAGE_KEY = '@ictm_theme';

const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? 'light';
  const [colorScheme, setColorScheme] = useState<ColorScheme>(systemScheme);

  // AsyncStorage에서 저장된 테마 불러오기
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') {
        setColorScheme(saved);
      }
    });
  }, []);

  const setTheme = (theme: ColorScheme) => {
    setColorScheme(theme);
    AsyncStorage.setItem(STORAGE_KEY, theme);
  };

  const toggleTheme = () => {
    setTheme(colorScheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
