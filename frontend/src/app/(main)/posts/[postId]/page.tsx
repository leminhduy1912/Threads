"use client";

import { useEffect, useState } from "react";
import clientRequest from "@/app/api/clientRequest";
import FollowButton from "@/components/FollowButton";
import Linkify from "@/components/Linkify";
import Post from "@/components/posts/Post";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import { UserData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface PageProps {
    params: { postId: string };
}

export default function Page({ params }: PageProps) {
    const { postId } = use(params); // Unwrap the `params` Promise

    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user-threads") || "null");

        if (!currentUser) {
            setError("You're not authorized to view this page.");
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                if (!post) return;
                const response = await clientRequest.get(`/api/users/profile/${post.postedBy}`);
                setUser(response.data);
            } catch (err) {
                setError("Failed to fetch the user's profile.");
            }
        };

        const fetchPost = async () => {
            try {
                const response = await clientRequest.get(`/api/posts/${postId}`);
                setPost(response.data);
            } catch (err) {
                setError("Failed to fetch the post.");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
        fetchProfile();
    }, [postId, post]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (error) {
        return <p className="text-destructive">{error}</p>;
    }

    return (
        <>
            {user && post ? (
                <main className="flex w-full min-w-0 gap-5">
                    <div className="w-full min-w-0 space-y-5">
                        <Post post={post} />
                    </div>
                    <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
                        <UserInfoSidebar user={user} />
                    </div>
                </main>
            ) : (
                <div className="flex justify-center items-center min-h-screen">
                    <Loader2 className="animate-spin" />
                </div>
            )}
        </>
    );
}

interface UserInfoSidebarProps {
    user: UserData;
}

function UserInfoSidebar({ user }: UserInfoSidebarProps) {
    return (
        <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
            <div className="text-xl font-bold">About this user</div>
            <UserTooltip user={user}>
                <Link href={`/users/${user.username}`} className="flex items-center gap-3">
                    <UserAvatar avatarUrl={user.profilePic} className="flex-none" />
                    <div>
                        <p className="line-clamp-1 break-all font-semibold hover:underline">
                            {user.username}
                        </p>
                        <p className="line-clamp-1 break-all text-muted-foreground">
                            @{user.username}
                        </p>
                    </div>
                </Link>
            </UserTooltip>
            <Linkify>
                <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
                    {user.bio}
                </div>
            </Linkify>
        </div>
    );
}
