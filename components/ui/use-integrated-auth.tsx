/**
 * Hook integrado que combina la autenticación existente con Solana wallet
 *
 * Funcionalidades:
 * - Mantiene toda la funcionalidad existente
 * - Añade integración con Solana wallet
 * - Preserva el contenido y funcionalidad actual
 */

import { useState, useEffect, useCallback } from "react";
import { useSolanaNFTs } from "./use-solana-nfts";
import { useSolanaConnection } from "./use-solana-connection";
import { PublicKey } from "@solana/web3.js";
import { useAuth } from "@/hooks/use-auth";

interface IntegratedAuthType {
  // Funcionalidad existente
  user: string | null;
  userData: any;
  isAuthenticated: boolean;
  balance: number;
  donated: number;
  login: (username: string) => void;
  loginWithNFID: (principal: string) => void;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  addToBalance: (amount: number) => void;
  addToDonated: (amount: number) => void;
  isArtist: () => boolean;
  isNFIDUser: () => boolean;
  isFirstTimeNFIDUser: (principal: string) => boolean;
  createNFIDUser: (
    principal: string,
    username: string,
    password: string,
    profilePhoto?: File,
  ) => boolean;
  updateUserProfile: (updates: any) => void;
  updateBackendProfile: (
    username?: string,
    handle?: string,
    profileImage?: string,
    coverImage?: string,
    genre?: string,
    bio?: string,
  ) => Promise<boolean>;
  updateBackendUsername: (username: string) => Promise<boolean>;
  updateBackendHandle: (handle: string) => Promise<boolean>;
  updateBackendProfileImage: (profileImage: string) => Promise<boolean>;
  updateBackendCoverImage: (coverImage: string) => Promise<boolean>;

  // Funcionalidad de Solana
  solanaConnected: boolean;
  solanaPublicKey: PublicKey | null;
  solanaBalance: number;
  hasProfileNFT: boolean;
  userMusicNFTs: any[];

  // Funciones de Solana
  mintProfileNFT: (profileData: any) => Promise<any>;
  mintMusicNFT: (musicData: any) => Promise<any>;
  buyMusicNFT: (
    musicMint: string,
    artistWallet: string,
    price: number,
  ) => Promise<any>;
  checkProfileNFT: () => Promise<boolean>;
  getUserMusicNFTs: () => Promise<any[]>;
  getSolanaBalance: () => Promise<number>;
}

