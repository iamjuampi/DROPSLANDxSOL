"use client";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ExtendedPost } from "@/types";
import { formatTimeAgo } from "./formatTimeAgo";

export function PostCard({
  post,
  user,
  onLike,
  onComment,
  onSelectArtist,
}: {
  post: ExtendedPost;
  user: string | null;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onSelectArtist: (artistId: string) => void;
}) {
  const isLiked = user ? post.likes.includes(user) : false;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Avatar
            className="h-8 w-8 mr-2 cursor-pointer"
            onClick={() => onSelectArtist(post.authorId)}
          >
            <AvatarImage src={post.authorAvatar} alt={post.authorName} />
            <AvatarFallback>
              {post.authorName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p
              className="font-medium text-white cursor-pointer"
              onClick={() => onSelectArtist(post.authorId)}
            >
              {post.authorName}
            </p>
            <p className="text-gray-400 text-xs">
              {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-3">{post.content}</p>
        {post.image && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img src={post.image} alt="Post" className="w-full h-auto" />
          </div>
        )}
        <div className="flex items-center justify-between text-gray-400 text-sm">
          <button
            className="flex items-center"
            onClick={() => onLike(post.id)}
            disabled={!user}
          >
            <Heart
              className={`h-4 w-4 mr-1 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
            {post.likes.length}
          </button>
          <button
            className="flex items-center"
            onClick={() => onComment(post.id)}
            disabled={!user}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            {post.comments.length}
          </button>
          <button className="flex items-center">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
