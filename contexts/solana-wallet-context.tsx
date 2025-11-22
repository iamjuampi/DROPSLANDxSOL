"use client";

import React, { useMemo, useEffect, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [currentCluster, setCurrentCluster] = useState<
    "mainnet-beta" | "testnet" | "devnet"
  >("devnet");
  const [currentEndpoint, setCurrentEndpoint] = useState<string>(
    "https://api.devnet.solana.com",
  );

  // Cluster endpoints configuration
  const clusterEndpoints = {
    "mainnet-beta": [
      "https://api.mainnet-beta.solana.com",
      "https://rpc.ankr.com/solana",
      "https://solana-api.projectserum.com",
    ],
    testnet: [
      "https://api.testnet.solana.com",
      "https://testnet.helius-rpc.com/?api-key=demo",
    ],
    devnet: [
      "https://api.devnet.solana.com",
      "https://devnet.helius-rpc.com/?api-key=demo",
    ],
  };

  // Use a working endpoint directly
  useEffect(() => {
    // Use devnet for development
    const devnetEndpoint = "https://api.devnet.solana.com";
    console.log("🔗 Setting Solana endpoint to:", devnetEndpoint);
    setCurrentEndpoint(devnetEndpoint);
    setCurrentCluster("devnet");
  }, []);

  // Use the best available endpoint
  const endpoint = useMemo(() => {
    console.log("🔗 Using Solana endpoint:", currentEndpoint);
    return currentEndpoint;
  }, [currentEndpoint]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    [],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
