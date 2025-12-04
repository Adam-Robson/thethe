'use client';

import {
  createContext, useContext, useRef, useState,
  useEffect, useMemo, ReactNode, useCallback,
} from 'react';
import { Howl } from 'howler';
import type { SongType } from '@/types/audio';
import { getPlaylist } from '@/utils/get-playlist';

function getStoredVolume(): number {
  if (typeof window === 'undefined') return 1;
  return parseFloat(localStorage.getItem('volume') ?? '1');
}

function getStoredTrackIndex(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem('trackIndex') ?? '0', 10);
}

function usePlaylistData() {
  const [playlist, setPlaylist] = useState<SongType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPlaylist() {
      setLoading(true);
      setError(null);
      try {
        const songs = await getPlaylist();
        if (!cancelled) {
          setPlaylist(songs);
        }
      } catch (error) {
        if (!cancelled) {
          setError('Failed to load music library');
          console.error('Failed to load playlist:', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPlaylist();

    return () => {
      cancelled = true;
    };
  }, []);

  return { playlist, setPlaylist, loading, error };
}

function useHowlPlayer() {
  const soundRef = useRef<Howl | null>(null);
  const rafRef = useRef<number | null>(null);

  const [playback, setPlayback] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [volume, setVolume] = useState(() => getStoredVolume());
  const [muted, setMuted] = useState(false);

  const clearAnimationFrame = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const stopAndUnload = useCallback(() => {
    clearAnimationFrame();
    const snd = soundRef.current;
    if (snd) {
      try {
        snd.stop();
      } catch (e) {
        console.error('Error stopping sound:', e);
      }
      try {
        snd.unload();
      } catch (e) {
        console.error('Error unloading sound:', e);
      }
      soundRef.current = null;
    }
  }, [clearAnimationFrame]);

  const startTicker = useCallback((snd: Howl) => {
    clearAnimationFrame();
    const tick = () => {
      if (!snd.playing()) return;
      setElapsed((snd.seek()) || 0);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [clearAnimationFrame]);

  const createHowl = useCallback((track: SongType) => {
    return new Howl({
      src: [track.src],
      html5: true,
      autoplay: false,
      volume,
      mute: muted,
      onload: () => {
        setDuration(soundRef.current?.duration() ?? 0);
        setLoading(false);
        setError(null);
      },
      onplay: () => {
        setPlayback(true);
        setError(null);
        if (soundRef.current) {
          startTicker(soundRef.current);
        }
      },
      onpause: () => {
        setPlayback(false);
        clearAnimationFrame();
      },
      onend: () => {
        setPlayback(false);
        setElapsed(0);
        clearAnimationFrame();
      },
      onloaderror: (_id, err) => {
        setError(`Load error: ${String(err)}`);
        setLoading(false);
      },
      onplayerror: (_id, err) => {
        setError(`Play blocked/failed: ${String(err)}`);
        setPlayback(false);
        clearAnimationFrame();
      },
    });
  }, [volume, muted, startTicker, clearAnimationFrame]);

  const loadTrack = useCallback((track: SongType) => {
    stopAndUnload();
    setLoading(true);
    setElapsed(0);
    setDuration(0);
    const snd = createHowl(track);
    soundRef.current = snd;
  }, [stopAndUnload, createHowl]);

  // ✅ Update volume immediately when changed (no Effect needed)
  const updateVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolume(clamped);

    // ✅ Update localStorage during the event, not in an Effect
    localStorage.setItem('volume', String(clamped));

    soundRef.current?.volume(clamped);

    if (clamped === 0) {
      soundRef.current?.mute(true);
      setMuted(true);
    } else if (muted) {
      soundRef.current?.mute(false);
      setMuted(false);
    }
  }, [muted]);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      soundRef.current?.mute(next);
      return next;
    });
  }, []);

  const play = useCallback(() => {
    const sound = soundRef.current;
    if (!sound) return;
    try {
      sound.play();
    } catch (e) {
      setError(`Play error: ${String(e)}`);
    }
  }, []);

  const pause = useCallback(() => {
    soundRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    soundRef.current?.stop();
    setPlayback(false);
    setElapsed(0);
    clearAnimationFrame();
  }, [clearAnimationFrame]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    stopAndUnload();
  }, [stopAndUnload]);

  return {
    soundRef,
    playback,
    elapsed,
    duration,
    loading,
    error,
    volume,
    muted,
    loadTrack,
    updateVolume,
    toggleMute,
    play,
    pause,
    stop,
  };
}

export interface AudioProviderType {
  // Playlist management
  playlist: SongType[];
  setPlaylist: (playlist: SongType[]) => void;
  showPlaylist: boolean;
  setShowPlaylist: (show: boolean) => void;
  showPlayer: boolean;
  setShowPlayer: (show: boolean) => void;

  // Playback state
  playback: boolean;
  volume: number;
  muted: boolean;
  toggleMute: () => void;

  // Track navigation
  nextSong: () => void;
  previousSong: () => void;
  elapsed: number;
  duration: number;
  loading: boolean;
  error: string | null;

