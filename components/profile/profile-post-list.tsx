import { userPosts } from "@/data/profile-view";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Post } from "@/types";

interface PostListProps {
  userDisplayName: string;
  userAvatar: string;
  likedPosts: { [key: string]: boolean };
  postComments: { [key: string]: any[] };
  onLike: (index: number) => void;
  onOpenComments: (index: number) => void;
}

interface PostCardProps {
  post: Post;
  index: number;
  userDisplayName: string;
  userAvatar: string;
  isLiked: boolean;
  commentCount: number;
  onLike: () => void;
  onOpenComments: () => void;
}

export const PostList: React.FC<PostListProps> = ({
  userDisplayName,
  userAvatar,
  likedPosts,
  postComments,
  onLike,
  onOpenComments,
}) => (
  <>
    {userPosts.map((post, index) => (
      <PostCard
        key={index}
        post={post}
        index={index}
        userDisplayName={userDisplayName}
        userAvatar={userAvatar}
        isLiked={!!likedPosts[`profile-${index}`]}
        commentCount={
          post.comments + (postComments[`profile-${index}`]?.length || 0)
        }
        onLike={() => onLike(index)}
        onOpenComments={() => onOpenComments(index)}
      />
    ))}
  </>
);

// --- 11. Post Card Component ---
export const PostCard: React.FC<PostCardProps> = ({
  post,
  userDisplayName,
  userAvatar,
  isLiked,
  commentCount,
  onLike,
  onOpenComments,
}) => (
  <Card className="bg-gray-800 border-gray-700">
    <CardContent className="p-4">
      <div className="flex items-center mb-3">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={userAvatar} alt={userDisplayName} />
          <AvatarFallback>
            {userDisplayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-white">{userDisplayName}</p>
          <p className="text-gray-400 text-xs">{post.time}</p>
        </div>
      </div>
      <p className="text-sm text-gray-300 mb-3">{post.content}</p>
      {post.image && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post image"
            className="w-full h-auto"
          />
        </div>
      )}
      <div className="flex items-center justify-between text-gray-400 text-sm">
        <button className="flex items-center" onClick={onLike}>
          <Heart
            className={`h-4 w-4 mr-1 ${
              isLiked ? "fill-red-500 text-red-500" : ""
            }`}
          />
          {post.likes + (isLiked ? 1 : 0)}
        </button>
        <button className="flex items-center" onClick={onOpenComments}>
          <MessageCircle className="h-4 w-4 mr-1" />
          {commentCount}
        </button>
        <button className="flex items-center">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </button>
      </div>
    </CardContent>
  </Card>
);
