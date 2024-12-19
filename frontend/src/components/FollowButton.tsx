"use client";
import { Button } from "./ui/button";
import { userFollowInfo } from "@/lib/types";
import { useState } from "react";
import clientRequest from "@/app/api/clientRequest";
import { useToast } from "@/hooks/use-toast";

interface FollowButtonProps {
  user: userFollowInfo;
  getSuggestedUser: () => Promise<void>;
}

export default function FollowButton({ user, getSuggestedUser }: FollowButtonProps) {
  const { toast } = useToast();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const notifyAuthor = async () => {
    try {

      const res = await clientRequest.post(`/api/notifications`, {
        receiver: user._id, // ID of the post author
        type: 'follow', // ID of the new comment
        content: "followed you", // Notification type

      });
      console.log("Author notified successfully.", res.data);


    } catch (error) {
      console.error("Error while notifying the author:", error);
    }
  };
  const handleFollow = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await clientRequest.post(`/api/users/follow/${user._id}`);
      if (res.data.message === "User followed successfully") {
        notifyAuthor();
        toast({
          variant: "success",
          title: "Followed Success",
          //description: "Error following/unfollowing user",
        });
      }
      setFollowing(!following);
      if (
        following
      ) {
        toast({
          variant: "destructive",
          title: "Unfollowed Success",
          //description: "Error following/unfollowing user",
        });
      }

    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      toast({
        variant: "destructive",
        description: "Error following/unfollowing user",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      // variant={data.isFollowedByUser ? "secondary" : "default"}
      disabled={loading}
      onClick={handleFollow}
    >
      {loading ? "Processing..." : following ? "Unfollow" : "Follow"}

    </Button>
  );
}
