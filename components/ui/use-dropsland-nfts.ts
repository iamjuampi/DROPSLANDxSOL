/**
 * Hook principal para manejar NFTs de DROPSLAND
 *
 * Funcionalidades:
 * - Profile NFTs (soulbound)
 * - Music NFTs
 * - Rewards system
 */

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  useDropslandProgram,
  mintProfileNFT,
  mintMusicNFT,
  buyMusicNFT,
  createReward,
  claimReward,
  getUserProfileNFT,
  getUserMusicNFTs,
  getSolBalance,
  ProfileNFTData,
  MusicNFTData,
  RewardData,
} from "@/lib/dropsland-program-client";

export function useDropslandNFTs() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const program = useDropslandProgram();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. MINT PROFILE NFT
  const mintProfile = useCallback(
    async (profileData: ProfileNFTData) => {
      if (!connected || !publicKey || !program) {
        throw new Error("Wallet not connected");
      }

      setLoading(true);
      setError(null);

      try {
        const signature = await mintProfileNFT(
          program.program,
          publicKey,
          profileData,
        );

        return { success: true, signature };
      } catch (err: any) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [connected, publicKey, program],
  );

  // 2. MINT MUSIC NFT
  const mintMusic = useCallback(
    async (musicData: MusicNFTData) => {
      if (!connected || !publicKey || !program) {
        throw new Error("Wallet not connected");
      }

      setLoading(true);
      setError(null);

      try {
        const signature = await mintMusicNFT(
          program.program,
          publicKey,
          musicData,
        );

        return { success: true, signature };
      } catch (err: any) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [connected, publicKey, program],
  );

  // 3. BUY MUSIC NFT
  const buyMusic = useCallback(
    async (musicMint: string, artistWallet: string, price: number) => {
      if (!connected || !publicKey || !program) {
        throw new Error("Wallet not connected");
      }

      setLoading(true);
      setError(null);

      try {
        const signature = await buyMusicNFT(
          program.program,
          publicKey,
          new PublicKey(musicMint),
          new PublicKey(artistWallet),
          price,
        );

        return { success: true, signature };
      } catch (err: any) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [connected, publicKey, program],
  );

  // 4. CREATE REWARD
  const createArtistReward = useCallback(
    async (rewardData: RewardData) => {
      if (!connected || !publicKey || !program) {
        throw new Error("Wallet not connected");
      }

      setLoading(true);
      setError(null);

      try {
        const signature = await createReward(
          program.program,
          publicKey,
          rewardData,
        );

        return { success: true, signature };
      } catch (err: any) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [connected, publicKey, program],
  );

  // 5. CLAIM REWARD
  const claimArtistReward = useCallback(
    async (artistWallet: string, rewardId: number, tokenMint: string) => {
      if (!connected || !publicKey || !program) {
        throw new Error("Wallet not connected");
      }

      setLoading(true);
      setError(null);

      try {
        const signature = await claimReward(
          program.program,
          publicKey,
          new PublicKey(artistWallet),
          rewardId,
          new PublicKey(tokenMint),
        );

        return { success: true, signature };
      } catch (err: any) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [connected, publicKey, program],
  );

  // 6. CHECK PROFILE NFT
  const checkProfileNFT = useCallback(async () => {
    if (!connected || !publicKey) {
      return false;
    }

    try {
      return await getUserProfileNFT(connection, publicKey);
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [connected, publicKey, connection]);

  // 7. GET USER MUSIC NFTS
  const getUserMusic = useCallback(async () => {
    if (!connected || !publicKey) {
      return [];
    }

    try {
      return await getUserMusicNFTs(connection, publicKey);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, [connected, publicKey, connection]);

  // 8. GET SOL BALANCE
  const getBalance = useCallback(async () => {
    if (!connected || !publicKey) {
      return 0;
    }

    try {
      return await getSolBalance(connection, publicKey);
    } catch (err: any) {
      setError(err.message);
      return 0;
    }
  }, [connected, publicKey, connection]);

  return {
    // Estado
    loading,
    error,
    connected,
    publicKey,

    // Funciones
    mintProfile,
    mintMusic,
    buyMusic,
    createArtistReward,
    claimArtistReward,
    checkProfileNFT,
    getUserMusic,
    getBalance,

    // Helpers
    setError,
  };
}
