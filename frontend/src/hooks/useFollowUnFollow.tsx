import { useState } from "react";
// import  from "./use-toast";

import { clientRequest } from "../app/api/clientRequest";

interface User {
    _id: string;
    name: string;
    followers: string[];
    following: string[];
}

interface UserFollowUnfollowResult {
    handleFollowUnfollow: () => Promise<void>;
    updating: boolean;
    following: boolean;
}

const userFollowUnfollow = (user: User): UserFollowUnfollowResult => {
    // const currentUser = useRecoilValue(userAtom);
    const currentUser = JSON.parse(localStorage.getItem("user-threads"))
    const [following, setFollowing] = useState<boolean>(user.followers.includes(currentUser?._id || ""));
    const [updating, setUpdating] = useState<boolean>(false);
    //const showToast = useShowToast();

    const handleFollowUnfollow = async () => {
        if (!currentUser) {
            //showToast("Error", "Please login to follow", "error");
            return;
        }

        if (updating) return; // Prevent multiple submissions
        setUpdating(true);

        try {
            // Make the follow/unfollow request
            const { data } = await clientRequest.post(`/api/users/follow/${user._id}`);

            // Handle errors from the server response
            if (data.error) {
                //showToast("Error", data.error, "error");
                return;
            }

            // Simulate updating followers based on action
            if (following) {
                //showToast("Success", `Unfollowed ${user.name}`, "success");
                user.followers = user.followers.filter((id) => id !== currentUser._id); // Remove from followers list
            } else {
                //showToast("Success", `Followed ${user.name}`, "success");
                user.followers.push(currentUser._id); // Add to followers list
            }

            setFollowing(!following); // Toggle the following state
            console.log(data);
        } catch (error: any) {
            // Improved error handling
            //showToast("Error", error.response?.data?.message || error.message, "error");
        } finally {
            setUpdating(false); // Always reset the updating state
        }
    };

    return { handleFollowUnfollow, updating, following };
};

export default userFollowUnfollow;
