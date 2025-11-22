"use client";
import { PrivyProvider } from "@privy-io/react-auth";

export function WrappedPrivyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // optional configs here
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
        },
        appearance: {
          theme: "light",
          accentColor: "#00AAFF",
          logo: "/logo.png",
        },
        // other settings like defaultChain/supportedChains if using wallets
      }}
    >
      {children}
    </PrivyProvider>
  );
}
