import { Heart, Home, Search, User, Wallet } from "lucide-react";

export function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center">
      <div className="max-w-md w-full bg-gray-900 border-t border-gray-800">
        <div className="flex justify-between items-center px-6 pt-2 pb-8">
          <button
            onClick={() => onTabChange("home")}
            className={`flex flex-col items-center ${activeTab === "home" ? "text-bright-yellow" : "text-gray-400"}`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => onTabChange("search")}
            className={`flex flex-col items-center ${activeTab === "search" ? "text-bright-yellow" : "text-gray-400"}`}
          >
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Explore</span>
          </button>
          <button
            onClick={() => onTabChange("wallet")}
            className={`flex flex-col items-center ${activeTab === "wallet" ? "text-bright-yellow" : "text-gray-400"}`}
          >
            <Wallet className="h-6 w-6" />
            <span className="text-xs mt-1">Wallet</span>
          </button>
          <button
            onClick={() => onTabChange("activity")}
            className={`flex flex-col items-center ${activeTab === "activity" ? "text-bright-yellow" : "text-gray-400"}`}
          >
            <Heart className="h-6 w-6" />
            <span className="text-xs mt-1">Activity</span>
          </button>
          <button
            onClick={() => onTabChange("profile")}
            className={`flex flex-col items-center ${activeTab === "profile" ? "text-bright-yellow" : "text-gray-400"}`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
