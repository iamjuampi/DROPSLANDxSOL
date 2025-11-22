"use client";
import { useState } from "react";
import { Send, ImageIcon, MapPin, Hash, BarChart2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from "@/types";

export function PostCreator({
  userData,
  onCreatePost,
}: {
  userData: UserData | null;
  onCreatePost: (content: string, image: string | null) => void;
}) {
  const [content, setContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [location, setLocation] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showPollDialog, setShowPollDialog] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file) as any);
  };

  const handlePost = () => {
    let finalContent = content;

    if (location) finalContent += ` 📍 ${location}`;

    const validPollOptions = pollOptions.filter((opt) => opt.trim());
    if (validPollOptions.length > 0) {
      finalContent += `\n\n📊 Poll:\n${validPollOptions.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}`;
    }

    onCreatePost(finalContent, previewUrl);
    setContent("");
    setPreviewUrl(null);
    setLocation("");
    setPollOptions(["", ""]);
  };

  return (
    <>
      <Card className="bg-gray-800 border-gray-700 mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={userData?.profilePhoto || "/avatars/user.jpg"}
              />
              <AvatarFallback>
                {userData?.username?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's on your USB?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white resize-none mb-3"
                rows={3}
              />
              <div className="flex flex-wrap gap-4 mb-3 justify-start">
                <ImageIcon
                  className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer"
                  onClick={() => document.getElementById("imageInput")?.click()}
                />
                <MapPin
                  className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer"
                  onClick={() => setShowLocationDialog(true)}
                />
                <Hash
                  className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer"
                  onClick={() => setContent((prev) => prev + " #")}
                />
                <BarChart2
                  className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer"
                  onClick={() => setShowPollDialog(true)}
                />
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handlePost}
                  disabled={!content.trim()}
                  className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add Location</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => setShowLocationDialog(false)}
              variant="outline"
              className="bg-gray-700 border-gray-600 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowLocationDialog(false)}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPollDialog} onOpenChange={setShowPollDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create Poll</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {pollOptions.map((option, i) => (
              <Input
                key={i}
                placeholder={`Option ${i + 1}`}
                value={option}
                onChange={(e) =>
                  setPollOptions((prev) =>
                    prev.map((opt, idx) => (idx === i ? e.target.value : opt)),
                  )
                }
                className="bg-gray-700 border-gray-600 text-white"
              />
            ))}
            <Button
              onClick={() => setPollOptions((prev) => [...prev, ""])}
              variant="outline"
              className="bg-gray-700 border-gray-600 text-white"
            >
              Add Option
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowPollDialog(false)}
                variant="outline"
                className="bg-gray-700 border-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowPollDialog(false)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Create Poll
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
