import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppTheme, Season } from '../types';

interface ThemeContextType {
  theme: AppTheme;
  season: Season;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<AppTheme>(AppTheme.LIGHT);
  const [season, setSeason] = useState<Season>(Season.NONE);

  useEffect(() => {
    // Check Date for Season
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const day = today.getDate();

    // Ramadan 2025 Prediction (Feb 28 - March 29)
    // Simplify for demo: March is Ramadan
    if (month === 3 || (month === 2 && day >= 28)) {
        setSeason(Season.RAMADAN);
    }
    // Independence Day (August 17 +/- 3 days for vibe)
    else if (month === 8 && day >= 14 && day <= 20) {
        setSeason(Season.INDEPENDENCE);
    } else {
        setSeason(Season.NONE);
    }

    // Load Theme from local storage or system
    const savedTheme = localStorage.getItem('app-theme') as AppTheme;
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme(AppTheme.DARK);
    }
  }, []);

  useEffect(() => {
    // Apply theme class to HTML/Body
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === AppTheme.LIGHT ? AppTheme.DARK : AppTheme.LIGHT);
  };

  return (
    <ThemeContext.Provider value={{ theme, season, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
