import { UserData } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { PostInteractionState } from "./profile-view";
import { CreatePostForm } from "./profile-create-post-form";
import { PostList } from "./profile-post-list";
import { Button } from "../ui/button";
import {
  artistRewards,
  certifications,
  followedArtists,
  rewards,
} from "@/data/profile-view";
import { Certification } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  Disc,
  Video,
  Users,
  Award,
  ExternalLink,
  Banknote,
  Play,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { MusicPlayer } from "@/types";
import { Track } from "@/types";

interface ProfileTabsProps {
  isArtist: boolean;
  userDisplayName: string;
  userAvatar: string;
  userData: UserData; // For CreatePostForm
  postInteractions: PostInteractionState;
  onLike: (index: number) => void;
  onOpenComments: (index: number) => void;
  userTracks: Track[];
  onPlayTrack: (track: Track) => void;
  musicPlayer: MusicPlayer;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  isArtist,
  userDisplayName,
  userAvatar,
  userData,
  postInteractions,
  onLike,
  onOpenComments,
  userTracks,
  onPlayTrack,
  musicPlayer,
}) => (
  <Tabs defaultValue={isArtist ? "posts" : "artists"}>
    <TabsList
      className={`grid w-full px-4 bg-gray-800 ${
        isArtist ? "grid-cols-3" : "grid-cols-3"
      }`}
    >
      {isArtist ? (
        <>
          <TabsTrigger
            value="posts"
            className="data-[state=active]:bg-gray-700"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="rewards"
            className="data-[state=active]:bg-gray-700"
          >
            Rewards
          </TabsTrigger>
          <TabsTrigger
            value="certifications"
            className="data-[state=active]:bg-gray-700"
          >
            Certifications
          </TabsTrigger>
        </>
      ) : (
        <>
          <TabsTrigger
            value="artists"
            className="data-[state=active]:bg-gray-700"
          >
            Following
          </TabsTrigger>
          <TabsTrigger
            value="tracks"
            className="data-[state=active]:bg-gray-700"
          >
            Tracks
          </TabsTrigger>
          <TabsTrigger
            value="rewards"
            className="data-[state=active]:bg-gray-700"
          >
            My Rewards
          </TabsTrigger>
        </>
      )}
    </TabsList>

    {/* Posts Tab */}
    <TabsContent value="posts" className="px-4 mt-4 space-y-4">
      {isArtist && (
        <CreatePostForm
          userAvatar={userAvatar}
          userDisplayName={userDisplayName}
          userData={userData}
        />
      )}
      <PostList
        userDisplayName={userDisplayName}
        userAvatar={userAvatar}
        likedPosts={postInteractions.likedPosts}
        postComments={postInteractions.postComments}
        onLike={onLike}
        onOpenComments={onOpenComments}
      />
    </TabsContent>

    {/* Artist-specific Tabs */}
    {isArtist && (
      <>
        <TabsContent value="rewards" className="px-4 mt-4 space-y-3">
          <ArtistRewardsTab />
        </TabsContent>
        <TabsContent value="certifications" className="px-4 mt-4 space-y-3">
          <CertificationsTab />
        </TabsContent>
      </>
    )}

    {/* Fan-specific Tabs */}
    {!isArtist && (
      <>
        <TabsContent value="rewards" className="px-4 mt-4 space-y-3">
          <FanRewardsTab />
        </TabsContent>
        <TabsContent value="artists" className="px-4 mt-4 space-y-3">
          <FollowingTab />
        </TabsContent>
        <TabsContent value="tracks" className="px-4 mt-4 space-y-3">
          <TracksTab
            userTracks={userTracks}
            onPlayTrack={onPlayTrack}
            musicPlayer={musicPlayer}
          />
        </TabsContent>
      </>
    )}
  </Tabs>
);

// --- 12. Artist Rewards Tab ---

