export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  audioUrl: string;
  isLiked?: boolean;
}

export interface MusicPlayer {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  showMiniPlayer: boolean;
  isExpanded: boolean;
  currentTrackIndex: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolumeLevel: (volume: number) => void;
  toggleMute: () => void;
  hideMiniPlayer: () => void;
  expandPlayer: () => void;
  collapsePlayer: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  formatTime: (time: number) => string;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}
