export { useTheme as useColorSchemeContext } from '@/context/ThemeContext';

// useColorScheme()을 호출하면 ThemeContext의 사용자 설정 값을 반환합니다.
import { useTheme } from '@/context/ThemeContext';

export function useColorScheme() {
  const { colorScheme } = useTheme();
  return colorScheme;
}
