import { UserData } from "@/types";
import { UserPlus } from "lucide-react";
import { SolanaWalletButton } from "@/components/auth/solana-wallet-button";
import { Button } from "@/components/ui/button";

export function Header({
  userData,
  isArtist,
  activeTab,
  handleOpenArtistDashboard,
  user,
  logout,
}: {
  userData: UserData | null;
  isArtist: () => boolean;
  activeTab: string;
  handleOpenArtistDashboard: () => void;
  user: string;
  logout: () => void;
}) {
  return (
    <header className="bg-gray-900 px-4 py-4 border-b border-gray-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src="/images/dropsland-logo.png"
          alt="DROPSLAND"
          className="h-12 max-w-[180px] object-contain"
        />
        <SolanaWalletButton />
      </div>
      <div className="flex items-center gap-2">
        {userData && isArtist() && activeTab === "profile" && (
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 text-white border-gray-700"
            onClick={handleOpenArtistDashboard}
          >
            Artist Dashboard
          </Button>
        )}
        {!userData && user && (
          <button onClick={logout} className="flex items-center text-gray-300">
            <UserPlus className="h-4 w-4 mr-1" />
            <span className="text-sm">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
