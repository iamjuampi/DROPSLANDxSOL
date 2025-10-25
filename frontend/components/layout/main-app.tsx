"use client";
import HomeView from "@/components/feed/home-view";
import SearchView from "@/components/search-view";
import ActivityView from "@/components/feed/activity-view";
import ProfileView from "@/components/profile/profile-view";
import WalletView from "@/components/wallet/wallet-view";
import ArtistDashboard from "@/components/artist-dashboard";
import BuyView from "@/components/wallet/buy-view";
import SendView from "@/components/send-view";
import ReceiveView from "@/components/wallet/receive-view";
import { Header } from "@/components/layout/header";
import { TabBar } from "@/components/layout/tab-bar";
import { useNavigation, useViewRenderer } from "@/hooks/use-navigation";
import type { useNavigation as useNavigationType } from "@/hooks/use-navigation";
import { useAuth } from "@/hooks/use-auth";
import ArtistProfile from "@/components/profile/artist-profile";

export default function MainApp() {
  const { user, userData, login, logout, isArtist } = useAuth();
  const navigation = useNavigation();
  const { viewType } = useViewRenderer(
    navigation.currentView,
    navigation.activeTab,
    navigation.selectedArtistId,
    user,
  );

  return (
    <>
      <Header
        userData={userData}
        isArtist={isArtist}
        activeTab={navigation.activeTab}
        handleOpenArtistDashboard={navigation.navigateToArtistDashboard}
        user={user || "iamjuampi"}
        logout={logout}
      />
      <main className="flex-1 overflow-auto bg-gray-950 pb-24">
        <ViewRenderer
          viewType={viewType}
          navigation={navigation}
          user={user || "iamjuampi"}
        />
      </main>
      <TabBar
        activeTab={navigation.activeTab}
        onTabChange={navigation.handleTabChange}
      />
    </>
  );
}

export function ViewRenderer({
  viewType,
  navigation,
  user,
}: {
  viewType: string | null;
  navigation: ReturnType<typeof useNavigationType>;
  user: string;
}) {
  const handleArtistClick = (artistId: string) => {
    navigation.handleViewArtist(artistId, user);
  };

  switch (viewType) {
    case "buy":
      return <BuyView onBack={navigation.navigateBack} />;
    case "send":
      return <SendView onBack={navigation.navigateBack} />;
    case "receive":
      return <ReceiveView onBack={navigation.navigateBack} />;
    case "artistDashboard":
      return <ArtistDashboard onBack={navigation.navigateBack} />;
    case "artist":
      return (
        <ArtistProfile
          artistId={navigation.selectedArtistId!}
          onBack={navigation.navigateBack}
        />
      );
    case "home":
      return <HomeView onSelectArtist={handleArtistClick} />;
    case "search":
      return <SearchView onSelectArtist={handleArtistClick} />;
    case "wallet":
      return (
        <WalletView
          onBuy={navigation.navigateToBuy}
          onSend={navigation.navigateToSend}
          onReceive={navigation.navigateToReceive}
        />
      );
    case "activity":
      return <ActivityView onSelectArtist={handleArtistClick} />;
    case "profile":
      return <ProfileView username={user} />;
    default:
      return null;
  }
}
