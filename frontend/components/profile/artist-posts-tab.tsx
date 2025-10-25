import { Artist } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { TabsContent } from "../ui/tabs";

export function ArtistPostsTab({ artist }: { artist: Artist }) {
  return (
    <TabsContent value="posts" className="mt-4 space-y-4">
      {artist.posts.map((post, index) => (
        <Card key={index} className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={artist.avatar} alt={artist.name} />
                <AvatarFallback>
                  {artist.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">{artist.name}</p>
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
              <button className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {post.likes}
              </button>
              <button className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.comments}
              </button>
              <button className="flex items-center">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </TabsContent>
  );
}
