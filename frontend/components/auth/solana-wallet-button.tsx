"use client";

import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export function SolanaWalletButton() {
  const { publicKey, connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-background/20 backdrop-blur supports-[backdrop-filter]:bg-background/10 border border-transparent rounded-lg shadow-lg p-2">
        <div className="!bg-primary/80 !text-primary-foreground !rounded-md !px-4 !py-2 !text-sm !font-medium h-10 flex items-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background/20 backdrop-blur supports-[backdrop-filter]:bg-background/10 border border-transparent rounded-lg shadow-lg p-2">
      <WalletMultiButton className="!bg-primary/80 hover:!bg-primary/90 !text-primary-foreground !rounded-md !px-4 !py-2 !text-sm !font-medium !transition-colors" />
      {connected && publicKey && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Connected: {publicKey.toBase58().slice(0, 4)}...
          {publicKey.toBase58().slice(-4)}
        </div>
      )}
    </div>
  );
}
