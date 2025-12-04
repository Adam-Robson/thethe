'use client';

import Image from 'next/image';
import { useTheme } from '@/contexts/theme-provider';

export default function Logo() {
  const { theme } = useTheme();
  return (
    <Image
      src={theme === 'light'
        ? '/logos/le.svg'
        : '/logos/le_dark.svg'}
      alt="le fog logo"
      width={140}
      height={140}
      priority
    />
  );
}
