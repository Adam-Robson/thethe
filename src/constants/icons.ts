import { ComponentType } from 'react';
import { IconProps } from '@phosphor-icons/react';
import {
  MinusIcon,
  ArrowsOutSimpleIcon,
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
  SkipBackIcon,
  PlaylistIcon,
  XIcon,
  SpeakerSimpleHighIcon,
  SpeakerSimpleLowIcon,
  SpeakerSimpleXIcon,
  LightningIcon,
  LightningSlashIcon
} from '@phosphor-icons/react';

export const ICONS = {
  MinusIcon,
  ArrowsOutSimpleIcon,
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
  SkipBackIcon,
  XIcon,
  PlaylistIcon,
  SpeakerSimpleHighIcon,
  SpeakerSimpleLowIcon,
  SpeakerSimpleXIcon,
  LightningIcon,
  LightningSlashIcon
} as const satisfies Record<string, ComponentType<IconProps>>;
