"use client";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect, useCallback } from "react";
import { PostData } from "@/lib/types";
import Link from "next/link";
import clientRequest from "@/app/api/clientRequest";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import Linkify from "../Linkify";
import LikeButton from "./LikeButton";
import { MessageSquare } from "lucide-react";
import Comments from "../comments/Comments";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const [userPosted, setUserPosted] = useState<null | any>(null); // Use appropriate type for the user
  const [showComments, setShowComments] = useState(false)
  // Function to fetch user information
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

  // Fetch user data on component mount
  useEffect(() => {
    getUser();
  }, [getUser]);

  if (!userPosted) {
    return null; // Render nothing while user data is loading
  }

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">

          <UserTooltip user={userPosted}>
            <Link href={`/users/test`}>
              <UserAvatar avatarUrl="https://th.bing.com/th/id/OIP.1mSyfMp-r01kxBYitbubbAHaHa?w=191&h=191&c=7&r=0&o=5&dpr=1.3&pid=1.7" />
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

      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.text}</div>
      </Linkify>

      <img className="w-full" src={post.img} alt="" />
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}

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
        {7}{" "}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
