/**
 * Hook simplificado para manejar NFTs de Solana
 *
 * Funcionalidades:
 * - Profile NFTs (soulbound)
 * - Music NFTs
 * - Conexión directa con el programa de Solana
 */

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  useSolanaNFTs as useSolanaNFTsClient,
  mintProfileNFT,
  mintMusicNFT,
  buyMusicNFT,
  getUserProfileNFT,
  getUserMusicNFTs,
  getSolBalance,
  ProfileNFTData,
  MusicNFTData,
} from "@/lib/solana/solana-nft-client";

export function useSolanaNFTs() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const nftClient = useSolanaNFTsClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. MINT PROFILE NFT
  const mintProfile = useCallback(
    async (profileData: ProfileNFTData) => {
      if (!connected || !publicKey || !nftClient.signTransaction) {
        throw new Error("Wallet not connected");
      }

      setLoading(true);
      setError(null);

      try {
        const signature = await mintProfileNFT(
          connection,
          publicKey,
          nftClient.signTransaction,
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
    [connected, publicKey, connection, nftClient.signTransaction],
  );

  // 2. MINT MUSIC NFT
  const mintMusic = useCallback(
    async (musicData: MusicNFTData) => {
      if (!connected || !publicKey || !nftClient.signTransaction) {
        throw new Error("Wallet not connected");
      }

      setLoading(true);
      setError(null);

      try {
        const signature = await mintMusicNFT(
          connection,
          publicKey,
          nftClient.signTransaction,
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
    [connected, publicKey, connection, nftClient.signTransaction],
  );

  // 3. BUY MUSIC NFT
  const buyMusic = useCallback(
    async (musicMint: string, artistWallet: string, price: number) => {
      if (!connected || !publicKey || !nftClient.signTransaction) {
        throw new Error("Wallet not connected");
      }

      setLoading(true);
      setError(null);

      try {
        const signature = await buyMusicNFT(
          connection,
          publicKey,
          nftClient.signTransaction,
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
    [connected, publicKey, connection, nftClient.signTransaction],
  );

  // 4. CHECK PROFILE NFT
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

  // 5. GET USER MUSIC NFTS
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

  // 6. GET SOL BALANCE
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
    checkProfileNFT,
    getUserMusic,
    getBalance,

    // Helpers
    setError,
  };
}
