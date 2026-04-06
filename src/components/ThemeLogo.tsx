'use client';

import { useTheme } from '@/context/ThemeContext';

interface ThemeLogoProps {
  className?: string;
  alt?: string;
}

export default function ThemeLogo({ className = '', alt = 'G4 COMPANY S.A' }: ThemeLogoProps) {
  const { theme } = useTheme();

  return (
    <img
      src={theme === 'dark' ? '/G4_COMPANY-LOGO_HORIZONTAL-B.webp' : '/G4_COMPANY-LOGO_HORIZONTAL.webp'}
      alt={alt}
      className={className}
      style={theme === 'light' ? { mixBlendMode: 'multiply' } : {}}
    />
  );
}
