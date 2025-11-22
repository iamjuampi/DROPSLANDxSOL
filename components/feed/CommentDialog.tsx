"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { userDataService } from "@/lib/user-data-service";

export function CommentDialog({
  open,
  onClose,
  postId,
  onSendComment,
}: {
  open: boolean;
  onClose: () => void;
  postId: string | null;
  onSendComment: (text: string) => void;
}) {
  const [commentText, setCommentText] = useState("");

  const handleSend = () => {
    onSendComment(commentText);
    setCommentText("");
  };

  const post = postId
    ? userDataService.getAllPosts().find((p) => p.id === postId)
    : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Comments</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="max-h-[300px] overflow-y-auto space-y-3">
            {post?.comments.map((comment, i) => (
              <div key={i} className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={comment.authorAvatar}
                    alt={comment.authorName}
                  />
                  <AvatarFallback>
                    {comment.authorName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-gray-700 p-2 rounded-lg">
                  <p className="text-sm font-medium text-white">
                    {comment.authorName}
                  </p>
                  <p className="text-sm text-gray-300">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-gray-700 border-gray-600 text-white"
            />
            <Button
              onClick={handleSend}
              disabled={!commentText.trim()}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
