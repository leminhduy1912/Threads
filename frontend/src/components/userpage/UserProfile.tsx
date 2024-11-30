// "use client"
// import { UserData } from "@/lib/types";
// import UserAvatar from "../UserAvatar";
// import { formatDistanceToNow } from "date-fns";
// import Linkify from "../Linkify";
// import { formatNumber } from "@/lib/utils";
// import FollowerCount from "../FollowerCount";
// import { useEffect, useState } from "react";
// import clientRequest from "@/app/api/clientRequest";

// interface UserProfileProps {
//     username: string;
//     postCount: number
// }

// export default function UserProfile({ username, postCount }: UserProfileProps) {
//     const [user, setUser] = useState();
//     console.log("hi");

//     const getProfileUser = async () => {
//         try {
//             const res = await clientRequest(`/api/users/profile/${username}`);
//             const data = await res.data;
//             setUser(data);
//             if (data.error) {
//                 return;
//             }
//         } catch (error) {
//             console.log("error", error);
//         }
//     };

//     useEffect(() => {
//         getProfileUser();
//     }, [user]);
//     return (
//         <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
//             <UserAvatar
//                 avatarUrl={user.profilePic}
//                 size={250}
//                 className="mx-auto size-full max-h-60 max-w-60 rounded-full"
//             />
//             <div className="flex flex-wrap gap-3 sm:flex-nowrap">
//                 <div className="me-auto space-y-3">
//                     <div>
//                         <h1 className="text-3xl font-bold">{user.username}</h1>
//                         <div className="text-muted-foreground">@{user.username}</div>
//                     </div>
//                     <div>Member since {formatDistanceToNow(user.createdAt)}</div>
//                     <div className="flex items-center gap-3">
//                         <span>
//                             Posts:{" "}
//                             <span className="font-semibold">
//                                 {formatNumber(postCount)}
//                             </span>
//                         </span>
//                         <FollowerCount count={postCount} />
//                     </div>
//                 </div>
//                 {/* {user.id === loggedInUserId ? (
//                     <EditProfileButton user={user} />
//                 ) : (
//                     <FollowButton userId={user.id} initialState={followerInfo} />
//                 )} */}
//             </div>
//             {user.bio && (
//                 <>
//                     <hr />
//                     <Linkify>
//                         <div className="overflow-hidden whitespace-pre-line break-words">
//                             {user.bio}
//                         </div>
//                     </Linkify>
//                 </>
//             )}
//         </div>
//     );
// }

"use client";

import { UserData } from "@/lib/types";
import UserAvatar from "../UserAvatar";
import { formatDistanceToNow } from "date-fns";
import Linkify from "../Linkify";
import { formatNumber } from "@/lib/utils";
import FollowerCount from "../FollowerCount";
import { useEffect, useState } from "react";
import clientRequest from "@/app/api/clientRequest";
import FollowButton from "../FollowButton";
import EditProfileButton from "@/app/(main)/users/[username]/EditProfileButton";

interface UserProfileProps {
    username: string;
    postCount: number;
}

export default function UserProfile({ username, postCount }: UserProfileProps) {
    const [user, setUser] = useState<UserData | null>(null);
    const userCurrent = JSON.parse(localStorage.getItem("user-threads"))
    const getProfileUser = async () => {
        try {
            const res = await clientRequest(`/api/users/profile/${username}`);
            const data = await res.data;
            if (data.error) {
                console.error(data.error);
                return;
            }
            setUser(data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    useEffect(() => {
        getProfileUser();
    }, [username]); // Only re-run the effect when `username` changes

    if (!user) {
        return <div>Loading user profile...</div>; // Handle loading state
    }

    return (
        <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
            <UserAvatar
                avatarUrl={user.profilePic}
                size={250}
                className="mx-auto size-full max-h-60 max-w-60 rounded-full"
            />
            <div className="flex flex-wrap gap-3 sm:flex-nowrap">
                <div className="me-auto space-y-3">
                    <div>
                        <h1 className="text-3xl font-bold">{user.username}</h1>
                        <div className="text-muted-foreground">@{user.username}</div>
                    </div>
                    <div>
                        Member since {formatDistanceToNow(new Date(user.createdAt))}
                    </div>
                    <div className="flex items-center gap-3">
                        <span>
                            Posts:{" "}
                            <span className="font-semibold">
                                {formatNumber(postCount)}
                            </span>
                        </span>
                        <FollowerCount count={user.followers.length.toString()} />
                    </div>
                </div>
                {user._id === userCurrent._id ? (
                    <EditProfileButton user={user} />
                ) : (
                    <FollowButton user={user} />
                )}
            </div>
            {user.bio && (
                <>
                    <hr />
                    <Linkify>
                        <div className="overflow-hidden whitespace-pre-line break-words">
                            {user.bio}
                        </div>
                    </Linkify>
                </>
            )}
        </div>
    );
}
