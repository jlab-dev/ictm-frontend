// 웹에서도 동일하게 ThemeContext의 사용자 설정 값을 사용합니다.
import { useTheme } from '@/context/ThemeContext';

export function useColorScheme() {
  const { colorScheme } = useTheme();
  return colorScheme;
}
