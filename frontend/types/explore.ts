export interface ExploreArtist {
  id: string;
  name: string;
  avatar: string;
  genre: string;
  followers: number;
}

export interface Genre {
  id: string;
  name: string;
  icon: string;
  artists: number;
}

export type Creator = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  category: string;
  description: string;
  blgReceived: number;
  featured: boolean;
};
