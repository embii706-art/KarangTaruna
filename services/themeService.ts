export type AppTheme = 'default' | 'independence' | 'ramadan' | 'kartini' | 'new_year';

interface ThemeConfig {
  name: AppTheme;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    cardBg: string;
    text: string;
  };
  assets: {
    decoration: string;
    icon: string;
  };
}

export const getTheme = (): ThemeConfig => {
  const date = new Date();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  // 1. Independence Day (August)
  if (month === 8) {
    return {
      name: 'independence',
      colors: {
        primary: 'bg-red-600',
        secondary: 'bg-red-100',
        accent: 'text-red-600',
        background: 'bg-gradient-to-b from-red-50 to-white',
        cardBg: 'bg-red-600',
        text: 'text-white'
      },
      assets: {
        decoration: '🇮🇩',
        icon: '🦅'
      }
    };
  }

  // 2. Kartini Day (April 21 approx)
  if (month === 4 && day >= 19 && day <= 23) {
    return {
      name: 'kartini',
      colors: {
        primary: 'bg-pink-600',
        secondary: 'bg-pink-100',
        accent: 'text-pink-600',
        background: 'bg-gradient-to-b from-pink-50 to-white',
        cardBg: 'bg-pink-600',
        text: 'text-white'
      },
      assets: {
        decoration: '🌸',
        icon: '👩'
      }
    };
  }

  // 3. New Year (Dec 25 - Jan 5)
  if ((month === 12 && day >= 25) || (month === 1 && day <= 5)) {
    return {
      name: 'new_year',
      colors: {
        primary: 'bg-indigo-900',
        secondary: 'bg-indigo-100',
        accent: 'text-indigo-600',
        background: 'bg-gradient-to-b from-slate-900 to-slate-800',
        cardBg: 'bg-gradient-to-r from-indigo-600 to-purple-600',
        text: 'text-white'
      },
      assets: {
        decoration: '🎉',
        icon: '🎆'
      }
    };
  }

  // 4. Ramadan (Mock Logic: Assuming Mar-Apr for 2024/2025 demo purposes)
  // In production, use a Hijri library.
  // Enabling this for demo if needed, otherwise fallback to default.
  // Let's force Ramadan for demo if date is set manually, else use date ranges.
  // For this code, I'll simulate Ramadan if the month is 3 (March) for demo visualization.
  const isRamadan = month === 3; 

  if (isRamadan) {
    return {
      name: 'ramadan',
      colors: {
        primary: 'bg-emerald-600',
        secondary: 'bg-emerald-100',
        accent: 'text-emerald-600',
        background: 'bg-gradient-to-b from-emerald-50 to-white',
        cardBg: 'bg-emerald-700',
        text: 'text-emerald-50'
      },
      assets: {
        decoration: '🌙',
        icon: '🕌'
      }
    };
  }

  // Default Theme
  return {
    name: 'default',
    colors: {
      primary: 'bg-slate-900',
      secondary: 'bg-slate-100',
      accent: 'text-slate-900',
      background: 'bg-[#F8F9FA]',
      cardBg: 'bg-slate-900',
      text: 'text-white'
    },
    assets: {
      decoration: '👋',
      icon: 'KT'
    }
  };
};