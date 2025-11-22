"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { userDataService } from "@/lib/user-data-service";
import { FeedItem, ExtendedPost, Activity } from "@/types";
import MusicPlayer from "@/components/music-player/music-player";
import { CommentDialog } from "./CommentDialog";
import { ActivityCard } from "./ActivityCard";
import { PostCard } from "./PostCard";
import { PostCreator } from "./PostCreator";
import { WelcomeBanner } from "./WelcomeBanner";
import { FeaturedArtists } from "./FeaturedArtists";

export default function HomeView({
  onSelectArtist,
  onNavigateToExplore,
}: {
  onSelectArtist: (artistId: string) => void;
  onNavigateToExplore: () => void;
}) {
  const { userData, isArtist, user } = useAuth();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  useEffect(() => {
    if (user) {
      setFeedItems(userDataService.getFeedForUser(user));
    }
  }, [user]);

  const refreshFeed = () => {
    if (user) setFeedItems(userDataService.getFeedForUser(user));
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    userDataService.likePost(user, postId);
    refreshFeed();
  };

  const handleComment = (postId: string) => {
    setCurrentPostId(postId);
    setShowCommentDialog(true);
  };

  const handleSendComment = (text: string) => {
    if (!user || !currentPostId) return;
    userDataService.addComment(user, currentPostId, text);
    refreshFeed();
  };

  const handleCreatePost = (content: string, image: string | null) => {
    if (!user || !userData) return;
    userDataService.createPost({
      authorId: user,
      authorName: userData.username,
      authorAvatar: userData.profilePhoto || "/avatars/user.jpg",
      content,
      image: image || undefined,
      type: "post",
      tags: (content.match(/#(\w+)/g) || []).map((tag: string) => tag.slice(1)),
    });
    refreshFeed();
  };

  return (
    <div className="pb-6 overflow-auto bg-gray-50 dark:bg-gray-950">
      <FeaturedArtists onSelectArtist={onSelectArtist} />

      {!isArtist() && showWelcomeBanner && (
        <WelcomeBanner
          onClose={() => setShowWelcomeBanner(false)}
          onNavigateToExplore={onNavigateToExplore}
        />
      )}

      <div className="px-4 mt-6">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger
              value="feed"
              className="data-[state=active]:bg-teal-600"
            >
              Feed
            </TabsTrigger>
            <TabsTrigger
              value="music"
              className="data-[state=active]:bg-teal-600"
            >
              Player
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-4">
            {user && (
              <PostCreator
                userData={userData}
                onCreatePost={handleCreatePost}
              />
            )}

            <div className="space-y-3">
              {feedItems.length > 0 ? (
                feedItems.map((item) =>
                  item.type === "post" ? (
                    <PostCard
                      key={item.id}
                      post={item.data as ExtendedPost}
                      user={user}
                      onLike={handleLike}
                      onComment={handleComment}
                      onSelectArtist={onSelectArtist}
                    />
                  ) : (
                    <ActivityCard
                      key={item.id}
                      activity={item.data as Activity}
                      onSelectArtist={onSelectArtist}
                    />
                  ),
                )
              ) : (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-300">No posts yet</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Follow some artists to see their posts here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="music" className="mt-4">
            <MusicPlayer
              onTrackChange={(track) =>
                console.log("Now playing:", track.title)
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      <CommentDialog
        open={showCommentDialog}
        onClose={() => setShowCommentDialog(false)}
        postId={currentPostId}
        onSendComment={handleSendComment}
      />
    </div>
  );
}
