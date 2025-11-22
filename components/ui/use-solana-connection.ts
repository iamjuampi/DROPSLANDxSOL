/**
 * Hook para conexión real con Solana
 *
 * Funcionalidades:
 * - Conexión real con red Solana
 * - Balance real de SOL
 * - Estado de conexión
 * - Manejo de errores
 */

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, Connection } from "@solana/web3.js";

export function useSolanaConnection() {
  const { publicKey, connected, connecting } = useWallet();

  // Use devnet endpoint directly
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed",
  );

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = useState<any>(null);

  // Función para obtener balance real
  const fetchBalance = useCallback(async () => {
    if (!connected || !publicKey) {
      setBalance(0);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Fetching balance for:", publicKey.toBase58());

      // Obtener balance real desde la blockchain
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;

      console.log("💰 Balance fetched:", solBalance, "SOL");
      setBalance(solBalance);

      // Obtener información de la red
      const slot = await connection.getSlot();
      const blockHeight = await connection.getBlockHeight();

      setNetworkInfo({
        slot,
        blockHeight,
        rpcEndpoint: connection.rpcEndpoint,
      });
    } catch (err: any) {
      console.error("❌ Error fetching balance:", err);
      setError(err.message || "Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey, connected]);

  // Función para obtener información de la cuenta
  const fetchAccountInfo = useCallback(async () => {
    if (!connected || !publicKey) return null;

    try {
      const accountInfo = await connection.getAccountInfo(publicKey);
      return accountInfo;
    } catch (err) {
      console.error("Error fetching account info:", err);
      return null;
    }
  }, [connection, publicKey, connected]);

  return {
    // Estado de conexión
    connected,
    connecting,
    publicKey,

    // Balance
    balance,
    loading,
    error,

    // Información de red
    networkInfo,

    // Funciones
    refresh: fetchBalance,
    getAccountInfo: fetchAccountInfo,

    // Información de conexión
    rpcEndpoint: connection.rpcEndpoint,
    commitment: connection.commitment,
  };
}
