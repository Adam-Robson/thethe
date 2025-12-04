import type { IconInstanceType } from '@/types/icon';
import { ICONS } from '@/constants/icons';
import clsx from 'clsx';

export default function Icon({
  name,
  size = 32,
  weight = 'fill', // bold, regular, light, thin, fill, duotone
  label,
  className,
  ...rest
}: IconInstanceType) {
  const IconInstance = ICONS[name as keyof typeof ICONS];
  const a11yProps = label
    ? ({ role: 'img', 'aria-label': label } as const)
    : ({ 'aria-hidden': true } as const);

  return (
    <IconInstance
      size={size}
      weight={weight}
      className={clsx(className as Parameters<typeof clsx>[0])}
      {...a11yProps}
      {...rest}
    />
  );

}