  // Player controls
  updateVolume: (volume: number) => void;
  currentTrack: SongType | null;
  setTrack: (track: SongType) => void;
  queueAndPlay: (track: SongType, playlist?: SongType[]) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;

  // Computed values
  trackTitle: string;
  safePct: number;
  formatTime: (time?: number | null) => string;
}

const AudioContext = createContext<AudioProviderType | undefined>(
  undefined
);

export function useAudio(): AudioProviderType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const {
    playlist,
    setPlaylist,
    loading: playlistLoading,
    error: playlistError
  } = usePlaylistData();
  const playerState = useHowlPlayer();

  // ✅ Initialize current track state properly
  const [currentTrack, setCurrentTrack] = useState<SongType | null>(null);
  const [prevPlaylist, setPrevPlaylist] = useState<SongType[]>([]);

  // UI state
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  // ✅ Adjust state during rendering when playlist changes (React's recommended pattern)
  if (playlist !== prevPlaylist) {
    setPrevPlaylist(playlist);

    // If we don't have a current track and playlist has items
    if (!currentTrack && playlist.length > 0) {
      const savedIndex = getStoredTrackIndex();
      const track = playlist[savedIndex] || playlist[0];
      setCurrentTrack(track);
    }
  }

  // ✅ Calculate derived values during render
  const trackTitle = currentTrack?.title ?? '';

  // ✅ Use useMemo for expensive calculations only
  const safePct = useMemo(() => {
    const d = playerState.duration;
    const e = playerState.elapsed;
    if (!Number.isFinite(d) || d <= 0) return 0;
    if (!Number.isFinite(e) || e < 0) return 0;
    return Math.max(0, Math.min(100, (e / d) * 100));
  }, [playerState.elapsed, playerState.duration]);

  const formatTime = useCallback((n?: number | null) => {
    if (typeof n !== 'number' || Number.isNaN(n)) {
      return '0:00';
    }
    const sec = Math.max(0, Math.floor(n));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m)}:${String(s).padStart(2, '0')}`;
  }, []);

  // ✅ Event handlers that update state immediately
  const setTrack = useCallback((track: SongType) => {
    setCurrentTrack(track);
    // ✅ Update localStorage immediately during the event
    const idx = playlist.findIndex(t => t.src === track.src);
    if (idx >= 0) {
      localStorage.setItem('trackIndex', String(idx));
    }
    playerState.loadTrack(track);
  }, [playlist, playerState]);

  const queueAndPlay = useCallback((
    track: SongType,
    newPlaylist?: SongType[]
  ) => {
    if (newPlaylist) {
      setPlaylist(newPlaylist);
    }
    setTrack(track);
    playerState.play();
  }, [setPlaylist, setTrack, playerState]);

  const getIndex = useCallback(() => {
    if (!currentTrack) return -1;
    return playlist.findIndex(t => t.src === currentTrack.src);
  }, [currentTrack, playlist]);

  const nextSong = useCallback(() => {
    const i = getIndex();
    if (i < 0 || playlist.length === 0) return;
    const nextTrack = playlist[(i + 1) % playlist.length];
    setTrack(nextTrack);
    playerState.play();
  }, [getIndex, playlist, setTrack, playerState]);

  const previousSong = useCallback(() => {
    const i = getIndex();
    if (i < 0 || playlist.length === 0) return;
    const prevTrack = playlist[
      (i - 1 + playlist.length) % playlist.length
    ];
    setTrack(prevTrack);
    playerState.play();
  }, [getIndex, playlist, setTrack, playerState]);

  const play = useCallback(() => {
    if (!currentTrack) return;
    if (!playerState.soundRef.current) {
      playerState.loadTrack(currentTrack);
    }
    playerState.play();
  }, [currentTrack, playerState]);

  // ✅ Stable context value with minimal dependencies
  const value: AudioProviderType = useMemo(() => ({
    // Playlist
    playlist,
    setPlaylist,
    showPlaylist,
    setShowPlaylist,
    showPlayer,
    setShowPlayer,

    // Playback state
    playback: playerState.playback,
    volume: playerState.volume,
    muted: playerState.muted,
    toggleMute: playerState.toggleMute,

    // Track navigation
    nextSong,
    previousSong,
    elapsed: playerState.elapsed,
    duration: playerState.duration,
    loading: playerState.loading || playlistLoading,
    error: playerState.error ?? playlistError,

    // Controls
    updateVolume: playerState.updateVolume,
    currentTrack,
    setTrack,
    queueAndPlay,
    play,
    pause: playerState.pause,
    stop: playerState.stop,

    // Computed
    trackTitle,
    safePct,
    formatTime,
  }), [
    playlist,
    setPlaylist,
    showPlaylist,
    setShowPlaylist,
    showPlayer,
    setShowPlayer,
    playerState.playback,
    playerState.volume,
    playerState.muted,
    playerState.toggleMute,
    nextSong,
    previousSong,
    playerState.elapsed,
    playerState.duration,
    playerState.loading,
    playerState.error,
    playlistLoading,
    playlistError,
    playerState.updateVolume,
    currentTrack,
    setTrack,
    queueAndPlay,
    play,
    playerState.pause,
    playerState.stop,
    trackTitle,
    safePct,
    formatTime,
  ]);

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}
