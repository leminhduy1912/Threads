
import { PostData } from "@/lib/types";
import { Loader2, SendHorizonal, Image, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePreviewImg } from "@/hooks/usePreviewImg";
import clientRequest from "@/app/api/clientRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "@/app/loading";
import axios from "axios";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "../ui/toast";

interface CommentInputProps {
  post: PostData;
}

export default function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { handleImageChange, imgUrl, setImgUrl, removeImage } = usePreviewImg();
  const queryClient = useQueryClient();



  const putComment = async () => {
    try {
      setIsLoading(true);

      // Prepare payload conditionally based on imgUrl
      const payload = { text: input };
      if (imgUrl) {
        payload.img = imgUrl
      }

      // Send request
      const response = await clientRequest.put(`/api/posts/reply/${post._id}`, payload);

      // Return the result
      return response.data.newReplyOrConversation;
    } catch (error) {
      console.error("Error while putting comment:", error);
      throw error; // Re-throw to handle it at a higher level if needed
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  const mutation = useMutation({
    mutationFn: putComment,
    onMutate: async () => {
      // Optionally handle optimistic updates here
      setIsLoading(true);
    },
    onSuccess: (newComment) => {
      console.log("New comment added:", newComment);

      // Update cache with new comment
      queryClient.setQueryData(["comment"], (oldData: any) => {
        if (!oldData) {
          return { pages: [[newComment]] };
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) =>
            Array.isArray(page) ? [newComment, ...page] : page
          ),
        };
      });

      // Reset input and image
      setInput("");
      setImgUrl(null);

      setIsLoading(false);

    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      setIsLoading(false);


    },
    onSettled: () => {
      // Always set loading state to false
      setIsLoading(false);
    },
  });


  // Handle comment submission
  const handleComment = async () => {

    if (!input.trim() && !imgUrl) {
      console.log("button comment")
      toast({
        variant: "destructive",
        description: "Please enter a comment or select an image.",
      });

      return;
    }
    const isToxic = await axios.post("https://toxic-moderator.onrender.com/predict", {
      text: input,
    });
    //setIsLoading(true)
    console.log("res toxic", typeof isToxic.data.prediction)
    if (isToxic.data.prediction === "Toxic") {
      console.log("toxic")
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,

      });
      setIsLoading(false)
    } else {
      console.log("non-toxic")
      mutation.mutate();
    }




  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center gap-2">
        {isLoading && (
          <Loading />
        )}

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
            {/* {isLoading ? <Loader2 className="animate-spin" /> : <Image />} */}
            <Image />
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
