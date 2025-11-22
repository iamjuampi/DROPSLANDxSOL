import { useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { clusterApiUrl } from "@solana/web3.js";

// Define your desired Solana cluster
const SOLANA_CLUSTER = "devnet";
const ENDPOINT = clusterApiUrl(SOLANA_CLUSTER);

/**
 * Custom hook to get a Umi instance configured for the connected wallet.
 */
export const useSolanaUmi = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const umi = useMemo(() => {
    // Create a new Umi instance
    const umiInstance = createUmi(connection?.rpcEndpoint || ENDPOINT).use(
      mplTokenMetadata(),
    );

    // If the wallet is connected, attach it as the identity
    if (wallet.connected && wallet.publicKey) {
      umiInstance.use(walletAdapterIdentity(wallet));
    }

    return umiInstance;
  }, [connection, wallet]);

  return umi;
};
