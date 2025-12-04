import { ThemeProvider } from '@/contexts/theme-provider';
import { AudioProvider } from '@/contexts/audio-provider';
import { IconProvider } from '@/contexts/icon-provider';

export const GlobalProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <ThemeProvider>
      <AudioProvider>
        <IconProvider>
          {children}
        </IconProvider>
      </AudioProvider>
    </ThemeProvider>
  );
};
