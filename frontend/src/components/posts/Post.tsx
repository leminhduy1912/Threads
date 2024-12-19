"use client";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect, useCallback, useRef } from "react";
import { PostData } from "@/lib/types";
import Link from "next/link";
import clientRequest from "@/app/api/clientRequest";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import Linkify from "../Linkify";
import LikeButton from "./LikeButton";
import { MessageSquare } from "lucide-react";
import Comments from "../comments/Comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import PostMoreButton from "./PostMoreButton";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const [user, setUser] = useState(null)
  const { toast } = useToast()
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user-threads");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        toast({
          variant: "destructive",
          title: "User not found",
          description: "Please log in to post a comment.",
        });
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to load user data. Please log in again.",
      });
    }
  }, []);
  console.log("re-render post")

  const handleLikeAndUnlike = async () => {

    const response = await clientRequest.put(`/api/posts/like/${post._id}`);

    console.log(response.data.message)
    return response.data.post;
  };
  const [userPosted, setUserPosted] = useState<null | any>(null); // Use appropriate type for the user
  const [showComments, setShowComments] = useState(false)
  const queryClient = useQueryClient();
  const notifyAuthor = async () => {
    try {
      if (user._id !== post.postedBy) {
        const res = await clientRequest.post(`/api/notifications`, {
          receiver: post.postedBy, // ID of the post author
          type: 'like', // ID of the new comment
          content: "liked your post", // Notification type
          post: post._id
        });
        console.log("Author notified successfully.", res.data);
      }

    } catch (error) {
      console.error("Error while notifying the author:", error);
    }
  };
  const mutation = useMutation({
    mutationFn: handleLikeAndUnlike,
    onMutate: async () => {
      console.log("on mutate");
    },
    onSuccess: (updatedPost) => {
      notifyAuthor()
      // Cập nhật bài viết trong cache thay vì thêm bài viết mới
      queryClient.setQueryData(["post-feed"], (oldData: any) => {
        if (!oldData) return;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) =>
            Array.isArray(page)
              ? page.map((post: PostData) =>
                post._id === updatedPost._id ? updatedPost : post
              )
              : page
          ),
        };
      });
    },
    onError: (error) => {
      console.error("Error updating post:", error);
    },
    onSettled: () => {
      // Invalidate cache nếu cần
      // queryClient.invalidateQueries(["post-feed"]);
    },
  });

  const handleOnclickLikePost = () => { mutation.mutate() }
  const getUser = useCallback(async () => {
    try {
      const res = await clientRequest.get(`/api/users/profile/${post.postedBy}`);
      const data = res.data;
      if (data.error) {
        console.error(data.error);
        return;
      }
      setUserPosted(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [post.postedBy]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (!userPosted) {
    return null;
  }

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">

          <UserTooltip user={userPosted}>
            <Link href={`/users/test`}>
              <UserAvatar avatarUrl={userPosted.profilePic} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={userPosted}>
              <Link
                href={`/users/${userPosted.username}`}
                className="block font-medium hover:underline"
              >
                {userPosted.username}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${1}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatDistanceToNow(post.createdAt)}
            </Link>
          </div>
        </div>
        {user._id == post.postedBy && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.text}</div>
      </Linkify>

      <img className="w-full h-[400px]" src={post.img} alt="" />

      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            numOflike={post.likes.length}
            isLiked={post.isLiked}
            onClick={handleOnclickLikePost}

          />
          <CommentButton
            post={post}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
      </div>
      {showComments && <Comments post={post} />}
    </article >
  );
}
interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post.replies.length}{" "}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
