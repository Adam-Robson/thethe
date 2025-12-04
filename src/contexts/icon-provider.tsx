'use client';

import { IconContext } from '@phosphor-icons/react';

export function IconProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <IconContext.Provider
      value={{
        size: 24,
        weight: 'bold', // options: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
        color: 'currentColor',
        mirrored: false
      }}
    >
      {children}
    </IconContext.Provider>
  );
}
