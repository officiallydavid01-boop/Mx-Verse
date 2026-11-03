
import { useEffect, type ReactNode } from 'react';
import { useThemeStore } from '../../stores/themeStore';

interface ThemeProviderProps {
  children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return <>{children}</>;
}

export default ThemeProvider;
