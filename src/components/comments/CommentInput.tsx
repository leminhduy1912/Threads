import { PostData } from "@/lib/types";
import { Loader2, SendHorizonal, Image, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePreviewImg } from "@/hooks/usePreviewImg";

interface CommentInputProps {
  post: PostData;
}

export default function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");
  console.log("comment input", post._id)
  const [isLoading, setIsLoading] = useState(false)
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true)
  }
  const { handleImageChange, imgUrl, setImgUrl, removeImage } = usePreviewImg()
  console.log("img", imgUrl)
  return (
    <div className="flex flex-col">
      <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>

        <Input
          placeholder="Write a comment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <div className="flex justify-between items-center">

          <div>
            {/* Input file ẩn */}
            <input
              type="file"
              id="fileInput"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
            >
              {!isLoading ? (
                <Image />
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </label>
          </div>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            // disabled={!input.trim() || isLoading}
            className="cursor-pointer"
          >
            {!isLoading ? (
              <SendHorizonal />
            ) : (
              <Loader2 className="animate-spin" />
            )}
          </Button>
        </div>
      </form>
      {imgUrl && (
        <div className="relative">
          <img className="mt-5 max-w-80" src={imgUrl} alt="" />
          <X
            onClick={() => removeImage()}
            className=" absolute top-5 left-0"
          />
        </div>
      )}
    </div>
  );
}