export function useIntegratedAuth(): IntegratedAuthType {
  // Hook de autenticación existente
  const auth = useAuth();

  // Hook de Solana NFTs - habilitado para funciones reales
  const solanaNFTs = useSolanaNFTs();

  // Hook de conexión real con Solana
  const {
    connected: solanaConnected,
    publicKey: solanaPublicKey,
    balance: realSolBalance,
    loading: balanceLoading,
    error: balanceError,
    networkInfo,
    refresh: refreshBalance,
  } = useSolanaConnection();

  // Estado local para Solana
  const [solanaBalance, setSolanaBalance] = useState(0);
  const [hasProfileNFT, setHasProfileNFT] = useState(false);
  const [userMusicNFTs, setUserMusicNFTs] = useState<any[]>([]);

  // Actualizar balance de Solana cuando se conecta el wallet
  useEffect(() => {
    if (solanaConnected && solanaPublicKey) {
      // Usar balance real de SOL
      setSolanaBalance(realSolBalance);
      console.log("🔄 Updating Solana balance:", realSolBalance);

      // Verificar NFTs usando funciones reales
      checkProfileNFT();
      getUserMusicNFTs();
    }
  }, [solanaConnected, solanaPublicKey, realSolBalance]);

  // Función para mintear Profile NFT - usando función real
  const mintProfileNFT = useCallback(
    async (profileData: any) => {
      if (!solanaConnected || !solanaPublicKey) {
        throw new Error("Solana wallet not connected");
      }

      try {
        console.log("🎨 Minting Profile NFT:", profileData);
        const result = await solanaNFTs.mintProfile(profileData);

        if (result.success) {
          setHasProfileNFT(true);
          return result;
        } else {
          throw new Error(result.error || "Failed to mint profile NFT");
        }
      } catch (error: any) {
        console.error("Error minting profile NFT:", error);
        throw error;
      }
    },
    [solanaConnected, solanaPublicKey, solanaNFTs],
  );

  // Función para mintear Music NFT - usando función real
  const mintMusicNFT = useCallback(
    async (musicData: any) => {
      if (!solanaConnected || !solanaPublicKey) {
        throw new Error("Solana wallet not connected");
      }

      try {
        console.log("🎵 Minting Music NFT:", musicData);
        const result = await solanaNFTs.mintMusic(musicData);

        if (result.success) {
          // Actualizar lista de NFTs de música
          const newNFT = {
            id: "music_nft_" + Date.now(),
            title: musicData.title || "Music NFT",
            artist: musicData.artist || "Artist",
            price: musicData.price || 0.1,
          };
          setUserMusicNFTs((prev) => [...prev, newNFT]);
          return result;
        } else {
          throw new Error(result.error || "Failed to mint music NFT");
        }
      } catch (error: any) {
        console.error("Error minting music NFT:", error);
        throw error;
      }
    },
    [solanaConnected, solanaPublicKey, solanaNFTs],
  );

  // Función para verificar Profile NFT - usando función real
  const checkProfileNFT = useCallback(async () => {
    if (!solanaConnected || !solanaPublicKey) {
      return false;
    }

    try {
      console.log("🔍 Checking Profile NFT...");
      const result = await solanaNFTs.checkProfileNFT();
      const hasNFT = typeof result === "boolean" ? result : false;
      setHasProfileNFT(hasNFT);
      return hasNFT;
    } catch (error: any) {
      console.error("Error checking profile NFT:", error);
      return false;
    }
  }, [solanaConnected, solanaPublicKey, solanaNFTs]);

  // Función para obtener NFTs de música del usuario - usando función real
  const getUserMusicNFTs = useCallback(async () => {
    if (!solanaConnected || !solanaPublicKey) {
      return [];
    }

    try {
      console.log("🎵 Getting user music NFTs...");
      const result = await solanaNFTs.getUserMusic();
      if (Array.isArray(result)) {
        setUserMusicNFTs(result);
        return result;
      }
      return [];
    } catch (error: any) {
      console.error("Error getting user music NFTs:", error);
      return [];
    }
  }, [solanaConnected, solanaPublicKey, solanaNFTs]);

  // Función para comprar Music NFT - usando función real
  const buyMusicNFT = useCallback(
    async (musicMint: string, artistWallet: string, price: number) => {
      if (!solanaConnected || !solanaPublicKey) {
        throw new Error("Solana wallet not connected");
      }

      try {
        console.log("💰 Buying Music NFT:", { musicMint, artistWallet, price });
        const result = await solanaNFTs.buyMusic(
          musicMint,
          artistWallet,
          price,
        );

        if (result.success) {
          // Actualizar lista de NFTs después de la compra
          await getUserMusicNFTs();
          return result;
        } else {
          throw new Error(result.error || "Failed to buy music NFT");
        }
      } catch (error: any) {
        console.error("Error buying music NFT:", error);
        throw error;
      }
    },
    [solanaConnected, solanaPublicKey, solanaNFTs, getUserMusicNFTs],
  );

  // Función para obtener balance de Solana
  const getSolanaBalance = useCallback(async () => {
    if (!solanaConnected || !solanaPublicKey) {
      return 0;
    }

    // Usar balance real de la conexión
    console.log("💰 Getting Solana balance...");
    return realSolBalance;
  }, [solanaConnected, solanaPublicKey]);

  // Función para enviar tokens
  const sendTokens = useCallback(
    async (recipientId: string, amount: number, message?: string) => {
      if (!solanaConnected || !solanaPublicKey) {
        throw new Error("Solana wallet not connected");
      }

      try {
        console.log("💸 Sending tokens:", { recipientId, amount, message });
        // Simular envío de tokens
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
          success: true,
          signature: "send_signature_" + Date.now(),
          transactionId: "send_tx_" + Date.now(),
        };
      } catch (error: any) {
        console.error("Error sending tokens:", error);
        throw error;
      }
    },
    [solanaConnected, solanaPublicKey],
  );

  // Función para comprar tokens
  const buyTokens = useCallback(
    async (amount: number, exchangeRate: number) => {
      if (!solanaConnected || !solanaPublicKey) {
        throw new Error("Solana wallet not connected");
      }

      try {
        console.log("💰 Buying tokens:", { amount, exchangeRate });
        // Simular compra de tokens
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
          success: true,
          signature: "buy_signature_" + Date.now(),
          transactionId: "buy_tx_" + Date.now(),
        };
      } catch (error: any) {
        console.error("Error buying tokens:", error);
        throw error;
      }
    },
    [solanaConnected, solanaPublicKey],
  );

  // Función para comprar token de artista
  const buyArtistToken = useCallback(
    async (artistId: string, amount: number, price: number) => {
      if (!solanaConnected || !solanaPublicKey) {
        throw new Error("Solana wallet not connected");
      }

      try {
        console.log("🎵 Buying artist token:", { artistId, amount, price });
        // Simular compra de token de artista
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
          success: true,
          signature: "artist_buy_signature_" + Date.now(),
          transactionId: "artist_buy_tx_" + Date.now(),
        };
      } catch (error: any) {
        console.error("Error buying artist token:", error);
        throw error;
      }
    },
    [solanaConnected, solanaPublicKey],
  );

  // Función para mintear ticket
  const mintTicket = useCallback(
    async (ticketData: any) => {
      if (!solanaConnected || !solanaPublicKey) {
        throw new Error("Solana wallet not connected");
      }

      try {
        console.log("🎫 Minting ticket:", ticketData);
        // Simular minting de ticket
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
          success: true,
          signature: "ticket_signature_" + Date.now(),
          transactionId: "ticket_tx_" + Date.now(),
        };
      } catch (error: any) {
        console.error("Error minting ticket:", error);
        throw error;
      }
    },
    [solanaConnected, solanaPublicKey],
  );

  return {
    // Funcionalidad existente (preservada)
    user: auth.user,
    userData: auth.userData,
    isAuthenticated: auth.isAuthenticated,
    balance: auth.balance,
    donated: auth.donated,
    login: auth.login,
    loginWithNFID: auth.loginWithNFID,
    logout: auth.logout,
    updateBalance: auth.updateBalance,
    addToBalance: auth.addToBalance,
    addToDonated: auth.addToDonated,
    isArtist: auth.isArtist,
    isNFIDUser: auth.isNFIDUser,
    isFirstTimeNFIDUser: auth.isFirstTimeNFIDUser,
    createNFIDUser: auth.createNFIDUser,
    updateUserProfile: auth.updateUserProfile,
    updateBackendProfile: auth.updateBackendProfile,
    updateBackendUsername: (username: string) =>
      auth.updateBackendProfile(username),
    updateBackendHandle: (handle: string) =>
      auth.updateBackendProfile(undefined, handle),
    updateBackendProfileImage: (profileImage: string) =>
      auth.updateBackendProfile(undefined, undefined, profileImage),
    updateBackendCoverImage: (coverImage: string) =>
      auth.updateBackendProfile(undefined, undefined, undefined, coverImage),

    // Funcionalidad de Solana (añadida)
    solanaConnected,
    solanaPublicKey,
    solanaBalance,
    hasProfileNFT,
    userMusicNFTs,

    // Funciones de Solana
    mintProfileNFT,
    mintMusicNFT,
    buyMusicNFT,
    checkProfileNFT,
    getUserMusicNFTs,
    getSolanaBalance,
  };
}
