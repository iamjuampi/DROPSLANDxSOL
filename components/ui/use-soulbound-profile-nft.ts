/**
 * Hook para Profile NFTs Soulbound
 *
 * Integra tu programa soulbound directamente desde el frontend
 */

import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  soulboundClient,
  SoulboundMintParams,
  MintResult,
} from "@/lib/solana/soulbound-nft-client";

export function useSoulboundProfileNFT() {
  const wallet = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [mintResult, setMintResult] = useState<MintResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Mintea un Profile NFT soulbound
   */
  const mintProfileNFT = useCallback(
    async (params: SoulboundMintParams): Promise<boolean> => {
      if (!wallet.publicKey) {
        setError("Por favor conecta tu wallet primero");
        return false;
      }

      setIsMinting(true);
      setError(null);
      setMintResult(null);

      try {
        const result = await soulboundClient.mintProfileNFT(wallet, params);

        setMintResult(result);

        if (result.success) {
          // Guardar en localStorage para referencia rápida
          localStorage.setItem("profile_nft_signature", result.signature || "");
          localStorage.setItem("profile_nft_mint", result.mintAddress || "");
          localStorage.setItem("profile_nft_minted", "true");

          return true;
        } else {
          setError(result.error || "Error al mintear NFT");
          return false;
        }
      } catch (err: any) {
        const errorMsg = err.message || "Error desconocido";
        setError(errorMsg);
        console.error("Error in mintProfileNFT:", err);
        return false;
      } finally {
        setIsMinting(false);
      }
    },
    [wallet],
  );

  /**
   * Verifica si el usuario ya tiene un Profile NFT
   */
  const checkHasProfileNFT = useCallback(async (): Promise<boolean> => {
    if (!wallet.publicKey) return false;

    setIsChecking(true);

    try {
      // Check localStorage primero (rápido)
      const hasMinted = localStorage.getItem("profile_nft_minted") === "true";
      if (hasMinted) {
        setIsChecking(false);
        return true;
      }

      // Check on-chain
      const hasNFT = await soulboundClient.hasProfileNFT(wallet.publicKey);

      if (hasNFT) {
        localStorage.setItem("profile_nft_minted", "true");
      }

      return hasNFT;
    } catch (err) {
      console.error("Error checking profile NFT:", err);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [wallet.publicKey]);

  /**
   * Obtiene la metadata del Profile NFT
   */
  const getProfileNFTMetadata = useCallback(async () => {
    if (!wallet.publicKey) return null;

    try {
      return await soulboundClient.getProfileNFTMetadata(wallet.publicKey);
    } catch (err) {
      console.error("Error getting NFT metadata:", err);
      return null;
    }
  }, [wallet.publicKey]);

  /**
   * Limpia el estado (útil para testing)
   */
  const reset = useCallback(() => {
    setMintResult(null);
    setError(null);
    setIsMinting(false);
    setIsChecking(false);
  }, []);

  return {
    // Estado
    isMinting,
    isChecking,
    mintResult,
    error,

    // Acciones
    mintProfileNFT,
    checkHasProfileNFT,
    getProfileNFTMetadata,
    reset,

    // Info de wallet
    connected: wallet.connected,
    publicKey: wallet.publicKey,
  };
}
