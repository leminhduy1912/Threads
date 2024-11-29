import { useState } from "react";
import useShowToast from "./use-toast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { clientRequest } from "../app/api/clientRequest";

// Define the User type
interface User {
    _id: string;
    name: string;
    followers: string[];
}

// Define the hook
const useUserFollowUnfollow = (user: User) => {
    // Current logged-in user from Recoil state
    const currentUser = useRecoilValue(userAtom);

    // State to manage follow/unfollow status
    const [following, setFollowing] = useState<boolean>(
        user.followers.includes(currentUser?._id)
    );
    const [updating, setUpdating] = useState<boolean>(false);

    // Toast notifications
    const showToast = useShowToast();

    // Follow/Unfollow handler
    const handleFollowUnfollow = async () => {
        if (!currentUser) {
            showToast("Error", "Please login to follow", "error");
            return;
        }

        if (updating) return; // Prevent multiple submissions
        setUpdating(true);

        try {
            // Make the follow/unfollow request
            const { data } = await clientRequest.post(`/api/users/follow/${user._id}`);

            // Handle errors from the server response
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            // Update followers list
            if (following) {
                showToast("Success", `Unfollowed ${user.name}`, "success");
                user.followers = user.followers.filter((id) => id !== currentUser._id); // Remove from followers
            } else {
                showToast("Success", `Followed ${user.name}`, "success");
                user.followers.push(currentUser._id); // Add to followers
            }

            // Toggle the following state
            setFollowing(!following);
        } catch (error: any) {
            // Improved error handling
            showToast("Error", error.response?.data?.message || error.message, "error");
        } finally {
            setUpdating(false); // Reset the updating state
        }
    };

    return { handleFollowUnfollow, updating, following };
};

export default useUserFollowUnfollow;