const ArtistRewardsTab: React.FC = () => (
  <>
    <div className="flex justify-between items-center">
      <h3 className="text-white font-medium">Manage Rewards</h3>
      <Button
        size="sm"
        className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
      >
        Add Reward
      </Button>
    </div>
    {artistRewards.map((reward, index) => (
      <Card key={index} className="overflow-hidden bg-gray-800 border-gray-700">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-white font-medium">{reward.title}</p>
              <p className="text-xs text-gray-400 mt-1">{reward.description}</p>
              <div className="flex items-center mt-1">
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-700 text-gray-300 border-gray-600"
                >
                  {reward.minTokens} $DROPS required
                </Badge>
                <p className="text-xs text-gray-500 ml-2">
                  {reward.subscribers} subscribers
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 bg-gray-700 text-white border-gray-600"
            >
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </>
);

// --- 13. Certifications Tab ---

const CertificationsTab: React.FC = () => (
  <>
    {certifications.map((cert: Certification) => (
      <Card
        key={cert.id}
        className="overflow-hidden bg-gray-800 border-gray-700"
      >
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-bright-yellow/20 flex items-center justify-center">
              {cert.type === "gold" && (
                <Disc className="h-6 w-6 text-bright-yellow" />
              )}
              {cert.type === "platinum" && (
                <Disc className="h-6 w-6 text-gray-300" />
              )}
              {cert.type === "views" && (
                <Video className="h-6 w-6 text-bright-yellow" />
              )}
              {cert.type === "soldout" && (
                <Users className="h-6 w-6 text-bright-yellow" />
              )}
              {cert.type === "award" && (
                <Award className="h-6 w-6 text-bright-yellow" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-white font-medium">{cert.title}</p>
                <Button
                  size="sm"
                  className={`${
                    cert.type === "gold"
                      ? "bg-[#F9BF15] hover:bg-[#e0ab13] text-black"
                      : cert.type === "platinum"
                        ? "bg-gray-400 hover:bg-gray-500"
                        : cert.type === "views"
                          ? "bg-red-600 hover:bg-red-700"
                          : cert.type === "soldout"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-blue-600 hover:bg-blue-700"
                  } text-white rounded-full`}
                  onClick={() => {
                    if (cert.type === "gold" || cert.type === "platinum") {
                      window.open(
                        "https://open.spotify.com/artist/iamjuampi",
                        "_blank",
                      );
                    } else if (cert.type === "views") {
                      window.open("https://youtube.com", "_blank");
                    } else if (cert.type === "soldout") {
                      alert("Tour dates coming soon!");
                    } else {
                      alert("Award details coming soon!");
                    }
                  }}
                >
                  {cert.type === "gold"
                    ? "Stream"
                    : cert.type === "platinum"
                      ? "Stream"
                      : cert.type === "views"
                        ? "Watch"
                        : cert.type === "soldout"
                          ? "Tour Dates"
                          : "Award"}
                </Button>
              </div>
              <p className="text-xs text-gray-400">{cert.description}</p>
              <p className="text-xs text-gray-500 mt-1">{cert.date}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </>
);

// --- 14. Fan Rewards Tab ---

const FanRewardsTab: React.FC = () => (
  <>
    <div className="mb-4">
      <h3 className="text-white font-medium mb-2">My Rewards</h3>
      <p className="text-sm text-gray-400">
        Exclusive rewards from artists you support
      </p>
    </div>

    {rewards.length > 0 ? (
      rewards.map((reward) => (
        <Card
          key={reward.id}
          className="overflow-hidden bg-gray-800 border-gray-700"
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={reward.artistAvatar}
                  alt={reward.artistName}
                />
                <AvatarFallback>
                  {reward.artistName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-white">
                  <span className="font-medium">{reward.title}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  From {reward.artistName}
                </p>
                <p className="text-xs text-gray-500 mt-1">{reward.date}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-8 bg-gray-700 text-white border-gray-600"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                <span className="text-xs">View</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))
    ) : (
      <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
        <Banknote className="h-12 w-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-300 font-medium">
          You don't have any rewards yet
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Buy tokens from your favorite artists to receive exclusive rewards
        </p>
        <Button className="mt-4 bg-bright-yellow hover:bg-bright-yellow-700 text-black">
          Explore Artists
        </Button>
      </div>
    )}
  </>
);

// --- 15. Following Tab ---

const FollowingTab: React.FC = () => (
  <>
    <div className="mb-4">
      <h3 className="text-white font-medium mb-2">Following</h3>
      <p className="text-sm text-gray-400">
        Artists you follow and support on DROPSLAND
      </p>
    </div>

    {followedArtists.map((artist) => (
      <Card
        key={artist.id}
        className="overflow-hidden bg-gray-800 border-gray-700 cursor-pointer"
        onClick={() => window.open(`/creator/${artist.id}`, "_self")}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={artist.avatar} alt={artist.name} />
              <AvatarFallback>
                {artist.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm text-white">
                <span className="font-medium">{artist.name}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {artist.followers} followers
              </p>
            </div>
            <Button
              size="sm"
              className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/creator/${artist.id}`, "_self");
              }}
            >
              <Banknote className="h-4 w-4 mr-1" />
              Buy
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </>
);

// --- 16. Tracks Tab ---

interface TracksTabProps {
  userTracks: Track[];
  onPlayTrack: (track: Track) => void;
  musicPlayer: MusicPlayer;
}

const TracksTab: React.FC<TracksTabProps> = ({
  userTracks,
  onPlayTrack,
  musicPlayer,
}) => (
  <>
    <div className="mb-4">
      <h3 className="text-white font-medium mb-2">My Music Collection</h3>
      <p className="text-sm text-gray-400">
        Your saved tracks and favorite music
      </p>
    </div>

    {userTracks.length > 0 ? (
      userTracks.map((track) => (
        <Card
          key={track.id}
          className="overflow-hidden bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => onPlayTrack(track)}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={track.cover} alt={track.artist} />
                <AvatarFallback>
                  {track.artist.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{track.title}</p>
                <p className="text-xs text-gray-400 mt-1">{track.artist}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {musicPlayer.formatTime(track.duration)}
                </p>
              </div>
              <Button
                size="sm"
                className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayTrack(track);
                }}
              >
                <Play className="h-4 w-4 mr-1" />
                Play
              </Button>
            </div>
          </CardContent>
        </Card>
      ))
    ) : (
      <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
        <Disc className="h-12 w-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-300 font-medium">No tracks saved yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Start building your music collection by saving your favorite tracks
        </p>
        <Button className="mt-4 bg-bright-yellow hover:bg-bright-yellow-700 text-black">
          Explore Music
        </Button>
      </div>
    )}
  </>
);
