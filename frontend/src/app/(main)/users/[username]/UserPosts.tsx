"use client";

import clientRequest from "@/app/api/clientRequest";
import Loading from "@/app/loading";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostData } from "@/lib/types";
// import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface UserPostsProps {
    username: string;
}

export default function UserPosts({ username }: UserPostsProps) {
    // Function to fetch posts with pagination
    const fetchPosts = async ({ pageParam = 1 }) => {
        const res = await clientRequest.get(`/api/posts/user/${username}?page=${pageParam}&limit=10`);
        return res.data; // Assuming the API response is the array of posts
    };

    // Infinite query setup
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["post-feed"],
        queryFn: fetchPosts,
        getNextPageParam: (lastPage, allPages) => {
            // Determine if there is a next page
            const currentPage = allPages.length;
            return lastPage?.length === 10 ? currentPage + 1 : undefined;
        },
    });

    // Flatten the posts array from all pages
    const posts = data?.pages.flat() || [];
    console.log("posts user", posts);
    // Handle loading state
    if (status === "pending") {
        return <Loading />;
    }

    // Handle error state
    if (status === "error") {
        return <p className="text-center text-destructive">Failed to load posts.</p>;
    }

    // Handle case where there are no posts
    if (status === "success" && posts.length === 0) {
        return (
            <p className="text-center text-muted-foreground">
                No posts available.
            </p>
        );
    }

    return (
        <InfiniteScrollContainer
            className="space-y-5"
            onBottomReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        >
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
            {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
        </InfiniteScrollContainer>
    );
}