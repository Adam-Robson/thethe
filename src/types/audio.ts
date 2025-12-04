export interface SongType {
  id: string;
  title: string;
  artist: string;
  album: string;
  src: string;
  duration: number; // duration in seconds
  coverImage?: string;
}

export interface AlbumType {
  id: string;
  title: string;
  artist: string;
  coverImage?: string;
  songs: SongType[];
}

export interface PlaylistType {
  id: string;
  name: string;
  description?: string;
  songs: SongType[];
}
