"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { backendService } from "@/lib/backend-service"; // Keep using the mock backend
import { UserData } from "@/types";

// --- Mock User Data ---
const mockArtistData: UserData = {
  id: "iamjuampi", // Using a known artist ID
  username: "iamjuampi",
  handle: "@iamjuampi",
  type: "artist",
  isVerified: true,
  profilePhoto: "/avatars/juampi.jpg",
  coverPhoto: "/images/bdeeeee.jpg",
  isIIUser: false, // Simulating non-II user for simplicity, can change
  principal: "mock-principal-artist",
  bio: "DJ, producer, and founder of the record label Best Drops Ever.",
  genre: "Tech-House",
  followers: ["mock_fan_id", "another_fan_id"],
  following: ["banger", "nicolamarti"],
  createdAt: new Date("2024-01-01T10:00:00Z").toISOString(),
  lastActive: new Date().toISOString(),
};

const mockFanData: UserData = {
  id: "mock_fan_id",
  username: "MusicFan99",
  handle: "@musicfan99",
  type: "fan",
  isVerified: false,
  profilePhoto: "/avatars/user.jpg",
  coverPhoto: "/images/bdeeeee.jpg", // Default cover
  isIIUser: false,
  principal: "mock-principal-fan",
  bio: "Just here to support great artists!",
  genre: "Techno",
  followers: [],
  following: ["iamjuampi", "banger"],
  createdAt: new Date("2024-03-15T14:30:00Z").toISOString(),
  lastActive: new Date().toISOString(),
};
// --- End Mock User Data ---

interface AuthContextType {
  user: string | null;
  userData: UserData | null;
  isAuthenticated: boolean;
  balance: number;
  donated: number;
  login: (username: string) => void; // Kept for potential testing, but not primary
  loginWithNFID: (principal: string) => void; // Kept for potential testing
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  addToBalance: (amount: number) => void;
  addToDonated: (amount: number) => void;
  isArtist: () => boolean;
  isNFIDUser: () => boolean; // Will check mocked data
  isFirstTimeNFIDUser: (principal: string) => boolean; // Mocked
  createNFIDUser: (
    principal: string,
    username: string,
    password: string,
    profilePhoto?: File,
  ) => boolean; // Mocked
  updateUserProfile: (updates: Partial<UserData>) => void;
  updateBackendProfile: (
    username?: string,
    handle?: string,
    profileImage?: string,
    coverImage?: string,
    genre?: string,
    bio?: string,
  ) => Promise<boolean>;
  // Simpler way to switch between mock users for testing
  switchMockUser: (type: "artist" | "fan") => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isAuthenticated: false,
  balance: 0,
  donated: 0,
  login: () => {},
  loginWithNFID: () => {},
  logout: () => {},
  updateBalance: () => {},
  addToBalance: () => {},
  addToDonated: () => {},
  isArtist: () => false,
  isNFIDUser: () => false,
  isFirstTimeNFIDUser: () => false,
  createNFIDUser: () => false,
  updateUserProfile: () => {},
  updateBackendProfile: () => Promise.resolve(false),
  switchMockUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use mock data by default
  const [user, setUser] = useState<string | null>(mockArtistData.id); // Default to artist
  const [userData, setUserData] = useState<UserData | null>(mockArtistData);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Assume logged in
  const [balance, setBalance] = useState(125);
  const [donated, setDonated] = useState(75);

  // Load balance/donated from localStorage on mount
  useEffect(() => {
    const storedBalance = localStorage.getItem("beans_balance");
    if (storedBalance) setBalance(Number(storedBalance));
    const storedDonated = localStorage.getItem("beans_donated");
    if (storedDonated) setDonated(Number(storedDonated));
  }, []);

  // Mock login - Sets the current user to one of the mocks based on "username"
  const login = useCallback((username: string) => {
    if (
      username === mockArtistData.username ||
      username === mockArtistData.id
    ) {
      setUser(mockArtistData.id);
      setUserData(mockArtistData);
      setIsAuthenticated(true);
    } else if (
      username === mockFanData.username ||
      username === mockFanData.id
    ) {
      setUser(mockFanData.id);
      setUserData(mockFanData);
      setIsAuthenticated(true);
    } else {
      // Basic fallback if needed
      setUser("temp_user");
      setUserData({ ...mockFanData, id: "temp_user", username: username });
      setIsAuthenticated(true);
    }
  }, []);

