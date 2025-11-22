"use client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { artists } from "@/data";
import { Lock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BanknoteIcon } from "@/components/icons/banknote-icon";
import { ArtistTokenInfo } from "./artist-token-info";
import { ArtistCertificationsTab } from "./artist-certifications-tab";
import { ArtistRewardsTab } from "./artist-rewards-tab";
import { ArtistPostsTab } from "./artist-posts-tab";

import { NotFoundError } from "@/components/profile/artist-not-found-error";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DialogHeader } from "../ui/dialog";
import DonateForm from "../wallet/donate-form";
import { Artist } from "@/types";

interface ArtistProfileProps {
  artistId: string;
  onBack: () => void;
}

export default function ArtistProfile({
  artistId,
  onBack,
}: ArtistProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false); // <-- Add state for modal
  const { toast } = useToast();
  const { addToBalance, isArtist } = useAuth();

  const artist = artists.find((a) => a.id === artistId);

  if (!artist) {
    return <NotFoundError />;
  }

  const handleBuyToken = () => {
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      addToBalance(-10); // Subtract DROPS

      toast({
        title: "Purchase successful!",
        description: `You've bought 10 $${artist.tokenName} from ${artist.name}`,
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="pb-6 bg-gray-950">
      {/* Back button at the top */}

      {/* Cover Image */}
      <div className="relative h-36 bg-gradient-to-r from-gray-800 to-black">
        {artist.coverImage && (
          <img
            src={artist.coverImage || "/placeholder.svg"}
            alt={`${artist.name}'s cover`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Artist Info */}
      <div className="px-4 relative">
        <div className="flex items-start mt-[-40px]">
          <Avatar className="h-20 w-20 border-4 border-gray-900">
            <img
              src={artist.avatar}
              alt={artist.name}
              className="h-full w-full rounded-full object-cover"
            />
            <AvatarFallback>
              {artist.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-xl text-white">{artist.name}</h1>
              <p className="text-gray-400 text-sm">{artist.handle}</p>
            </div>
            <BuyTokenDialog
              showDonateModal={showDonateModal}
              setShowDonateModal={setShowDonateModal}
              isLoading={isLoading}
              artist={artist}
            />
          </div>

          <Badge
            variant="outline"
            className="mt-2 bg-gray-800 text-gray-300 border-gray-700"
          >
            {artist.genre}
          </Badge>

          <p className="mt-3 text-sm text-gray-300">{artist.description}</p>

          <div className="flex mt-3 space-x-4 text-sm">
            <div>
              <span className="font-bold text-white">{artist.supporters}</span>
              <span className="text-gray-400 ml-1">followers</span>
            </div>
            <div>
              <span className="font-bold text-white">{artist.blgReceived}</span>
              <span className="text-gray-400 ml-1">$DROPS received</span>
            </div>
          </div>
        </div>

        <ArtistTokenInfo
          artist={artist}
          handleBuyToken={handleBuyToken}
          isLoading={isLoading}
        />

        <div className="mt-6">
          <Tabs defaultValue="posts">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
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
            </TabsList>

            <ArtistPostsTab artist={artist} />
            <ArtistRewardsTab artist={artist} />
            <ArtistCertificationsTab artist={artist} />
          </Tabs>
        </div>

        {!isArtist() && <BecomeArtistCTA />}
      </div>
    </div>
  );
}

interface BuyTokenDialogProps {
  showDonateModal: boolean;
  setShowDonateModal: (show: boolean) => void;
  isLoading: boolean;
  artist: Artist;
}

function BuyTokenDialog({
  showDonateModal,
  setShowDonateModal,
  isLoading,
  artist,
}: BuyTokenDialogProps) {
  return (
    <Dialog open={showDonateModal} onOpenChange={setShowDonateModal}>
      <DialogTrigger asChild>
        <Button
          className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
          disabled={isLoading}
        >
          <BanknoteIcon className="h-4 w-4 mr-1" />
          Buy ${artist.tokenName}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>
            Buy ${artist.tokenName} from {artist.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Support {artist.name} directly by purchasing their token.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <DonateForm creatorId={artist.id} creatorName={artist.name} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BecomeArtistCTA() {
  return (
    <Card className="mt-6 bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center">
          <Lock className="h-5 w-5 text-bright-yellow mr-2" />
          <div className="flex-1">
            <h3 className="text-white font-medium">Want to create content?</h3>
            <p className="text-sm text-gray-400">
              Apply to become an artist on DROPSLAND
            </p>
          </div>
          <Button className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
