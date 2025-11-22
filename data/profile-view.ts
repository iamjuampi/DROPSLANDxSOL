// Sample posts data
export const userPosts = [
  {
    content: "Just finished a new track! Can't wait to share it with you all.",
    image: "https://images.unsplash.com/photo-1660211934853-e33d8a02201d",
    likes: 42,
    comments: 7,
    time: "2h ago",
  },
  {
    content: "Working on something special for my supporters. Stay tuned!",
    image: "https://images.unsplash.com/photo-1660211934853-e33d8a02201d",
    likes: 28,
    comments: 5,
    time: "1d ago",
  },
];

// Sample data for rewards and certifications
export const artistRewards = [
  {
    title: "Exclusive Track Access",
    description: "Get early access to unreleased tracks",
    minTokens: 50,
    subscribers: 12,
  },
  {
    title: "Backstage Pass",
    description: "VIP access to live events",
    minTokens: 100,
    subscribers: 8,
  },
];

export const certifications = [
  {
    id: "1",
    type: "gold" as const,
    title: "Gold Artist",
    description: "Achieved gold status on Spotify",
    date: "2024-01-15",
  },
  {
    id: "2",
    type: "views" as const,
    title: "1M Views",
    description: "Reached 1 million views on YouTube",
    date: "2024-02-20",
  },
  {
    id: "3",
    type: "platinum" as const,
    title: "Platinum Artist",
    description: "Achieved platinum status on Spotify",
    date: "2024-03-10",
  },
  {
    id: "4",
    type: "soldout" as const,
    title: "Sold Out Tour",
    description: "Completed a sold out tour",
    date: "2024-04-05",
  },
  {
    id: "5",
    type: "award" as const,
    title: "Best Artist Award",
    description: "Won best artist award",
    date: "2024-05-12",
  },
];

export const rewards = [
  {
    id: "1",
    title: "Exclusive Track Access",
    artistName: "iamjuampi",
    artistAvatar: "/avatars/juampi.jpg",
    description: "Get early access to unreleased tracks",
    date: "2024-01-15",
  },
];

export const followedArtists = [
  {
    id: "1",
    name: "iamjuampi",
    avatar: "/avatars/juampi.jpg",
    followers: 1200,
  },
  {
    id: "2",
    name: "banger",
    avatar: "/avatars/banger.jpg",
    followers: 800,
  },
];
