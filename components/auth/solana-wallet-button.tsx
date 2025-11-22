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
      <div className="bg-background/20 backdrop-blur supports-[backdrop-filter]:bg-background/10 border border-transparent rounded-lg shadow-lg p-1">
        <div className="!bg-primary/80 !text-primary-foreground !rounded-md !px-1 !py-0.5 !text-xs !font-medium h-6 flex items-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background/20 backdrop-blur supports-[backdrop-filter]:bg-background/10 border border-transparent rounded-lg shadow-lg p-1">
      <WalletMultiButton className="!bg-primary/80 hover:!bg-primary/90 !text-primary-foreground !rounded-md !px-1 !py-0.5 !text-xs !font-medium !transition-colors" />
    </div>
  );
}
