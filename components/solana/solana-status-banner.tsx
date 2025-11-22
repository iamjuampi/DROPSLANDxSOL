/**
 * Banner de estado de Solana para el home
 *
 * Funcionalidades:
 * - Muestra el estado de conexión de Solana
 * - Muestra el estado del Profile NFT
 * - Permite acciones rápidas
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  User,
  Music,
  Zap,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useIntegratedAuth } from "../ui/use-integrated-auth";

interface SolanaStatusBannerProps {
  onMintProfile?: () => void;
  onMintMusic?: () => void;
  onViewNFTs?: () => void;
}

export function SolanaStatusBanner({
  onMintProfile,
  onMintMusic,
  onViewNFTs,
}: SolanaStatusBannerProps) {
  const {
    solanaConnected,
    solanaPublicKey,
    solanaBalance,
    hasProfileNFT,
    userMusicNFTs,
    mintProfileNFT,
    userData,
  } = useIntegratedAuth();

  const [isMinting, setIsMinting] = useState(false);

  const handleMintProfile = async () => {
    if (!userData) return;

    setIsMinting(true);
    try {
      const profileData = {
        username: userData.username,
        profileType: userData.type || "fan",
        principal: userData.principal,
        createdAt: new Date().toISOString(),
      };

      await mintProfileNFT(profileData);
      onMintProfile?.();
    } catch (error) {
      console.error("Error minting profile NFT:", error);
    } finally {
      setIsMinting(false);
    }
  };

  if (!solanaConnected) {
    return (
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600/30 rounded-full flex items-center justify-center">
                <Wallet className="h-5 w-5 text-purple-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Connect Solana Wallet
                </p>
                <p className="text-xs text-purple-300">
                  Unlock NFT features and collect music tokens
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-orange-500/20 text-orange-200"
            >
              <XCircle className="h-3 w-3 mr-1" />
              Not Connected
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/30 rounded-full flex items-center justify-center">
              <Zap className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Solana Connected</p>
              <p className="text-xs text-purple-300">
                {solanaBalance.toFixed(4)} SOL • {userMusicNFTs.length} NFTs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={
                hasProfileNFT
                  ? "bg-green-500/20 text-green-200"
                  : "bg-orange-500/20 text-orange-200"
              }
            >
              {hasProfileNFT ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {hasProfileNFT ? "NFT Active" : "No NFT"}
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex gap-2">
          {!hasProfileNFT && (
            <Button
              size="sm"
              onClick={handleMintProfile}
              disabled={isMinting}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
            >
              {isMinting ? (
                <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                  Minting...
                </>
              ) : (
                <>
                  <User className="h-3 w-3 mr-1" />
                  Mint Profile NFT
                </>
              )}
            </Button>
          )}

          {onMintMusic && (
            <Button
              size="sm"
              variant="outline"
              onClick={onMintMusic}
              className="border-purple-500 text-purple-300 hover:bg-purple-900/20 text-xs"
            >
              <Music className="h-3 w-3 mr-1" />
              Mint Music
            </Button>
          )}

          {onViewNFTs && (
            <Button
              size="sm"
              variant="outline"
              onClick={onViewNFTs}
              className="border-purple-500 text-purple-300 hover:bg-purple-900/20 text-xs"
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              View NFTs
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
