import { Artist } from "@/types";
import { TabsContent } from "@radix-ui/react-tabs";
import { BanknoteIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Lock } from "lucide-react";

export function ArtistRewardsTab({ artist }: { artist: Artist }) {
  return (
    <TabsContent value="rewards" className="mt-4 space-y-3">
      <div className="mb-3">
        <h3 className="text-white font-medium">Artist Rewards</h3>
        <p className="text-sm text-gray-400">
          Exclusive rewards for {artist.name}'s token holders
        </p>
      </div>

      {artist.rewards ? (
        artist.rewards.map((reward, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bright-yellow/20 flex items-center justify-center">
                  <BanknoteIcon className="h-5 w-5 text-bright-yellow" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">
                    {reward.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {reward.description}
                  </p>
                  <div className="flex items-center mt-1">
                    <Badge
                      variant="outline"
                      className="text-xs bg-gray-700 text-gray-300 border-gray-600"
                    >
                      {reward.minTokens} $DROPS required
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
                >
                  Get
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
          <Lock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-300 font-medium">No rewards available yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {artist.name} hasn't created any rewards yet
          </p>
        </div>
      )}
    </TabsContent>
  );
}
