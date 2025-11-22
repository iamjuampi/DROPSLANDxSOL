import { Artist } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export function ArtistTokenInfo({
  artist,
  handleBuyToken,
  isLoading,
}: {
  artist: Artist;
  handleBuyToken: () => void;
  isLoading: boolean;
}) {
  return (
    <Card className="mt-4 bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-white">${artist.tokenName}</h3>
            <p className="text-xs text-gray-400">
              {artist.name}'s personal token
            </p>
          </div>
          <div className="text-right">
            <p className="text-bright-yellow font-bold">
              ${artist.tokenPrice} USD
            </p>
            <p className="text-xs text-gray-400">Current price</p>
          </div>
        </div>
        <Button
          className="w-full mt-3 bg-bright-yellow hover:bg-bright-yellow-700 text-black"
          onClick={handleBuyToken}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : `Buy $${artist.tokenName}`}
        </Button>
      </CardContent>
    </Card>
  );
}
