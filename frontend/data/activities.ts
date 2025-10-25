// Mock data for activity
export const ACTIVITIES = [
  {
    id: "a1",
    type: "donation_sent",
    user: {
      name: "Elena Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    amount: 5,
    time: "2 hours ago",
  },
  {
    id: "a2",
    type: "purchase",
    amount: 50,
    wldAmount: 0.5,
    time: "1 day ago",
  },
  {
    id: "a3",
    type: "donation_received",
    user: {
      name: "Anonymous",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    amount: 10,
    time: "3 days ago",
  },
  {
    id: "a4",
    type: "donation_sent",
    user: {
      name: "Marcus Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    amount: 20,
    time: "1 week ago",
  },
  {
    id: "a5",
    type: "purchase",
    amount: 100,
    wldAmount: 1,
    time: "2 weeks ago",
  },
];

// Mock data for social notifications
export const SOCIAL_NOTIFICATIONS = [
  {
    id: "n1",
    type: "like",
    user: {
      name: "Juan Pablo",
      avatar: "/avatars/user.jpg",
    },
    action: "liked your post",
    postContent:
      "Just finished a new track! Can't wait to share it with you all.",
    time: "5 minutes ago",
  },
  {
    id: "n2",
    type: "comment",
    user: {
      name: "Banger",
      avatar: "/avatars/banger.jpg",
    },
    action: "commented on your post",
    comment: "Amazing track! 🔥",
    time: "1 hour ago",
  },
  {
    id: "n3",
    type: "follow",
    user: {
      name: "Nicola Marti",
      avatar: "/avatars/nicola.jpg",
    },
    action: "started following you",
    time: "2 hours ago",
  },
  {
    id: "n4",
    type: "like",
    user: {
      name: "AXS",
      avatar: "/avatars/axs.jpg",
    },
    action: "liked your post",
    postContent: "Working on something special for my supporters. Stay tuned!",
    time: "3 hours ago",
  },
  {
    id: "n5",
    type: "comment",
    user: {
      name: "FLUSH",
      avatar: "/avatars/flush.jpg",
    },
    action: "commented on your post",
    comment: "Can't wait to hear it! 🎵",
    time: "1 day ago",
  },
];
