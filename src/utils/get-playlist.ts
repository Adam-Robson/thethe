import type { SongType } from '@/types/audio';

// API base URL - proxy in dev, direct in prod
const getApiUrl = (endpoint: string): string => {
  if (process.env.NODE_ENV === 'development') {
    // dev uses the Next.js proxy rewrite to backend
    return endpoint;
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URI ?? 'https://thethe.fly.dev';
  return `${apiUrl}${endpoint}`;
};

async function fetchPlaylist(): Promise<SongType[]> {
  try {
    const response = await fetch(getApiUrl('/api/audio'));
    if (!response.ok) {
      throw new Error(`Failed to fetch songs: ${response.status.toString()}`);
    }
    const data: unknown = await response.json();

    // Accepts multiple possible response formats
    const isRecord = (v: unknown): v is Record<string, unknown> =>
      typeof v === 'object' && v !== null;

    const rawSongs: unknown[] =
      isRecord(data) && Array.isArray(data.songs)
        ? (data.songs as unknown[])
        : isRecord(data) && Array.isArray(data.data)
          ? (data.data as unknown[])
          : Array.isArray(data)
            ? (data as unknown[])
            : [];

    return rawSongs.map((song) => {
      const s = song as Record<string, unknown>;
      return {
        id: String(s.id),
        title: String(s.title),
        artist: String(s.artist),
        album: String(s.album),
        src: String(
          s.fileUrl
        ),
        cover: String(
          s.coverArtUrl
        ),
        duration: typeof s.duration === 'number'
          ? s.duration
          : Number(s.duration ?? 0) || 0,
      } as SongType;
    });
  } catch (error) {
    console.error('Failed to fetch playlist from API:', error);
    return [];
  }
}

export async function getPlaylist(): Promise<SongType[]> {
  return fetchPlaylist();
}

export async function getSongsByAlbum(albumTitle: string): Promise<SongType[]> {
  const playlist = await getPlaylist();
  return playlist.filter((song) => song.album === albumTitle);
}

export async function getSongsByArtist(
  artistName: string
): Promise<SongType[]> {
  const playlist = await getPlaylist();
  return playlist.filter((song) => song.artist === artistName);
}

export async function findSongById(songId: string): Promise<SongType | null> {
  const playlist = await getPlaylist();
  return playlist.find((song) => song.id === songId) ?? null;
}
