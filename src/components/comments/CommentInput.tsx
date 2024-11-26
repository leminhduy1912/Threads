
import { PostData } from "@/lib/types";
import { Loader2, SendHorizonal, Image, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePreviewImg } from "@/hooks/usePreviewImg";
import { useToast } from "../ui/use-toast";
import clientRequest from "@/app/api/clientRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CommentInputProps {
  post: PostData;
}

export default function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { handleImageChange, imgUrl, setImgUrl, removeImage } = usePreviewImg();
  const queryClient = useQueryClient();

  // API call for submitting a comment
  const putComment = async () => {
    const response = await clientRequest.put(`/api/posts/reply/${post._id}`, {
      text: input,
      img: imgUrl,
    });
    return response.data.newReplyOrConversation
      ;
  };

  // Mutation for handling comment submission
  const mutation = useMutation({
    mutationFn: putComment,
    onSuccess: (newComment) => {
      console.log("new comment added", newComment)
      // Update cache with new comment
      queryClient.setQueryData(["comment"], (oldData: any) => {
        if (!oldData) return { pages: [[newComment]] };
        const updatedPages = oldData.pages.map((page: any) =>
          Array.isArray(page) ? [newComment, ...page] : page
        );
        return { ...oldData, pages: updatedPages };
      });

      // // Reset input and image
      setInput("");
      setImgUrl(null);
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit comment. Please try again.",
      });
    },
  });

  // Handle comment submission
  const handleComment = () => {
    if (!input.trim() && !imgUrl) {
      toast({
        variant: "destructive",
        description: "Please enter a comment or select an image.",
      });
      return;
    }

    setIsLoading(true);
    mutation.mutate();
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center gap-2">
        <Input
          placeholder="Write a comment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <div className="flex items-center gap-2">
          <label htmlFor="fileInput" className="cursor-pointer">
            <input
              type="file"
              id="fileInput"
              onChange={handleImageChange}
              className="hidden"
            />
            {isLoading ? <Loader2 className="animate-spin" /> : <Image />}
          </label>
          <Button
            onClick={handleComment}
            variant="ghost"
            size="icon"
            className="cursor-pointer"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <SendHorizonal />}
          </Button>
        </div>
      </div>
      {imgUrl && (
        <div className="relative mt-5 max-w-80">
          <img src={imgUrl} alt="Preview" className="w-full" />
          <X
            onClick={removeImage}
            className="absolute top-2 left-2 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
