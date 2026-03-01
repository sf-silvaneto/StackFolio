import React, { createContext, useState, useEffect, useContext } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextData {
  theme: Theme;
  toggleTheme: () => void;
  colors: Record<string, string>;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('@StackFolio:theme');
    return (saved as Theme) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('@StackFolio:theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Paletas de cores profissionais para cada modo
  const colors = {
    background: theme === 'dark' ? '#0f172a' : '#f8fafc',
    card: theme === 'dark' ? '#1e293b' : '#ffffff',
    text: theme === 'dark' ? '#f8fafc' : '#0f172a',
    textMuted: theme === 'dark' ? '#94a3b8' : '#64748b',
    primary: theme === 'dark' ? '#6366f1' : '#4f46e5',
    border: theme === 'dark' ? '#334155' : '#e2e8f0',
    hover: theme === 'dark' ? '#334155' : '#f1f5f9',
    success: '#22c55e'
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      <div style={{ backgroundColor: colors.background, color: colors.text, minHeight: '100vh', transition: 'all 0.3s ease' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);