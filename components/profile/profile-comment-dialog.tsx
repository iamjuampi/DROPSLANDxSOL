// --- 17. Comment Dialog Component ---

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Send } from "lucide-react";
import { Button } from "react-day-picker";
import { DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";

interface ProfileCommentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  postIndex: number | null;
  comments: { [key: string]: { author: string; text: string }[] };
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onSendComment: () => void;
  userAvatar: string;
  userDisplayName: string;
  legacyAvatarSrc: string; // For fallback
}

export const ProfileCommentDialog: React.FC<ProfileCommentDialogProps> = ({
  isOpen,
  onOpenChange,
  postIndex,
  comments,
  commentText,
  onCommentTextChange,
  onSendComment,
  userAvatar,
  userDisplayName,
  legacyAvatarSrc,
}) => {
  const currentComments =
    postIndex !== null ? comments[`profile-${postIndex}`] || [] : [];

  const getCommentAvatar = (author: string) => {
    // This logic is flawed from the original, but preserved.
    // It assumes the author's name *is* "banger" for the specific avatar.
    // A better way would be to store userId with the comment.
    if (author === userDisplayName) return userAvatar;
    if (author === "banger") return "/avatars/banger.jpg";
    return "/avatars/user.jpg";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto space-y-3 my-4">
          {currentComments.length > 0 ? (
            currentComments.map((comment, i) => (
              <div key={i} className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={getCommentAvatar(comment.author)}
                    alt={comment.author}
                  />
                  <AvatarFallback>
                    {comment.author.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-gray-700 p-2 rounded-lg">
                  <p className="text-sm font-medium">{comment.author}</p>
                  <p className="text-sm text-gray-300">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            className="bg-gray-700 border-gray-600 text-white"
            value={commentText}
            onChange={(e) => onCommentTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendComment();
              }
            }}
          />
          <Button
            className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
            onClick={onSendComment}
            disabled={!commentText.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
