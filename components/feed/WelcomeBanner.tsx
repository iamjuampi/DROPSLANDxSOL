"use client";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BanknoteIcon } from "@/components/icons/banknote-icon";

export function WelcomeBanner({
  onClose,
  onNavigateToExplore,
}: {
  onClose: () => void;
  onNavigateToExplore: () => void;
}) {
  return (
    <div className="px-4 mt-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-white font-medium mb-2">
                Welcome to DROPSLAND
              </h3>
              <p className="text-sm text-gray-300">
                Here you can discover artists, buy their tokens and receive
                exclusive rewards.
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
                >
                  <BanknoteIcon className="h-5 w-5 mr-1" />
                  Buy Tokens
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-gray-700 text-white border-gray-600"
                  onClick={onNavigateToExplore}
                >
                  Explore Artists
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
