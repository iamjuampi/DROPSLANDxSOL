"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { featuredArtists } from "./featuredArtists";

export function FeaturedArtists({
  onSelectArtist,
}: {
  onSelectArtist: (artistId: string) => void;
}) {
  return (
    <div className="px-4 pt-6">
      <h2 className="text-lg font-semibold mb-3 text-white">
        Featured Artists
      </h2>
      <div className="flex overflow-x-auto gap-1 pb-2 -mx-4 px-4">
        {featuredArtists.map((artist) => (
          <div
            key={artist.id}
            className="flex-shrink-0 w-28 cursor-pointer"
            onClick={() => onSelectArtist(artist.id)}
          >
            <div className="flex flex-col items-center">
              <Avatar className="h-16 w-16">
                <AvatarImage src={artist.avatar} alt={artist.name} />
                <AvatarFallback>
                  {artist.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium text-sm mt-2 text-center text-white">
                {artist.name}
              </p>
              <p className="text-xs text-gray-400">{artist.genre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
