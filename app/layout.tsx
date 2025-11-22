import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { MusicPlayerProvider } from "@/contexts/music-player-context";
import { SolanaWalletProvider } from "@/contexts/solana-wallet-context";
import MiniPlayerWrapper from "@/components/music-player/mini-player-wrapper";
import ExpandedPlayer from "@/components/music-player/expanded-player";
import { WrappedPrivyProvider } from "@/components/privy-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DROPSLAND",
  description: "Platform for DJs",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <HeadPWA />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WrappedPrivyProvider>
            <SolanaWalletProvider>
              <AuthProvider>
                <MusicPlayerProvider>
                  {children}
                  <MiniPlayerWrapper />
                  <ExpandedPlayer />
                </MusicPlayerProvider>
              </AuthProvider>
              <Toaster />
            </SolanaWalletProvider>
          </WrappedPrivyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function HeadPWA() {
  return (
    <head>
      {/* PWA Meta Tags */}
      <meta name="application-name" content="Dropsland" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Dropsland" />
      <meta
        name="description"
        content="Platform for DJs - Where Music Meets Ownership"
      />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#ffff00" />

      {/* Link to Manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Favicon and Apple Touch Icon */}
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    </head>
  );
}
