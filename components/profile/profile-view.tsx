"use client";
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMusicPlayer } from "@/hooks/use-music-player";

import { ProfileCommentDialog } from "./profile-comment-dialog";
import { ProfileTabs } from "./profile-tabs";
import { musicTracks } from "@/data";
import { Track } from "@/types";
import UserProfile from "@/components/profile/user-profile";
import { LegacyProfileView } from "./legacy-profile-view";

type UserData = any;

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
