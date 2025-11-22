import { UserData } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { ImageIcon, MapPin, BarChart2, Paperclip, Hash } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface CreatePostFormProps {
  userAvatar: string;
  userDisplayName: string;
  userData: UserData; // Keeping userData prop for full profile data access if needed
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  userAvatar,
  userDisplayName,
  userData,
}) => {
  const [postContent, setPostContent] = useState("");

  const handlePostSubmit = () => {
    if (postContent.trim()) {
      console.log("New post:", postContent);
      setPostContent("");
      // Add submission logic here
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={userData?.profilePhoto || userAvatar}
              alt={userDisplayName}
            />
            <AvatarFallback>
              {userDisplayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your USB?"
              className="bg-gray-700 border-gray-600 text-white resize-none mb-3"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <div className="flex flex-wrap gap-4 mb-3 justify-start">
              <ImageIcon className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <MapPin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Hash className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <BarChart2 className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Paperclip className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
            <Button
              className="w-full bg-bright-yellow hover:bg-bright-yellow-700 text-black"
              onClick={handlePostSubmit}
              disabled={!postContent.trim()}
            >
              Post
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
