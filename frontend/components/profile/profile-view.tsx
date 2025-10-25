"use client";
import { useState, useMemo } from "react";
import { Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import UserProfile from "@/components/profile/user-profile";
import { useMusicPlayer } from "@/hooks/use-music-player";
import { LegacyProfileInfo } from "./legacy-profile-info";
import { LegacyProfileSettings } from "./legacy-profile-settings";
import { ProfileCommentDialog } from "./profile-comment-dialog";
import { ProfileTabs } from "./profile-tabs";
import { musicTracks } from "@/data";

// --- Type Definitions ---
// (Ideally, these would be imported from your data files)
type Track = any;
type UserData = any; // Type from useAuth()

interface ProfileViewProps {
  username?: string;
}

export interface PostInteractionState {
  likedPosts: { [key: string]: boolean };
  postComments: { [key: string]: { author: string; text: string }[] };
}

export interface CommentDialogState {
  showCommentDialog: boolean;
  currentPostIndex: number | null;
  commentText: string;
}

// --- 1. Main ProfileView Component (Root) ---
export default function ProfileView({
  username: legacyUsername = "usuario",
}: ProfileViewProps) {
  const { balance, donated, userData, isArtist, logout, isNFIDUser, user } =
    useAuth();
  const musicPlayer = useMusicPlayer();
  const userTracks = musicTracks;

  // --- State for Post Interactions (Shared) ---
  const [postInteractions, setPostInteractions] =
    useState<PostInteractionState>({
      likedPosts: {},
      postComments: {},
    });

  // --- State for Comment Dialog (Shared) ---
  const [commentDialog, setCommentDialog] = useState<CommentDialogState>({
    showCommentDialog: false,
    currentPostIndex: null,
    commentText: "",
  });

  // --- Handlers for Post Interactions ---
  const handleLike = (postIndex: number) => {
    const postKey = `profile-${postIndex}`;
    setPostInteractions((prev) => ({
      ...prev,
      likedPosts: {
        ...prev.likedPosts,
        [postKey]: !prev.likedPosts[postKey],
      },
    }));
  };

  const handleOpenComments = (postIndex: number) => {
    setCommentDialog((prev) => ({
      ...prev,
      currentPostIndex: postIndex,
      showCommentDialog: true,
    }));
  };

  const handleSendComment = () => {
    const { commentText, currentPostIndex } = commentDialog;
    if (commentText.trim() && currentPostIndex !== null) {
      const postKey = `profile-${currentPostIndex}`;
      // This user name logic will be passed down
      const authorName = userData?.username || legacyProfile.name || "User";

      setPostInteractions((prev) => ({
        ...prev,
        postComments: {
          ...prev.postComments,
          [postKey]: [
            ...(prev.postComments[postKey] || []),
            { author: authorName, text: commentText.trim() },
          ],
        },
      }));

      setCommentDialog((prev) => ({
        ...prev,
        commentText: "",
        showCommentDialog: false,
      }));
    }
  };

  const handlePlayTrack = (track: Track) => {
    musicPlayer.playTrack(track);
  };

  // --- Data for Legacy View (Memoized) ---
  const legacyProfile = useMemo(() => {
    const isLegacyArtist = isArtist(); // Assuming isArtist() works for legacy too
    return {
      name: userData?.username || "musicfan", // Fallback logic from original
      handle: `@${userData?.username || "musicfan"}`,
      bio: isLegacyArtist
        ? "iamjuampi is a DJ, producer, and founder of Best Drops Ever."
        : "Music enthusiast and electronic music fan. Supporting my favorite artists on DROPSLAND.",
      category: isLegacyArtist ? "Techno / House" : "Fan",
      memberSince: "March 2025",
      isVerified: userData?.isVerified || false,
      avatarSrc:
        legacyUsername === "iamjuampi"
          ? "/avatars/juampi.jpg"
          : "/avatars/user.jpg",
      coverSrc: isLegacyArtist
        ? "/images/bdeeeee.jpg"
        : "bg-gradient-to-r from-gray-800 to-black",
      hasCoverImage: isLegacyArtist,
    };
  }, [userData, isArtist, legacyUsername]);

  // --- Determine User Display Info ---
  const isNFID = user && isNFIDUser();
  const userDisplayName = isNFID
    ? userData?.username || "User"
    : legacyProfile.name;
  const userAvatar = isNFID
    ? userData?.profilePhoto || "/avatars/user.jpg"
    : legacyProfile.avatarSrc;

  // --- Props for Shared Tabs ---
  const tabsProps = {
    isArtist: isArtist(),
    userDisplayName,
    userAvatar,
    postInteractions,
    onLike: handleLike,
    onOpenComments: handleOpenComments,
    userTracks,
    onPlayTrack: handlePlayTrack,
    musicPlayer,
    userData, // For CreatePostForm
  };

  return (
    <div className="pb-6 bg-gray-950">
      {isNFID ? (
        <NFIDProfileView
          user={user}
          userData={userData}
          isArtist={isArtist()}
          balance={balance}
          donated={donated}
          tabsProps={tabsProps}
        />
      ) : (
        <LegacyProfileView
          legacyProfile={legacyProfile}
          isArtist={isArtist()}
          balance={balance}
          donated={donated}
          logout={logout}
          tabsProps={tabsProps}
        />
      )}

      {/* Comment Dialog is rendered once at the root */}
      <ProfileCommentDialog
        isOpen={commentDialog.showCommentDialog}
        onOpenChange={(isOpen) =>
          setCommentDialog((prev) => ({ ...prev, showCommentDialog: isOpen }))
        }
        postIndex={commentDialog.currentPostIndex}
        comments={postInteractions.postComments}
        commentText={commentDialog.commentText}
        onCommentTextChange={(text) =>
          setCommentDialog((prev) => ({ ...prev, commentText: text }))
        }
        onSendComment={handleSendComment}
        userAvatar={userAvatar}
        userDisplayName={userDisplayName}
        legacyAvatarSrc={legacyProfile.avatarSrc} // For legacy comment authors
      />
    </div>
  );
}

// --- 2. NFID User Profile View ---
interface NFIDProfileViewProps {
  user: any;
  userData: UserData;
  isArtist: boolean;
  balance: number;
  donated: number;
  tabsProps: any;
}

const NFIDProfileView: React.FC<NFIDProfileViewProps> = ({
  user,
  userData,
  isArtist,
  balance,
  donated,
  tabsProps,
}) => {
  return (
    <>
      <UserProfile
        userId={user}
        username={userData?.username || "User"}
        handle={userData?.handle}
        profilePhoto={userData?.profilePhoto}
        coverPhoto={userData?.coverPhoto}
        isVerified={userData?.isVerified}
        type={userData?.type}
        bio={userData?.bio}
        followers={userData?.followers?.length || 0}
        following={userData?.following?.length || 0}
        genre={userData?.genre}
      />

      {isArtist && <NFIDArtistStats balance={balance} donated={donated} />}

      <div className="mt-6">
        <ProfileTabs {...tabsProps} />
      </div>
    </>
  );
};

// --- 3. NFID Artist Stats ---

interface NFIDArtistStatsProps {
  balance: number;
  donated: number;
}

const NFIDArtistStats: React.FC<NFIDArtistStatsProps> = ({
  balance,
  donated,
}) => (
  <div className="px-4 mt-6">
    <div className="flex gap-4">
      <div>
        <p className="text-sm text-gray-400">Balance</p>
        <div className="flex items-center">
          <span className="font-bold text-white">{balance} $DROPS</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-400">Purchased</p>
        <div className="flex items-center">
          <span className="font-bold text-white">{donated} $DROPS</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-400">Artists</p>
        <p className="font-bold text-white">8</p>
      </div>
    </div>
  </div>
);

// --- 4. Legacy User Profile View ---
interface LegacyProfileViewProps {
  legacyProfile: any;
  isArtist: boolean;
  balance: number;
  donated: number;
  logout: () => void;
  tabsProps: any;
}

export const LegacyProfileView: React.FC<LegacyProfileViewProps> = ({
  legacyProfile,
  isArtist,
  balance,
  donated,
  logout,
  tabsProps,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(legacyProfile.bio);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      console.log("Saving bio:", editedBio);
      // Here you would update the bio, e.g.,
      // legacyProfile.bio = editedBio; // This won't work as props are immutable
      // You'd need a state update function passed down if this were real
    } else {
      setEditedBio(legacyProfile.bio);
    }
  };

  return (
    <>
      <LegacyProfileHeader
        legacyProfile={legacyProfile}
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
      />

      <LegacyProfileInfo
        legacyProfile={legacyProfile}
        isEditing={isEditing}
        editedBio={editedBio}
        onBioChange={setEditedBio}
        balance={balance}
        donated={donated}
      />

      <div className="mt-6">
        <ProfileTabs {...tabsProps} />
      </div>

      <LegacyProfileSettings logout={logout} isArtist={isArtist} />
    </>
  );
};

// --- 5. Legacy Profile Header ---
interface LegacyProfileHeaderProps {
  legacyProfile: any;
  isEditing: boolean;
  onEditToggle: () => void;
}

const LegacyProfileHeader: React.FC<LegacyProfileHeaderProps> = ({
  legacyProfile,
  isEditing,
  onEditToggle,
}) => (
  <div className="relative">
    {legacyProfile.hasCoverImage ? (
      <div className="h-32 relative overflow-hidden">
        <Image
          src={legacyProfile.coverSrc || "/placeholder.svg"}
          alt="Profile cover"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
    ) : (
      <div className="h-32 bg-gradient-to-r from-gray-800 to-black"></div>
    )}
    <div className="absolute top-20 left-0 w-full px-4">
      <div className="flex justify-between">
        <Avatar className="h-24 w-24">
          <AvatarImage src={legacyProfile.avatarSrc} alt="Your profile" />
          <AvatarFallback>
            {legacyProfile.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800 text-white border-gray-700"
          onClick={onEditToggle}
        >
          {isEditing ? (
            <span>Save</span>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-1" />
              <span>Edit</span>
            </>
          )}
        </Button>
      </div>
    </div>
  </div>
);
