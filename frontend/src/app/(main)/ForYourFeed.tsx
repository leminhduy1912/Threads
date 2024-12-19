// "use client";

// import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
// import Post from "@/components/posts/Post";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import clientRequest from "../api/clientRequest";
// import { Loader2 } from "lucide-react";
// import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";


// export default function ForYouFeed() {

//     // Function to fetch posts with pagination
//     const fetchPosts = async ({ pageParam = 1 }) => {
//         const res = await clientRequest.get(`/api/posts/feed?page=${pageParam}&limit=10`);
//         return res.data; // Assuming the API response is the array of posts
//     };

//     // Infinite query setup
//     const {
//         data,
//         fetchNextPage,
//         hasNextPage,
//         isFetchingNextPage,
//         status,
//     } = useInfiniteQuery({
//         queryKey: ["post-feed"],
//         queryFn: fetchPosts,
//         getNextPageParam: (lastPage, allPages) => {
//             // Determine if there is a next page
//             const currentPage = allPages.length;
//             return lastPage?.length === 10 ? currentPage + 1 : undefined;
//         },
//     });
//     console.log("status", status)
//     // Flatten the posts array from all pages
//     const posts = data?.pages.flat() || [];

//     // Handle loading state
//     if (status === "pending") {
//         return <PostsLoadingSkeleton />;
//     }

//     // Handle error state
//     if (status === "error") {
//         return <p className="text-center text-destructive">Failed to load posts.</p>;
//     }

//     // Handle case where there are no posts
//     if (status === "success" && posts.length === 0) {
//         return (
//             <p className="text-center text-muted-foreground">
//                 No posts available.
//             </p>
//         );
//     }

//     return (
//         <InfiniteScrollContainer
//             className="space-y-5"
//             onBottomReached={() => {
//                 if (hasNextPage && !isFetchingNextPage) {
//                     fetchNextPage();
//                 }
//             }}
//         >
//             {posts.map((post) => (
//                 <Post key={post._id} post={post} />
//             ))}

//             {/* Show loading spinner while fetching the next page */}
//             {isFetchingNextPage && (
//                 <div className="flex justify-center py-3">
//                     <Loader2 className="animate-spin" />
//                 </div>
//             )}

//             {/* Show message when no more posts are available */}
//             {!hasNextPage && !isFetchingNextPage && posts.length > 0 && (
//                 <p className="text-center text-muted-foreground">
//                     No more posts to load.
//                 </p>
//             )}
//         </InfiniteScrollContainer>
//     );
// }
"use client";

import { useState, useEffect } from "react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import clientRequest from "../api/clientRequest";
import { Loader2 } from "lucide-react";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";

export default function ForYouFeed() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [status, setStatus] = useState("pending"); // "pending", "success", "error"

    // Function to fetch posts
    const fetchPosts = async (page) => {
        setIsFetching(true);
        try {
            const res = await clientRequest.get(`/api/posts/feed?page=${page}&limit=10`);
            const newPosts = res.data || [];
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            setHasNextPage(newPosts.length === 10); // Check if more posts are available
            setStatus("success");
        } catch (error) {
            setStatus("error");
        } finally {
            setIsFetching(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    // Handle loading state
    if (status === "pending" && posts.length === 0) {
        return <PostsLoadingSkeleton />;
    }

    // Handle error state
    if (status === "error" && posts.length === 0) {
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
            onBottomReached={() => {
                if (hasNextPage && !isFetching) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }
            }}
        >
            {posts.map((post) => (
                <Post key={post._id} post={post} />
            ))}

            {/* Show loading spinner while fetching the next page */}
            {isFetching && (
                <div className="flex justify-center py-3">
                    <Loader2 className="animate-spin" />
                </div>
            )}

            {/* Show message when no more posts are available */}
            {!hasNextPage && !isFetching && posts.length > 0 && (
                <p className="text-center text-muted-foreground">
                    No more posts to load.
                </p>
            )}
        </InfiniteScrollContainer>
    );
}
