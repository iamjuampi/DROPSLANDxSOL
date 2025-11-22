import { Artist } from "@/types";
import { Disc, Video, Users, Award } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";

export function ArtistCertificationsTab({ artist }: { artist: Artist }) {
  return (
    <TabsContent value="certifications" className="mt-4 space-y-3">
      <div className="mb-3">
        <h3 className="text-white font-medium">Artist Certifications</h3>
        <p className="text-sm text-gray-400">
          Achievements and certifications earned by {artist.name}
        </p>
      </div>

      {artist.certifications ? (
        artist.certifications.map((cert, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-bright-yellow/20 flex items-center justify-center">
                  {cert.type === "gold" && (
                    <Disc className="h-6 w-6 text-bright-yellow" />
                  )}
                  {cert.type === "platinum" && (
                    <Disc className="h-6 w-6 text-gray-300" />
                  )}
                  {cert.type === "views" && (
                    <Video className="h-6 w-6 text-bright-yellow" />
                  )}
                  {cert.type === "soldout" && (
                    <Users className="h-6 w-6 text-bright-yellow" />
                  )}
                  {cert.type === "award" && (
                    <Award className="h-6 w-6 text-bright-yellow" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-white font-medium">
                      {cert.title}
                    </p>
                    <Button
                      size="sm"
                      className={`${
                        cert.type === "gold"
                          ? "bg-[#F9BF15] hover:bg-[#e0ab13] text-black" // Changed from #082479 to #F9BF15 with black text
                          : cert.type === "platinum"
                            ? "bg-gray-400 hover:bg-gray-500"
                            : cert.type === "views"
                              ? "bg-red-600 hover:bg-red-700"
                              : cert.type === "soldout"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                      } text-white rounded-full`}
                    >
                      {cert.type === "gold" || cert.type === "platinum"
                        ? "Stream"
                        : cert.type === "views"
                          ? "Watch"
                          : cert.type === "soldout"
                            ? "Tour Dates"
                            : "Award"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">{cert.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{cert.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
          <Award className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-300 font-medium">No certifications yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {artist.name} hasn't earned any certifications yet
          </p>
        </div>
      )}
    </TabsContent>
  );
}
