import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LegacyProfileInfo } from "./legacy-profile-info";
import { LegacyProfileSettings } from "./legacy-profile-settings";
import { useState } from "react";
import { ProfileTabs } from "./profile-tabs";

interface LegacyProfileHeaderProps {
  legacyProfile: any;
  isEditing: boolean;
  onEditToggle: () => void;
}

interface LegacyProfileViewProps {
  legacyProfile: any;
  isArtist: boolean;
  balance: number;
  donated: number;
  logout: () => void;
  tabsProps: any;
}

export const LegacyProfileView: React.FC<LegacyProfileViewProps> = ({
  legacyProfile,
  isArtist,
  balance,
  donated,
  logout,
  tabsProps,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(legacyProfile.bio);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      console.log("Saving bio:", editedBio);
    } else {
      setEditedBio(legacyProfile.bio);
    }
  };

  return (
    <>
      <LegacyProfileHeader
        legacyProfile={legacyProfile}
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
      />

      <LegacyProfileInfo
        legacyProfile={legacyProfile}
        isEditing={isEditing}
        editedBio={editedBio}
        onBioChange={setEditedBio}
        balance={balance}
        donated={donated}
      />

      <div className="mt-6">
        <ProfileTabs {...tabsProps} />
      </div>

      <LegacyProfileSettings logout={logout} isArtist={isArtist} />
    </>
  );
};

export const LegacyProfileHeader: React.FC<LegacyProfileHeaderProps> = ({
  legacyProfile,
  isEditing,
  onEditToggle,
}) => (
  <div className="relative">
    {legacyProfile.hasCoverImage ? (
      <div className="h-32 relative overflow-hidden">
        <Image
          src={legacyProfile.coverSrc || "/placeholder.svg"}
          alt="Profile cover"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
    ) : (
      <div className="h-32 bg-gradient-to-r from-gray-800 to-black"></div>
    )}
    <div className="absolute top-20 left-0 w-full px-4">
      <div className="flex justify-between">
        <Avatar className="h-24 w-24">
          <AvatarImage src={legacyProfile.avatarSrc} alt="Your profile" />
          <AvatarFallback>
            {legacyProfile.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800 text-white border-gray-700"
          onClick={onEditToggle}
        >
          {isEditing ? (
            <span>Save</span>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-1" />
              <span>Edit</span>
            </>
          )}
        </Button>
      </div>
    </div>
  </div>
);
