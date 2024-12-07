
import { PostData } from "@/lib/types";
import { Loader2, SendHorizonal, Image, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePreviewImg } from "@/hooks/usePreviewImg";
import clientRequest, { toxicCommentRequest, toxicImageRequest } from "@/app/api/clientRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "@/app/loading";
import axios from "axios";
import { useToast } from "@/hooks/use-toast"


interface CommentInputProps {
  post: PostData;
}

export default function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { handleImageChange, imgUrl, setImgUrl, removeImage } = usePreviewImg();
  const queryClient = useQueryClient();

  const notifyAuthor = async () => {
    try {
      const res = await clientRequest.post(`/api/notifications`, {
        receiver: post.postedBy, // ID of the post author
        type: 'comment', // ID of the new comment
        content: "commented your post", // Notification type
        post: post._id
      });
      console.log("Author notified successfully.", res.data);
    } catch (error) {
      console.error("Error while notifying the author:", error);
    }
  };

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
      queryClient.setQueryData(["comments", post._id], (oldData: any) => {
        if (!oldData) {
          return { pages: [[newComment]] };
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) =>
            Array.isArray(page) ? [...page, newComment] : page // Append to the array
          ),
        };
      });

      // Reset input and image
      setInput("");
      setImgUrl(null);
      setIsLoading(false);
      toast({
        variant: "success",
        title: "Comment Added",
        description: "Your comment was successfully added to the post.",
      });

      notifyAuthor();
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      setIsLoading(false);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
  // Handle comment submission
  const handleComment = async () => {
    try {
      setIsLoading(true);

      // Check for missing input
      if (!input.trim() && !imgUrl) {
        toast({
          variant: "destructive",
          title: "Missing Input",
          description: "Please provide a comment or select an image to proceed.",
        });
        setIsLoading(false);
        return; // Prevent further execution
      }

      // Check for harmful image
      if (imgUrl) {
        const isToxicImage = await axios.post("http://localhost:8080/detect", {
          image: imgUrl,
        });

        if (isToxicImage.data.detections.length > 0) {
          toast({
            variant: "destructive",
            title: "Unacceptable Image",
            description: "The selected image contains harmful content. Please choose another image.",
          });
          setIsLoading(false);
          return; // Prevent further execution
        }
      }

      // Check for harmful text
      if (input) {
        const isToxicText = await axios.post("http://localhost:5000/predict", {
          text: input,
        });

        if (isToxicText.data.prediction === "Toxic") {
          toast({
            variant: "destructive",
            title: "Unacceptable Comment",
            description: "Your comment contains harmful content. Please revise your text.",
          });
          setIsLoading(false);
          return; // Prevent further execution
        }
      }

      // Proceed with mutation if no toxicity is detected
      mutation.mutate();
    } catch (error) {
      console.error("Error during comment submission:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Something went wrong while submitting your comment. Please try again later.",
      });
    } finally {
      setIsLoading(false);
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
