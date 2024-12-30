// "use client";
// import { Button } from "./ui/button";
// import { userFollowInfo } from "@/lib/types";
// import { useState } from "react";
// import clientRequest from "@/app/api/clientRequest";
// import { useToast } from "@/hooks/use-toast";

// interface FollowButtonProps {
//   user: userFollowInfo;
//   getSuggestedUser: () => Promise<void>;
// }

// export default function FollowButton({ user, getSuggestedUser }: FollowButtonProps) {
//   const { toast } = useToast();
//   const [following, setFollowing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const notifyAuthor = async () => {
//     try {

//       const res = await clientRequest.post(`/api/notifications`, {
//         receiver: user._id, // ID of the post author
//         type: 'follow', // ID of the new comment
//         content: "followed you", // Notification type

//       });
//       console.log("Author notified successfully.", res.data);


//     } catch (error) {
//       console.error("Error while notifying the author:", error);
//     }
//   };
//   const handleFollow = async () => {
//     if (loading) return;

//     setLoading(true);
//     try {
//       const res = await clientRequest.post(`/api/users/follow/${user._id}`);
//       if (res.data.message === "User followed successfully") {
//         notifyAuthor();
//         toast({
//           variant: "success",
//           title: "Followed Success",
//           //description: "Error following/unfollowing user",
//         });
//       }
//       setFollowing(!following);
//       if (
//         following
//       ) {
//         toast({
//           variant: "success",
//           title: "Unfollowed Success",
//         });
//       }

//     } catch (error) {
//       console.error("Error following/unfollowing user:", error);
//       toast({
//         variant: "destructive",
//         description: "Error following/unfollowing user",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <Button
//       // variant={data.isFollowedByUser ? "secondary" : "default"}
//       disabled={loading}
//       onClick={handleFollow}
//     >
//       {loading ? "Processing..." : following ? "Unfollow" : "Follow"}

//     </Button>
//   );
// }
// "use client";
// import { Button } from "./ui/button";
// import { userFollowInfo } from "@/lib/types";
// import { useState, useEffect } from "react";
// import clientRequest from "@/app/api/clientRequest";
// import { useToast } from "@/hooks/use-toast";

// interface FollowButtonProps {
//   user: userFollowInfo;
// }

// export default function FollowButton({ user }: FollowButtonProps) {
//   const { toast } = useToast();
//   const [following, setFollowing] = useState(user.isFollowedByUser); // Init state with prop value
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Sync initial prop value with state if it changes
//     setFollowing(user.isFollowedByUser);
//   }, [user.isFollowedByUser]);

//   const notifyAuthor = async () => {
//     try {
//       await clientRequest.post(`/api/notifications`, {
//         receiver: user._id,
//         type: "follow",
//         content: "followed you",
//       });
//     } catch (error) {
//       console.error("Error while notifying the author:", error);
//     }
//   };

//   const handleFollow = async () => {
//     if (loading) return;

//     setLoading(true);
//     try {
//       const res = await clientRequest.post(`/api/users/follow/${user._id}`);
//       if (res.data.message === "User followed successfully") {
//         setFollowing(true);
//         notifyAuthor();
//         toast({
//           variant: "success",
//           title: "Followed Successfully",
//         });
//       } else if (res.data.message === "User unfollowed successfully") {
//         setFollowing(false);
//         toast({
//           variant: "success",
//           title: "Unfollowed Successfully",
//         });
//       }
//     } catch (error) {
//       console.error("Error following/unfollowing user:", error);
//       toast({
//         variant: "destructive",
//         description: "Error following/unfollowing user",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Button disabled={loading} onClick={handleFollow}>
//       {loading ? "Processing..." : following ? "Unfollow" : "Follow"}
//     </Button>
//   );
// }
"use client";
import { Button } from "./ui/button";
import { userFollowInfo } from "@/lib/types";
import { useState, useEffect } from "react";
import clientRequest from "@/app/api/clientRequest";
import { useToast } from "@/hooks/use-toast";

interface FollowButtonProps {
  user: userFollowInfo;
  currentUserId: string; // ID của người dùng hiện tại
}

export default function FollowButton({ user, currentUserId }: FollowButtonProps) {
  const { toast } = useToast();
  const [following, setFollowing] = useState(false); // Init state to false
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra xem người dùng hiện tại có nằm trong danh sách followers không
    setFollowing(user.followers.includes(currentUserId));
  }, [user.followers, currentUserId]);

  const notifyAuthor = async () => {
    try {
      await clientRequest.post(`/api/notifications`, {
        receiver: user._id,
        type: "follow",
        content: "followed you",
      });
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
        setFollowing(true);
        notifyAuthor();
        toast({
          variant: "success",
          title: "Followed Successfully",
        });
      } else if (res.data.message === "User unfollowed successfully") {
        setFollowing(false);
        toast({
          variant: "success",
          title: "Unfollowed Successfully",
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
    <Button disabled={loading} onClick={handleFollow}>
      {loading ? "Processing..." : following ? "Unfollow" : "Follow"}
    </Button>
  );
}
