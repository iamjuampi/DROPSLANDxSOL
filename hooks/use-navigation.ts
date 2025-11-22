import { useState, useEffect, useCallback } from "react";

// Hook for managing navigation state
export function useNavigation() {
  const [activeTab, setActiveTab] = useState("home");
  const [currentView, setCurrentView] = useState<
    "main" | "buy" | "send" | "receive" | "artist" | "artistDashboard"
  >("main");
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

  // Debug state changes
  useEffect(() => {
    console.log("Current view changed to:", currentView);
    console.log("Selected artist ID:", selectedArtistId);
  }, [currentView, selectedArtistId]);

  const handleViewArtist = useCallback(
    (artistId: string, currentUser: string | null) => {
      console.log("Viewing artist:", artistId);

      // Check if the clicked artist is the authenticated user
      if (currentUser && artistId === currentUser) {
        console.log("Navigating to user's own profile");
        setActiveTab("profile");
        setCurrentView("main");
        setSelectedArtistId(null);
      } else {
        console.log("Navigating to other artist profile");
        setSelectedArtistId(artistId);
        setCurrentView("artist");
      }
    },
    [],
  );

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setCurrentView("main");
    setSelectedArtistId(null);
  }, []);

  const navigateToBuy = useCallback(() => {
    setCurrentView("buy");
  }, []);

  const navigateToSend = useCallback(() => {
    setCurrentView("send");
  }, []);

  const navigateToReceive = useCallback(() => {
    setCurrentView("receive");
  }, []);

  const navigateToArtistDashboard = useCallback(() => {
    setCurrentView("artistDashboard");
  }, []);

  const navigateBack = useCallback(() => {
    setCurrentView("main");
    setSelectedArtistId(null);
  }, []);

  return {
    activeTab,
    currentView,
    selectedArtistId,
    handleViewArtist,
    handleTabChange,
    navigateToBuy,
    navigateToSend,
    navigateToReceive,
    navigateToArtistDashboard,
    navigateBack,
  };
}

// Hook for determining which view to render
export function useViewRenderer(
  currentView: string,
  activeTab: string,
  selectedArtistId: string | null,
  user: string | null,
) {
  const getViewType = useCallback(() => {
    // Priority views (override main tabs)
    if (currentView === "buy") return "buy";
    if (currentView === "send") return "send";
    if (currentView === "receive") return "receive";
    if (currentView === "artistDashboard") return "artistDashboard";
    if (currentView === "artist" && selectedArtistId) return "artist";

    // Main tab views
    if (currentView === "main") {
      switch (activeTab) {
        case "home":
          return "home";
        case "search":
          return "search";
        case "wallet":
          return "wallet";
        case "activity":
          return "activity";
        case "profile":
          return "profile";
        default:
          return null;
      }
    }

    return null;
  }, [currentView, activeTab, selectedArtistId]);

  return { viewType: getViewType() };
}