  // Mock NFID login - Just uses the principal as ID and sets mock fan data
  const loginWithNFID = useCallback((principal: string) => {
    // For simplicity, always log in as the mock fan when using this
    setUser(mockFanData.id);
    setUserData({ ...mockFanData, id: principal, principal: principal }); // Use principal as ID
    setIsAuthenticated(true);
    console.log(
      "Mock NFID Login: Logged in as mock fan with principal:",
      principal,
    );
  }, []);

  // Switch between mock users easily
  const switchMockUser = useCallback((type: "artist" | "fan") => {
    if (type === "artist") {
      setUser(mockArtistData.id);
      setUserData(mockArtistData);
    } else {
      setUser(mockFanData.id);
      setUserData(mockFanData);
    }
    setIsAuthenticated(true); // Ensure authenticated state
    console.log(`Switched mock user to: ${type}`);
  }, []);

  const logout = () => {
    setUser(null);
    setUserData(null);
    setIsAuthenticated(false);
    // Don't remove balance/donated to persist them across "sessions"
    console.log("Mock Logout: User logged out");
  };

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
    localStorage.setItem("beans_balance", newBalance.toString());
  };

  const addToBalance = (amount: number) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    localStorage.setItem("beans_balance", newBalance.toString());
  };

  const addToDonated = (amount: number) => {
    const newDonated = donated + amount;
    setDonated(newDonated);
    localStorage.setItem("beans_donated", newDonated.toString());
  };

  const isArtist = () => {
    return userData?.type === "artist";
  };

  // Check the mocked userData
  const isNFIDUser = () => {
    return userData?.isIIUser === true;
  };

  // Mocked functions related to signup flow
  const isFirstTimeNFIDUser = (principal: string) => {
    console.log("Mock isFirstTimeNFIDUser called for:", principal);
    return false; // Assume user always exists in mock setup
  };

  const createNFIDUser = (
    principal: string,
    username: string,
    password: string,
    profilePhoto?: File,
  ) => {
    console.log("Mock createNFIDUser called:", {
      principal,
      username,
      profilePhoto,
    });
    // Simulate creating the fan user
    setUser(principal);
    setUserData({ ...mockFanData, id: principal, username: username });
    setIsAuthenticated(true);
    return true;
  };

  // Update local state for profile changes
  const updateUserProfile = useCallback(
    (updates: Partial<UserData>) => {
      if (!userData) return;
      const updatedUserData = { ...userData, ...updates };
      setUserData(updatedUserData);
      console.log(
        "Mock updateUserProfile (local state updated):",
        updatedUserData,
      );
    },
    [userData],
  );

  // Update backend profile (using the MOCKED backend service)
  const updateBackendProfile = useCallback(
    async (
      username?: string,
      handle?: string,
      profileImage?: string,
      coverImage?: string,
      genre?: string,
      bio?: string,
    ): Promise<boolean> => {
      console.log("Auth (Mock): updateBackendProfile called", {
        username,
        handle,
        profileImage,
        coverImage,
        genre,
        bio,
      });
      if (!user || !userData) {
        console.log("Auth (Mock): No user found, returning false");
        return false;
      }

      try {
        console.log(
          "Auth (Mock): Calling MOCKED backendService.updateUserProfile",
        );
        // This calls the already mocked backend service in lib/backend-service.ts
        const result = await backendService.updateUserProfile(
          username,
          handle,
          profileImage,
          coverImage,
          genre,
          bio,
        );
        console.log("Auth (Mock): Mock backendService result", result);

        if (result.success) {
          console.log(
            "Auth (Mock): Mock backend update successful, updating local state",
          );
          // Update local state based on potentially returned data (or inputs)
          const updatedLocalData: Partial<UserData> = {};
          if (username !== undefined) updatedLocalData.username = username;
          if (handle !== undefined) updatedLocalData.handle = handle;
          if (profileImage !== undefined)
            updatedLocalData.profilePhoto = profileImage;
          if (coverImage !== undefined)
            updatedLocalData.coverPhoto = coverImage;
          if (genre !== undefined) updatedLocalData.genre = genre;
          if (bio !== undefined) updatedLocalData.bio = bio;

          updateUserProfile(updatedLocalData); // Update local state
        }
        return result.success;
      } catch (error) {
        console.error("Auth (Mock): Error updating profile:", error);
        return false;
      }
    },
    [user, userData, updateUserProfile], // Add dependencies
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isAuthenticated,
        balance,
        donated,
        login,
        loginWithNFID,
        logout,
        updateBalance,
        addToBalance,
        addToDonated,
        isArtist,
        isNFIDUser,
        isFirstTimeNFIDUser,
        createNFIDUser,
        updateUserProfile,
        updateBackendProfile,
        switchMockUser, // Expose the switcher
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
