
// "use client";

// import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
// import Post from "@/components/posts/Post";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import clientRequest from "../api/clientRequest";
// import { Loader2 } from "lucide-react";
// import Loading from "../loading";

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
//             return lastPage.length === 10 ? currentPage + 1 : undefined; // If 10 posts are returned, there might be more
//         },
//     });

//     // Flatten the posts array from all pages
//     const posts = data?.pages.flat() || [];

//     // Error and loading handling
//     if (status === "loading") {
//         return <h1>Loading</h1>
//     }

//     if (status === "error") {
//         return <p className="text-center text-destructive">Failed to load posts.</p>;
//     }

//     if (status === "success" && posts.length === 0) {
//         return (
//             <p className="text-center text-muted-foreground">
//                 No posts available.
//             </p>
//         );
//     }
//     console.log(posts.length)
//     return (
//         <InfiniteScrollContainer
//             className="space-y-5"
//             onBottomReached={() => {
//                 if (hasNextPage && !isFetchingNextPage) {
//                     fetchNextPage(); // Fetch the next page when the bottom is reached
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
//             {!hasNextPage && (
//                 <p className="text-center text-muted-foreground">
//                     No more posts to load.
//                 </p>
//             )}
//         </InfiniteScrollContainer>
//     );
// }
"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import clientRequest from "../api/clientRequest";
import { Loader2 } from "lucide-react";
import Loading from "../loading";

export default function ForYouFeed() {
    // Function to fetch posts with pagination
    const fetchPosts = async ({ pageParam = 1 }) => {
        const res = await clientRequest.get(`/api/posts/feed?page=${pageParam}&limit=10`);
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
    console.log("status", status)
    // Flatten the posts array from all pages
    const posts = data?.pages.flat() || [];

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
            onBottomReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }}
        >
            {posts.map((post) => (
                <Post key={post._id} post={post} />
            ))}

            {/* Show loading spinner while fetching the next page */}
            {isFetchingNextPage && (
                <div className="flex justify-center py-3">
                    <Loader2 className="animate-spin" />
                </div>
            )}

            {/* Show message when no more posts are available */}
            {!hasNextPage && !isFetchingNextPage && posts.length > 0 && (
                <p className="text-center text-muted-foreground">
                    No more posts to load.
                </p>
            )}
        </InfiniteScrollContainer>
    );
}
