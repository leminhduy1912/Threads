"use client";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { userFollowInfo } from "@/lib/types";
import { useState } from "react";
import clientRequest from "@/app/api/clientRequest";

interface FollowButtonProps {
  user: userFollowInfo;
  getSuggestedUser: () => Promise<void>;
}

export default function FollowButton({ user, getSuggestedUser }: FollowButtonProps) {
  const { toast } = useToast();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await clientRequest.post(`/api/users/follow/${user._id}`);
      setFollowing(!following);
      if (
        following
      ) {
        toast({
          variant: "destructive",
          description: "Error following/unfollowing user",
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
