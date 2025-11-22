"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { BanknoteIcon } from "@/components/icons/banknote-icon";
import { Activity } from "@/types";
import { formatTimeAgo } from "./formatTimeAgo";

export function ActivityCard({
  activity,
  onSelectArtist,
}: {
  activity: Activity;
  onSelectArtist: (artistId: string) => void;
}) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-3">
        <div className="flex gap-3">
          <Avatar
            className="h-10 w-10 cursor-pointer"
            onClick={() => onSelectArtist(activity.userId)}
          >
            <AvatarImage src={activity.userAvatar} alt={activity.userName} />
            <AvatarFallback>
              {activity.userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm text-white">
              <span
                className="font-medium cursor-pointer"
                onClick={() => onSelectArtist(activity.userId)}
              >
                {activity.userName}
              </span>{" "}
              {activity.action}
            </p>
            {activity.message && (
              <p className="text-sm mt-1 bg-gray-700 p-2 rounded-lg text-gray-300">
                {activity.message}
              </p>
            )}
            <div className="flex items-center mt-1">
              <p className="text-xs text-gray-400">
                {formatTimeAgo(activity.createdAt)}
              </p>
              {activity.amount && activity.tokenName && (
                <div className="flex items-center text-bright-yellow text-xs font-medium ml-2">
                  <BanknoteIcon className="h-4 w-4 mr-1" />
                  <span>
                    {activity.amount} ${activity.tokenName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
