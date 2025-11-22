export interface Post {
  content: string;
  time: string;
  likes: number;
  comments: number;
  image: string;
}

export interface ExclusiveContent {
  title: string;
  description: string;
  date: string;
}

export interface Reward {
  title: string;
  description: string;
  minTokens: number;
  subscribers: number;
}

export interface Certification {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
}

export interface Artist {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  genre: string;
  description: string;
  supporters: number;
  blgReceived: number;
  featured: boolean;
  tokenName: string;
  tokenPrice: number;
  posts: Post[];
  exclusiveContent: ExclusiveContent[];
  rewards: Reward[];
  certifications: Certification[];
}
